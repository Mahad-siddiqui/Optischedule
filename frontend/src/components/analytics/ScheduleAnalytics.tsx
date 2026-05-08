import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, CalendarCheck2, Clock3, Gauge, type LucideIcon, Moon, TimerReset } from "lucide-react";
import type { ScheduleGene } from "../../types/schedule";
import { analyzeSchedule } from "../../utils/scheduleAnalytics";

const colors = { teaching: "#38bdf8", gaps: "#f97316", efficiency: "#34d399", labs: "#3b82f6", theory: "#34d399" };
const tooltipStyle = { background: "#151b2e", border: "1px solid rgba(99,122,179,0.15)", borderRadius: 8, fontSize: 12, color: "#e8edf5" };

export function ScheduleAnalytics({ genes }: { genes: ScheduleGene[] }) {
  const a = analyzeSchedule(genes);
  return (
    <section className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <InsightCard icon={Clock3} label="Teaching Hours" value={`${a.summary.totalTeachingHours}h`} detail="Filtered load" />
        <InsightCard icon={TimerReset} label="Gap Time" value={`${a.summary.totalGapHours}h`} detail="Waiting hours" />
        <InsightCard icon={Moon} label="Days Off" value={a.summary.averageDaysOff.toFixed(1)} detail="Per section avg" />
        <InsightCard icon={CalendarCheck2} label="Active Days" value={a.summary.averageActiveDays.toFixed(1)} detail="Campus visits" />
        <InsightCard icon={Gauge} label="Efficiency" value={`${a.summary.averageEfficiency.toFixed(0)}%`} detail="Class/span ratio" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartPanel title="Daily Load" desc="Class vs gap hours per day">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={a.dailyLoad} margin={{ top: 12, right: 18, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,122,179,0.08)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }} />
              <Bar dataKey="classHours" name="Class" fill={colors.teaching} radius={[4, 4, 0, 0]} />
              <Bar dataKey="gapHours" name="Gap" fill={colors.gaps} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Theory vs Lab" desc="Credit-hour distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={a.typeSplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                {a.typeSplit.map((e) => <Cell key={e.name} fill={e.name === "LAB" ? colors.labs : colors.theory} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartPanel title="Section Efficiency" desc="Teaching vs gap per section">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={a.sectionEfficiency} margin={{ top: 12, right: 18, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,122,179,0.08)" />
              <XAxis dataKey="section" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} interval={0} angle={-10} height={44} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }} />
              <Bar dataKey="teachingHours" name="Teaching" fill={colors.teaching} radius={[4, 4, 0, 0]} />
              <Bar dataKey="gapHours" name="Gap" fill={colors.gaps} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Room Utilization" desc="Top rooms by hours">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={a.roomUsage} layout="vertical" margin={{ top: 12, right: 18, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,122,179,0.08)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} />
              <YAxis dataKey="room" type="category" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} width={100} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="hours" name="Hours" fill="#a78bfa" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </section>
  );
}

function InsightCard({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string; detail: string }) {
  return (
    <div className="bento-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">{label}</p>
          <p className="font-display mt-1 text-2xl font-bold text-white">{value}</p>
          <p className="mt-0.5 text-[10px] text-white/25">{detail}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-400/10 text-cyan-400">
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function ChartPanel({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="bento-card">
      <div className="mb-3 flex items-start gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/10 text-cyan-400">
          <BarChart3 className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-white/80">{title}</h2>
          <p className="text-[10px] text-white/30">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
