import { BrainCircuit, Dna, Gauge, GitBranch, type LucideIcon, RefreshCcw, ShieldCheck, Shuffle, Target, TrendingUp, Users, Zap, Award, Layers, Clock3, Building2, AlertTriangle, CheckCircle2, BarChart3 } from "lucide-react";

export function AboutEAPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <section className="bento-card relative overflow-hidden p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-8 h-48 w-48 rounded-full bg-cyan-500/10 blur-[80px]" />
          <div className="absolute right-8 bottom-8 h-56 w-56 rounded-full bg-violet-500/[0.07] blur-[80px]" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
            <BrainCircuit className="h-3.5 w-3.5" /> Research & Methodology
          </div>
          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Evolutionary Algorithm <span className="text-cyan-400">Architecture</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/50">
            OptiSchedule uses a Genetic Algorithm (GA) — a class of Evolutionary Algorithms inspired by Darwin's theory of natural selection — to generate conflict-free, optimized university timetables for the Department of Computer Science & Engineering at DUET (Dawood University of Engineering & Technology).
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bento-card">
        <SectionHead icon={AlertTriangle} title="The Real-World Problem at DUET" color="amber" />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
            <h4 className="font-bold text-amber-400">Manual Scheduling Challenges</h4>
            <ul className="mt-2 space-y-1.5 text-xs text-white/50">
              <li>• <strong className="text-white/70">Teacher Conflicts:</strong> Faculty assigned to overlapping timeslots across sections</li>
              <li>• <strong className="text-white/70">Room Clashes:</strong> Multiple classes assigned to same room simultaneously</li>
              <li>• <strong className="text-white/70">Student Gaps:</strong> Long idle hours between classes (e.g. 9 AM class then 3 PM class)</li>
              <li>• <strong className="text-white/70">Lab Misassignment:</strong> Lab sessions booked in theory rooms and vice versa</li>
              <li>• <strong className="text-white/70">Unfair Loads:</strong> Some days packed with 7 hours, others completely empty</li>
              <li>• <strong className="text-white/70">Manual Effort:</strong> Days of human effort every semester for 4 concurrent batches</li>
            </ul>
          </div>
          <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
            <h4 className="font-bold text-emerald-400">What OptiSchedule Solves</h4>
            <ul className="mt-2 space-y-1.5 text-xs text-white/50">
              <li>• <strong className="text-white/70">Zero Conflicts:</strong> Guaranteed no teacher, room, or student overlap</li>
              <li>• <strong className="text-white/70">Compact Schedules:</strong> Minimizes gaps — students finish early</li>
              <li>• <strong className="text-white/70">Fair Distribution:</strong> Balanced load across weekdays</li>
              <li>• <strong className="text-white/70">Lab Compliance:</strong> Labs always in lab rooms, 3-hour blocks</li>
              <li>• <strong className="text-white/70">Automated:</strong> Generates optimal timetable in seconds, not days</li>
              <li>• <strong className="text-white/70">Exportable:</strong> Professional PDF, Word, Excel output</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What is EA */}
      <section className="bento-card">
        <SectionHead icon={Dna} title="What are Evolutionary Algorithms?" color="cyan" />
        <p className="mt-3 text-sm text-white/50 leading-relaxed">
          <strong className="text-white/70">Evolutionary Algorithms (EAs)</strong> are a family of metaheuristic optimization algorithms inspired by biological evolution. They maintain a <strong className="text-white/70">population</strong> of candidate solutions that <strong className="text-white/70">evolve</strong> over generations through processes analogous to natural selection, crossover (recombination), and mutation.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ConceptCard icon={Users} title="Population" desc="A set of candidate timetables (chromosomes). Each represents a complete weekly schedule." />
          <ConceptCard icon={Target} title="Fitness Function" desc="Scores each timetable. Higher fitness = fewer conflicts + more compact schedule." />
          <ConceptCard icon={GitBranch} title="Crossover" desc="Combines two parent schedules to create a child with traits from both." />
          <ConceptCard icon={Shuffle} title="Mutation" desc="Random swaps in room/time assignments to explore new scheduling possibilities." />
        </div>
        <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h4 className="text-xs font-bold text-white/60">EA Family Tree — Where Our GA Fits</h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-5 text-[10px]">
            {[
              ["Genetic Algorithm (GA)", "Used in OptiSchedule — chromosome = timetable", true],
              ["Genetic Programming (GP)", "Evolves programs/trees, not used here", false],
              ["Evolution Strategy (ES)", "Continuous optimization, not for scheduling", false],
              ["Differential Evolution", "Numeric optimization variant", false],
              ["Particle Swarm (PSO)", "Swarm intelligence — alternative approach", false],
            ].map(([name, desc, active]) => (
              <div key={name as string} className={`rounded-lg border p-2.5 ${active ? "border-cyan-400/20 bg-cyan-400/[0.06]" : "border-white/[0.04] bg-white/[0.02]"}`}>
                <p className={`font-bold ${active ? "text-cyan-400" : "text-white/40"}`}>{name as string}</p>
                <p className="mt-1 text-white/30">{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GA Workflow */}
      <section className="bento-card">
        <SectionHead icon={RefreshCcw} title="How the Genetic Algorithm Works — Step by Step" color="violet" />
        <div className="mt-5 grid gap-4">
          {gaSteps.map((step, i) => (
            <div key={step.title} className="flex gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-violet-400/10 text-violet-400 font-display text-lg font-bold">
                {i + 1}
              </div>
              <div>
                <h4 className="font-bold text-white/80">{step.title}</h4>
                <p className="mt-1 text-xs text-white/45 leading-relaxed">{step.desc}</p>
                {step.detail && <p className="mt-2 rounded-lg bg-white/[0.02] p-2 text-[10px] font-mono text-white/30">{step.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chromosome Structure */}
      <section className="bento-card">
        <SectionHead icon={Layers} title="Chromosome & Gene Encoding" color="blue" />
        <p className="mt-3 text-sm text-white/50">Each <strong className="text-white/70">chromosome</strong> is a complete timetable. Each <strong className="text-white/70">gene</strong> represents one session requirement mapped to a specific day, time, and room.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Gene Field", "Example Value", "Description"].map(h => (
                  <th key={h} className="py-2 px-3 font-bold text-white/40 uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-white/50">
              {[
                ["courseId", "CSC-481", "The course being scheduled"],
                ["teacherId", "teacher-cse-8", "Assigned instructor"],
                ["sectionId", "section-cse-22f-a", "Target student section"],
                ["sessionType", "THEORY / LAB", "Determines room type + duration"],
                ["day", "Monday", "Day of the week (Mon-Fri)"],
                ["startPeriodId", "P1", "Starting time slot (9 AM - 5 PM)"],
                ["roomId", "room-cs-lab-4", "Assigned classroom or lab"],
                ["durationPeriods", "1 (theory) / 3 (lab)", "How many consecutive periods"],
              ].map(([field, val, desc]) => (
                <tr key={field} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-2 px-3 font-mono text-cyan-400/70">{field}</td>
                  <td className="py-2 px-3">{val}</td>
                  <td className="py-2 px-3 text-white/30">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Crossover Strategies */}
      <section className="bento-card">
        <SectionHead icon={GitBranch} title="Crossover Strategies" color="emerald" />
        <p className="mt-3 text-sm text-white/50">OptiSchedule uses three crossover strategies randomly selected each generation:</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { name: "DAY_BLOCK", desc: "Copies all genes from Parent B that fall on 1-2 randomly selected days. Preserves daily schedule coherence.", color: "cyan" },
            { name: "DEPARTMENT_BLOCK", desc: "Copies genes from Parent B belonging to 1-2 randomly selected departments. Keeps departmental scheduling intact.", color: "violet" },
            { name: "TWO_POINT", desc: "Classic two-point crossover — selects a random segment of genes from Parent B. Standard GA technique.", color: "emerald" },
          ].map(s => (
            <div key={s.name} className={`rounded-xl border border-${s.color}-400/10 bg-${s.color}-400/[0.04] p-4`}>
              <h4 className={`font-mono font-bold text-${s.color}-400`}>{s.name}</h4>
              <p className="mt-2 text-xs text-white/45">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mutation */}
      <section className="bento-card">
        <SectionHead icon={Zap} title="Mutation Operators" color="amber" />
        <p className="mt-3 text-sm text-white/50">Each gene has a probability (mutation rate, default 5%) of being mutated. Three mutation kinds:</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { name: "ROOM", desc: "Randomly reassigns the room (preserving type — labs stay in labs, theory stays in theory rooms)." },
            { name: "TIME", desc: "Randomly changes the day and starting time period. Uses student-friendly day preferences (Section A → Mon-Wed, Section B → Wed-Fri)." },
            { name: "ROOM_AND_TIME", desc: "Combines both mutations — changes room AND time simultaneously for maximum exploration." },
          ].map(m => (
            <div key={m.name} className="rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
              <h4 className="font-mono font-bold text-amber-400">{m.name}</h4>
              <p className="mt-2 text-xs text-white/45">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fitness Function */}
      <section className="bento-card">
        <SectionHead icon={Gauge} title="Fitness Function — Detailed Breakdown" color="cyan" />
        <p className="mt-3 text-sm text-white/50">The fitness function is the heart of the EA. It evaluates every chromosome (timetable) with a score formula:</p>
        <div className="mt-3 rounded-lg bg-white/[0.03] p-3 font-mono text-sm text-cyan-400">
          score = 1000 − hard_penalty − soft_penalty
        </div>

        <h4 className="mt-5 text-xs font-bold text-rose-400 uppercase tracking-wider">Hard Constraints (Must be zero for valid schedule)</h4>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-white/[0.06]">
              {["Constraint", "Penalty/Violation", "What It Prevents"].map(h => (
                <th key={h} className="py-2 px-3 text-left font-bold text-white/40 text-[10px] uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody className="text-white/50">
              {hardConstraints.map(c => (
                <tr key={c[0]} className="border-b border-white/[0.03]">
                  <td className="py-2 px-3 font-semibold text-white/60">{c[0]}</td>
                  <td className="py-2 px-3 font-mono text-rose-400">{c[1]}</td>
                  <td className="py-2 px-3 text-white/35">{c[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h4 className="mt-5 text-xs font-bold text-amber-400 uppercase tracking-wider">Soft Constraints (Optimization objectives)</h4>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-white/[0.06]">
              {["Objective", "Weight Formula", "Purpose"].map(h => (
                <th key={h} className="py-2 px-3 text-left font-bold text-white/40 text-[10px] uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody className="text-white/50">
              {softConstraints.map(c => (
                <tr key={c[0]} className="border-b border-white/[0.03]">
                  <td className="py-2 px-3 font-semibold text-white/60">{c[0]}</td>
                  <td className="py-2 px-3 font-mono text-amber-400 text-[10px]">{c[1]}</td>
                  <td className="py-2 px-3 text-white/35">{c[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Selection */}
      <section className="bento-card">
        <SectionHead icon={Award} title="Selection Strategy: Tournament Selection" color="violet" />
        <p className="mt-3 text-sm text-white/50 leading-relaxed">
          OptiSchedule uses <strong className="text-white/70">Tournament Selection</strong> (default size = 5). For each new child:
        </p>
        <ol className="mt-3 space-y-2 text-xs text-white/50">
          <li className="flex gap-2"><span className="shrink-0 font-bold text-violet-400">1.</span> Randomly pick 5 chromosomes from the population</li>
          <li className="flex gap-2"><span className="shrink-0 font-bold text-violet-400">2.</span> Compare them — prioritize fewer hard violations first, then higher fitness score</li>
          <li className="flex gap-2"><span className="shrink-0 font-bold text-violet-400">3.</span> The winner becomes a parent for crossover</li>
          <li className="flex gap-2"><span className="shrink-0 font-bold text-violet-400">4.</span> Repeat to get second parent</li>
        </ol>
        <p className="mt-3 text-xs text-white/30">
          <strong className="text-white/50">Elitism:</strong> The top N chromosomes (default 4) are preserved unchanged into the next generation, ensuring the best solutions are never lost.
        </p>
      </section>

      {/* Benefits */}
      <section className="bento-card">
        <SectionHead icon={TrendingUp} title="Benefits of This Approach" color="emerald" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(b => (
            <div key={b.title} className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h4 className="mt-2 font-bold text-white/70">{b.title}</h4>
              <p className="mt-1 text-xs text-white/40">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Parameters */}
      <section className="bento-card">
        <SectionHead icon={BarChart3} title="Configurable EA Parameters" color="cyan" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-white/[0.06]">
              {["Parameter", "Default", "Range", "Effect"].map(h => (
                <th key={h} className="py-2 px-3 text-left font-bold text-white/40 text-[10px] uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody className="text-white/50">
              {eaParams.map(p => (
                <tr key={p[0]} className="border-b border-white/[0.03]">
                  <td className="py-2 px-3 font-semibold text-white/60">{p[0]}</td>
                  <td className="py-2 px-3 font-mono text-cyan-400">{p[1]}</td>
                  <td className="py-2 px-3">{p[2]}</td>
                  <td className="py-2 px-3 text-white/35">{p[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bento-card">
        <SectionHead icon={Building2} title="Technology Stack" color="blue" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "TypeScript", role: "Core language for both frontend & backend" },
            { name: "React + Vite", role: "Frontend UI framework with hot module replacement" },
            { name: "Tailwind CSS", role: "Utility-first CSS framework for dark-mode UI" },
            { name: "Recharts", role: "React charting library for live fitness visualization" },
            { name: "Node.js HTTP + SSE", role: "Backend server with Server-Sent Events streaming" },
            { name: "PDFKit + docx + ExcelJS", role: "Professional export generation (PDF, Word, Excel)" },
          ].map(t => (
            <div key={t.name} className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
              <p className="font-bold text-white/60">{t.name}</p>
              <p className="mt-0.5 text-[10px] text-white/30">{t.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Data ─── */
function SectionHead({ icon: Icon, title, color }: { icon: LucideIcon; title: string; color: string }) {
  const colorMap: Record<string, string> = { cyan: "text-cyan-400", emerald: "text-emerald-400", violet: "text-violet-400", amber: "text-amber-400", blue: "text-blue-400", rose: "text-rose-400" };
  return <h2 className="flex items-center gap-2 text-sm font-bold text-white/80"><Icon className={`h-4 w-4 ${colorMap[color]}`} /> {title}</h2>;
}

function ConceptCard({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <Icon className="h-5 w-5 text-cyan-400" />
      <h4 className="mt-2 font-bold text-white/70">{title}</h4>
      <p className="mt-1 text-[11px] text-white/40">{desc}</p>
    </div>
  );
}

const gaSteps = [
  { title: "Initialize Random Population", desc: "Create N random timetables (chromosomes). Each gene is assigned a random valid room, day, and time period. Labs are biased toward lab rooms, theory toward lecture rooms.", detail: "Chromosome.random(data, random) → Gene.random(requirement, data, random)" },
  { title: "Evaluate Fitness", desc: "Score every chromosome using the fitness function. Count all hard constraint violations (clashes, mismatches) and soft penalties (gaps, late finishes). Hard violations are prioritized.", detail: "score = 1000 − Σ(hardPenalties) − Σ(softPenalties)" },
  { title: "Tournament Selection", desc: "For each child needed, randomly pick k chromosomes (tournament size) and select the one with fewest hard violations, then highest score. This balances exploration and exploitation.", detail: "tournamentSize=5 → pick 5 random, sort by (hardViolations ASC, score DESC)" },
  { title: "Crossover (Recombination)", desc: "Two selected parents are combined using one of three strategies: DAY_BLOCK, DEPARTMENT_BLOCK, or TWO_POINT. The child inherits scheduling genes from both parents.", detail: "crossoverRate=0.85 → 85% chance of crossover, 15% clone parent" },
  { title: "Mutation", desc: "Each gene in the child has a small probability of being randomly changed. Mutation can swap the room, time, or both. This prevents premature convergence.", detail: "mutationRate=0.05 → ~5.6 genes mutated per chromosome (112 total)" },
  { title: "Elitism", desc: "The top eliteCount chromosomes from the current generation are copied unchanged to the next generation. This ensures the best solution found so far is never lost.", detail: "eliteCount=4 → top 4 preserved each generation" },
  { title: "Convergence Check", desc: "If a chromosome achieves 0 hard violations, the EA continues for simSteps more generations to optimize soft constraints, then stops. Otherwise continues until maxGenerations.", detail: "if (hardViolations === 0 && gen - solvedGen >= simSteps) → STOP" },
];

const hardConstraints = [
  ["Room Clashes", "1,000", "Two classes in the same room at the same time"],
  ["Teacher Clashes", "1,200", "Same teacher assigned to two classes simultaneously"],
  ["Student Clashes", "1,500", "Same section has two classes at the same time"],
  ["Room Type Mismatch", "1,000", "Lab in theory room or theory in lab room"],
  ["Capacity Violations", "1,000", "More students than room capacity"],
  ["Break Violations", "2,000", "Classes scheduled during the 1-2 PM break"],
  ["Duration Violations", "2,000", "Theory > 2hr continuous or lab ≠ 3hr block"],
];

const softConstraints = [
  ["Student Gap Minimization", "35 per empty period + 30 if >1 gap", "Prevents long idle times between classes"],
  ["Early Finish Reward", "8 × max(0, lastPeriodIdx - 2)", "Rewards compacting classes toward morning"],
  ["Campus Span", "24 per wasted period in daily span", "Penalizes large first-to-last class spread"],
  ["Active Campus Days", "90 per extra day beyond ideal", "Reduces unnecessary campus visits"],
  ["Teacher Fragmentation", "3 per idle period (if >1 idle)", "Keeps teacher schedules compact"],
  ["Teacher Overload", "6 per period over weekly max", "Prevents exceeding weekly teaching limits"],
];

const benefits = [
  { title: "Multi-Objective Optimization", desc: "Simultaneously handles 7 hard constraints and 6 soft objectives — impossible to solve manually." },
  { title: "Scalable", desc: "Handles 4 batches × 7 sections × 5 courses × theory+lab = 112+ session requirements." },
  { title: "Real-Time Visualization", desc: "Watch the algorithm work — live fitness charts, chromosome inspection, and generation logs." },
  { title: "Configurable", desc: "All EA parameters adjustable from the UI — population size, mutation rate, crossover rate, etc." },
  { title: "Deterministic Quality", desc: "Elitism ensures the best solution is never lost. Tournament selection drives convergence." },
  { title: "Professional Output", desc: "Generates publication-quality PDF, Word, and Excel timetables with color coding." },
];

const eaParams = [
  ["Population Size", "120", "20–500", "Larger = more diversity but slower per generation"],
  ["Generations", "500", "50–2000", "More generations = better convergence"],
  ["Crossover Rate", "85%", "10–100%", "Higher = more recombination, lower = more cloning"],
  ["Mutation Rate", "5%", "1–30%", "Higher = more exploration, risk of destroying good solutions"],
  ["Elite Count", "4", "1–20", "More elites = safer convergence, less diversity"],
  ["Tournament Size", "5", "2–15", "Larger = stronger selection pressure"],
  ["Sim Steps", "50", "10–200", "Soft optimization generations after hard constraints solved"],
  ["Spawn Rate", "12%", "5–50%", "Probability of random day assignment (vs student-friendly)"],
];
