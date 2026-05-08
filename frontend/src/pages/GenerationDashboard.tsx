import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, BrainCircuit, CheckCircle2, Dna, FlaskConical,
  Gauge, Loader2, Play, Radar, ShieldCheck, Zap,
  type LucideIcon, Activity, BarChart3, Terminal, Eye,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { startEvolution, fetchSchedule } from "../services/api";
import type {
  EAParams, FitnessDataPoint, LogEntry, SchedulePayload,
  SSEGenerationEvent,
} from "../types/schedule";
import { DEFAULT_EA_PARAMS } from "../types/schedule";
import { DownloadExports } from "../components/DownloadExports";

export function GenerationDashboard() {
  const navigate = useNavigate();
  const [params, setParams] = useState<EAParams>({ ...DEFAULT_EA_PARAMS });
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState<SchedulePayload | null>(null);
  const [fitnessData, setFitnessData] = useState<FitnessDataPoint[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentGen, setCurrentGen] = useState<SSEGenerationEvent | null>(null);
  const [progress, setProgress] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const logIdRef = useRef(0);

  const addLog = useCallback((gen: number, msg: string, type: LogEntry["type"]) => {
    logIdRef.current += 1;
    setLogs((prev) => [
      { id: logIdRef.current, generation: gen, message: msg, type, timestamp: Date.now() },
      ...prev,
    ].slice(0, 200));
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setFitnessData([]);
    setLogs([]);
    setCurrentGen(null);
    setProgress(0);
    addLog(0, "Initializing EA engine...", "info");

    abortRef.current = startEvolution(params, {
      onInit: (data: unknown) => {
        const d = data as Record<string, unknown>;
        addLog(0, `Seed: ${d.seed} | Reqs: ${d.totalRequirements} | Rooms: ${d.totalRooms} | Teachers: ${d.totalTeachers}`, "info");
      },
      onGeneration: (event) => {
        setCurrentGen(event);
        setProgress(Math.round((event.generation / event.maxGenerations) * 100));
        if (event.generation % 5 === 0 || event.generation < 10) {
          setFitnessData((prev) => [
            ...prev,
            {
              generation: event.generation,
              fitness: event.best.score,
              average: event.average,
              hardViolations: event.best.hardViolations,
              softPenalty: event.best.softPenalty,
            },
          ]);
        }
        if (event.best.hardViolations === 0 && event.generation > 0) {
          addLog(event.generation, `✓ Zero hard violations! Score: ${event.best.score.toFixed(1)}`, "success");
        } else if (event.generation % 25 === 0) {
          addLog(event.generation, event.log, "info");
        }
        if (event.mutationInfo && event.generation % 20 === 0) {
          addLog(event.generation, `Mutated ${event.mutationInfo.genesAffected}/${event.mutationInfo.totalGenes} genes`, "mutation");
        }
        if (event.crossoverInfo && event.generation % 30 === 0) {
          addLog(event.generation, `Crossover: ${event.crossoverInfo.strategy} → child fitness ${event.crossoverInfo.childFitness.toFixed(1)}`, "crossover");
        }
      },
      onComplete: async () => {
        addLog(0, "EA converged! Fetching final schedule...", "success");
        try {
          const sched = await fetchSchedule();
          setSchedule(sched);
          toast.success(`Schedule generated! Fitness: ${sched.metrics.fitnessScore.toFixed(1)}`);
        } catch {
          toast.error("Failed to fetch final schedule.");
        }
        setIsGenerating(false);
        setProgress(100);
      },
      onError: (err) => {
        addLog(0, `Error: ${err}`, "warning");
        toast.error(err);
        setIsGenerating(false);
      },
    });
  }, [params, addLog]);

  const handleStop = () => { abortRef.current?.abort(); setIsGenerating(false); };
  const updateParam = <K extends keyof EAParams>(key: K, val: EAParams[K]) =>
    setParams((p) => ({ ...p, [key]: val }));
  const metrics = schedule?.metrics;
  const report = currentGen?.best;

  return (
    <>
      {/* ─── Hero Banner ─── */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0c1229] via-[#0f1a35] to-[#101630] p-6 shadow-lg">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-8 h-48 w-48 rounded-full bg-cyan-500/10 blur-[80px]" />
          <div className="absolute right-8 top-16 h-56 w-56 rounded-full bg-violet-500/8 blur-[80px]" />
        </div>
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
              <BrainCircuit className="h-3.5 w-3.5" /> Evolutionary Core
            </div>
            <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Genetic Algorithm <span className="text-cyan-400">Command Center</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/50">
              Configure EA parameters, launch the optimization, and watch the algorithm evolve conflict-free timetables in real time.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={isGenerating ? handleStop : handleGenerate} disabled={false}
                className={`focus-ring inline-flex h-12 items-center gap-2.5 rounded-full px-7 text-sm font-bold shadow-lg transition-all ${
                  isGenerating
                    ? "bg-rose-500/90 text-white shadow-rose-500/20 hover:bg-rose-500"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40"
                }`}
              >
                {isGenerating ? <><Loader2 className="h-5 w-5 animate-spin" /> Stop</> : <><Play className="h-5 w-5" /> Generate Schedule</>}
              </button>
              <button type="button" onClick={() => navigate("/timetable")}
                className="focus-ring inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white">
                Timetable <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {isGenerating && (
              <div className="mt-6 max-w-lg animate-fade-in">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/70">
                  <span>Evolution Progress</span><span>{progress}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-white/40">
                  Gen {currentGen?.generation ?? 0}/{params.generations} · Best {report?.score?.toFixed(1) ?? "--"} · Hard {report?.hardViolations ?? "--"}
                </p>
              </div>
            )}
          </div>
          {/* Metrics mini-panel */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Latest Fitness</p>
                <p className="font-display mt-1 text-4xl font-bold tracking-tight text-white">{metrics?.fitnessScore?.toFixed(1) ?? report?.score?.toFixed(1) ?? "--"}</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-2">
              <MiniMetric label="Hard" value={metrics?.hardConflicts ?? report?.hardViolations ?? 0} />
              <MiniMetric label="Soft" value={Number((metrics?.softPenalty ?? report?.softPenalty ?? 0).toFixed(1))} />
              <MiniMetric label="Teacher" value={metrics?.teacherClashes ?? report?.hardBreakdown?.teacherClashes ?? 0} />
              <MiniMetric label="Room" value={metrics?.roomClashes ?? report?.hardBreakdown?.roomClashes ?? 0} />
            </dl>
          </div>
        </div>
      </section>

      {/* ─── Bento Grid ─── */}
      <section className="grid gap-4 xl:grid-cols-[320px_1fr]">
        {/* EA Parameter Controls */}
        <div className="bento-card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white/80">EA Parameters</h2>
          </div>
          <ParamSlider label="Population Size" value={params.populationSize} min={20} max={500} step={10} onChange={(v) => updateParam("populationSize", v)} disabled={isGenerating} />
          <ParamSlider label="Generations" value={params.generations} min={50} max={2000} step={50} onChange={(v) => updateParam("generations", v)} disabled={isGenerating} />
          <ParamSlider label="Crossover Rate" value={params.crossoverRate} min={0.1} max={1} step={0.05} onChange={(v) => updateParam("crossoverRate", v)} disabled={isGenerating} isPercent />
          <ParamSlider label="Mutation Rate" value={params.mutationRate} min={0.01} max={0.3} step={0.01} onChange={(v) => updateParam("mutationRate", v)} disabled={isGenerating} isPercent />
          <ParamSlider label="Elite Count" value={params.eliteCount} min={1} max={20} step={1} onChange={(v) => updateParam("eliteCount", v)} disabled={isGenerating} />
          <ParamSlider label="Tournament Size" value={params.tournamentSize} min={2} max={15} step={1} onChange={(v) => updateParam("tournamentSize", v)} disabled={isGenerating} />
          <ParamSlider label="Sim Steps" value={params.simSteps} min={10} max={200} step={10} onChange={(v) => updateParam("simSteps", v)} disabled={isGenerating} />
          <ParamSlider label="Spawn Rate" value={params.spawnRate} min={0.05} max={0.5} step={0.01} onChange={(v) => updateParam("spawnRate", v)} disabled={isGenerating} isPercent />
          <div className="mt-2 h-px bg-white/[0.06]" />
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-bold text-white/80">Resources</h2>
          </div>
          <ParamSlider label="Theory Rooms" value={params.theoryRooms} min={2} max={20} step={1} onChange={(v) => updateParam("theoryRooms", v)} disabled={isGenerating} />
          <ParamSlider label="Lab Rooms" value={params.labRooms} min={1} max={10} step={1} onChange={(v) => updateParam("labRooms", v)} disabled={isGenerating} />
          <ParamSlider label="Teachers" value={params.totalTeachers} min={5} max={30} step={1} onChange={(v) => updateParam("totalTeachers", v)} disabled={isGenerating} />
        </div>

        {/* Right column: Charts + Inspector + Logs */}
        <div className="grid gap-4">
          {/* Charts row */}
          <div className="grid gap-4 xl:grid-cols-2">
            {/* Fitness Chart */}
            <div className="bento-card">
              <div className="mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white/80">Fitness Evolution</h3>
                {isGenerating && <span className="live-dot ml-auto" />}
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={fitnessData.length ? fitnessData : placeholderFitness} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,122,179,0.08)" />
                  <XAxis dataKey="generation" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
                  <Tooltip contentStyle={{ background: "#151b2e", border: "1px solid rgba(99,122,179,0.15)", borderRadius: 8, fontSize: 12, color: "#e8edf5" }} />
                  <Line type="monotone" dataKey="fitness" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="average" stroke="#a78bfa" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Constraint Pressure */}
            <div className="bento-card">
              <div className="mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white/80">Constraint Pressure</h3>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={fitnessData.length ? fitnessData : placeholderPenalty} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="penGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,122,179,0.08)" />
                  <XAxis dataKey="generation" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
                  <Tooltip contentStyle={{ background: "#151b2e", border: "1px solid rgba(99,122,179,0.15)", borderRadius: 8, fontSize: 12, color: "#e8edf5" }} />
                  <Area type="monotone" dataKey="softPenalty" stroke="#f97316" fill="url(#penGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="hardViolations" stroke="#fb7185" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chromosome Inspector + Live Logs */}
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            {/* Chromosome Inspector */}
            <div className="bento-card">
              <div className="mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white/80">Chromosome Inspector</h3>
                {isGenerating && <span className="ml-auto text-[10px] font-mono text-cyan-400/60">Gen {currentGen?.generation ?? 0}</span>}
              </div>
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                {(currentGen?.geneSnapshot ?? placeholderGenes).map((gene, i) => (
                  <div key={gene.requirementId + i}
                    className={`rounded-lg border p-2 text-[10px] leading-tight transition-all duration-300 ${
                      gene.sessionType === "LAB"
                        ? "border-blue-400/15 bg-blue-400/[0.06]"
                        : "border-emerald-400/15 bg-emerald-400/[0.06]"
                    } ${isGenerating ? "gene-swapping" : ""}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <p className="font-bold text-white/70 truncate">{gene.courseName.slice(0, 18)}</p>
                    <p className="mt-0.5 text-white/30 truncate">{gene.day} · {gene.startPeriod}</p>
                    <p className="mt-0.5 text-white/30 truncate">{gene.room.slice(0, 20)}</p>
                    <span className={`mt-1 inline-block rounded px-1 py-0.5 text-[8px] font-bold uppercase ${
                      gene.sessionType === "LAB" ? "bg-blue-400/20 text-blue-300" : "bg-emerald-400/20 text-emerald-300"
                    }`}>{gene.sessionType}</span>
                  </div>
                ))}
              </div>
              {currentGen?.crossoverInfo && (
                <div className="mt-3 rounded-lg border border-violet-400/10 bg-violet-400/[0.04] p-2 text-[10px] text-white/50">
                  <span className="font-bold text-violet-400">Crossover:</span> {currentGen.crossoverInfo.strategy} | Parents: {currentGen.crossoverInfo.parentAFitness.toFixed(0)} × {currentGen.crossoverInfo.parentBFitness.toFixed(0)} → Child: {currentGen.crossoverInfo.childFitness.toFixed(0)}
                </div>
              )}
              {currentGen?.mutationInfo && (
                <div className="mt-1.5 rounded-lg border border-amber-400/10 bg-amber-400/[0.04] p-2 text-[10px] text-white/50">
                  <span className="font-bold text-amber-400">Mutation:</span> {currentGen.mutationInfo.genesAffected}/{currentGen.mutationInfo.totalGenes} genes swapped
                </div>
              )}
            </div>

            {/* Live Logs */}
            <div className="bento-card flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white/80">Live Logs</h3>
                {isGenerating && <span className="live-dot ml-auto" />}
              </div>
              <div className="log-console flex-1 overflow-y-auto rounded-lg p-3" style={{ maxHeight: 300 }}>
                {logs.length === 0 ? (
                  <p className="text-white/20">Waiting for generation to start...</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="mb-1 flex gap-2 animate-fade-in">
                      <span className="shrink-0 text-white/20">[{log.generation.toString().padStart(4, "0")}]</span>
                      <span className={
                        log.type === "success" ? "text-emerald-400" :
                        log.type === "warning" ? "text-rose-400" :
                        log.type === "mutation" ? "text-amber-400" :
                        log.type === "crossover" ? "text-violet-400" :
                        "text-white/50"
                      }>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Constraints + Stats Row ─── */}
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="bento-card">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white/80">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Hard Constraints
          </h3>
          <ul className="mt-3 space-y-2 text-xs text-white/50">
            {["No teacher double-booking", "No room conflicts per timeslot", "Labs → Lab Rooms only", "Theory → Theory Rooms only", "Theory ≤ 2hr continuous", "Labs = 3hr blocks", "No classes during 1–2 PM break", "No batch overlap in same slot"].map((c) => (
              <li key={c} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />{c}</li>
            ))}
          </ul>
        </div>
        <div className="bento-card">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white/80">
            <Gauge className="h-4 w-4 text-amber-400" /> Soft Constraints (Fitness Weights)
          </h3>
          <ul className="mt-3 space-y-2 text-xs text-white/50">
            {[
              ["Gap Penalty", "35 per empty period + 30 bonus if >1 gap"],
              ["Early Finish", "8 × (period_index - 2) per section-day"],
              ["Campus Span", "24 per wasted period in daily span"],
              ["Active Days", "90 per extra campus day beyond ideal"],
              ["Teacher Fragmentation", "3 per idle period if >1 idle"],
              ["Teacher Overload", "6 per period over weekly max"],
            ].map(([name, weight]) => (
              <li key={name} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span><strong className="text-white/70">{name}:</strong> {weight}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <DownloadExports />
    </>
  );
}

/* ─── Sub-components ─── */
function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5">
      <dt className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">{label}</dt>
      <dd className="mt-0.5 text-lg font-bold text-white">{value}</dd>
    </div>
  );
}

function ParamSlider({ label, value, min, max, step, onChange, disabled, isPercent }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; disabled: boolean; isPercent?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex justify-between text-[10px] font-semibold text-white/40">
        <span>{label}</span>
        <span className="font-mono text-cyan-400/70">{isPercent ? `${(value * 100).toFixed(0)}%` : value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} disabled={disabled}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/[0.06] accent-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed
          [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-400/30"
      />
    </label>
  );
}

/* Placeholder data */
const placeholderFitness: FitnessDataPoint[] = Array.from({ length: 10 }, (_, i) => ({
  generation: i * 10, fitness: 400 + i * 55 + Math.sin(i) * 20, average: 350 + i * 40, hardViolations: Math.max(0, 15 - i * 2), softPenalty: Math.max(20, 200 - i * 18),
}));
const placeholderPenalty = placeholderFitness;

const placeholderGenes = [
  { requirementId: "1", courseName: "Machine Learning", day: "Monday", startPeriod: "P1", room: "CS Smart Classroom", sessionType: "THEORY", teacher: "Dr. Ayesha" },
  { requirementId: "2", courseName: "Computer Vision", day: "Monday", startPeriod: "P2", room: "Cyber Security Lab", sessionType: "LAB", teacher: "Dr. Sadia" },
  { requirementId: "3", courseName: "Evolutionary Computing", day: "Tuesday", startPeriod: "P1", room: "CS Lecture 202", sessionType: "THEORY", teacher: "Dr. Asma" },
  { requirementId: "4", courseName: "Software Project Mgmt", day: "Tuesday", startPeriod: "P3", room: "Discussion Room", sessionType: "THEORY", teacher: "Mr. Bilal" },
  { requirementId: "5", courseName: "Professional Ethics", day: "Wednesday", startPeriod: "P1", room: "Seminar Room 301", sessionType: "THEORY", teacher: "Ms. Mahnoor" },
  { requirementId: "6", courseName: "AI Lab", day: "Wednesday", startPeriod: "P2", room: "AI & DS Lab", sessionType: "LAB", teacher: "Dr. Ayesha" },
  { requirementId: "7", courseName: "Database Systems", day: "Thursday", startPeriod: "P1", room: "CS Lecture 201", sessionType: "THEORY", teacher: "Engr. Farhan" },
  { requirementId: "8", courseName: "Operating Systems", day: "Thursday", startPeriod: "P3", room: "CS Lecture 202", sessionType: "THEORY", teacher: "Engr. Zain" },
];
