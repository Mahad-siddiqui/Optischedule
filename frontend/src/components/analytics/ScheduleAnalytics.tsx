import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  BarChart3,
  CalendarCheck2,
  Clock3,
  Gauge,
  type LucideIcon,
  Moon,
  TimerReset
} from "lucide-react";
import type { ScheduleGene } from "../../types/schedule";
import { analyzeSchedule } from "../../utils/scheduleAnalytics";

interface ScheduleAnalyticsProps {
  genes: ScheduleGene[];
}

const chartColors = {
  teaching: "#0ea5e9",
  gaps: "#f97316",
  efficiency: "#10b981",
  labs: "#0f766e",
  theory: "#22c55e"
};

export function ScheduleAnalytics({ genes }: ScheduleAnalyticsProps) {
  const analytics = analyzeSchedule(genes);

  return (
    <section className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <InsightCard
          icon={Clock3}
          label="Teaching Hours"
          value={`${analytics.summary.totalTeachingHours}h`}
          detail="Filtered schedule load"
        />
        <InsightCard
          icon={TimerReset}
          label="Free Gap Time"
          value={`${analytics.summary.totalGapHours}h`}
          detail="Waiting between classes"
        />
        <InsightCard
          icon={Moon}
          label="Avg Days Off"
          value={analytics.summary.averageDaysOff.toFixed(1)}
          detail="Student relief per week"
        />
        <InsightCard
          icon={CalendarCheck2}
          label="Avg Active Days"
          value={analytics.summary.averageActiveDays.toFixed(1)}
          detail="Campus visit days"
        />
        <InsightCard
          icon={Gauge}
          label="Time Efficiency"
          value={`${analytics.summary.averageEfficiency.toFixed(0)}%`}
          detail="Class time vs campus span"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <ChartPanel
          title="Daily Teaching Load"
          description="Shows how course hours are compressed into fewer useful days."
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.dailyLoad} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="classHours" name="Class Hours" fill={chartColors.teaching} radius={[6, 6, 0, 0]} />
              <Bar dataKey="gapHours" name="Gap Hours" fill={chartColors.gaps} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          title="Theory vs Lab Hours"
          description="Credit-hour mix across the current filtered timetable."
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={analytics.typeSplit}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={4}
              >
                {analytics.typeSplit.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.name === "LAB" ? chartColors.labs : chartColors.theory}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <ChartPanel
          title="Student Time Saved"
          description="Best schedules keep teaching hours high and gap hours low for every section."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={analytics.sectionEfficiency}
              margin={{ top: 12, right: 18, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="section" tick={{ fontSize: 11 }} interval={0} angle={-12} height={48} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="teachingHours" name="Teaching Hours" fill={chartColors.teaching} radius={[6, 6, 0, 0]} />
              <Bar dataKey="gapHours" name="Gap Hours" fill={chartColors.gaps} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          title="Room Utilization"
          description="Rooms and labs used most by the filtered timetable."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={analytics.roomUsage}
              layout="vertical"
              margin={{ top: 12, right: 22, left: 60, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="room" type="category" tick={{ fontSize: 11 }} width={112} />
              <Tooltip />
              <Bar dataKey="hours" name="Hours" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </section>
  );
}

function InsightCard({
  icon: Icon,
  label,
  value,
  detail
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
          <p className="font-display mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-600 text-white">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function ChartPanel({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-600 text-white">
          <BarChart3 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
