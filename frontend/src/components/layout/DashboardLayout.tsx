import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen" style={{ background: "var(--bg-primary)", transition: "background 0.3s" }}>
      {/* Background grid pattern */}
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern bg-grid-40 opacity-30" />
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.04] blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-violet-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-emerald-500/[0.03] blur-[100px]" />
      </div>

      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((c) => !c)}
      />
      <main
        className={`relative min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
