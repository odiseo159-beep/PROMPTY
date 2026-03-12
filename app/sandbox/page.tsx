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
  return s >= 80 ? "text-[#2D6A6A]" : s >= 55 ? "text-amber-600" : "text-[#E2654A]";
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
          className="w-2 h-2 rounded-full bg-[#E2654A] shrink-0"
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

      <Divider className="bg-[#E8E5E0]" />

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

      {/* Processing hint */}
      <div className="flex items-center gap-2 pt-1">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="text-xs text-[#9C9890] font-mono"
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
      {/* Placeholder */}
      <div className="text-center py-4 border-b border-[#E8E5E0]">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl mb-2 inline-block"
        >
          🧪
        </motion.div>
        <p className="text-sm font-semibold text-[#6B6960] mt-1">El output aparecerá aquí</p>
        <p className="text-xs text-[#9C9890]">Escribe un prompt a la izquierda y pulsa Evaluar</p>
      </div>

      {/* Tabs: Templates + Tips */}
      <Tabs
        variant="underlined"
        size="sm"
        classNames={{
          tabList: "border-b border-[#E8E5E0] w-full gap-0 p-0",
          tab: "h-9 px-3 text-xs data-[hover=true]:text-[#1A1A18]",
          cursor: "bg-[#E2654A] h-0.5",
          tabContent: "text-[#6B6960] group-data-[selected=true]:text-[#1A1A18] font-semibold",
          panel: "pt-3",
        }}
      >
        <Tab key="templates" title="⚡ Plantillas">
          <div className="flex flex-col gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => onInsert(t.text)}
                className="w-full text-left rounded-xl border border-[#E8E5E0] bg-[#FAFAF8]
                           hover:bg-[#FDF0ED] hover:border-[#E2654A]/20
                           active:scale-[0.98] transition-all duration-150 p-3 group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{t.icon}</span>
                  <span className="text-xs font-bold text-[#6B6960] group-hover:text-[#1A1A18] transition-colors">
                    {t.label}
                  </span>
                  <span className="ml-auto text-[10px] text-[#9C9890] group-hover:text-[#6B6960]">Insertar →</span>
                </div>
                <p className="text-xs text-[#9C9890] leading-relaxed line-clamp-2 pl-5">{t.text}</p>
              </button>
            ))}
          </div>
        </Tab>

        <Tab key="tips" title="💡 Tips">
          <div className="flex flex-col gap-2">
            {TIPS.map((tip) => (
              <div
                key={tip.title}
                className="rounded-xl border border-[#E8E5E0] bg-[#FAFAF8] p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{tip.icon}</span>
                  <span className="text-xs font-bold text-[#6B6960]">{tip.title}</span>
                </div>
                <p className="text-xs text-[#9C9890] leading-relaxed pl-5">{tip.desc}</p>
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
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#E8E5E0] bg-[#FAFAF8] shrink-0">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E2654A] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#E2654A]">
            Respuesta de Claude
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="flat"
            onPress={handleCopy}
            className="h-7 px-2.5 min-w-0 bg-white border border-[#E8E5E0] text-[#6B6960] hover:text-[#1A1A18] text-xs font-semibold"
            startContent={<span className="text-xs">{copied ? "✓" : "📋"}</span>}
          >
            {copied ? "Copiado" : "Copiar"}
          </Button>
          <Button
            size="sm"
            variant="flat"
            onPress={onReset}
            className="h-7 px-2.5 min-w-0 bg-white border border-[#E8E5E0] text-[#6B6960] hover:text-[#1A1A18] text-xs font-semibold"
          >
            Nueva prueba
          </Button>
        </div>
      </div>

      {/* Response text with typing cursor */}
      <div className="px-5 py-4">
        <p className="text-base text-[#1A1A18] leading-relaxed whitespace-pre-wrap font-mono">
          {displayed}
          {!isDone && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-[2px] h-[14px] bg-[#E2654A] ml-0.5 align-middle rounded-full"
            />
          )}
        </p>
      </div>

      <div className="mx-5 h-px bg-[#E8E5E0]" />

      {/* Evaluation section */}
      <div className="px-5 py-4 flex flex-col gap-4">

        {/* Score + circular gauge */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#2D6A6A] mb-1">
              Puntuación
            </p>
            <div className="flex items-end gap-1.5">
              <span className={`text-5xl font-black leading-none ${scoreColor(score)}`}>{score}</span>
              <span className="text-sm text-[#9C9890] mb-1">/100</span>
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
            <svg viewBox="0 0 76 76" className="w-full h-full -rotate-90" aria-hidden="true">
              <circle cx="38" cy="38" r="30"
                fill="none" stroke="#E8E5E0" strokeWidth="7" />
              <motion.circle
                cx="38" cy="38" r="30"
                fill="none"
                stroke={score >= 80 ? "#2D6A6A" : score >= 55 ? "#D97706" : "#E2654A"}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 30}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - score / 100) }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-extrabold text-[#1A1A18]">{score}%</span>
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
                  <span className="text-[#6B6960] font-medium">{BREAKDOWN_LABELS[key] ?? key}</span>
                  <span className="text-[#9C9890] font-semibold tabular-nums">
                    {pts as number}<span className="text-[#E8E5E0]">/{max}</span>
                  </span>
                </div>
                <Progress
                  size="sm"
                  value={pct}
                  classNames={{
                    track: "bg-[#E8E5E0]",
                    indicator: pct >= 75 ? "bg-[#2D6A6A]" : pct >= 50 ? "bg-amber-500" : "bg-[#E2654A]",
                  }}
                  aria-label={`${BREAKDOWN_LABELS[key]}: ${pts}/${max}`}
                />
              </div>
            );
          })}
        </div>

        <div className="h-px bg-[#E8E5E0]" />

        {/* Techniques */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#2D6A6A] mb-2">
            Técnicas Detectadas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recognizedTechniques.length > 0 ? (
              recognizedTechniques.map((t) => (
                <Chip key={t} size="sm" classNames={{
                  base: "bg-[#EFF6F6] border border-[#2D6A6A]/25 h-6",
                  content: "text-[#2D6A6A] text-xs font-medium",
                }}>
                  {t}
                </Chip>
              ))
            ) : (
              <span className="text-xs text-[#9C9890]">Ninguna detectada aún</span>
            )}
          </div>
        </div>

        <div className="h-px bg-[#E8E5E0]" />

        {/* Suggestions */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#E2654A] mb-3">
            Sugerencias de Mejora
          </p>
          <ul className="flex flex-col gap-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#6B6960] leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#FDF0ED] border border-[#E2654A]/20
                                flex items-center justify-center text-[#E2654A] text-[10px] font-extrabold">
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

  submitRef.current = handleSubmit;

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

  const charPct     = Math.round((prompt.length / MAX_CHARS) * 100);
  const nearLimit   = prompt.length > MAX_CHARS * 0.8;
  const overLimit   = prompt.length > MAX_CHARS;
  const outputState = loading ? "loading" : result ? "result" : error ? "error" : "idle";

  function reset() { setResult(null); setError(null); }

  return (
    <div className="relative min-h-screen px-4 py-14 sm:px-6 overflow-x-hidden bg-[#FAFAF8]">

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
                <span className="absolute inset-0 animate-ping rounded-full bg-[#E2654A] opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-[#E2654A]" />
              </span>
            }
            variant="flat"
            classNames={{
              base: "bg-[#FDF0ED] border border-[#E2654A]/20 mb-4",
              content: "text-[#E2654A] font-semibold",
            }}
          >
            Beta Disponible
          </Chip>
          <h1 className="font-display text-4xl sm:text-5xl text-[#1A1A18] mt-3 mb-3 leading-[1.1]">
            Sandbox de{" "}
            <span className="text-[#E2654A]">Prompts</span>
          </h1>
          <p className="text-[#6B6960] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Escribe un prompt, dispáralo contra Claude y obtén puntuación instantánea por rúbrica.
          </p>
        </motion.div>

        {/* ── IDE Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 22 }}
        >
          <Card className="w-full bg-white border border-[#E8E5E0] shadow-lg shadow-black/5 overflow-hidden">

            {/* Window chrome */}
            <CardHeader className="border-b border-[#E8E5E0] bg-[#FAFAF8] px-5 py-3 flex items-center gap-3 shrink-0">
              <div className="flex gap-1.5 shrink-0">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 bg-white border border-[#E8E5E0] rounded-md px-3 h-6 max-w-[220px] w-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E2654A]/60 shrink-0" />
                  <span className="text-[11px] font-mono text-[#9C9890] truncate">sandbox.promptly.dev</span>
                </div>
              </div>
              <Chip size="sm" classNames={{
                base: "bg-[#FDF0ED] border border-[#E2654A]/20 h-5 shrink-0",
                content: "text-[#E2654A] text-[10px] font-bold px-1",
              }}>
                Prompt Engineering
              </Chip>
            </CardHeader>

            {/* ── Split panes ── */}
            <div className="flex flex-col lg:flex-row" style={{ minHeight: 560 }}>

              {/* ── LEFT: Editor ── */}
              <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-[#E8E5E0] lg:w-1/2">

                {/* Editor tab bar */}
                <div className="flex items-center justify-between px-5 py-2 border-b border-[#E8E5E0] bg-[#FAFAF8] shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#9C9890]">editor.prompt</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[10px] text-amber-600 font-semibold">sin guardar</span>
                  </div>
                  {/* Character counter */}
                  <div className="flex items-center gap-2">
                    {nearLimit && (
                      <div className="w-16 hidden sm:block">
                        <Progress
                          size="sm"
                          value={charPct}
                          classNames={{
                            track: "bg-[#E8E5E0]",
                            indicator: overLimit ? "bg-[#E2654A]" : "bg-amber-500",
                          }}
                          aria-label="Uso de caracteres"
                        />
                      </div>
                    )}
                    <span className={`text-[11px] font-mono font-semibold tabular-nums transition-colors ${
                      overLimit ? "text-[#E2654A]" : nearLimit ? "text-amber-600" : "text-[#9C9890]"
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
                        "text-[#1A1A18] text-sm leading-relaxed font-mono resize-none",
                        "placeholder:text-[#9C9890] placeholder:text-xs placeholder:leading-relaxed placeholder:font-sans",
                      ].join(" "),
                    }}
                  />
                </div>

                {/* Template chips */}
                <div className="px-4 pb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9C9890] mb-2">
                    Insertar plantilla:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {TEMPLATES.map((t) => (
                      <Chip
                        key={t.label}
                        size="sm"
                        role="button"
                        tabIndex={0}
                        onClick={() => setPrompt(t.text)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPrompt(t.text); } }}
                        classNames={{
                          base: "bg-[#FAFAF8] border border-[#E8E5E0] hover:bg-[#FDF0ED] hover:border-[#E2654A]/20 cursor-pointer transition-all duration-150 h-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2654A]",
                          content: "text-[#6B6960] hover:text-[#E2654A] text-xs font-medium transition-colors",
                        }}
                        startContent={<span className="text-xs leading-none">{t.icon}</span>}
                      >
                        {t.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Status bar + submit */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E5E0] bg-[#FAFAF8] shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#9C9890]">
                      <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E8E5E0] font-mono text-[10px] text-[#6B6960]">⌘</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E8E5E0] font-mono text-[10px] text-[#6B6960]">↵</kbd>
                      <span>evaluar</span>
                    </span>
                    {(prompt || result) && (
                      <button
                        onClick={() => { setPrompt(""); reset(); }}
                        className="text-[11px] text-[#9C9890] hover:text-[#6B6960] transition-colors min-h-[44px] flex items-center px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2654A] rounded-md"
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
                    className="font-bold bg-[#E2654A] text-white text-sm
                               hover:bg-[#C9553D] active:scale-[0.98]
                               transition-all duration-150 px-5 disabled:opacity-40 border-0"
                    endContent={!loading ? <span className="text-sm">✨</span> : undefined}
                  >
                    {loading ? "Evaluando..." : "Evaluar"}
                  </Button>
                </div>
              </div>

              {/* ── RIGHT: Output ── */}
              <div className="flex-1 overflow-y-auto lg:w-1/2">

                {/* Output tab bar */}
                <div className="flex items-center gap-2 px-5 py-2 border-b border-[#E8E5E0] bg-[#FAFAF8] shrink-0">
                  <span className="text-xs font-mono text-[#9C9890]">output.result</span>
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    loading ? "bg-amber-400 animate-pulse" :
                    result  ? "bg-[#2D6A6A]" :
                    error   ? "bg-[#E2654A]" :
                    "bg-[#E8E5E0]"
                  }`} />
                  <span className={`text-[10px] font-semibold transition-colors ${
                    loading ? "text-amber-600" :
                    result  ? "text-[#2D6A6A]" :
                    error   ? "text-[#E2654A]" :
                    "text-[#9C9890]"
                  }`}>
                    {loading ? "procesando" : result ? "completado" : error ? "error" : "esperando"}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {outputState === "loading" && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <OutputSkeleton />
                    </motion.div>
                  )}

                  {outputState === "error" && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-5"
                    >
                      <div className="rounded-2xl bg-[#FDF0ED] border border-[#E2654A]/25 p-4 flex items-start gap-3">
                        <span className="text-[#E2654A] mt-0.5 shrink-0 text-lg">⚠</span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-[#E2654A] mb-1">Error</p>
                          <p className="text-sm text-[#6B6960]">{error}</p>
                          <button onClick={reset} className="mt-2 text-xs text-[#E2654A] hover:text-[#C9553D] transition-colors">
                            Intentar de nuevo →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {outputState === "result" && result && (
                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ResultPanel result={result} onReset={reset} />
                    </motion.div>
                  )}

                  {outputState === "idle" && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <IdlePanel onInsert={(text) => setPrompt(text)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── IDE bottom status bar ── */}
            <CardBody className="border-t border-[#E8E5E0] bg-[#FAFAF8] px-5 py-2 flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-[10px] text-[#9C9890] font-mono overflow-hidden">
                <span className="shrink-0">Sandbox v2.0</span>
                <span className="shrink-0 hidden sm:inline">·</span>
                <span className="shrink-0 hidden sm:inline">Claude 3.5 Sonnet</span>
                <span className="shrink-0 hidden sm:inline">·</span>
                <motion.span
                  key={outputState}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`shrink-0 ${
                    loading ? "text-amber-600" : result ? "text-[#2D6A6A]" : "text-[#9C9890]"
                  }`}
                >
                  {loading ? "⚙ Procesando..." : result ? "✓ Completado" : "● Listo"}
                </motion.span>
              </div>
              <span className="text-[10px] text-[#9C9890] font-mono shrink-0">UTF-8</span>
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
            className="w-full sm:w-auto font-bold bg-[#E2654A] text-white hover:bg-[#C9553D] transition-colors border-0"
            endContent={<span>→</span>}
          >
            Ir a las Lecciones
          </Button>
          <Button
            as={Link}
            href="/"
            variant="bordered"
            className="w-full sm:w-auto font-semibold text-[#6B6960] border-[#E8E5E0] bg-white hover:bg-[#FAFAF8] hover:text-[#1A1A18]"
            startContent={<span>←</span>}
          >
            Volver al Inicio
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
