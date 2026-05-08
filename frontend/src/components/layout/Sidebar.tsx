import {
  Activity, BrainCircuit, Building2, CalendarDays,
  ChevronLeft, ChevronRight, Cpu, Dna, GraduationCap,
  LayoutDashboard, Moon, Sun,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

const navItems = [
  { to: "/", label: "Evolution Lab", icon: LayoutDashboard },
  { to: "/timetable", label: "Timetable", icon: CalendarDays },
  { to: "/resources", label: "Resources", icon: Building2 },
  { to: "/about-ea", label: "About EA", icon: BrainCircuit },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside
      className={[
        "sidebar fixed inset-y-0 left-0 z-50 hidden lg:flex lg:flex-col",
        "border-r transition-all duration-300",
        collapsed ? "w-20" : "w-72",
      ].join(" ")}
    >
      {/* Logo */}
      <div className={["px-5 py-6", collapsed ? "flex flex-col items-center gap-3" : "flex items-center gap-4"].join(" ")}>
        <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20">
          <Dna className="h-6 w-6" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-display text-lg font-bold tracking-tight sidebar-title">OptiSchedule</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-500/70">Timetable Evolution Lab</p>
          </div>
        )}
        <button
          type="button" onClick={onToggle}
          className={["sidebar-icon-btn focus-ring hidden h-8 w-8 items-center justify-center rounded-lg transition lg:inline-flex", collapsed ? "ml-0" : "ml-auto"].join(" ")}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Separator */}
      <div className="sidebar-sep mx-4 h-px" />

      {/* Navigation */}
      <nav className="mt-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to} to={item.to} end={item.to === "/"} title={item.label}
              className={({ isActive }) => [
                "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed ? "justify-center" : "justify-start",
                isActive ? "nav-active" : "nav-inactive",
              ].join(" ")}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div className={["mt-auto px-3 pb-3", collapsed ? "flex justify-center" : ""].join(" ")}>
        <button
          type="button"
          onClick={toggle}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={[
            "theme-toggle focus-ring flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200",
            collapsed ? "justify-center w-full" : "w-full",
          ].join(" ")}
        >
          <span className="relative grid h-5 w-5 shrink-0 place-items-center">
            <Sun className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0 text-amber-500"}`} />
            <Moon className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? "opacity-100 scale-100 rotate-0 text-cyan-400" : "opacity-0 scale-50 -rotate-90"}`} />
          </span>
          {!collapsed && <span>{isDark ? "Dark Mode" : "Light Mode"}</span>}
        </button>
      </div>

      {/* Bottom info card */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <div className="sidebar-card rounded-xl border p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="h-4 w-4 text-cyan-500" />
              <span className="sidebar-card-text">BS Computer Science</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs sidebar-muted">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              Batches 22F — 25F active
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs sidebar-muted">
              <Cpu className="h-3.5 w-3.5 text-violet-500" />
              Semesters 2, 4, 6, 8
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
