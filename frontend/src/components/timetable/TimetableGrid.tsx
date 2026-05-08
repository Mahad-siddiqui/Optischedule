import { AlertCircle } from "lucide-react";
import { DAYS, TIME_SLOTS } from "../../data/mockSchedule";
import type { Day, ScheduleGene } from "../../types/schedule";
import { ClassCard } from "./ClassCard";

interface GroupedClasses { key: string; day: Day; startTime: string; duration: number; genes: ScheduleGene[]; }

export function TimetableGrid({ genes }: { genes: ScheduleGene[] }) {
  const groups = groupClasses(genes);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c1020] shadow-lg">
      <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-white/80">Weekly Grid</p>
            <p className="text-xs text-white/30">Monday – Friday · 9 AM – 5 PM</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-white/40">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Theory</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-400" /> Lab</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[1396px] grid-cols-timetable grid-rows-timetable bg-[#080c18]">
          <div className="sticky left-0 top-0 z-30 border-b border-r border-white/[0.06] bg-cyan-500/10 px-3 py-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Time</div>
          {DAYS.map((day, i) => (
            <div key={day} className="sticky top-0 z-20 border-b border-r border-white/[0.06] bg-cyan-500/10 px-3 py-3 text-center text-sm font-bold text-cyan-400/80"
              style={{ gridColumn: i + 2, gridRow: 1 }}>{day}</div>
          ))}
          {TIME_SLOTS.map((slot, i) => (
            <div key={slot.id} className="sticky left-0 z-10 flex items-center justify-center border-b border-r border-white/[0.06] bg-[#0c1020] px-2 text-center text-xs font-semibold text-white/40"
              style={{ gridColumn: 1, gridRow: i + 2 }}>{slot.label}</div>
          ))}
          {TIME_SLOTS.map((slot, i) =>
            slot.isBreak ? (
              <div key={slot.id} className="z-0 flex items-center justify-center border-b border-r border-white/[0.06] bg-amber-400/[0.04] text-sm font-bold text-amber-400/40"
                style={{ gridColumn: "2 / 7", gridRow: i + 2 }}>Lunch / Namaz Break</div>
            ) : DAYS.map((day, di) => (
              <div key={`${day}-${slot.id}`} className="border-b border-r border-white/[0.04] bg-transparent" style={{ gridColumn: di + 2, gridRow: i + 2 }} />
            ))
          )}
          {groups.map((group) => {
            const dc = DAYS.indexOf(group.day) + 2;
            const si = TIME_SLOTS.findIndex((s) => s.startTime === group.startTime);
            if (si < 0) return null;
            return (
              <div key={group.key} className="z-20 min-h-0 p-1.5" style={{ gridColumn: dc, gridRow: `${si + 2} / span ${group.duration}` }}>
                <div className="flex h-full min-h-0 flex-col gap-1.5 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] p-1 shadow-sm backdrop-blur-sm">
                  {group.genes.slice(0, 2).map((gene) => <ClassCard key={gene.id} gene={gene} compact={group.genes.length > 1} />)}
                  {group.genes.length > 2 && <div className="rounded-md bg-white/[0.06] px-2 py-1 text-center text-[10px] font-bold text-white/40">+{group.genes.length - 2} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {genes.length === 0 && (
        <div className="flex items-center gap-3 border-t border-white/[0.06] px-4 py-5 text-sm text-white/40">
          <AlertCircle className="h-5 w-5 text-amber-400" /> No classes match the selected filters.
        </div>
      )}
    </div>
  );
}

function groupClasses(genes: ScheduleGene[]): GroupedClasses[] {
  const groups = new Map<string, GroupedClasses>();
  for (const gene of genes) {
    const key = `${gene.day}-${gene.startTime}`;
    const ex = groups.get(key);
    if (ex) { ex.genes.push(gene); ex.duration = Math.max(ex.duration, gene.duration); }
    else groups.set(key, { key, day: gene.day, startTime: gene.startTime, duration: Math.min(gene.duration, TIME_SLOTS.length), genes: [gene] });
  }
  return [...groups.values()].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.startTime.localeCompare(b.startTime));
}
