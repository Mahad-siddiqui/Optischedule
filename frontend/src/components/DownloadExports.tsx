import { Download, FileText, Table2, type LucideIcon } from "lucide-react";

type DownloadVariant = "panel" | "inline";

interface ExportItem {
  label: string;
  description: string;
  href: string;
  fileName: string;
  icon: LucideIcon;
  allowPreview?: boolean;
}

const exportsList: ExportItem[] = [
  {
    label: "PDF",
    description: "Printable timetable report",
    href: "/exports/best-timetable.pdf",
    fileName: "OptiSchedule-Timetable.pdf",
    icon: FileText,
    allowPreview: true
  },
  {
    label: "Excel",
    description: "Workbook with section sheets",
    href: "/exports/best-timetable.xlsx",
    fileName: "OptiSchedule-Timetable.xlsx",
    icon: Table2
  },
  {
    label: "Word",
    description: "Editable timetable document",
    href: "/exports/best-timetable.docx",
    fileName: "OptiSchedule-Timetable.docx",
    icon: FileText
  }
];

export function DownloadExports({ variant = "panel" }: { variant?: DownloadVariant }) {
  if (variant === "inline") {
    return (
      <div className="flex flex-wrap gap-2" aria-label="Download timetable exports">
        {exportsList.map((item) => (
          <DownloadButton key={item.label} item={item} compact />
        ))}
      </div>
    );
  }

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
            <Download className="h-5 w-5" aria-hidden="true" />
            Export Timetable
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Download the latest generated schedule in PDF, Excel, or Word format.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {exportsList.map((item) => (
            <DownloadButton key={item.label} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DownloadButton({ item, compact = false }: { item: ExportItem; compact?: boolean }) {
  const Icon = item.icon;
  const previewLink = item.allowPreview ? (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="text-xs font-semibold text-cyan-700 hover:text-cyan-900"
    >
      View
    </a>
  ) : null;

  return (
    <div className={compact ? "flex items-center gap-2" : "flex flex-col gap-2"}>
      <a
        href={item.href}
        download={item.allowPreview ? undefined : item.fileName}
        className={[
          "focus-ring inline-flex items-center rounded-full border border-slate-200 bg-white font-semibold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-slate-900",
          compact ? "h-10 gap-2 px-3 text-sm" : "min-h-16 gap-3 px-4 py-3 text-sm"
        ].join(" ")}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-600 text-white">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className={compact ? "sr-only" : "min-w-0"}>
          <span className="block">{item.label}</span>
          <span className="block truncate text-xs font-medium text-slate-500">{item.description}</span>
        </span>
        {compact && <span>{item.label}</span>}
      </a>
      {!compact && previewLink}
      {compact && previewLink && <span className="text-xs">{previewLink}</span>}
    </div>
  );
}
