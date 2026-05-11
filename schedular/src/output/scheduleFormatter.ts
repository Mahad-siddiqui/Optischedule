import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DAYS } from "../domain/constants";
import type { Day, FitnessReport, UniversityData } from "../domain/types";
import { Chromosome } from "../ga/Chromosome";
import {
  writeExcelTimetable,
  writePdfTimetable,
  writeWordTimetable
} from "./richExporters";

export interface ScheduleEntry {
  department: string;
  batch: string;
  semester: number;
  section: string;
  courseCode: string;
  courseName: string;
  sessionType: string;
  teacher: string;
  room: string;
  day: Day;
  start: string;
  end: string;
  durationPeriods: number;
}

export interface TimetableGrid {
  sectionId: string;
  section: string;
  days: Record<Day, Record<string, ScheduleEntry[]>>;
}

export function buildScheduleEntries(
  data: UniversityData,
  chromosome: Chromosome
): ScheduleEntry[] {
  const departments = new Map(data.departments.map((department) => [department.id, department]));
  const batches = new Map(data.batches.map((batch) => [batch.id, batch]));
  const sections = new Map(data.sections.map((section) => [section.id, section]));
  const teachers = new Map(data.teachers.map((teacher) => [teacher.id, teacher]));
  const courses = new Map(data.courses.map((course) => [course.id, course]));
  const rooms = new Map(data.rooms.map((room) => [room.id, room]));

  return chromosome.genes
    .map((gene) => {
      const department = departments.get(gene.departmentId);
      const batch = batches.get(gene.batchId);
      const section = sections.get(gene.sectionId);
      const teacher = teachers.get(gene.teacherId);
      const course = courses.get(gene.courseId);
      const room = rooms.get(gene.roomId);
      const startPeriod = data.periods.find((period) => period.id === gene.startPeriodId);
      const endPeriod = data.periods.find(
        (period) => period.index === (startPeriod?.index ?? 0) + gene.durationPeriods - 1
      );

      if (!department || !batch || !section || !teacher || !course || !room || !startPeriod || !endPeriod) {
        throw new Error(`Unable to format schedule entry for gene ${gene.requirementId}`);
      }

      return {
        department: department.code,
        batch: batch.batchCode,
        semester: batch.semester,
        section: section.label,
        courseCode: course.code,
        courseName:
          gene.sessionType === "LAB" && !course.name.endsWith("PR")
            ? `${course.name} PR`
            : course.name,
        sessionType: gene.sessionType,
        teacher: `${teacher.title} ${teacher.name}`,
        room: room.name,
        day: gene.day,
        start: startPeriod.start,
        end: endPeriod.end,
        durationPeriods: gene.durationPeriods
      };
    })
    .sort((left, right) => {
      const departmentCompare = left.department.localeCompare(right.department);
      if (departmentCompare !== 0) {
        return departmentCompare;
      }

      const batchCompare = left.batch.localeCompare(right.batch);
      if (batchCompare !== 0) {
        return batchCompare;
      }

      const sectionCompare = left.section.localeCompare(right.section);
      if (sectionCompare !== 0) {
        return sectionCompare;
      }

      const dayCompare = DAYS.indexOf(left.day) - DAYS.indexOf(right.day);
      if (dayCompare !== 0) {
        return dayCompare;
      }

      return left.start.localeCompare(right.start);
    });
}

export function buildTimetableGrid(
  data: UniversityData,
  chromosome: Chromosome
): TimetableGrid[] {
  const entries = buildScheduleEntries(data, chromosome);
  const grids = new Map<string, TimetableGrid>();

  for (const section of data.sections) {
    const days = Object.fromEntries(
      DAYS.map((day) => [
        day,
        Object.fromEntries(data.periods.map((period) => [period.id, [] as ScheduleEntry[]]))
      ])
    ) as Record<Day, Record<string, ScheduleEntry[]>>;

    grids.set(section.label, {
      sectionId: section.id,
      section: section.label,
      days
    });
  }

  for (const entry of entries) {
    const grid = grids.get(entry.section);
    if (!grid) {
      continue;
    }

    const startPeriod = data.periods.find((period) => period.start === entry.start);
    if (!startPeriod) {
      continue;
    }

    for (let offset = 0; offset < entry.durationPeriods; offset += 1) {
      const period = data.periods.find((candidate) => candidate.index === startPeriod.index + offset);
      if (period) {
        grid.days[entry.day][period.id].push(entry);
      }
    }
  }

  return [...grids.values()];
}

export async function writeScheduleOutputs(
  data: UniversityData,
  chromosome: Chromosome,
  report: FitnessReport,
  outputDir = "output"
): Promise<void> {
  mkdirSync(outputDir, { recursive: true });

  const entries = buildScheduleEntries(data, chromosome);
  const grid = buildTimetableGrid(data, chromosome);

  writeFileSync(
    join(outputDir, "best-schedule.json"),
    `${JSON.stringify({ report, entries, grid }, null, 2)}\n`,
    "utf8"
  );
  writeFileSync(join(outputDir, "best-schedule.csv"), toCsv(entries), "utf8");

  await Promise.all([
    writeExcelTimetable(data, entries, report, join(outputDir, "best-timetable.xlsx")),
    writePdfTimetable(data, entries, report, join(outputDir, "best-timetable.pdf")),
    writeWordTimetable(data, entries, report, join(outputDir, "best-timetable.docx"))
  ]);

  syncFrontendExports(outputDir);
}

function toCsv(entries: ScheduleEntry[]): string {
  const headers: Array<keyof ScheduleEntry> = [
    "department",
    "batch",
    "semester",
    "section",
    "courseCode",
    "courseName",
    "sessionType",
    "teacher",
    "room",
    "day",
    "start",
    "end",
    "durationPeriods"
  ];
  const rows = entries.map((entry) => headers.map((header) => escapeCsv(entry[header])).join(","));

  return `${headers.join(",")}\n${rows.join("\n")}\n`;
}

function escapeCsv(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function syncFrontendExports(outputDir: string): void {
  const frontendPublicDir = join("frontend", "public", "exports");

  if (!existsSync("frontend")) {
    return;
  }

  mkdirSync(frontendPublicDir, { recursive: true });

  for (const fileName of [
    "best-timetable.pdf",
    "best-timetable.xlsx",
    "best-timetable.docx"
  ]) {
    copyFileSync(join(outputDir, fileName), join(frontendPublicDir, fileName));
  }
}
