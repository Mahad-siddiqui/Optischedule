/* ─────────────────────────────────────────
   Reusable skeleton / shimmer primitives
   ───────────────────────────────────────── */

/** Single shimmer stripe — drop into any container */
export function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-white/[0.04] ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

/* ─── Timetable page skeleton ─── */
export function TimetableSkeleton() {
  return (
    <section className="flex flex-col gap-5">
      {/* Header card */}
      <div className="bento-card">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3">
            <Shimmer className="h-3 w-32" />
            <Shimmer className="h-7 w-56" />
            <Shimmer className="h-3 w-64" />
          </div>
          <div className="flex gap-2">
            <Shimmer className="h-9 w-20 !rounded-full" />
            <Shimmer className="h-9 w-20 !rounded-full" />
            <Shimmer className="h-9 w-24 !rounded-full" />
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <Shimmer className="h-10 w-10 !rounded-lg" />
              <div className="flex flex-col gap-2">
                <Shimmer className="h-2 w-16" />
                <Shimmer className="h-5 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0e1a]/90 p-4 backdrop-blur-xl">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[180px_160px_1fr_1fr_auto]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Shimmer className="h-2.5 w-16" />
              <Shimmer className="h-10 w-full !rounded-lg" />
            </div>
          ))}
          <Shimmer className="h-10 w-20 self-end !rounded-lg" />
        </div>
      </div>

      {/* Analytics: stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bento-card flex items-start justify-between gap-2">
            <div className="flex flex-col gap-2">
              <Shimmer className="h-2 w-20" />
              <Shimmer className="h-7 w-14" />
              <Shimmer className="h-2 w-24" />
            </div>
            <Shimmer className="h-9 w-9 !rounded-lg" />
          </div>
        ))}
      </div>

      {/* Analytics: charts */}
      {[[1, 2], [3, 4]].map((pair) => (
        <div key={pair[0]} className="grid gap-4 xl:grid-cols-2">
          {pair.map((i) => (
            <div key={i} className="bento-card">
              <div className="mb-3 flex items-start gap-2">
                <Shimmer className="h-8 w-8 !rounded-lg" />
                <div className="flex flex-col gap-1.5 pt-1">
                  <Shimmer className="h-3 w-32" />
                  <Shimmer className="h-2 w-48" />
                </div>
              </div>
              <Shimmer className="h-[250px] w-full !rounded-xl" />
            </div>
          ))}
        </div>
      ))}

      {/* Timetable grid */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c1020]">
        <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-2">
              <Shimmer className="h-3.5 w-24" />
              <Shimmer className="h-2.5 w-48" />
            </div>
            <div className="flex gap-3">
              <Shimmer className="h-3 w-14" />
              <Shimmer className="h-3 w-10" />
            </div>
          </div>
        </div>
        {/* Day headers */}
        <div className="flex min-w-[1396px] border-b border-white/[0.06]">
          <div className="w-24 shrink-0 border-r border-white/[0.06] bg-cyan-500/10 px-3 py-3">
            <Shimmer className="mx-auto h-3 w-8" />
          </div>
          {[1, 2, 3, 4, 5].map((d) => (
            <div key={d} className="flex-1 border-r border-white/[0.06] bg-cyan-500/10 px-3 py-3">
              <Shimmer className="mx-auto h-3 w-16" />
            </div>
          ))}
        </div>
        {/* Body rows */}
        {[1, 2, 3, 4, 5, 6].map((row) => (
          <div key={row} className="flex min-w-[1396px] border-b border-white/[0.04]" style={{ height: 120 }}>
            <div className="flex w-24 shrink-0 items-center justify-center border-r border-white/[0.06] bg-[#0c1020]">
              <Shimmer className="h-3 w-14" />
            </div>
            {[1, 2, 3, 4, 5].map((col) => (
              <div key={col} className="flex-1 border-r border-white/[0.04] p-2">
                {(row + col) % 3 === 0 && (
                  <div className="flex h-full flex-col gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                    <Shimmer className="h-2 w-16" />
                    <Shimmer className="h-3.5 w-32" />
                    <div className="mt-auto flex flex-col gap-1">
                      <Shimmer className="h-2 w-28" />
                      <Shimmer className="h-2 w-24" />
                      <Shimmer className="h-2 w-20" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Resources page skeleton ─── */
export function ResourcesSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header card */}
      <div className="bento-card flex flex-col gap-4">
        <Shimmer className="h-3 w-40" />
        <Shimmer className="h-7 w-80" />
        <Shimmer className="h-3 w-96" />
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <Shimmer className="h-10 w-10 !rounded-lg" />
              <div className="flex flex-col gap-2">
                <Shimmer className="h-2 w-14" />
                <Shimmer className="h-6 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic info */}
      <div className="bento-card flex flex-col gap-4">
        <Shimmer className="h-4 w-40" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex flex-col gap-2">
              <Shimmer className="h-2 w-16" />
              <Shimmer className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* Teachers grid */}
      <div className="bento-card flex flex-col gap-4">
        <Shimmer className="h-4 w-52" />
        <Shimmer className="h-3 w-80" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Shimmer className="h-10 w-10 !rounded-lg shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <Shimmer className="h-3.5 w-32" />
                  <Shimmer className="h-2.5 w-44" />
                </div>
              </div>
              <div className="space-y-1.5">
                {[1, 2, 3].map((j) => (
                  <Shimmer key={j} className="h-7 w-full !rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rooms */}
      <div className="grid gap-4 xl:grid-cols-2">
        {[1, 2].map((col) => (
          <div key={col} className="bento-card flex flex-col gap-4">
            <Shimmer className="h-4 w-40" />
            <Shimmer className="h-3 w-64" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Shimmer key={i} className="h-12 w-full !rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Batches */}
      <div className="bento-card flex flex-col gap-4">
        <Shimmer className="h-4 w-56" />
        <Shimmer className="h-3 w-96" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Shimmer className="h-10 w-10 !rounded-lg shrink-0" />
              <div className="flex flex-col gap-1.5">
                <Shimmer className="h-4 w-40" />
                <Shimmer className="h-2.5 w-60" />
              </div>
              <div className="ml-auto flex gap-2">
                <Shimmer className="h-7 w-28 !rounded-full" />
                <Shimmer className="h-7 w-28 !rounded-full" />
              </div>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <Shimmer key={j} className="h-12 w-full !rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Time structure */}
      <div className="bento-card flex flex-col gap-4">
        <Shimmer className="h-4 w-44" />
        <Shimmer className="h-3 w-80" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Shimmer key={i} className="h-16 w-20 !rounded-lg" />
          ))}
        </div>
      </div>

      {/* Credit hours */}
      <div className="bento-card flex flex-col gap-4">
        <Shimmer className="h-4 w-36" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Shimmer className="h-36 w-full !rounded-xl" />
          <Shimmer className="h-36 w-full !rounded-xl" />
        </div>
      </div>
    </div>
  );
}
