import { AlertCircle } from "lucide-react";
import { DAYS, TIME_SLOTS } from "../../data/mockSchedule";
import type { Day, ScheduleGene } from "../../types/schedule";
import { ClassCard } from "./ClassCard";

interface TimetableGridProps {
  genes: ScheduleGene[];
}

interface GroupedClasses {
  key: string;
  day: Day;
  startTime: string;
  duration: number;
  genes: ScheduleGene[];
}

export function TimetableGrid({ genes }: TimetableGridProps) {
  const groups = groupClasses(genes);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-panel backdrop-blur">
      <div className="border-b border-slate-200 bg-white/95 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">Weekly Grid</p>
            <p className="text-xs text-slate-500">Monday to Friday - 9:00 AM to 5:00 PM</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Theory
            <span className="ml-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
            Lab
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-[1396px] grid-cols-timetable grid-rows-timetable bg-slate-50">
          <div className="sticky left-0 top-0 z-30 border-b border-r border-slate-200 bg-cyan-600 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white">
            Time
          </div>

          {DAYS.map((day, dayIndex) => (
            <div
              key={day}
              className="sticky top-0 z-20 border-b border-r border-slate-200 bg-cyan-600 px-3 py-3 text-center text-sm font-semibold text-white"
              style={{ gridColumn: dayIndex + 2, gridRow: 1 }}
            >
              {day}
            </div>
          ))}

          {TIME_SLOTS.map((slot, slotIndex) => (
            <div
              key={slot.id}
              className="sticky left-0 z-10 flex items-center justify-center border-b border-r border-slate-200 bg-white px-2 text-center text-sm font-semibold text-slate-700"
              style={{ gridColumn: 1, gridRow: slotIndex + 2 }}
            >
              {slot.label}
            </div>
          ))}

          {TIME_SLOTS.map((slot, slotIndex) =>
            slot.isBreak ? (
              <div
                key={slot.id}
                className="z-0 flex items-center justify-center border-b border-r border-slate-200 bg-amber-100/80 text-base font-semibold text-amber-700"
                style={{ gridColumn: "2 / 7", gridRow: slotIndex + 2 }}
              >
                Lunch / Namaz Break
              </div>
            ) : (
              DAYS.map((day, dayIndex) => (
                <div
                  key={`${day}-${slot.id}`}
                  className="border-b border-r border-slate-200 bg-white"
                  style={{ gridColumn: dayIndex + 2, gridRow: slotIndex + 2 }}
                />
              ))
            )
          )}

          {groups.map((group) => {
            const dayColumn = DAYS.indexOf(group.day) + 2;
            const slotIndex = TIME_SLOTS.findIndex((slot) => slot.startTime === group.startTime);
            const compact = group.genes.length > 1;

            if (slotIndex < 0) {
              return null;
            }

            return (
              <div
                key={group.key}
                className="z-20 min-h-0 p-2"
                style={{
                  gridColumn: dayColumn,
                  gridRow: `${slotIndex + 2} / span ${group.duration}`
                }}
              >
                <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden rounded-lg border border-white/80 bg-white/70 p-1.5 shadow-sm backdrop-blur-sm">
                  {group.genes.slice(0, 2).map((gene) => (
                    <ClassCard key={gene.id} gene={gene} compact={compact} />
                  ))}
                  {group.genes.length > 2 && (
                    <div className="rounded-md bg-slate-900/85 px-2 py-1 text-center text-[11px] font-semibold text-white">
                      +{group.genes.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {genes.length === 0 && (
        <div className="flex items-center gap-3 border-t border-slate-200 px-4 py-5 text-sm font-medium text-slate-600">
          <AlertCircle className="h-5 w-5 text-amber-500" aria-hidden="true" />
          No classes match the selected filters.
        </div>
      )}
    </div>
  );
}

function groupClasses(genes: ScheduleGene[]): GroupedClasses[] {
  const groups = new Map<string, GroupedClasses>();

  for (const gene of genes) {
    const key = `${gene.day}-${gene.startTime}`;
    const existing = groups.get(key);

    if (existing) {
      existing.genes.push(gene);
      existing.duration = Math.max(existing.duration, gene.duration);
    } else {
      groups.set(key, {
        key,
        day: gene.day,
        startTime: gene.startTime,
        duration: Math.min(gene.duration, TIME_SLOTS.length),
        genes: [gene]
      });
    }
  }

  return [...groups.values()].sort((left, right) => {
    const dayCompare = DAYS.indexOf(left.day) - DAYS.indexOf(right.day);
    if (dayCompare !== 0) {
      return dayCompare;
    }

    return left.startTime.localeCompare(right.startTime);
  });
}
