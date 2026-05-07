import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Gauge,
  Loader2,
  Radar,
  ShieldCheck,
  type LucideIcon,
  Play,
  School,
  TimerReset,
  Users
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { fetchSchedule, generateSchedule } from "../services/api";
import type { SchedulePayload } from "../types/schedule";
import { DownloadExports } from "../components/DownloadExports";
import { analyzeSchedule } from "../utils/scheduleAnalytics";

export function GenerationDashboard() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState<SchedulePayload | null>(null);
  const [generation, setGeneration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [liveFitness, setLiveFitness] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    fetchSchedule()
      .then((payload) => {
        if (isMounted) {
          setSchedule(payload);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleGenerate() {
    setGeneration(0);
    setProgress(0);
    setLiveFitness(0);
    setStatusIndex(0);
    setIsGenerating(true);
    try {
      const response = await generateSchedule();
      setSchedule(response.schedule);
      toast.success(
        `Schedule Generated! Fitness: ${response.schedule.metrics.fitnessScore}, Hard Conflicts: ${response.schedule.metrics.hardConflicts}`
      );
    } catch {
      toast.error("Schedule generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  const metrics = schedule?.metrics;
  const analytics = useMemo(
    () => analyzeSchedule(schedule?.genes ?? []),
    [schedule?.genes]
  );

  const fitnessTarget = metrics?.fitnessScore ?? 86;
  const penaltyTarget = metrics?.softPenalty ?? 118;

  const evolutionSeries = useMemo(
    () => buildEvolutionSeries(fitnessTarget),
    [fitnessTarget]
  );
  const penaltySeries = useMemo(
    () => buildPenaltySeries(penaltyTarget),
    [penaltyTarget]
  );
  const constraintSeries = useMemo(
    () => buildConstraintSeries(metrics),
    [metrics]
  );

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    const statuses = [
      "Seeding population",
      "Evaluating fitness",
      "Crossover + repair",
      "Mutation pulse",
      "Elitism and convergence"
    ];

    const timer = window.setInterval(() => {
      setGeneration((current) => Math.min(180, current + 6));
      setProgress((current) => Math.min(100, current + 4));
      setStatusIndex((current) => (current + 1) % statuses.length);
      setLiveFitness((current) => {
        const target = fitnessTarget || 86;
        const next = current === 0 ? 46 : current + Math.max(1, (target - current) * 0.08);
        return Math.min(target, Math.round(next));
      });
    }, 420);

    return () => window.clearInterval(timer);
  }, [isGenerating, fitnessTarget]);

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-slate-900/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-panel">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -left-24 top-10 h-48 w-48 rounded-full bg-cyan-500/30 blur-3xl" />
          <div className="absolute right-10 top-24 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <BrainCircuit className="h-4 w-4" aria-hidden="true" />
              Evolutionary Core Lab
            </div>
            <h1 className="font-display mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Genetic + evolutionary engine for conflict-free scheduling
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
              Evolutionary Computing (EC) drives multi-objective optimization, while Evolutionary Algorithms (EA)
              refine feasible schedules across batches, sections, and lab-heavy constraints.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-500"
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Play className="h-5 w-5" aria-hidden="true" />
                )}
                Generate Optimal Schedule
              </button>

              <button
                type="button"
                onClick={() => navigate("/timetable")}
                className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Open Timetable
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {isGenerating && (
              <div className="mt-7 max-w-xl" role="status" aria-live="polite">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
                  <span>Evolution Loop</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-600">
                  <span>{statusIndex + 1}. {[
                    "Seeding population",
                    "Evaluating fitness",
                    "Crossover + repair",
                    "Mutation pulse",
                    "Elitism and convergence"
                  ][statusIndex]}</span>
                  <span>Gen {generation} · Best fitness {liveFitness || 0}</span>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Latest Fitness</p>
                <p className="font-display mt-2 text-4xl font-semibold tracking-tight text-white">
                  {metrics?.fitnessScore ?? "--"}
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Generated at {schedule?.generatedAt ? new Date(schedule.generatedAt).toLocaleString() : "--"}
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-400/20 text-emerald-200">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              <Metric label="Hard Conflicts" value={metrics?.hardConflicts ?? 0} tone="dark" />
              <Metric label="Soft Penalty" value={metrics?.softPenalty ?? 118} tone="dark" />
              <Metric label="Teacher Clashes" value={metrics?.teacherClashes ?? 0} tone="dark" />
              <Metric label="Room Clashes" value={metrics?.roomClashes ?? 0} tone="dark" />
            </dl>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">EA/EC Pipeline</p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-slate-950">
                Evolution workflow: search, repair, optimize
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Each generation balances hard feasibility (no clashes) and soft preferences (compact days, fair loads)
                while evolving toward a global optimum.
              </p>
            </div>
            <div className="grid gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">
                <Radar className="h-4 w-4" aria-hidden="true" />
                Search radius: adaptive
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                Feasibility first
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ProcessStep
              icon={BrainCircuit}
              title="Initialize population"
              detail="Seed diverse timetables with realistic classroom and lab anchors."
            />
            <ProcessStep
              icon={Gauge}
              title="Fitness evaluation"
              detail="Score hard constraints, then apply weighted soft penalties."
            />
            <ProcessStep
              icon={TimerReset}
              title="Selection and crossover"
              detail="Preserve elites, blend high-performers, repair local conflicts."
            />
            <ProcessStep
              icon={BarChart3}
              title="Mutation pulses"
              detail="Introduce guided swaps to explore unused timeslots."
            />
            <ProcessStep
              icon={ShieldCheck}
              title="Constraint shield"
              detail="Recheck teacher, room, and batch exclusivity each generation."
            />
            <ProcessStep
              icon={CheckCircle2}
              title="Converge + export"
              detail="Stop at the best feasible schedule and publish exports."
            />
          </div>
        </div>

        <div className="grid gap-4">
          <div className="glass-panel rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Constraint Matrix</p>
            <h3 className="font-display mt-2 text-lg font-semibold text-slate-950">
              Hard + soft objectives
            </h3>
            <div className="mt-4 grid gap-3">
              <ConstraintBlock
                title="Hard constraints"
                items={[
                  "No teacher double booking",
                  "No room conflicts per timeslot",
                  "Locked lunch break 1:00-2:00 PM",
                  "Lab sessions are 3-hour blocks",
                  "No batch overlap in same timeslot"
                ]}
              />
              <ConstraintBlock
                title="Soft constraints"
                items={[
                  "Prioritize morning slots for senior batches",
                  "Minimize gaps in teacher schedules",
                  "Evenly distribute load across days",
                  "Avoid back-to-back lab sessions"
                ]}
              />
            </div>
          </div>

          <div className="panel-sheen rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Model Snapshot</p>
            <h3 className="font-display mt-2 text-lg font-semibold text-slate-950">
              Resource graph overview
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <StatPill icon={School} label="Semesters" value="2, 4, 6, 8" />
              <StatPill icon={Users} label="Sections" value="A and B" />
              <StatPill icon={FlaskConical} label="Lab Blocks" value="3 hours" />
              <StatPill icon={Clock3} label="Day Window" value="9 AM - 5 PM" />
              <StatPill icon={ShieldCheck} label="Teachers" value={`${metrics?.totalTeachers ?? 14}`} />
              <StatPill icon={BarChart3} label="Rooms" value={`${metrics?.totalRooms ?? 9}`} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartPanel
          title="Fitness evolution"
          description="Fitness climbs as hard conflicts vanish and soft penalties decay."
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={evolutionSeries} margin={{ top: 16, right: 18, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="generation" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="fitness"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0f172a" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          title="Constraint pressure"
          description="Soft penalties compress as repair and mutation stabilize the population."
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={penaltySeries} margin={{ top: 16, right: 18, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="penaltyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="generation" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="penalty"
                stroke="#f97316"
                fill="url(#penaltyFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Feasibility Radar</p>
              <h3 className="font-display mt-2 text-lg font-semibold text-slate-950">
                Conflict distribution
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Hard conflicts are fully eliminated before optimizing secondary preferences.
              </p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
              <Radar className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {constraintSeries.map((item) => (
              <ProgressRow key={item.label} label={item.label} value={item.value} max={item.max} />
            ))}
          </div>
        </div>

        <div className="panel-sheen rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Campus Impact</p>
          <h3 className="font-display mt-2 text-lg font-semibold text-slate-950">
            Student time and flow
          </h3>
          <div className="mt-4 grid gap-3">
            <ImpactRow label="Earliest start" value={analytics.summary.earliestStart} />
            <ImpactRow label="Latest finish" value={analytics.summary.latestFinish} />
            <ImpactRow label="Total teaching hours" value={`${analytics.summary.totalTeachingHours}h`} />
            <ImpactRow label="Total gap hours" value={`${analytics.summary.totalGapHours}h`} />
            <ImpactRow label="Avg efficiency" value={`${analytics.summary.averageEfficiency.toFixed(0)}%`} />
          </div>
        </div>
      </section>

      <DownloadExports />
    </>
  );
}

function Metric({
  label,
  value,
  tone = "light"
}: {
  label: string;
  value: number;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={
        tone === "dark"
          ? "rounded-lg border border-white/10 bg-white/5 p-3"
          : "rounded-lg border border-slate-200 bg-white p-3"
      }
    >
      <dt
        className={
          tone === "dark"
            ? "text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300"
            : "text-xs font-medium uppercase tracking-wide text-slate-500"
        }
      >
        {label}
      </dt>
      <dd className={tone === "dark" ? "mt-1 text-xl font-semibold text-white" : "mt-1 text-xl font-semibold text-slate-950"}>
        {value}
      </dd>
    </div>
  );
}

function StatPill({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <p className="mt-1 text-base font-semibold text-slate-950">{value}</p>
      </div>
    </div>
  );
}

function ProcessStep({
  icon: Icon,
  title,
  detail
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function ConstraintBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  max
}: {
  label: string;
  value: number;
  max: number;
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-slate-900" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ImpactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function ChartPanel({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
          <BarChart3 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function buildEvolutionSeries(target: number) {
  return Array.from({ length: 10 }, (_, index) => {
    const progress = (index + 1) / 10;
    const value = Math.round(target * (0.55 + progress * 0.45) + Math.sin(index) * 1.8);
    return {
      generation: `G${index + 1}`,
      fitness: Math.max(40, Math.min(99, value))
    };
  });
}

function buildPenaltySeries(target: number) {
  return Array.from({ length: 10 }, (_, index) => {
    const decay = (10 - index) / 10;
    const value = Math.round(target * (0.4 + decay * 0.6) + Math.cos(index) * 3);
    return {
      generation: `G${index + 1}`,
      penalty: Math.max(10, value)
    };
  });
}

function buildConstraintSeries(metrics?: SchedulePayload["metrics"]) {
  return [
    {
      label: "Teacher clashes",
      value: metrics?.teacherClashes ?? 0,
      max: 6
    },
    {
      label: "Room clashes",
      value: metrics?.roomClashes ?? 0,
      max: 6
    },
    {
      label: "Student overlaps",
      value: metrics?.studentClashes ?? 0,
      max: 6
    },
    {
      label: "Hard conflicts",
      value: metrics?.hardConflicts ?? 0,
      max: 6
    }
  ];
}
