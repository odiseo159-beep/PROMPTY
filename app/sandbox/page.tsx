"use client";

import { useState, useEffect, useRef } from "react";
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
  Skeleton,
  Tabs,
  Tab,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import type { EvaluationResult } from "@/lib/prompt-evaluation-rubric";

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_CHARS = 2000;

const BREAKDOWN_MAX: Record<string, number> = {
  clarity: 20,
  specificity: 20,
  context: 20,
  constraints: 15,
  format: 10,
  tone: 15,
};

const BREAKDOWN_LABELS: Record<string, string> = {
  clarity:      "Claridad",
  specificity:  "Especificidad",
  context:      "Contexto",
  constraints:  "Restricciones",
  format:       "Formato",
  tone:         "Tono",
};

const TEMPLATES = [
  { label: "Rol experto",   icon: "🎭", text: 'Actúa como un experto en [tema]. Tu objetivo es [objetivo]. El público objetivo es [audiencia]. Usa un tono [tono] y formato [formato].' },
  { label: "Paso a paso",   icon: "🔢", text: 'Explica paso a paso cómo [hacer algo]. Sé detallado en cada paso. Incluye ejemplos concretos y errores comunes a evitar.' },
  { label: "Resumir",       icon: "📝", text: 'Resume el siguiente texto en exactamente 3 puntos clave.\nFormato: lista con viñetas.\nTono: profesional y conciso.\n\nTexto: [pegar aquí]' },
  { label: "Generar ideas", icon: "💡", text: 'Genera 5 ideas creativas para [objetivo]. Para cada idea incluye: nombre, descripción en 1 oración, y cómo implementarla en 3 pasos.' },
  { label: "Comparar",      icon: "⚖️", text: 'Compara [A] vs [B] en los siguientes aspectos: velocidad, costo, facilidad de uso y casos de uso ideales. Presenta el resultado en una tabla.' },
];

const TIPS = [
  { icon: "🎯", title: "Sé específico",      desc: 'Cuanto más concreto sea tu prompt, mejor será la respuesta. Evita términos vagos como "algo interesante".' },
  { icon: "📐", title: "Define el formato",  desc: 'Indica si quieres lista, tabla, JSON, párrafos o código. El modelo lo respetará.' },
  { icon: "🧠", title: "Añade contexto",     desc: 'Explica quién eres, para qué es la respuesta y quién la leerá. El contexto cambia todo.' },
  { icon: "⛔", title: "Usa restricciones",  desc: '"En menos de 100 palabras", "sin tecnicismos", "solo en inglés". Las restricciones mejoran la calidad.' },
  { icon: "🎭", title: "Asigna un rol",      desc: '"Actúa como un chef estrella Michelin..." activa conocimientos específicos del modelo.' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  return s >= 80 ? "text-emerald-400" : s >= 55 ? "text-amber-400" : "text-rose-400";
}
function scoreLabel(s: number) {
  return s >= 80
    ? { label: "Excelente",    color: "success" as const }
    : s >= 55
    ? { label: "En progreso",  color: "warning" as const }
    : { label: "Mejorable",    color: "danger"  as const };
}

// ── Typing effect hook ────────────────────────────────────────────────────────

function useTypingEffect(text: string | null, msPerWord = 30) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone]       = useState(false);

  useEffect(() => {
    if (!text) { setDisplayed(""); setIsDone(false); return; }
    setDisplayed("");
    setIsDone(false);
    const words = text.split(" ");
    let i = 0;
    const timer = setInterval(() => {
      if (i < words.length) {
        setDisplayed(words.slice(0, i + 1).join(" "));
        i++;
      } else {
        setIsDone(true);
        clearInterval(timer);
      }
    }, msPerWord);
    return () => clearInterval(timer);
  }, [text, msPerWord]);

  return { displayed, isDone };
}

// ── Loading Skeleton ──────────────────────────────────────────────────────────

function OutputSkeleton() {
  return (
    <div className="flex flex-col gap-5 p-5 animate-pulse">
      {/* Claude label */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-violet-400 shrink-0"
        />
        <Skeleton className="h-3 w-32 rounded-lg" />
      </div>

      {/* Response lines */}
      <div className="space-y-2.5">
        <Skeleton className="h-3.5 w-full rounded-lg" />
        <Skeleton className="h-3.5 w-[88%] rounded-lg" />
        <Skeleton className="h-3.5 w-[94%] rounded-lg" />
        <Skeleton className="h-3.5 w-[72%] rounded-lg" />
        <Skeleton className="h-3.5 w-[80%] rounded-lg" />
        <Skeleton className="h-3.5 w-[60%] rounded-lg" />
      </div>

      <Divider className="bg-white/5" />

      {/* Score label + circle */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>

      {/* Breakdown bars */}
      <div className="space-y-3">
        {[100, 85, 70, 90, 60, 75].map((w, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20 rounded-lg" />
              <Skeleton className="h-3 w-10 rounded-lg" />
            </div>
            <Skeleton className="h-2 rounded-full" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>

      {/* Shimmer overlay hint */}
      <div className="flex items-center gap-2 pt-1">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="text-xs text-gray-600 font-mono"
        >
          ✦ Claude está procesando tu prompt...
        </motion.div>
      </div>
    </div>
  );
}

// ── Idle Output Panel ─────────────────────────────────────────────────────────

function IdlePanel({ onInsert }: { onInsert: (text: string) => void }) {
  return (
    <div className="flex flex-col p-5 gap-5">
      {/* Placeholder illustration */}
      <div className="text-center py-4 border-b border-white/[0.05]">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl mb-2 inline-block"
        >
          🧪
        </motion.div>
        <p className="text-sm font-semibold text-gray-500 mt-1">El output aparecerá aquí</p>
        <p className="text-xs text-gray-700">Escribe un prompt a la izquierda y pulsa Evaluar</p>
      </div>

      {/* Tabs: Templates + Tips */}
      <Tabs
        variant="underlined"
        size="sm"
        classNames={{
          tabList: "border-b border-white/8 w-full gap-0 p-0",
          tab: "h-9 px-3 text-xs data-[hover=true]:text-white",
          cursor: "bg-violet-500 h-0.5",
          tabContent: "text-gray-500 group-data-[selected=true]:text-white font-semibold",
          panel: "pt-3",
        }}
      >
        <Tab key="templates" title="⚡ Plantillas">
          <div className="flex flex-col gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => onInsert(t.text)}
                className="w-full text-left rounded-xl border border-white/8 bg-white/[0.03]
                           hover:bg-white/[0.07] hover:border-white/15
                           active:scale-[0.98] transition-all duration-150 p-3 group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{t.icon}</span>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                    {t.label}
                  </span>
                  <span className="ml-auto text-[10px] text-gray-700 group-hover:text-gray-500">Insertar →</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-2 pl-5">{t.text}</p>
              </button>
            ))}
          </div>
        </Tab>

        <Tab key="tips" title="💡 Tips">
          <div className="flex flex-col gap-2">
            {TIPS.map((tip) => (
              <div
                key={tip.title}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{tip.icon}</span>
                  <span className="text-xs font-bold text-gray-300">{tip.title}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pl-5">{tip.desc}</p>
              </div>
            ))}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

// ── Result Panel ──────────────────────────────────────────────────────────────

function ResultPanel({
  result,
  onReset,
}: {
  result: { response: string; evaluation: EvaluationResult };
  onReset: () => void;
}) {
  const { displayed, isDone } = useTypingEffect(result.response, 28);
  const [copied, setCopied]   = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(result.response).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const { score, breakdown, recognizedTechniques, suggestions } = result.evaluation;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col"
    >
      {/* Panel top bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.05] bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-violet-400">
            Respuesta de Claude
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="flat"
            onPress={handleCopy}
            className="h-7 px-2.5 min-w-0 bg-white/5 text-gray-500 hover:text-white text-xs font-semibold"
            startContent={<span className="text-xs">{copied ? "✓" : "📋"}</span>}
          >
            {copied ? "Copiado" : "Copiar"}
          </Button>
          <Button
            size="sm"
            variant="flat"
            onPress={onReset}
            className="h-7 px-2.5 min-w-0 bg-white/5 text-gray-600 hover:text-white text-xs font-semibold"
          >
            Nueva prueba
          </Button>
        </div>
      </div>

      {/* Response text with typing cursor */}
      <div className="px-5 py-4">
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">
          {displayed}
          {!isDone && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-[2px] h-[14px] bg-violet-400 ml-0.5 align-middle rounded-full"
            />
          )}
        </p>
      </div>

      <div className="mx-5 h-px bg-white/[0.06]" />

      {/* Evaluation section */}
      <div className="px-5 py-4 flex flex-col gap-4">

        {/* Score + circular gauge */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-1">
              Puntuación
            </p>
            <div className="flex items-end gap-1.5">
              <span className={`text-5xl font-black leading-none ${scoreColor(score)}`}>{score}</span>
              <span className="text-sm text-gray-600 mb-1">/100</span>
            </div>
            <Chip
              color={scoreLabel(score).color}
              variant="flat"
              size="sm"
              className="mt-2"
            >
              {scoreLabel(score).label}
            </Chip>
          </div>

          {/* Circular SVG gauge */}
          <div className="relative w-[76px] h-[76px]">
            <svg viewBox="0 0 76 76" className="w-full h-full -rotate-90">
              <circle cx="38" cy="38" r="30"
                fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
              <motion.circle
                cx="38" cy="38" r="30"
                fill="none"
                stroke={score >= 80 ? "#34d399" : score >= 55 ? "#fbbf24" : "#f43f5e"}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 30}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - score / 100) }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-extrabold text-white">{score}%</span>
            </div>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="flex flex-col gap-2.5">
          {Object.entries(breakdown).map(([key, pts]) => {
            const max = BREAKDOWN_MAX[key] ?? 20;
            const pct = Math.round(((pts as number) / max) * 100);
            return (
              <div key={key}>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-400 font-medium">{BREAKDOWN_LABELS[key] ?? key}</span>
                  <span className="text-gray-600 font-semibold tabular-nums">
                    {pts as number}<span className="text-gray-700">/{max}</span>
                  </span>
                </div>
                <Progress
                  size="sm"
                  value={pct}
                  classNames={{
                    track: "bg-white/5",
                    indicator: pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500",
                  }}
                  aria-label={`${BREAKDOWN_LABELS[key]}: ${pts}/${max}`}
                />
              </div>
            );
          })}
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* Techniques */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
            Técnicas Detectadas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recognizedTechniques.length > 0 ? (
              recognizedTechniques.map((t) => (
                <Chip key={t} size="sm" classNames={{
                  base: "bg-emerald-500/15 border border-emerald-500/25 h-6",
                  content: "text-emerald-300 text-xs font-medium",
                }}>
                  {t}
                </Chip>
              ))
            ) : (
              <span className="text-xs text-gray-700">Ninguna detectada aún</span>
            )}
          </div>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* Suggestions */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 mb-3">
            Sugerencias de Mejora
          </p>
          <ul className="flex flex-col gap-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400 leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/20
                                flex items-center justify-center text-cyan-400 text-[10px] font-extrabold">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SandboxPage() {
  const [prompt,  setPrompt]  = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<{ response: string; evaluation: EvaluationResult } | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  // Stable ref so keyboard shortcut doesn't need to re-register
  const submitRef = useRef<() => void>(() => {});

  async function handleSubmit() {
    if (!prompt.trim() || loading || prompt.length > MAX_CHARS) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res  = await fetch("/api/evaluate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al evaluar el prompt");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  // Keep ref current on every render
  submitRef.current = handleSubmit;

  // Cmd+Enter / Ctrl+Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        submitRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const charPct      = Math.round((prompt.length / MAX_CHARS) * 100);
  const nearLimit    = prompt.length > MAX_CHARS * 0.8;
  const overLimit    = prompt.length > MAX_CHARS;
  const outputState  = loading ? "loading" : result ? "result" : error ? "error" : "idle";

  function reset() { setResult(null); setError(null); }

  return (
    <div className="relative min-h-screen px-4 py-14 sm:px-6 overflow-x-hidden">

      {/* Background glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[500px]
                        rounded-[60%] bg-emerald-600/10 blur-[130px]" />
        <div className="absolute left-[8%] top-[40%] w-[350px] h-[350px]
                        rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute right-[8%] top-[35%] w-[350px] h-[350px]
                        rounded-full bg-cyan-600/6 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="text-center mb-10"
        >
          <Chip
            startContent={
              <span className="relative flex h-2 w-2 ml-1">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            }
            variant="flat"
            classNames={{
              base: "bg-emerald-500/10 border border-emerald-500/25 mb-4",
              content: "text-emerald-400 font-semibold",
            }}
          >
            Beta Disponible
          </Chip>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-3 leading-[1.1]">
            Sandbox de{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Prompts
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Escribe un prompt, dispáralo contra Claude y obtén puntuación instantánea por rúbrica.
          </p>
        </motion.div>

        {/* ── IDE Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 22 }}
        >
          <Card className="w-full bg-[#0d0d18] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden">

            {/* Window chrome */}
            <CardHeader className="border-b border-white/[0.07] bg-white/[0.02] px-5 py-3 flex items-center gap-3 shrink-0">
              <div className="flex gap-1.5 shrink-0">
                <span className="h-3 w-3 rounded-full bg-rose-500/70" />
                <span className="h-3 w-3 rounded-full bg-amber-500/70" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/8 rounded-md px-3 h-6 max-w-[220px] w-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />
                  <span className="text-[11px] font-mono text-gray-600 truncate">sandbox.promptly.dev</span>
                </div>
              </div>
              <Chip size="sm" classNames={{
                base: "bg-violet-500/10 border border-violet-500/20 h-5 shrink-0",
                content: "text-violet-400 text-[10px] font-bold px-1",
              }}>
                Prompt Engineering
              </Chip>
            </CardHeader>

            {/* ── Split panes ── */}
            <div className="flex flex-col lg:flex-row" style={{ minHeight: 560 }}>

              {/* ── LEFT: Editor ── */}
              <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/[0.07] lg:w-1/2">

                {/* Editor tab bar */}
                <div className="flex items-center justify-between px-5 py-2 border-b border-white/[0.05] bg-white/[0.01] shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-600">editor.prompt</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                    <span className="text-[10px] text-amber-500/70 font-semibold">sin guardar</span>
                  </div>
                  {/* Character counter */}
                  <div className="flex items-center gap-2">
                    {nearLimit && (
                      <div className="w-16 hidden sm:block">
                        <Progress
                          size="sm"
                          value={charPct}
                          classNames={{
                            track: "bg-white/5",
                            indicator: overLimit ? "bg-rose-500" : "bg-amber-500",
                          }}
                          aria-label="Uso de caracteres"
                        />
                      </div>
                    )}
                    <span className={`text-[11px] font-mono font-semibold tabular-nums transition-colors ${
                      overLimit ? "text-rose-400" : nearLimit ? "text-amber-400" : "text-gray-600"
                    }`}>
                      {prompt.length}/{MAX_CHARS}
                    </span>
                  </div>
                </div>

                {/* Textarea */}
                <div className="flex-1 px-4 pt-3 pb-2">
                  <Textarea
                    placeholder={`Escribe tu prompt aquí…\n\nEjemplo:\n"Actúa como un chef estrella Michelin. Explica paso a paso cómo preparar un risotto perfecto. Incluye tiempos, temperaturas y errores comunes a evitar. Formato: numerado con subtítulos."`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
                    disabled={loading}
                    minRows={9}
                    maxRows={18}
                    classNames={{
                      base: "h-full",
                      inputWrapper: [
                        "bg-transparent border-none shadow-none p-0 h-full",
                        "hover:bg-transparent focus-within:!bg-transparent !ring-0 !shadow-none",
                      ].join(" "),
                      input: [
                        "text-gray-200 text-sm leading-relaxed font-mono resize-none",
                        "placeholder:text-gray-700 placeholder:text-xs placeholder:leading-relaxed placeholder:font-sans",
                      ].join(" "),
                    }}
                  />
                </div>

                {/* Template chips */}
                <div className="px-4 pb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-700 mb-2">
                    Insertar plantilla:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {TEMPLATES.map((t) => (
                      <Chip
                        key={t.label}
                        size="sm"
                        onClick={() => setPrompt(t.text)}
                        classNames={{
                          base: "bg-white/[0.04] border border-white/8 hover:bg-violet-500/15 hover:border-violet-500/30 cursor-pointer transition-all duration-150 h-6",
                          content: "text-gray-500 hover:text-violet-300 text-xs font-medium transition-colors",
                        }}
                        startContent={<span className="text-xs leading-none">{t.icon}</span>}
                      >
                        {t.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Status bar + submit */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.07] bg-white/[0.01] shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-700">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/8 border border-white/10 font-mono text-[10px] text-gray-600">⌘</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/8 border border-white/10 font-mono text-[10px] text-gray-600">↵</kbd>
                      <span>evaluar</span>
                    </span>
                    {(prompt || result) && (
                      <button
                        onClick={() => { setPrompt(""); reset(); }}
                        className="text-[11px] text-gray-700 hover:text-gray-400 transition-colors"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                  <Button
                    onPress={handleSubmit}
                    isDisabled={loading || !prompt.trim() || overLimit}
                    isLoading={loading}
                    size="sm"
                    className="font-bold bg-violet-500 text-white text-sm
                               shadow-[0_4px_0_#4c1d95] hover:shadow-[0_2px_0_#4c1d95]
                               hover:translate-y-[2px] active:translate-y-[4px]
                               transition-all duration-100 px-5 disabled:opacity-40"
                    endContent={!loading ? <span className="text-sm">✨</span> : undefined}
                  >
                    {loading ? "Evaluando..." : "Evaluar"}
                  </Button>
                </div>
              </div>

              {/* ── RIGHT: Output ── */}
              <div className="flex-1 overflow-y-auto lg:w-1/2">

                {/* Output tab bar */}
                <div className="flex items-center gap-2 px-5 py-2 border-b border-white/[0.05] bg-white/[0.01] shrink-0">
                  <span className="text-xs font-mono text-gray-600">output.result</span>
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    loading ? "bg-amber-400 animate-pulse" :
                    result  ? "bg-emerald-400" :
                    error   ? "bg-rose-400" :
                    "bg-gray-700"
                  }`} />
                  <span className={`text-[10px] font-semibold transition-colors ${
                    loading ? "text-amber-500/70" :
                    result  ? "text-emerald-500/70" :
                    error   ? "text-rose-500/70" :
                    "text-gray-700"
                  }`}>
                    {loading ? "procesando" : result ? "completado" : error ? "error" : "esperando"}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {/* Loading skeleton */}
                  {outputState === "loading" && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <OutputSkeleton />
                    </motion.div>
                  )}

                  {/* Error */}
                  {outputState === "error" && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-5"
                    >
                      <div className="rounded-2xl bg-rose-500/10 border border-rose-500/25 p-4 flex items-start gap-3">
                        <span className="text-rose-400 mt-0.5 shrink-0 text-lg">⚠</span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-1">Error</p>
                          <p className="text-sm text-rose-300">{error}</p>
                          <button onClick={reset} className="mt-2 text-xs text-rose-500 hover:text-rose-400 transition-colors">
                            Intentar de nuevo →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Result */}
                  {outputState === "result" && result && (
                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ResultPanel result={result} onReset={reset} />
                    </motion.div>
                  )}

                  {/* Idle */}
                  {outputState === "idle" && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <IdlePanel onInsert={(text) => setPrompt(text)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── IDE bottom status bar ── */}
            <CardBody className="border-t border-white/[0.05] bg-white/[0.01] px-5 py-2 flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-[10px] text-gray-700 font-mono overflow-hidden">
                <span className="shrink-0">Sandbox v2.0</span>
                <span className="shrink-0 hidden sm:inline">·</span>
                <span className="shrink-0 hidden sm:inline">Claude 3.5 Sonnet</span>
                <span className="shrink-0 hidden sm:inline">·</span>
                <motion.span
                  key={outputState}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`shrink-0 ${
                    loading ? "text-amber-400" : result ? "text-emerald-400" : "text-gray-700"
                  }`}
                >
                  {loading ? "⚙ Procesando..." : result ? "✓ Completado" : "● Listo"}
                </motion.span>
              </div>
              <span className="text-[10px] text-gray-700 font-mono shrink-0">UTF-8</span>
            </CardBody>
          </Card>
        </motion.div>

        {/* ── Footer CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.1 }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-3"
        >
          <Button
            as={Link}
            href="/lessons"
            className="w-full sm:w-auto font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white
                       shadow-lg shadow-violet-600/20 hover:-translate-y-px transition-transform"
            endContent={<span>→</span>}
          >
            Ir a las Lecciones
          </Button>
          <Button
            as={Link}
            href="/"
            variant="bordered"
            className="w-full sm:w-auto font-semibold text-gray-400 border-white/10 bg-white/5
                       hover:text-white hover:bg-white/10 hover:border-white/20"
            startContent={<span>←</span>}
          >
            Volver al Inicio
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
