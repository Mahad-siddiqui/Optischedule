import {
  Clock3,
  DoorOpen,
  FlaskConical,
  GraduationCap,
  type LucideIcon,
  UserRound
} from "lucide-react";
import type { ScheduleGene } from "../../types/schedule";

interface ClassCardProps {
  gene: ScheduleGene;
  compact?: boolean;
}

const toneByType = {
  LAB: "bg-sky-50/90 border-sky-500 text-sky-950 ring-sky-100",
  THEORY: "bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-emerald-100"
};

export function ClassCard({ gene, compact = false }: ClassCardProps) {
  const isLab = gene.type === "LAB";

  return (
    <article
      className={[
        "group flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-l-4 shadow-sm ring-1 ring-inset",
        "transition hover:-translate-y-0.5 hover:shadow-md",
        isLab ? "p-3.5" : "p-3",
        toneByType[gene.type]
      ].join(" ")}
      aria-label={`${gene.courseName}, ${gene.teacherName}, ${gene.roomName}, ${gene.sectionLabel}`}
      title={`${gene.courseName}\n${gene.teacherName}\n${gene.roomName}\n${gene.sectionLabel}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">
            {gene.courseCode} - {gene.type}
          </p>
          <h3
            className={[
              "mt-1 whitespace-normal break-words font-semibold leading-snug",
              isLab ? "text-base" : "text-[15px]",
              compact && "text-xs"
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {gene.courseName}
          </h3>
        </div>

        {isLab && (
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-700">
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>

      {isLab ? (
        <dl className="mt-3 grid gap-1.5 text-xs">
          <InfoRow icon={UserRound} text={gene.teacherName} />
          <InfoRow icon={DoorOpen} text={gene.roomName} />
          <InfoRow icon={GraduationCap} text={gene.sectionLabel} />
          <InfoRow icon={Clock3} text={`${gene.startTime} - ${gene.endTime}`} />
        </dl>
      ) : (
        <dl className="mt-2 grid gap-1 text-[11px]">
          <InfoRow icon={UserRound} text={gene.teacherName} />
          <InfoRow icon={DoorOpen} text={gene.roomName} />
          <InfoRow icon={GraduationCap} text={gene.sectionLabel} />
          <InfoRow icon={Clock3} text={`${gene.startTime} - ${gene.endTime}`} />
        </dl>
      )}
    </article>
  );
}

function InfoRow({
  icon: Icon,
  text
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-1.5 rounded-md bg-white/50 px-1.5 py-1">
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
      <span className="min-w-0 whitespace-normal break-words leading-snug">{text}</span>
    </div>
  );
}
