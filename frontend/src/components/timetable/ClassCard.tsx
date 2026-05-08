import { Clock3, DoorOpen, FlaskConical, GraduationCap, type LucideIcon, UserRound } from "lucide-react";
import type { ScheduleGene } from "../../types/schedule";

const toneByType = {
  LAB: "border-l-blue-400 bg-blue-400/[0.06] ring-blue-400/10",
  THEORY: "border-l-emerald-400 bg-emerald-400/[0.06] ring-emerald-400/10",
};

export function ClassCard({ gene, compact = false }: { gene: ScheduleGene; compact?: boolean }) {
  const isLab = gene.type === "LAB";
  return (
    <article
      className={[
        "group flex h-full min-h-0 flex-col overflow-hidden rounded-lg border-l-[3px] ring-1 ring-inset shadow-sm",
        "transition hover:-translate-y-0.5 hover:shadow-md",
        isLab ? "p-3" : "p-2.5",
        toneByType[gene.type],
      ].join(" ")}
      title={`${gene.courseName}\n${gene.teacherName}\n${gene.roomName}\n${gene.sectionLabel}`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/40">{gene.courseCode} · {gene.type}</p>
          <h3 className={`mt-0.5 font-semibold leading-snug text-white/80 ${compact ? "text-[10px]" : "text-xs"}`}>
            {gene.courseName}
          </h3>
        </div>
        {isLab && (
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-400/15 text-blue-400">
            <FlaskConical className="h-3 w-3" />
          </span>
        )}
      </div>
      <dl className="mt-2 grid gap-1 text-[10px]">
        <InfoRow icon={UserRound} text={gene.teacherName} />
        <InfoRow icon={DoorOpen} text={gene.roomName} />
        <InfoRow icon={GraduationCap} text={gene.sectionLabel} />
        <InfoRow icon={Clock3} text={`${gene.startTime} – ${gene.endTime}`} />
      </dl>
    </article>
  );
}

function InfoRow({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-start gap-1 rounded bg-white/[0.03] px-1.5 py-0.5">
      <Icon className="h-3 w-3 shrink-0 text-white/25 mt-0.5" />
      <span className="min-w-0 break-words leading-snug text-white/50">{text}</span>
    </div>
  );
}
