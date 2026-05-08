import { RotateCcw } from "lucide-react";
import type { TimetableFilters } from "../../types/schedule";

interface FilterBarProps {
  filters: TimetableFilters;
  teacherOptions: string[];
  roomOptions: string[];
  onChange: (filters: TimetableFilters) => void;
}

const defaultFilters: TimetableFilters = { semester: "8", section: "A", teacher: "all", room: "all" };

export function FilterBar({ filters, teacherOptions, roomOptions, onChange }: FilterBarProps) {
  return (
    <div className="sticky top-0 z-30 rounded-2xl border border-white/[0.06] bg-[#0a0e1a]/90 p-4 backdrop-blur-xl">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[180px_160px_1fr_1fr_auto]">
        <SelectField label="Semester" value={filters.semester}
          onChange={(v) => onChange({ ...filters, semester: v as TimetableFilters["semester"] })}
          options={[["all", "All"], ["2", "2nd Sem"], ["4", "4th Sem"], ["6", "6th Sem"], ["8", "8th Sem"]]} />
        <SelectField label="Section" value={filters.section}
          onChange={(v) => onChange({ ...filters, section: v as TimetableFilters["section"] })}
          options={[["all", "All"], ["A", "Section A"], ["B", "Section B"]]} />
        <SelectField label="Teacher" value={filters.teacher}
          onChange={(v) => onChange({ ...filters, teacher: v })}
          options={[["all", "All Teachers"], ...teacherOptions.map((t) => [t, t] as const)]} />
        <SelectField label="Room" value={filters.room}
          onChange={(v) => onChange({ ...filters, room: v })}
          options={[["all", "All Rooms"], ...roomOptions.map((r) => [r, r] as const)]} />
        <button type="button" onClick={() => onChange(defaultFilters)}
          className="focus-ring inline-flex h-10 items-center gap-2 self-end rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 text-xs font-semibold text-white/50 transition hover:bg-white/[0.08] hover:text-white">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: ReadonlyArray<readonly [string, string]>; onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="select-dark">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
