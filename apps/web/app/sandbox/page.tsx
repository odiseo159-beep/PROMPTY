import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Prompt Sandbox – Promptly",
  description:
    "A free-form environment to craft, test, and refine AI prompts with real-time scoring and feedback. Coming soon to Promptly.",
};

const upcomingFeatures = [
  { icon: "✍️", label: "Live prompt editor with syntax highlighting" },
  { icon: "🤖", label: "Instant AI responses via multiple model providers" },
  { icon: "📊", label: "Rubric-based scoring: clarity, specificity, output quality" },
  { icon: "💾", label: "Save, version, and share your best prompts" },
  { icon: "🔬", label: "A/B compare two prompts side-by-side" },
];

export default function SandboxPage() {
  return (
    <div className="relative isolate flex flex-col items-center px-6 py-24 text-center">
      {/* Background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-emerald-600/15 blur-[120px]" />
        <div className="absolute left-1/3 top-1/2 h-[250px] w-[350px] -translate-y-1/2 rounded-full bg-violet-600/10 blur-[90px]" />
        <div className="absolute right-1/3 top-1/2 h-[250px] w-[350px] -translate-y-1/2 rounded-full bg-amber-600/10 blur-[90px]" />
      </div>

      {/* Coming Soon badge */}
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Coming Soon
      </span>

      {/* Heading */}
      <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.1]">
        Prompt{" "}
        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Sandbox
        </span>
      </h1>

      {/* Subheading */}
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
        The Sandbox is your free-form laboratory for prompt engineering. Write
        prompts, fire them at real AI models, and get back instant rubric-based
        scores — no lesson structure, no guardrails. Pure experimentation.
      </p>

      {/* Decorative editor mockup */}
      <div className="mt-12 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#111122] shadow-2xl shadow-black/50 text-left">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-5 py-3.5">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-amber-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-xs font-mono text-gray-500">sandbox.promptly.dev</span>
        </div>

        {/* Mock editor body */}
        <div className="p-6 font-mono text-sm">
          <p className="text-gray-500">
            <span className="text-violet-400">// </span>Your prompt goes here...
          </p>
          <div className="mt-4 flex items-start gap-3">
            <span className="mt-0.5 text-xs text-gray-600 select-none">1</span>
            <p className="text-gray-300">
              You are a <span className="text-amber-300">helpful assistant</span> that explains complex topics using{" "}
              <span className="text-emerald-300">simple analogies</span>.
            </p>
          </div>
          <div className="mt-2 flex items-start gap-3">
            <span className="mt-0.5 text-xs text-gray-600 select-none">2</span>
            <p className="text-gray-300">
              Explain <span className="text-fuchsia-300">quantum entanglement</span> to a 10-year-old.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-block h-4 w-0.5 animate-pulse bg-violet-400" />
          </div>

          {/* Score preview */}
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Score Preview
            </p>
            <div className="space-y-2">
              {[
                { label: "Clarity", score: 92 },
                { label: "Specificity", score: 85 },
                { label: "Output Quality", score: 88 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-gray-500">{item.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming features list */}
      <div className="mt-14 w-full max-w-lg">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-gray-500">
          What&apos;s coming
        </h2>
        <ul className="space-y-3 text-left">
          {upcomingFeatures.map((feature) => (
            <li
              key={feature.label}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-3.5 text-sm text-gray-300"
            >
              <span className="text-base">{feature.icon}</span>
              {feature.label}
            </li>
          ))}
        </ul>
      </div>

      {/* CTAs */}
      <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition-all duration-200 hover:from-violet-500 hover:to-purple-500 hover:-translate-y-px"
        >
          Start a Lesson Instead →
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-gray-400 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
