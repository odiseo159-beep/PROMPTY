import Link from "next/link";

const features = [
  {
    icon: "🎯",
    title: "Learn by Doing",
    description:
      "Forget passive reading. Every lesson drops you straight into the editor where you craft, iterate, and ship real prompts against live AI models.",
    accent: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/15 text-violet-300",
  },
  {
    icon: "🏆",
    title: "Earn XP & Badges",
    description:
      "Level up your Promptly rank with every challenge you complete. Unlock rare badges, climb the global leaderboard, and flex your prompt mastery.",
    accent: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/15 text-amber-300",
  },
  {
    icon: "🤖",
    title: "Real AI Feedback",
    description:
      "Our rubric-powered evaluation engine scores your prompts on clarity, specificity, and output quality — giving you precise, actionable feedback instantly.",
    accent: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/15 text-emerald-300",
  },
];

const stats = [
  { value: "10,000+", label: "Learners Enrolled" },
  { value: "500+", label: "Prompt Challenges" },
  { value: "50+", label: "Structured Lessons" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative isolate overflow-hidden px-6 pt-24 pb-32 text-center">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute left-1/4 top-1/2 h-[300px] w-[400px] -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-[100px]" />
          <div className="absolute right-1/4 top-1/2 h-[300px] w-[400px] -translate-y-1/2 rounded-full bg-purple-600/10 blur-[100px]" />
        </div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px] shadow-emerald-400/60" />
          Now in Early Access — Join Free
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
          Master the Art of{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
            AI Prompting
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed sm:text-xl">
          Promptly turns prompt engineering into a game. Complete bite-sized
          challenges, get scored by real AI, earn XP, and go from curious
          beginner to prompt pro — one lesson at a time.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-600/30 transition-all duration-200 hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Learning Free
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/sandbox"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-gray-300 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Try the Sandbox
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          No credit card required · Free forever tier available
        </p>
      </section>

      {/* Stats row */}
      <section className="border-y border-white/5 bg-white/[0.02] px-6 py-12">
        <dl className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <dt className="text-4xl font-extrabold bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent">
                {stat.value}
              </dt>
              <dd className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Everything you need to level up
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Built for hands-on learners who want to actually get better at
              working with AI — not just read about it.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className={`relative overflow-hidden rounded-2xl border ${feature.border} bg-gradient-to-b ${feature.accent} p-8 transition-transform duration-200 hover:-translate-y-1`}
              >
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-lg font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-fuchsia-900/20 p-12 text-center shadow-2xl shadow-violet-900/20">
          <div className="mb-4 text-4xl">⚡</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to become a prompt engineer?
          </h2>
          <p className="mt-4 text-gray-400">
            Join thousands of learners already building sharper AI skills with Promptly.
          </p>
          <Link
            href="/lessons"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-600/30 transition-all duration-200 hover:from-violet-500 hover:to-purple-500 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Learning Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-gray-600 sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-gray-500">
            <span>⚡</span>
            <span>Promptly</span>
          </div>
          <p>© {new Date().getFullYear()} Promptly. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
