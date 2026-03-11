"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Progress,
  Divider,
  Textarea,
  Spinner,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import type { EvaluationResult } from "@/lib/prompt-evaluation-rubric";

const BREAKDOWN_MAX: Record<string, number> = {
  clarity: 20,
  specificity: 20,
  context: 20,
  constraints: 15,
  format: 10,
  tone: 15,
};

const BREAKDOWN_LABELS: Record<string, string> = {
  clarity: "Claridad",
  specificity: "Especificidad",
  context: "Contexto",
  constraints: "Restricciones",
  format: "Formato",
  tone: "Tono",
};

const upcomingFeatures = [
  { icon: "✍️", label: "Editor de prompts en vivo con resaltado de sintaxis" },
  { icon: "🤖", label: "Respuestas instantáneas de IA con múltiples proveedores" },
  { icon: "📊", label: "Puntuación por rúbrica: claridad, especificidad, calidad de salida" },
  { icon: "💾", label: "Guarda, versiona y comparte tus mejores prompts" },
  { icon: "🔬", label: "Compara dos prompts en modo A/B" },
];

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 55) return "text-amber-400";
  return "text-rose-400";
}

function scoreLabel(score: number) {
  if (score >= 80) return { label: "Excelente", color: "success" as const };
  if (score >= 55) return { label: "En progreso", color: "warning" as const };
  return { label: "Mejorable", color: "danger" as const };
}

export default function SandboxPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ response: string; evaluation: EvaluationResult } | null>(null);
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-14 sm:px-8">
      {/* Background glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-emerald-600/10 blur-[130px]" />
        <div className="absolute left-1/4 top-1/2 w-[350px] h-[350px] rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute right-1/4 top-1/2 w-[350px] h-[350px] rounded-full bg-cyan-600/6 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-3xl flex flex-col items-center">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="text-center mb-12"
        >
          <Chip
            startContent={
              <span className="relative flex h-2 w-2 ml-1">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            }
            variant="flat"
            classNames={{ base: "bg-emerald-500/10 border border-emerald-500/25 mb-4", content: "text-emerald-400 font-semibold" }}
          >
            Beta Disponible
          </Chip>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-4 leading-[1.1]">
            Sandbox de{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Prompts
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
            Tu laboratorio libre de prompt engineering. Escribe un prompt, dispáralo contra IA real y obtén una puntuación instantánea por rúbrica.
          </p>
        </motion.div>

        {/* Editor Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 22 }}
          className="w-full"
        >
          <Card className="w-full bg-[#0e0e1a] border border-white/10 shadow-2xl shadow-black/60">
            {/* Window chrome */}
            <CardHeader className="border-b border-white/5 bg-white/[0.02] px-5 py-3 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/70" />
              <span className="h-3 w-3 rounded-full bg-amber-500/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-xs font-mono text-gray-500">sandbox.promptly.dev</span>
            </CardHeader>

            <CardBody className="p-5 gap-4 flex flex-col">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Textarea
                  placeholder="Escribe tu prompt aquí… Sé específico, añade contexto y define el formato de salida."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                  minRows={5}
                  classNames={{
                    base: "font-mono",
                    inputWrapper: "bg-white/[0.04] border border-white/10 hover:border-white/20 focus-within:!border-violet-500 focus-within:!ring-violet-500/30 shadow-none",
                    input: "text-gray-300 text-sm placeholder:text-gray-600",
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    isDisabled={loading || !prompt.trim()}
                    isLoading={loading}
                    spinner={<Spinner size="sm" color="white" />}
                    className="bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors"
                    endContent={!loading && <span>✨</span>}
                  >
                    {loading ? "Evaluando..." : "Evaluar"}
                  </Button>
                </div>
              </form>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="bg-rose-500/10 border border-rose-500/25">
                      <CardBody className="p-4 flex flex-row items-start gap-3">
                        <span className="text-rose-400 mt-0.5">⚠</span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-1">Error</p>
                          <p className="text-sm text-rose-300">{error}</p>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="flex flex-col gap-4 mt-2"
                  >
                    {/* AI Response */}
                    <Card className="bg-violet-500/8 border border-violet-500/25">
                      <CardHeader className="px-5 pt-4 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                          <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
                            Respuesta de Claude
                          </p>
                        </div>
                      </CardHeader>
                      <CardBody className="px-5 pb-5 pt-0">
                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {result.response}
                        </p>
                      </CardBody>
                    </Card>

                    {/* Evaluation */}
                    <Card className="bg-emerald-500/5 border border-emerald-500/20">
                      <CardHeader className="px-5 pt-4 pb-3 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                          Evaluación del Sandbox
                        </p>
                        <div className="flex items-center gap-2">
                          <Chip
                            color={scoreLabel(result.evaluation.score).color}
                            variant="flat"
                            size="sm"
                          >
                            {scoreLabel(result.evaluation.score).label}
                          </Chip>
                          <span className={`text-2xl font-black ${scoreColor(result.evaluation.score)}`}>
                            {result.evaluation.score}<span className="text-base font-semibold text-gray-500">/100</span>
                          </span>
                        </div>
                      </CardHeader>

                      <Divider className="bg-emerald-500/10" />

                      <CardBody className="px-5 py-4 flex flex-col gap-5">
                        {/* Score breakdown */}
                        <div className="flex flex-col gap-3">
                          {Object.entries(result.evaluation.breakdown).map(([key, points]) => {
                            const max = BREAKDOWN_MAX[key] ?? 20;
                            const pct = Math.round(((points as number) / max) * 100);
                            return (
                              <div key={key} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-400 font-medium">{BREAKDOWN_LABELS[key] ?? key}</span>
                                  <span className="text-gray-500 font-semibold tabular-nums">
                                    {points as number}<span className="text-gray-700">/{max}</span>
                                  </span>
                                </div>
                                <Progress
                                  size="sm"
                                  value={pct}
                                  classNames={{
                                    track: "bg-white/5",
                                    indicator: pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500",
                                  }}
                                  aria-label={`${BREAKDOWN_LABELS[key]}: ${points}/${max}`}
                                />
                              </div>
                            );
                          })}
                        </div>

                        <Divider className="bg-emerald-500/10" />

                        {/* Techniques */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                            Técnicas Detectadas
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {result.evaluation.recognizedTechniques.length > 0 ? (
                              result.evaluation.recognizedTechniques.map((t) => (
                                <Chip
                                  key={t}
                                  size="sm"
                                  variant="flat"
                                  classNames={{ base: "bg-emerald-500/15 border border-emerald-500/25", content: "text-emerald-200 font-medium" }}
                                >
                                  {t}
                                </Chip>
                              ))
                            ) : (
                              <span className="text-xs text-gray-600">Ninguna detectada</span>
                            )}
                          </div>
                        </div>

                        <Divider className="bg-emerald-500/10" />

                        {/* Suggestions */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">
                            Sugerencias de Mejora
                          </p>
                          <ul className="flex flex-col gap-2">
                            {result.evaluation.suggestions.map((s, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 text-xs font-bold">
                                  {i + 1}
                                </span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardBody>
          </Card>
        </motion.div>

        {/* Upcoming features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.1 }}
          className="w-full mt-14 max-w-lg"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 text-center mb-5">
            Próximamente
          </p>
          <div className="flex flex-col gap-2">
            {upcomingFeatures.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 22 }}
              >
                <Card className="bg-white/[0.02] border border-white/5 shadow-none">
                  <CardBody className="px-5 py-3.5 flex flex-row items-center gap-3">
                    <span className="text-base">{feature.icon}</span>
                    <span className="text-sm text-gray-400">{feature.label}</span>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row gap-3"
        >
          <Button
            as={Link}
            href="/lessons"
            className="font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/25 hover:-translate-y-px transition-transform"
            endContent={<span>→</span>}
          >
            Ir a las Lecciones
          </Button>
          <Button
            as={Link}
            href="/"
            variant="bordered"
            className="font-semibold text-gray-400 border-white/10 bg-white/5 hover:text-white hover:bg-white/10 hover:border-white/20"
            startContent={<span>←</span>}
          >
            Volver al Inicio
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
