import { RotateCcw } from "lucide-react";
import type { TimetableFilters } from "../../types/schedule";

interface FilterBarProps {
  filters: TimetableFilters;
  teacherOptions: string[];
  roomOptions: string[];
  onChange: (filters: TimetableFilters) => void;
}

const defaultFilters: TimetableFilters = {
  semester: "8",
  section: "A",
  teacher: "all",
  room: "all"
};

export function FilterBar({ filters, teacherOptions, roomOptions, onChange }: FilterBarProps) {
  return (
    <div className="sticky top-0 z-30 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-panel backdrop-blur">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[180px_160px_minmax(220px,1fr)_minmax(220px,1fr)_auto]">
        <SelectField
          label="Semester"
          value={filters.semester}
          onChange={(value) => onChange({ ...filters, semester: value as TimetableFilters["semester"] })}
          options={[
            ["all", "All"],
            ["2", "2nd Semester"],
            ["4", "4th Semester"],
            ["6", "6th Semester"],
            ["8", "8th Semester"]
          ]}
        />

        <SelectField
          label="Section"
          value={filters.section}
          onChange={(value) => onChange({ ...filters, section: value as TimetableFilters["section"] })}
          options={[
            ["all", "All"],
            ["A", "Section A"],
            ["B", "Section B"]
          ]}
        />

        <SelectField
          label="Teacher"
          value={filters.teacher}
          onChange={(value) => onChange({ ...filters, teacher: value })}
          options={[["all", "All Teachers"], ...teacherOptions.map((teacher) => [teacher, teacher] as const)]}
        />

        <SelectField
          label="Room"
          value={filters.room}
          onChange={(value) => onChange({ ...filters, room: value })}
          options={[["all", "All Rooms"], ...roomOptions.map((room) => [room, room] as const)]}
        />

        <button
          type="button"
          onClick={() => onChange(defaultFilters)}
          className="focus-ring inline-flex h-11 items-center justify-center gap-2 self-end rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: ReadonlyArray<readonly [string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-cyan-200"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
