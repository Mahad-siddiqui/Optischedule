import { useEffect, useState } from "react";
import {
  BookOpen, Building2, DoorOpen, FlaskConical, GraduationCap,
  type LucideIcon, School, UserRound, Users, Clock3,
  BookMarked, Layers, Hash,
} from "lucide-react";
import { fetchUniversityData } from "../services/api";
import { ResourcesSkeleton } from "../components/Skeleton";

export function ResourcesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUniversityData()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ResourcesSkeleton />;

  if (!data) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <p className="text-white/40">Failed to load data. Make sure the backend is running.</p>
      </div>
    );
  }

  const theoryRooms = data.rooms?.filter((r: any) => !r.isLab) ?? [];
  const labRooms = data.rooms?.filter((r: any) => r.isLab) ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="bento-card">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/70">
          <Building2 className="h-4 w-4" /> University Resources
        </div>
        <h1 className="font-display mt-2 text-2xl font-bold tracking-tight text-white">
          DUET — Department of Computer Science & Engineering
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Complete overview of all resources fed into the Evolutionary Algorithm for optimal timetable generation.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon={Users} label="Teachers" value={data.teachers?.length ?? 0} color="cyan" />
          <StatCard icon={DoorOpen} label="Theory Rooms" value={theoryRooms.length} color="emerald" />
          <StatCard icon={FlaskConical} label="Lab Rooms" value={labRooms.length} color="blue" />
          <StatCard icon={School} label="Batches" value={data.batches?.length ?? 0} color="violet" />
          <StatCard icon={Hash} label="Session Reqs" value={data.totalRequirements ?? 0} color="amber" />
        </div>
      </section>

      {/* Academic Info */}
      <section className="bento-card">
        <SectionTitle icon={GraduationCap} title="Academic Program" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile label="Degree" value={data.academic?.degreeName ?? "BS Computer Science"} />
          <InfoTile label="Duration" value={`${data.academic?.degreeYears ?? 4} Years / ${data.academic?.totalSemesters ?? 8} Semesters`} />
          <InfoTile label="Current Year" value={String(data.academic?.currentYear ?? 2026)} />
          <InfoTile label="Active Batches" value={(data.academic?.activeBatchCodes ?? []).join(", ")} />
        </div>
      </section>

      {/* Teachers */}
      <section className="bento-card">
        <SectionTitle icon={UserRound} title={`Faculty Members (${data.teachers?.length ?? 0})`} />
        <p className="mt-1 text-xs text-white/30">Each teacher is assigned courses based on their specialization. The EA ensures no teacher is double-booked in any timeslot.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {(data.teachers ?? []).map((t: any) => (
            <div key={t.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-cyan-400/15">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white/80 truncate">{t.title} {t.name}</p>
                  <p className="text-[10px] text-white/30">Max {t.maxClassesPerWeek} classes/week · {data.departments?.[0]?.name ?? "CSE"}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {(t.courses ?? []).map((c: any) => (
                  <div key={c.code} className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-[11px]">
                    <span className={`h-1.5 w-1.5 rounded-full ${c.creditHours.lab > 0 ? "bg-blue-400" : "bg-emerald-400"}`} />
                    <span className="font-mono text-white/40">{c.code}</span>
                    <span className="text-white/60 truncate">{c.name}</span>
                    <span className="ml-auto shrink-0 text-[9px] text-white/25">
                      {c.creditHours.theory}+{c.creditHours.lab} · Sem {c.semester}
                    </span>
                  </div>
                ))}
              </div>
              {t.sections?.length > 0 && (
                <p className="mt-2 text-[10px] text-white/20">
                  Teaches: {t.sections.join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Rooms */}
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="bento-card">
          <SectionTitle icon={DoorOpen} title={`Theory Rooms (${theoryRooms.length})`} />
          <p className="mt-1 text-xs text-white/30">Used for lectures (1-2 hour sessions). The EA assigns theory classes only to these rooms.</p>
          <div className="mt-4 space-y-2">
            {theoryRooms.map((r: any) => (
              <RoomRow key={r.id} name={r.name} capacity={r.capacity} type="THEORY" />
            ))}
          </div>
        </div>
        <div className="bento-card">
          <SectionTitle icon={FlaskConical} title={`Lab Rooms (${labRooms.length})`} />
          <p className="mt-1 text-xs text-white/30">Used for practical sessions (3-hour blocks). Labs are strictly assigned to these rooms.</p>
          <div className="mt-4 space-y-2">
            {labRooms.map((r: any) => (
              <RoomRow key={r.id} name={r.name} capacity={r.capacity} type="LAB" />
            ))}
          </div>
        </div>
      </section>

      {/* Batches */}
      <section className="bento-card">
        <SectionTitle icon={Layers} title={`Batches & Curriculum (${data.batches?.length ?? 0})`} />
        <p className="mt-1 text-xs text-white/30">
          Each batch runs a specific semester with defined courses. The EA schedules all batches simultaneously without any conflicts.
        </p>
        <div className="mt-4 grid gap-4">
          {(data.batches ?? []).map((batch: any) => (
            <div key={batch.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-violet-400/15 text-violet-400">
                  <School className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white/80">{batch.label}</h3>
                  <p className="text-[10px] text-white/30">
                    Batch {batch.batchCode} · Admission {batch.admissionYear} · Year {Math.ceil(batch.semester / 2)} of {batch.degreeYears}
                  </p>
                </div>
                <div className="ml-auto flex gap-2">
                  {(batch.sections ?? []).map((sec: any) => (
                    <span key={sec.id} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[10px] font-bold text-white/50">
                      {sec.name} · {sec.studentCount} students
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {(batch.courses ?? []).map((c: any) => (
                  <div key={c.code} className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2 text-[11px]">
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-white/20" />
                    <div className="min-w-0">
                      <p className="font-semibold text-white/60 truncate">{c.code} — {c.name}</p>
                      <p className="text-[9px] text-white/25">{c.teacherName} · {c.creditHours.theory}+{c.creditHours.lab} CrHr</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Time Structure */}
      <section className="bento-card">
        <SectionTitle icon={Clock3} title="Daily Time Structure" />
        <p className="mt-1 text-xs text-white/30">The scheduling window is 9:00 AM to 5:00 PM with a mandatory break at 1:00 PM (Lunch / Namaz).</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(data.periods ?? []).map((p: any) => (
            <div key={p.id} className={`rounded-lg border px-4 py-2.5 text-center text-xs ${
              p.isBreak
                ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-400"
                : "border-white/[0.06] bg-white/[0.02] text-white/60"
            }`}>
              <p className="font-mono font-bold">{p.id}</p>
              <p className="mt-0.5 text-[10px]">{p.label}</p>
              {p.isBreak && <p className="mt-0.5 text-[9px] text-amber-400/60">BREAK</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Credit Hours Logic */}
      <section className="bento-card">
        <SectionTitle icon={BookMarked} title="Credit Hours Logic" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
            <h4 className="font-bold text-emerald-400">Theory Course (e.g. 3 CrHr)</h4>
            <ul className="mt-2 space-y-1 text-xs text-white/50">
              <li>• 3 credit hours = 3 separate 1-hour theory lectures per week</li>
              <li>• Each lecture is assigned to a Theory Room</li>
              <li>• Maximum 2 continuous hours for theory</li>
              <li>• Distributed across different days to avoid overload</li>
            </ul>
          </div>
          <div className="rounded-xl border border-blue-400/10 bg-blue-400/[0.04] p-4">
            <h4 className="font-bold text-blue-400">Lab Course (e.g. 3+1 CrHr)</h4>
            <ul className="mt-2 space-y-1 text-xs text-white/50">
              <li>• "3+1" = 3 theory lectures + 1 lab session per week</li>
              <li>• Lab is a continuous 3-hour block</li>
              <li>• Labs are strictly assigned to Lab Rooms only</li>
              <li>• Lab cannot span across the lunch break</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Sub-components ─── */
function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-bold text-white/80">
      <Icon className="h-4 w-4 text-cyan-400" /> {title}
    </h2>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: "bg-cyan-400/10 text-cyan-400",
    emerald: "bg-emerald-400/10 text-emerald-400",
    blue: "bg-blue-400/10 text-blue-400",
    violet: "bg-violet-400/10 text-violet-400",
    amber: "bg-amber-400/10 text-amber-400",
  };
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <span className={`grid h-10 w-10 place-items-center rounded-lg ${colorMap[color]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white/70">{value}</p>
    </div>
  );
}

function RoomRow({ name, capacity, type }: { name: string; capacity: number; type: "THEORY" | "LAB" }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
      <div className={`grid h-8 w-8 place-items-center rounded-lg ${
        type === "LAB" ? "bg-blue-400/10 text-blue-400" : "bg-emerald-400/10 text-emerald-400"
      }`}>
        {type === "LAB" ? <FlaskConical className="h-4 w-4" /> : <DoorOpen className="h-4 w-4" />}
      </div>
      <span className="flex-1 text-sm text-white/60">{name}</span>
      <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-bold text-white/40">
        Cap: {capacity}
      </span>
    </div>
  );
}
