import {
  Activity,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Cpu,
  GraduationCap,
  LayoutDashboard
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/",
    label: "Generate",
    icon: LayoutDashboard
  },
  {
    to: "/timetable",
    label: "Timetable",
    icon: CalendarDays
  }
];

export function Sidebar({
  collapsed,
  onToggle
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={[
        "border-b border-white/60 bg-white/85 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:border-b-0 lg:border-r",
        "transition-all duration-300",
        collapsed ? "lg:w-20" : "lg:w-72"
      ].join(" ")}
    >
      <div className="flex h-full flex-col">
        <div
          className={[
            "px-5 py-5",
            collapsed ? "flex flex-col items-center gap-3" : "flex items-center gap-4"
          ].join(" ")}
        >
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-cyan-600 via-sky-600 to-emerald-500 text-white shadow-sm">
            <Cpu className="h-6 w-6" aria-hidden="true" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="font-display text-lg font-semibold tracking-tight">OptiSchedule</p>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">CS Scheduler</p>
            </div>
          )}
          <button
            type="button"
            onClick={onToggle}
            className={[
              "focus-ring ml-auto hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 lg:inline-flex",
              collapsed ? "ml-0" : "ml-auto"
            ].join(" ")}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible">
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
                    "focus-ring flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                    collapsed ? "justify-center" : "justify-start",
                    isActive
                      ? "bg-cyan-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {!collapsed && item.label}
              </NavLink>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="mt-auto hidden border-t border-white/60 p-5 lg:block">
            <div className="rounded-lg bg-gradient-to-br from-sky-600 via-cyan-600 to-emerald-500 p-4 text-white shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                BS Computer Science
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-white/80">
                <Activity className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                2026 active batches 22F to 25F
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
