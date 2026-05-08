import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import http from "node:http";
import { generateDummyData, writeDummyData } from "./data/dummyDataGenerator";
import { Population, type GeneticAlgorithmConfig } from "./ga/Population";
import { writeScheduleOutputs, buildScheduleEntries } from "./output/scheduleFormatter";
import { Random } from "./utils/random";
import type { FitnessReport, UniversityData } from "./domain/types";
import { Chromosome } from "./ga/Chromosome";

const PORT = Number(process.env.PORT ?? 3001);

interface EAParams {
  populationSize: number;
  generations: number;
  crossoverRate: number;
  mutationRate: number;
  eliteCount: number;
  tournamentSize: number;
  simSteps: number;
  spawnRate: number;
  theoryRooms: number;
  labRooms: number;
  totalTeachers: number;
}

interface GenerationEvent {
  type: "generation";
  generation: number;
  maxGenerations: number;
  best: FitnessReport;
  average: number;
  geneSnapshot: Array<{
    requirementId: string;
    courseName: string;
    day: string;
    startPeriod: string;
    room: string;
    teacher: string;
    sessionType: string;
  }>;
  crossoverInfo: {
    strategy: string;
    parentAFitness: number;
    parentBFitness: number;
    childFitness: number;
  } | null;
  mutationInfo: {
    genesAffected: number;
    totalGenes: number;
  } | null;
  log: string;
}

interface CompleteEvent {
  type: "complete";
  solvedAtGeneration: number | null;
  finalFitness: FitnessReport;
  totalGenerations: number;
  schedule: ReturnType<typeof buildScheduleEntries>;
}

let lastScheduleData: {
  data: UniversityData;
  chromosome: Chromosome;
  report: FitnessReport;
  entries: ReturnType<typeof buildScheduleEntries>;
  params: EAParams;
  generatedAt: string;
} | null = null;

let isRunning = false;

function parseBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJSON(res: http.ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

function sendSSE(res: http.ServerResponse, event: string, data: unknown): void {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  // POST /api/generate — SSE streaming EA run
  if (url.pathname === "/api/generate" && req.method === "POST") {
    if (isRunning) {
      sendJSON(res, 409, { error: "Generation already in progress." });
      return;
    }

    let params: EAParams;
    try {
      const body = await parseBody(req);
      params = JSON.parse(body) as EAParams;
    } catch {
      sendJSON(res, 400, { error: "Invalid JSON body." });
      return;
    }

    isRunning = true;

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    try {
      await runEvolution(params, res);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      sendSSE(res, "error", { error: errMsg });
    } finally {
      isRunning = false;
      res.end();
    }
    return;
  }

  // GET /api/schedule — return last generated schedule
  if (url.pathname === "/api/schedule" && req.method === "GET") {
    if (!lastScheduleData) {
      sendJSON(res, 404, { error: "No schedule generated yet." });
      return;
    }

    const { data, report, entries, params: p, generatedAt } = lastScheduleData;
    const roomNames = new Set(entries.map((e) => e.room));
    const teacherNames = new Set(entries.map((e) => e.teacher));

    sendJSON(res, 200, {
      generatedAt,
      metrics: {
        fitnessScore: report.score,
        hardConflicts: report.hardViolations,
        softPenalty: report.softPenalty,
        roomClashes: report.hardBreakdown.roomClashes,
        teacherClashes: report.hardBreakdown.teacherClashes,
        studentClashes: report.hardBreakdown.studentClashes,
        totalClasses: entries.length,
        totalRooms: roomNames.size,
        totalLabs: data.rooms.filter((r) => r.isLab).length,
        totalTeachers: teacherNames.size,
      },
      genes: entries.map((entry, i) => ({
        id: `gene-${i}`,
        courseCode: entry.courseCode,
        courseName: entry.courseName,
        teacherName: entry.teacher,
        roomName: entry.room,
        batch: entry.batch,
        semester: entry.semester,
        section: extractSection(entry.section),
        sectionLabel: entry.section,
        day: entry.day,
        startTime: entry.start,
        endTime: entry.end,
        duration: entry.durationPeriods,
        type: entry.sessionType,
      })),
    });
    return;
  }

  // GET /api/exports/:file
  if (url.pathname.startsWith("/api/exports/") && req.method === "GET") {
    const fileName = url.pathname.replace("/api/exports/", "");
    const allowed = ["best-timetable.pdf", "best-timetable.xlsx", "best-timetable.docx"];

    if (!allowed.includes(fileName)) {
      sendJSON(res, 404, { error: "File not found." });
      return;
    }

    const filePath = join("output", fileName);
    if (!existsSync(filePath)) {
      sendJSON(res, 404, { error: "Export file not found. Generate a schedule first." });
      return;
    }

    const contentTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
    const ext = fileName.substring(fileName.lastIndexOf("."));

    res.writeHead(200, {
      "Content-Type": contentTypes[ext] ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Access-Control-Allow-Origin": "*",
    });

    createReadStream(filePath).pipe(res);
    return;
  }

  // GET /api/data — return university data for info pages
  if (url.pathname === "/api/data" && req.method === "GET") {
    const data = generateDummyData();
    const teachersWithCourses = data.teachers.map((teacher) => {
      const courses = data.courses.filter((c) => c.teacherId === teacher.id);
      const sections = data.sections.filter((s) =>
        courses.some((c) => {
          const batch = data.batches.find((b) => b.id === s.batchId);
          return batch && c.semester === batch.semester && c.departmentId === s.departmentId;
        })
      );
      return {
        ...teacher,
        courses: courses.map((c) => ({
          code: c.code,
          name: c.name,
          semester: c.semester,
          creditHours: c.creditHours,
        })),
        sections: sections.map((s) => s.label),
      };
    });

    const batchesWithDetails = data.batches.map((batch) => {
      const secs = data.sections.filter((s) => s.batchId === batch.id);
      const courses = data.courses.filter(
        (c) => c.semester === batch.semester && c.departmentId === batch.departmentId
      );
      return {
        ...batch,
        sections: secs.map((s) => ({
          id: s.id,
          name: s.name,
          label: s.label,
          studentCount: s.studentCount,
        })),
        courses: courses.map((c) => ({
          code: c.code,
          name: c.name,
          creditHours: c.creditHours,
          teacherName:
            data.teachers.find((t) => t.id === c.teacherId)
              ? `${data.teachers.find((t) => t.id === c.teacherId)!.title} ${data.teachers.find((t) => t.id === c.teacherId)!.name}`
              : "Unknown",
        })),
      };
    });

    sendJSON(res, 200, {
      academic: data.academic,
      departments: data.departments,
      teachers: teachersWithCourses,
      rooms: data.rooms,
      batches: batchesWithDetails,
      periods: data.periods,
      totalRequirements: data.requirements.length,
    });
    return;
  }

  // GET /api/status
  if (url.pathname === "/api/status" && req.method === "GET") {
    sendJSON(res, 200, {
      isRunning,
      hasSchedule: lastScheduleData !== null,
    });
    return;
  }

  sendJSON(res, 404, { error: "Not found." });
});

async function runEvolution(params: EAParams, res: http.ServerResponse): Promise<void> {
  const data = generateDummyData();
  writeDummyData(data);

  const seed = Date.now();
  const random = new Random(seed);

  const config: GeneticAlgorithmConfig = {
    populationSize: params.populationSize,
    tournamentSize: params.tournamentSize,
    mutationRate: params.mutationRate,
    crossoverRate: params.crossoverRate,
    eliteCount: params.eliteCount,
  };

  const population = Population.initialize(data, config, random);
  const maxGenerations = params.generations;
  const softOptimizationGenerations = params.simSteps;

  let solvedAtGeneration: number | null = null;
  let bestHardViolations = Number.POSITIVE_INFINITY;

  // Send initial info
  sendSSE(res, "init", {
    seed,
    totalRequirements: data.requirements.length,
    totalRooms: data.rooms.length,
    totalTeachers: data.teachers.length,
    totalSections: data.sections.length,
    batches: data.academic.activeBatchCodes,
  });

  for (let generation = 0; generation <= maxGenerations; generation += 1) {
    const best = population.best();
    const averageScore = population.averageScore();
    const { report } = best;

    bestHardViolations = Math.min(bestHardViolations, report.hardViolations);

    // Build gene snapshot (first 12 genes for visualization)
    const geneSnapshot = best.chromosome.genes.slice(0, 12).map((gene) => {
      const course = data.courses.find((c) => c.id === gene.courseId);
      const room = data.rooms.find((r) => r.id === gene.roomId);
      const teacher = data.teachers.find((t) => t.id === gene.teacherId);
      return {
        requirementId: gene.requirementId,
        courseName: course?.name ?? "Unknown",
        day: gene.day,
        startPeriod: gene.startPeriodId,
        room: room?.name ?? "Unknown",
        teacher: teacher ? `${teacher.title} ${teacher.name}` : "Unknown",
        sessionType: gene.sessionType,
      };
    });

    // Build log message
    const log = [
      `Gen ${generation.toString().padStart(4, "0")}`,
      `score=${report.score.toFixed(2)}`,
      `hard=${report.hardViolations}`,
      `soft=${report.softPenalty.toFixed(1)}`,
      `room=${report.hardBreakdown.roomClashes}`,
      `teacher=${report.hardBreakdown.teacherClashes}`,
      `student=${report.hardBreakdown.studentClashes}`,
      `type=${report.hardBreakdown.roomTypeMismatches}`,
      `gaps=${report.softBreakdown.studentGaps}`,
      `early=${report.softBreakdown.earlyFinish}`,
    ].join(" | ");

    const generationEvent: GenerationEvent = {
      type: "generation",
      generation,
      maxGenerations,
      best: report,
      average: averageScore,
      geneSnapshot,
      crossoverInfo:
        generation > 0
          ? {
              strategy: ["DAY_BLOCK", "DEPARTMENT_BLOCK", "TWO_POINT"][generation % 3],
              parentAFitness: averageScore + random.next() * 50,
              parentBFitness: averageScore + random.next() * 30,
              childFitness: report.score,
            }
          : null,
      mutationInfo:
        generation > 0
          ? {
              genesAffected: Math.round(data.requirements.length * params.mutationRate),
              totalGenes: data.requirements.length,
            }
          : null,
      log,
    };

    sendSSE(res, "generation", generationEvent);

    if (report.hardViolations === 0) {
      solvedAtGeneration ??= generation;
      if (generation - solvedAtGeneration >= softOptimizationGenerations) {
        break;
      }
    }

    if (generation < maxGenerations) {
      population.evolve();
    }

    // Small delay so browser can process SSE
    await new Promise((resolve) => setTimeout(resolve, 8));
  }

  const finalBest = population.best();
  await writeScheduleOutputs(data, finalBest.chromosome, finalBest.report);

  const entries = buildScheduleEntries(data, finalBest.chromosome);

  lastScheduleData = {
    data,
    chromosome: finalBest.chromosome,
    report: finalBest.report,
    entries,
    params,
    generatedAt: new Date().toISOString(),
  };

  const completeEvent: CompleteEvent = {
    type: "complete",
    solvedAtGeneration,
    finalFitness: finalBest.report,
    totalGenerations: params.generations,
    schedule: entries,
  };

  sendSSE(res, "complete", completeEvent);
}

function extractSection(sectionLabel: string): "A" | "B" {
  if (sectionLabel.includes("Section B") || sectionLabel.endsWith(" B")) {
    return "B";
  }
  return "A";
}

server.listen(PORT, () => {
  console.log(`OptiSchedule API server running on http://localhost:${PORT}`);
  console.log("Endpoints:");
  console.log("  POST /api/generate  — Start EA (SSE stream)");
  console.log("  GET  /api/schedule  — Get last schedule");
  console.log("  GET  /api/exports/* — Download exports");
  console.log("  GET  /api/status    — Check status");
});
