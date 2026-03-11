"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button, Chip, Progress } from "@heroui/react";

// ── Data (sin cambios) ────────────────────────────────────────────────────────

const modules = [
  {
    id: 1,
    emoji: "🧱",
    title: "Módulo 1: Fundamentos del Prompt",
    description: "Aprende la sintaxis básica y el comportamiento de los LLMs.",
    color: "from-emerald-500 to-teal-500",
    ringColor: "ring-emerald-500/30",
    lessons: [
      { id: "1-1", title: "Hola Mundo (Zero-Shot)", desc: "La instrucción más simple posible.", status: "completed", xp: 100 },
      { id: "1-2", title: "Añadir Contexto",        desc: "Proporcionar información de fondo para guiar las respuestas.", status: "completed", xp: 150 },
      { id: "1-3", title: "Formatear la Salida",    desc: "Forzar a la IA a generar JSON, Markdown o tablas.", status: "completed", xp: 200 },
    ],
  },
  {
    id: 2,
    emoji: "⚡",
    title: "Módulo 2: Técnicas Avanzadas",
    description: "Dominando el few-shot prompting y los system personas.",
    color: "from-violet-500 to-purple-500",
    ringColor: "ring-violet-500/30",
    lessons: [
      { id: "2-1", title: "Few-Shot Prompting", desc: "Dar ejemplos para enseñar nuevos patrones.",                              status: "completed", xp: 250 },
      { id: "2-2", title: "Chain of Thought",   desc: "Forzar al modelo a razonar paso a paso en matemáticas y lógica.",        status: "current",   xp: 300 },
      { id: "2-3", title: "System Personas",    desc: "Adoptar identidades de experto.",                                        status: "locked",    xp: 350 },
    ],
  },
  {
    id: 3,
    emoji: "🛡️",
    title: "Módulo 3: Jailbreaks y Seguridad",
    description: "Comprendiendo la inyección de prompts y las barreras de seguridad.",
    color: "from-rose-500 to-pink-500",
    ringColor: "ring-rose-500/25",
    lessons: [
      { id: "3-1", title: "Exploits de Roleplay",   desc: "Cómo los actores maliciosos eluden los filtros de seguridad.",       status: "locked", xp: 500 },
      { id: "3-2", title: "Prompting Defensivo",     desc: "Redactar instrucciones de sistema seguras e inviolables.",           status: "locked", xp: 500 },
    ],
  },
];

const TOTAL   = modules.reduce((a, m) => a + m.lessons.length, 0);
const DONE    = modules.reduce((a, m) => a + m.lessons.filter(l => l.status === "completed").length, 0);

// ── Variants ──────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, type: "spring", stiffness: 260, damping: 22 },
  }),
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Mod    = typeof modules[0];
type Lesson = Mod["lessons"][0];

// ── Node Circle ───────────────────────────────────────────────────────────────
// Always 44 × 44px (w-11 h-11) so mobile spine stays aligned.

function NodeCircle({ status, modColor, ringColor }: {
  status: string; modColor: string; ringColor: string;
}) {
  if (status === "completed") {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -120 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 340, damping: 20 }}
        className={`w-11 h-11 rounded-full bg-gradient-to-br ${modColor} flex items-center justify-center
                    shadow-lg ring-2 ring-offset-2 ring-offset-[#0a0a0f] ${ringColor} shrink-0`}
      >
        <span className="text-white font-extrabold text-base leading-none">✓</span>
      </motion.div>
    );
  }

  if (status === "current") {
    return (
      <div className="relative w-11 h-11 shrink-0">
        {/* Outer pulse */}
        <motion.div
          animate={{ scale: [1, 2.2, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-violet-500/35 pointer-events-none"
        />
        {/* Inner pulse */}
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          className="absolute inset-0 rounded-full bg-fuchsia-400/25 pointer-events-none"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600
                        flex items-center justify-center shadow-xl shadow-violet-500/50
                        ring-2 ring-offset-2 ring-offset-[#0a0a0f] ring-violet-400/60">
          <span className="text-base leading-none">⚡</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11 h-11 rounded-full bg-white/[0.04] border-2 border-white/8
                    flex items-center justify-center shrink-0 opacity-35">
      <span className="text-sm leading-none">🔒</span>
    </div>
  );
}

// ── Lesson Card ───────────────────────────────────────────────────────────────

function LessonCard({ lesson }: { lesson: Lesson }) {
  const locked    = lesson.status === "locked";
  const current   = lesson.status === "current";
  const completed = lesson.status === "completed";

  const inner = (
    <div className={[
      "rounded-2xl border p-4 transition-all duration-200",
      locked
        ? "bg-white/[0.02] border-white/[0.05] opacity-35 cursor-not-allowed select-none"
        : current
        ? "bg-gradient-to-br from-violet-500/15 to-fuchsia-500/8 border-violet-500/40 shadow-xl shadow-violet-500/10 hover:border-violet-400/60"
        : "bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-white/20",
    ].join(" ")}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span className={`text-[11px] font-mono font-semibold ${locked ? "text-gray-600" : "text-gray-500"}`}>
          {lesson.id}
        </span>
        <Chip size="sm" classNames={{
          base: `h-5 shrink-0 ${locked ? "bg-white/[0.03]" : "bg-amber-500/10 border border-amber-500/20"}`,
          content: `text-[11px] font-bold ${locked ? "text-gray-700" : "text-amber-400"}`,
        }}>
          +{lesson.xp} XP
        </Chip>
      </div>

      {/* Content */}
      <h3 className={`font-bold text-base leading-snug mb-1 ${locked ? "text-gray-600" : "text-white"}`}>
        {lesson.title}
      </h3>
      <p className={`text-sm leading-relaxed ${locked ? "text-gray-700" : "text-gray-400"}`}>
        {lesson.desc}
      </p>

      {/* Footer */}
      {completed && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[9px] text-emerald-400 font-extrabold shrink-0">✓</span>
          <span className="text-xs text-emerald-500/80 font-semibold">Completada · Toca para repasar</span>
        </div>
      )}
      {current && (
        <Button
          size="sm"
          className="mt-3 w-full font-bold text-sm bg-violet-500 text-white
                     shadow-[0_4px_0_#4c1d95] hover:shadow-[0_2px_0_#4c1d95]
                     hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-100"
        >
          Empezar lección →
        </Button>
      )}
    </div>
  );

  return locked ? inner : <Link href="/lesson">{inner}</Link>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LessonsPage() {
  // Running global index for desktop zigzag side calculation
  let gIdx = 0;

  return (
    <div className="relative min-h-screen px-4 py-14 sm:px-6 overflow-x-hidden">

      {/* Fixed background glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[500px]
                        rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute right-[-10%] bottom-0 w-[400px] h-[400px]
                        rounded-full bg-emerald-600/8 blur-[110px]" />
        <div className="absolute left-[-10%] bottom-[20%] w-[300px] h-[300px]
                        rounded-full bg-fuchsia-600/8 blur-[100px]" />
      </div>

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="max-w-xl mx-auto mb-14 text-center"
      >
        <Chip variant="flat" classNames={{
          base: "bg-violet-500/10 border border-violet-500/20 mb-4",
          content: "text-violet-300 font-semibold",
        }}>
          📚 Currículo Completo
        </Chip>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">
          Tu Ruta de Aprendizaje
        </h1>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
          Domina el arte del prompt engineering a través de lecciones interactivas puntuadas por Claude.
        </p>

        {/* Overall progress card */}
        <div className="mt-7 bg-white/[0.04] border border-white/8 rounded-2xl p-5 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-400">Progreso total</span>
            <span className="text-sm font-extrabold text-white">{DONE} / {TOTAL} lecciones</span>
          </div>
          <Progress
            value={Math.round((DONE / TOTAL) * 100)}
            classNames={{
              track: "bg-white/5 h-2",
              indicator: "bg-gradient-to-r from-emerald-400 via-violet-500 to-fuchsia-500",
            }}
            aria-label={`${DONE} de ${TOTAL} lecciones completadas`}
          />
          <div className="flex flex-wrap gap-2 mt-4">
            <Chip size="sm" classNames={{ base: "bg-emerald-500/10 border border-emerald-500/20", content: "text-emerald-400 text-xs font-bold" }}>
              ✓ {DONE} completadas
            </Chip>
            <Chip size="sm" classNames={{ base: "bg-violet-500/10 border border-violet-500/20", content: "text-violet-300 text-xs font-bold" }}>
              ⚡ 1 activa
            </Chip>
            <Chip size="sm" classNames={{ base: "bg-white/[0.04] border border-white/10", content: "text-gray-500 text-xs font-bold" }}>
              🔒 {TOTAL - DONE - 1} bloqueadas
            </Chip>
          </div>
        </div>
      </motion.header>

      {/* ── Path Map ── */}
      {/*
        Layout strategy:
        - Mobile  : left spine at left-[22px] (center of 44px node)
                    Each row = flex [node · card]
        - Desktop : center spine at left-1/2
                    Each row = grid [1fr · 44px · 1fr] — cards zigzag left/right
      */}
      <div className="relative mx-auto max-w-2xl">

        {/* Spine line */}
        <div
          aria-hidden
          className="absolute left-[22px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 rounded-full"
          style={{
            background: "linear-gradient(to bottom, #34d399 0%, #34d399 40%, #8b5cf6 55%, rgba(139,92,246,0.25) 70%, rgba(255,255,255,0.05) 100%)",
          }}
        />

        {modules.map((mod, modIdx) => {
          const allLocked    = mod.lessons.every(l => l.status === "locked");
          const completedCnt = mod.lessons.filter(l => l.status === "completed").length;
          const pct          = Math.round((completedCnt / mod.lessons.length) * 100);

          return (
            <div key={mod.id}>

              {/* ── Module milestone ── */}
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }} custom={0}
                className={`relative ${modIdx === 0 ? "pt-2 pb-5" : "pt-8 pb-5"} ${allLocked ? "opacity-40" : ""}`}
              >
                {/* MOBILE */}
                <div className="flex items-center gap-4 md:hidden">
                  <div className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${mod.color}
                                  flex items-center justify-center text-xl shadow-xl
                                  ring-2 ring-offset-2 ring-offset-[#0a0a0f] ${mod.ringColor}`}>
                    {mod.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-extrabold text-white text-base leading-tight">{mod.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{mod.description}</p>
                    {!allLocked && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <Progress size="sm" value={pct} className="flex-1 max-w-[90px]"
                          classNames={{ track: "bg-white/5", indicator: `bg-gradient-to-r ${mod.color}` }}
                          aria-label={`${pct}%`}
                        />
                        <span className="text-xs text-gray-500 font-semibold shrink-0">{completedCnt}/{mod.lessons.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* DESKTOP — emoji node in center column, info to right */}
                <div className="hidden md:grid md:grid-cols-[1fr_44px_1fr] md:gap-6 md:items-center">
                  <div /> {/* empty left */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mod.color}
                                  flex items-center justify-center text-xl shadow-xl
                                  ring-2 ring-offset-2 ring-offset-[#0a0a0f] ${mod.ringColor}`}>
                    {mod.emoji}
                  </div>
                  <div>
                    <p className="font-display font-extrabold text-white text-base leading-tight">{mod.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{mod.description}</p>
                    {!allLocked && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <Progress size="sm" value={pct} className="w-24"
                          classNames={{ track: "bg-white/5", indicator: `bg-gradient-to-r ${mod.color}` }}
                          aria-label={`${pct}%`}
                        />
                        <span className="text-xs text-gray-500 font-semibold">{completedCnt}/{mod.lessons.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* ── Lesson nodes ── */}
              {mod.lessons.map((lesson, li) => {
                const currentGIdx = gIdx++;
                const isLeft      = currentGIdx % 2 === 0; // desktop: card goes left col
                const isCurrent   = lesson.status === "current";
                const rowPy       = isCurrent ? "py-5" : "py-3";

                return (
                  <motion.div
                    key={lesson.id}
                    variants={fadeUp} initial="hidden" whileInView="show"
                    viewport={{ once: true }} custom={li + 1}
                    className={rowPy}
                  >
                    {/* MOBILE — flex: node left, card right */}
                    <div className="flex items-start gap-4 md:hidden">
                      <div className="shrink-0 mt-1 relative z-10">
                        <NodeCircle status={lesson.status} modColor={mod.color} ringColor={mod.ringColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <LessonCard lesson={lesson} />
                      </div>
                    </div>

                    {/* DESKTOP — 3-col grid: cards alternate left/right */}
                    <div className="hidden md:grid md:grid-cols-[1fr_44px_1fr] md:gap-6 md:items-center">
                      {/* Left column: card if isLeft, else horizontal connector hint */}
                      <div className="flex justify-end items-center gap-3">
                        {isLeft ? (
                          <>
                            <div className="flex-1 max-w-[280px]">
                              <LessonCard lesson={lesson} />
                            </div>
                            {/* Connector dot */}
                            <div className={`shrink-0 w-6 h-px ${lesson.status === "locked" ? "bg-white/8" : lesson.status === "current" ? "bg-violet-500/40" : "bg-emerald-500/30"}`} />
                          </>
                        ) : null}
                      </div>

                      {/* Center: node */}
                      <div className="flex items-center justify-center z-10 relative">
                        <NodeCircle status={lesson.status} modColor={mod.color} ringColor={mod.ringColor} />
                      </div>

                      {/* Right column: card if !isLeft */}
                      <div className="flex justify-start items-center gap-3">
                        {!isLeft ? (
                          <>
                            {/* Connector dot */}
                            <div className={`shrink-0 w-6 h-px ${lesson.status === "locked" ? "bg-white/8" : lesson.status === "current" ? "bg-violet-500/40" : "bg-emerald-500/30"}`} />
                            <div className="flex-1 max-w-[280px]">
                              <LessonCard lesson={lesson} />
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          );
        })}

        {/* End-of-path marker */}
        <div className="relative pt-6 pb-2 flex flex-col items-start md:items-center">
          <div className="relative z-10 ml-0 md:ml-0 pl-0 flex items-center gap-3 md:flex-col md:gap-2">
            <div className="w-11 h-11 rounded-full bg-white/[0.04] border-2 border-dashed border-white/10
                            flex items-center justify-center text-lg opacity-40 shrink-0 md:mx-auto">
              🎯
            </div>
            <p className="text-xs text-gray-600 font-semibold md:text-center">Más lecciones próximamente</p>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.1 }}
        className="mt-16 max-w-sm mx-auto"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-violet-500/15 blur-2xl scale-95 translate-y-3 -z-10" />
          <div className="bg-gradient-to-br from-violet-900/50 via-purple-900/40 to-fuchsia-900/30
                          border border-violet-500/25 rounded-2xl p-7 text-center flex flex-col items-center gap-4">
            <p className="text-4xl">🎯</p>
            <div>
              <h3 className="font-display text-xl font-extrabold text-white">¿Listo para el siguiente desafío?</h3>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">Continúa donde lo dejaste y sigue ganando XP.</p>
            </div>
            <Button
              as={Link}
              href="/lesson"
              size="lg"
              fullWidth
              className="font-bold bg-violet-500 text-white
                         shadow-[0_6px_0_#4c1d95] hover:shadow-[0_3px_0_#4c1d95]
                         hover:translate-y-[3px] active:translate-y-[5px] transition-all duration-100"
            >
              Continuar Aprendiendo →
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
