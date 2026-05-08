import {
  Activity,
  BrainCircuit,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Dna,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Evolution Lab", icon: LayoutDashboard },
  { to: "/timetable", label: "Timetable", icon: CalendarDays },
  { to: "/resources", label: "Resources", icon: Building2 },
  { to: "/about-ea", label: "About EA", icon: BrainCircuit },
];

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={[
        "glass-panel fixed inset-y-0 left-0 z-50 hidden lg:flex lg:flex-col",
        "border-r border-white/[0.06] transition-all duration-300",
        collapsed ? "w-20" : "w-72",
      ].join(" ")}
    >
      {/* Logo */}
      <div
        className={[
          "px-5 py-6",
          collapsed ? "flex flex-col items-center gap-3" : "flex items-center gap-4",
        ].join(" ")}
      >
        <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20">
          <Dna className="h-6 w-6" aria-hidden="true" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-display text-lg font-bold tracking-tight text-white">
              OptiSchedule
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-400/70">
              Timetable Evolution Lab
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className={[
            "focus-ring hidden h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white lg:inline-flex",
            collapsed ? "ml-0" : "ml-auto",
          ].join(" ")}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Separator */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Navigation */}
      <nav className="mt-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              title={item.label}
              className={({ isActive }) =>
                [
                  "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center" : "justify-start",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-400 shadow-sm shadow-cyan-500/5 border border-cyan-500/15"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/80 border border-transparent",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!collapsed && item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom card */}
      {!collapsed && (
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-violet-500/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <GraduationCap className="h-4 w-4 text-cyan-400" />
              BS Computer Science
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              Batches 22F — 25F active
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-white/40">
              <Cpu className="h-3.5 w-3.5 text-violet-400" />
              Semesters 2, 4, 6, 8
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
