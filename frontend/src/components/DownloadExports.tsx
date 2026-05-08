import { Download, FileSpreadsheet, FileText, type LucideIcon } from "lucide-react";
import { getExportUrl } from "../services/api";

type DownloadVariant = "panel" | "inline";

interface ExportItem {
  label: string;
  description: string;
  fileName: string;
  icon: LucideIcon;
  color: string;
}

const exportsList: ExportItem[] = [
  { label: "PDF", description: "Printable timetable report", fileName: "best-timetable.pdf", icon: FileText, color: "text-rose-400" },
  { label: "Excel", description: "Section-wise workbook", fileName: "best-timetable.xlsx", icon: FileSpreadsheet, color: "text-emerald-400" },
  { label: "Word", description: "Editable document", fileName: "best-timetable.docx", icon: FileText, color: "text-blue-400" },
];

export function DownloadExports({ variant = "panel" }: { variant?: DownloadVariant }) {
  if (variant === "inline") {
    return (
      <div className="flex flex-wrap gap-2">
        {exportsList.map((item) => (
          <a key={item.label} href={getExportUrl(item.fileName)} download={item.fileName}
            className="focus-ring inline-flex h-9 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 text-xs font-semibold text-white/60 transition hover:bg-white/[0.08] hover:text-white">
            <item.icon className={`h-3.5 w-3.5 ${item.color}`} /> {item.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <section className="bento-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/70">
            <Download className="h-4 w-4" /> Export Timetable
          </div>
          <p className="mt-1 text-sm text-white/40">Download the latest generated schedule as PDF, Excel, or Word.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {exportsList.map((item) => (
            <a key={item.label} href={getExportUrl(item.fileName)} download={item.fileName}
              className="focus-ring flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition hover:border-cyan-400/15 hover:bg-white/[0.05]">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[0.04] ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-white/80">{item.label}</span>
                <span className="block text-[11px] text-white/30">{item.description}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
