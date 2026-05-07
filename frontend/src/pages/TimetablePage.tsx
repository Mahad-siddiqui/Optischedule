import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Filter,
  Gauge,
  Loader2,
  type LucideIcon,
  ShieldCheck,
  TimerReset
} from "lucide-react";
import { fetchSchedule } from "../services/api";
import type { ScheduleGene, SchedulePayload, TimetableFilters } from "../types/schedule";
import { FilterBar } from "../components/timetable/FilterBar";
import { TimetableGrid } from "../components/timetable/TimetableGrid";
import { DownloadExports } from "../components/DownloadExports";
import { ScheduleAnalytics } from "../components/analytics/ScheduleAnalytics";
import { analyzeSchedule } from "../utils/scheduleAnalytics";

const defaultFilters: TimetableFilters = {
  semester: "8",
  section: "A",
  teacher: "all",
  room: "all"
};

export function TimetablePage() {
  const [schedule, setSchedule] = useState<SchedulePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TimetableFilters>(defaultFilters);

  useEffect(() => {
    let isMounted = true;
    fetchSchedule()
      .then((payload) => {
        if (isMounted) {
          setSchedule(payload);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const genes = schedule?.genes ?? [];
  const teacherOptions = useMemo(
    () => [...new Set(genes.map((gene) => gene.teacherName))].sort(),
    [genes]
  );
  const roomOptions = useMemo(
    () => [...new Set(genes.map((gene) => gene.roomName))].sort(),
    [genes]
  );

  const filteredGenes = useMemo(
    () => filterGenes(genes, filters),
    [genes, filters]
  );
  const analytics = useMemo(
    () => analyzeSchedule(filteredGenes),
    [filteredGenes]
  );

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-sky-600" aria-hidden="true" />
          Loading timetable
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
              Master Timetable Grid
            </div>
            <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Computer Science weekly schedule
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Filtered view is synchronized with the EA optimization engine.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <DownloadExports variant="inline" />
            <Badge icon={ShieldCheck} label={`Hard Conflicts: ${schedule?.metrics.hardConflicts ?? 0}`} />
            <Badge icon={Filter} label={`${filteredGenes.length} Visible Classes`} />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <SummaryPill icon={Gauge} label="Avg Efficiency" value={`${analytics.summary.averageEfficiency.toFixed(0)}%`} />
          <SummaryPill icon={TimerReset} label="Gap Hours" value={`${analytics.summary.totalGapHours}h`} />
          <SummaryPill icon={CalendarDays} label="Teaching Hours" value={`${analytics.summary.totalTeachingHours}h`} />
        </div>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        teacherOptions={teacherOptions}
        roomOptions={roomOptions}
      />

      <ScheduleAnalytics genes={filteredGenes} />

      <TimetableGrid genes={filteredGenes} />
    </section>
  );
}

function filterGenes(genes: ScheduleGene[], filters: TimetableFilters): ScheduleGene[] {
  return genes.filter((gene) => {
    const semesterMatch = filters.semester === "all" || gene.semester === Number(filters.semester);
    const sectionMatch = filters.section === "all" || gene.section === filters.section;
    const teacherMatch = filters.teacher === "all" || gene.teacherName === filters.teacher;
    const roomMatch = filters.room === "all" || gene.roomName === filters.room;

    return semesterMatch && sectionMatch && teacherMatch && roomMatch;
  });
}

function Badge({
  icon: Icon,
  label
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
      <Icon className="h-4 w-4 text-cyan-700" aria-hidden="true" />
      {label}
    </div>
  );
}

function SummaryPill({
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
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-600 text-white">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <p className="mt-1 text-base font-semibold text-slate-950">{value}</p>
      </div>
    </div>
  );
}
