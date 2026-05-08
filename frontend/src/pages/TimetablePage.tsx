import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Filter, Gauge, Loader2, type LucideIcon, ShieldCheck, TimerReset } from "lucide-react";
import { fetchSchedule } from "../services/api";
import type { ScheduleGene, SchedulePayload, TimetableFilters } from "../types/schedule";
import { FilterBar } from "../components/timetable/FilterBar";
import { TimetableGrid } from "../components/timetable/TimetableGrid";
import { DownloadExports } from "../components/DownloadExports";
import { ScheduleAnalytics } from "../components/analytics/ScheduleAnalytics";
import { analyzeSchedule } from "../utils/scheduleAnalytics";

const defaultFilters: TimetableFilters = { semester: "8", section: "A", teacher: "all", room: "all" };

export function TimetablePage() {
  const [schedule, setSchedule] = useState<SchedulePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TimetableFilters>(defaultFilters);

  useEffect(() => {
    let m = true;
    fetchSchedule().then((p) => { if (m) setSchedule(p); }).catch(() => {}).finally(() => { if (m) setIsLoading(false); });
    return () => { m = false; };
  }, []);

  const genes = schedule?.genes ?? [];
  const teacherOptions = useMemo(() => [...new Set(genes.map((g) => g.teacherName))].sort(), [genes]);
  const roomOptions = useMemo(() => [...new Set(genes.map((g) => g.roomName))].sort(), [genes]);
  const filteredGenes = useMemo(() => filterGenes(genes, filters), [genes, filters]);
  const analytics = useMemo(() => analyzeSchedule(filteredGenes), [filteredGenes]);

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-4 text-sm font-medium text-white/60">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" /> Loading timetable…
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <p className="text-lg font-bold text-white/60">No schedule generated yet</p>
          <p className="mt-2 text-sm text-white/30">Go to Command Center and run the EA first.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="bento-card">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/70">
              <CalendarDays className="h-4 w-4" /> Master Timetable
            </div>
            <h1 className="font-display mt-2 text-2xl font-bold tracking-tight text-white">CS Weekly Schedule</h1>
            <p className="mt-1 text-sm text-white/40">Synchronized with the EA optimization engine.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DownloadExports variant="inline" />
            <Badge icon={ShieldCheck} label={`Hard: ${schedule.metrics.hardConflicts}`} />
            <Badge icon={Filter} label={`${filteredGenes.length} Classes`} />
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <SummaryPill icon={Gauge} label="Efficiency" value={`${analytics.summary.averageEfficiency.toFixed(0)}%`} />
          <SummaryPill icon={TimerReset} label="Gap Hours" value={`${analytics.summary.totalGapHours}h`} />
          <SummaryPill icon={CalendarDays} label="Teaching" value={`${analytics.summary.totalTeachingHours}h`} />
        </div>
      </div>
      <FilterBar filters={filters} onChange={setFilters} teacherOptions={teacherOptions} roomOptions={roomOptions} />
      <ScheduleAnalytics genes={filteredGenes} />
      <TimetableGrid genes={filteredGenes} />
    </section>
  );
}

function filterGenes(genes: ScheduleGene[], f: TimetableFilters): ScheduleGene[] {
  return genes.filter((g) => {
    return (f.semester === "all" || g.semester === Number(f.semester))
      && (f.section === "all" || g.section === f.section)
      && (f.teacher === "all" || g.teacherName === f.teacher)
      && (f.room === "all" || g.roomName === f.room);
  });
}

function Badge({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/60">
      <Icon className="h-3.5 w-3.5 text-cyan-400" /> {label}
    </div>
  );
}

function SummaryPill({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-400/10 text-cyan-400">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">{label}</p>
        <p className="mt-0.5 text-base font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
