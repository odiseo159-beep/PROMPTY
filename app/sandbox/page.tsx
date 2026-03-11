"use client";

import { useState } from "react";
import Link from "next/link";

const upcomingFeatures = [
  { icon: "✍️", label: "Editor de prompts en vivo con resaltado de sintaxis" },
  { icon: "🤖", label: "Respuestas instantáneas de IA con múltiples proveedores" },
  { icon: "📊", label: "Puntuación por rúbrica: claridad, especificidad, calidad de salida" },
  { icon: "💾", label: "Guarda, versiona y comparte tus mejores prompts" },
  { icon: "🔬", label: "Compara dos prompts en modo A/B" },
];

export default function SandboxPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al evaluar el prompt");

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate flex flex-col items-center px-6 py-24 text-center">
      {/* Background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-emerald-600/15 blur-[120px]" />
        <div className="absolute left-1/3 top-1/2 h-[250px] w-[350px] -translate-y-1/2 rounded-full bg-violet-600/10 blur-[90px]" />
        <div className="absolute right-1/3 top-1/2 h-[250px] w-[350px] -translate-y-1/2 rounded-full bg-amber-600/10 blur-[90px]" />
      </div>

      {/* Próximamente badge */}
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Próximamente
      </span>

      {/* Heading */}
      <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.1]">
        Sandbox de{" "}
        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Prompts
        </span>
      </h1>

      {/* Subheading */}
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
        El Sandbox es tu laboratorio libre de prompt engineering. Escribe prompts, dispáralos contra modelos de IA reales y obtén puntuaciones instantáneas por rúbrica — sin estructura de lección, sin restricciones. Experimentación pura.
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

        {/* Mock/Real editor body */}
        <div className="p-6 font-mono text-sm overflow-x-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-y min-h-[120px]"
              placeholder="Escribe tu prompt aquí..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="self-end inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Evaluando..." : "Evaluar"}
              {!loading && <span>✨</span>}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
              <p className="font-semibold text-xs uppercase tracking-widest mb-1">Error</p>
              {error}
            </div>
          )}

          {/* AI Response Preview */}
          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-5 mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                  Respuesta de Claude 3.5 Sonnet
                </p>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                  {result.response}
                </div>
              </div>

              {/* Score breakdown */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="flex justify-between items-end mb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    Evaluación del Sandbox
                  </p>
                  <p className="text-2xl font-black text-emerald-400">
                    {result.evaluation.score}/100
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {Object.entries(result.evaluation.breakdown).map(([key, maxPoints]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span>{maxPoints as number} / {(key === 'clarity' || key === 'specificity' || key === 'context') ? 20 : (key === 'constraints' ? 15 : (key === 'format' ? 10 : 15))}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                          style={{ width: `${((maxPoints as number) / ((key === 'clarity' || key === 'specificity' || key === 'context') ? 20 : (key === 'constraints' ? 15 : (key === 'format' ? 10 : 15)))) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-emerald-500/20 pt-4">
                  <p className="text-xs font-semibold uppercase text-emerald-400 mb-2">Técnicas Detectadas</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.evaluation.recognizedTechniques.length > 0 ? (
                      result.evaluation.recognizedTechniques.map((t: string) => (
                        <span key={t} className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-200">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">Ninguna detectada</span>
                    )}
                  </div>

                  <p className="text-xs font-semibold uppercase text-emerald-400 mb-2">Sugerencias de mejora</p>
                  <ul className="list-disc pl-4 text-xs text-emerald-200/80 space-y-1">
                    {result.evaluation.suggestions.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming features list */}
      <div className="mt-14 w-full max-w-lg">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-gray-500">
          Próximamente
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
          Ir a las Lecciones →
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-gray-400 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          ← Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
