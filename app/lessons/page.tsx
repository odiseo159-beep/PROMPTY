"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button, Chip, Progress } from "@heroui/react";

// ── Data ─────────────────────────────────────────────────────────────────────

const modules = [
  {
    id: 1,
    emoji: "🌱",
    title: "Módulo 1: Tus Primeros Prompts",
    description: "Aprende qué es un prompt y cómo escribir uno que funcione de verdad.",
    modBg: "bg-[#2D6A6A]",
    ringColor: "ring-[#2D6A6A]/30",
    lessons: [
      { id: "1-1", title: "¿Qué es un Prompt?",  desc: "Descubre qué es un prompt y por qué son tan importantes.", status: "completed", xp: 100 },
      { id: "1-2", title: "Sé Específico",        desc: "Instrucciones claras = respuestas mucho mejores.",          status: "completed", xp: 150 },
      { id: "1-3", title: "Añade Contexto",       desc: "Da más información para que la IA te ayude mejor.",         status: "completed", xp: 200 },
    ],
  },
  {
    id: 2,
    emoji: "⚡",
    title: "Módulo 2: Mejora tus Prompts",
    description: "Técnicas sencillas para que tus prompts sean mucho más efectivos.",
    modBg: "bg-[#E2654A]",
    ringColor: "ring-[#E2654A]/30",
    lessons: [
      { id: "2-1", title: "Dale un Rol a la IA",       desc: "Convierte a la IA en el experto que necesitas.",          status: "current", xp: 250 },
      { id: "2-2", title: "Pide el Formato Correcto",  desc: "Obtén listas, pasos, tablas o lo que necesites.",         status: "locked",  xp: 300 },
      { id: "2-3", title: "Un Paso a la Vez",          desc: "Divide tareas complejas en instrucciones simples.",        status: "locked",  xp: 350 },
    ],
  },
  {
    id: 3,
    emoji: "🚀",
    title: "Módulo 3: Nivel Avanzado",
    description: "Técnicas más poderosas para obtener resultados extraordinarios.",
    modBg: "bg-[#9C9890]",
    ringColor: "ring-[#9C9890]/20",
    lessons: [
      { id: "3-1", title: "Aprende con Ejemplos", desc: "Muéstrale a la IA exactamente qué resultado quieres.", status: "locked", xp: 500 },
      { id: "3-2", title: "Prompts para el Trabajo", desc: "Aplica todo lo aprendido en situaciones reales del día a día.", status: "locked", xp: 500 },
    ],
  },
];

const TOTAL = modules.reduce((a, m) => a + m.lessons.length, 0);
const DONE  = modules.reduce((a, m) => a + m.lessons.filter(l => l.status === "completed").length, 0);

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

function NodeCircle({ status, modBg, ringColor }: {
  status: string; modBg: string; ringColor: string;
}) {
  if (status === "completed") {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -120 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 340, damping: 20 }}
        className={`w-11 h-11 rounded-full ${modBg} flex items-center justify-center
                    shadow-sm ring-2 ring-offset-2 ring-offset-[#FAFAF8] ${ringColor} shrink-0`}
      >
        <span className="text-white font-extrabold text-base leading-none">✓</span>
      </motion.div>
    );
  }

  if (status === "current") {
    return (
      <div className="relative w-11 h-11 shrink-0">
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[#E2654A]/20 pointer-events-none"
        />
        <div className="absolute inset-0 rounded-full bg-[#E2654A]
                        flex items-center justify-center shadow-md
                        ring-2 ring-offset-2 ring-offset-[#FAFAF8] ring-[#E2654A]/40">
          <span className="text-base leading-none">⚡</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11 h-11 rounded-full bg-white border-2 border-[#E8E5E0]
                    flex items-center justify-center shrink-0 opacity-50">
      <span className="text-sm leading-none text-[#9C9890]">🔒</span>
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
        ? "bg-[#FAFAF8] border-[#E8E5E0] opacity-50 cursor-not-allowed select-none"
        : current
        ? "bg-[#FDF0ED] border-[#E2654A] shadow-sm hover:shadow-md"
        : "bg-white border-[#E8E5E0] shadow-sm hover:shadow-md hover:border-[#E2654A]/20",
    ].join(" ")}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span className="text-[11px] font-mono font-semibold text-[#9C9890]">
          {lesson.id}
        </span>
        <Chip size="sm" classNames={{
          base: `h-5 shrink-0 ${locked ? "bg-[#FAFAF8] border border-[#E8E5E0]" : "bg-[#FDF0ED] border border-[#E2654A]/20"}`,
          content: `text-[11px] font-bold ${locked ? "text-[#9C9890]" : "text-[#E2654A]"}`,
        }}>
          +{lesson.xp} XP
        </Chip>
      </div>

      {/* Content */}
      <h3 className={`font-bold text-base leading-snug mb-1 ${locked ? "text-[#9C9890]" : "text-[#1A1A18]"}`}>
        {lesson.title}
      </h3>
      <p className={`text-base leading-relaxed ${locked ? "text-[#9C9890]" : "text-[#6B6960]"}`}>
        {lesson.desc}
      </p>

      {/* Footer */}
      {completed && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-[#EFF6F6] flex items-center justify-center text-[9px] text-[#2D6A6A] font-extrabold shrink-0">✓</span>
          <span className="text-xs text-[#2D6A6A] font-semibold">Completada · Toca para repasar</span>
        </div>
      )}
      {current && (
        <div className="mt-3 w-full h-9 rounded-xl bg-[#E2654A] flex items-center justify-center text-white text-sm font-bold">
          Empezar lección →
        </div>
      )}
    </div>
  );

  return locked ? inner : <Link href={`/lesson?id=${lesson.id}`}>{inner}</Link>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LessonsPage() {
  let gIdx = 0;

  return (
    <div className="relative min-h-screen px-4 py-14 sm:px-6 overflow-x-hidden bg-[#FAFAF8]">
      <div className="mx-auto max-w-2xl">

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="max-w-xl mx-auto mb-14 text-center"
        >
          <Chip variant="flat" classNames={{
            base: "bg-[#FDF0ED] border border-[#E2654A]/20 mb-4",
            content: "text-[#E2654A] font-semibold",
          }}>
            Currículo Completo
          </Chip>
          <h1 className="font-display text-4xl sm:text-5xl text-[#1A1A18] mt-3 mb-4 tracking-tight">
            Tu Ruta de Aprendizaje
          </h1>
          <p className="text-[#6B6960] text-base sm:text-lg leading-relaxed">
            Domina el arte del prompt engineering a través de lecciones interactivas puntuadas por Claude.
          </p>

          {/* Overall progress card */}
          <div className="mt-7 bg-white border border-[#E8E5E0] rounded-2xl p-5 text-left shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#6B6960]">Progreso total</span>
              <span className="text-sm font-extrabold text-[#1A1A18]">{DONE} / {TOTAL} lecciones</span>
            </div>
            <Progress
              value={Math.round((DONE / TOTAL) * 100)}
              classNames={{
                track: "bg-[#E8E5E0] h-2",
                indicator: "bg-[#E2654A]",
              }}
              aria-label={`${DONE} de ${TOTAL} lecciones completadas`}
            />
            <div className="flex flex-wrap gap-2 mt-4">
              <Chip size="sm" classNames={{ base: "bg-[#EFF6F6] border border-[#2D6A6A]/20", content: "text-[#2D6A6A] text-xs font-bold" }}>
                ✓ {DONE} completadas
              </Chip>
              <Chip size="sm" classNames={{ base: "bg-[#FDF0ED] border border-[#E2654A]/20", content: "text-[#E2654A] text-xs font-bold" }}>
                ⚡ 1 activa
              </Chip>
              <Chip size="sm" classNames={{ base: "bg-[#FAFAF8] border border-[#E8E5E0]", content: "text-[#9C9890] text-xs font-bold" }}>
                🔒 {TOTAL - DONE - 1} bloqueadas
              </Chip>
            </div>
          </div>
        </motion.header>

        {/* ── Path Map ── */}
        <div className="relative mx-auto max-w-2xl">

          {/* Spine line */}
          <div
            aria-hidden
            className="absolute left-[22px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 rounded-full"
            style={{
              background: "linear-gradient(to bottom, #2D6A6A 0%, #2D6A6A 40%, #E2654A 55%, rgba(226,101,74,0.25) 70%, #E8E5E0 100%)",
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
                    <div className={`shrink-0 w-11 h-11 rounded-xl ${mod.modBg}
                                    flex items-center justify-center text-xl shadow-sm
                                    ring-2 ring-offset-2 ring-offset-[#FAFAF8] ${mod.ringColor}`}>
                      {mod.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display font-extrabold text-[#1A1A18] text-base leading-tight">{mod.title}</h2>
                      <p className="text-xs text-[#6B6960] mt-0.5 line-clamp-1">{mod.description}</p>
                      {!allLocked && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <Progress size="sm" value={pct} className="flex-1 max-w-[90px]"
                            classNames={{ track: "bg-[#E8E5E0]", indicator: "bg-[#E2654A]" }}
                            aria-label={`${pct}%`}
                          />
                          <span className="text-xs text-[#9C9890] font-semibold shrink-0">{completedCnt}/{mod.lessons.length}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DESKTOP */}
                  <div className="hidden md:grid md:grid-cols-[1fr_44px_1fr] md:gap-6 md:items-center">
                    <div />
                    <div className={`w-11 h-11 rounded-xl ${mod.modBg}
                                    flex items-center justify-center text-xl shadow-sm
                                    ring-2 ring-offset-2 ring-offset-[#FAFAF8] ${mod.ringColor}`}>
                      {mod.emoji}
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-[#1A1A18] text-base leading-tight">{mod.title}</h2>
                      <p className="text-xs text-[#6B6960] mt-0.5">{mod.description}</p>
                      {!allLocked && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <Progress size="sm" value={pct} className="w-24"
                            classNames={{ track: "bg-[#E8E5E0]", indicator: "bg-[#E2654A]" }}
                            aria-label={`${pct}%`}
                          />
                          <span className="text-xs text-[#9C9890] font-semibold">{completedCnt}/{mod.lessons.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* ── Lesson nodes ── */}
                {mod.lessons.map((lesson, li) => {
                  const currentGIdx = gIdx++;
                  const isLeft    = currentGIdx % 2 === 0;
                  const isCurrent = lesson.status === "current";
                  const rowPy     = isCurrent ? "py-5" : "py-3";

                  return (
                    <motion.div
                      key={lesson.id}
                      variants={fadeUp} initial="hidden" whileInView="show"
                      viewport={{ once: true }} custom={li + 1}
                      className={rowPy}
                    >
                      {/* MOBILE */}
                      <div className="flex items-start gap-4 md:hidden">
                        <div className="shrink-0 mt-1 relative z-10">
                          <NodeCircle status={lesson.status} modBg={mod.modBg} ringColor={mod.ringColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <LessonCard lesson={lesson} />
                        </div>
                      </div>

                      {/* DESKTOP */}
                      <div className="hidden md:grid md:grid-cols-[1fr_44px_1fr] md:gap-6 md:items-center">
                        <div className="flex justify-end items-center gap-3">
                          {isLeft ? (
                            <>
                              <div className="flex-1 max-w-[280px]">
                                <LessonCard lesson={lesson} />
                              </div>
                              <div className={`shrink-0 w-6 h-px ${
                                lesson.status === "locked" ? "bg-[#E8E5E0]"
                                : lesson.status === "current" ? "bg-[#E2654A]/40"
                                : "bg-[#2D6A6A]/30"
                              }`} />
                            </>
                          ) : null}
                        </div>

                        <div className="flex items-center justify-center z-10 relative">
                          <NodeCircle status={lesson.status} modBg={mod.modBg} ringColor={mod.ringColor} />
                        </div>

                        <div className="flex justify-start items-center gap-3">
                          {!isLeft ? (
                            <>
                              <div className={`shrink-0 w-6 h-px ${
                                lesson.status === "locked" ? "bg-[#E8E5E0]"
                                : lesson.status === "current" ? "bg-[#E2654A]/40"
                                : "bg-[#2D6A6A]/30"
                              }`} />
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
              <div className="w-11 h-11 rounded-full bg-white border-2 border-dashed border-[#E8E5E0]
                              flex items-center justify-center text-lg opacity-40 shrink-0 md:mx-auto">
                🎯
              </div>
              <p className="text-xs text-[#9C9890] font-semibold md:text-center">Más lecciones próximamente</p>
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
          <div className="bg-white border border-[#E8E5E0] rounded-2xl p-7 text-center flex flex-col items-center gap-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FDF0ED] flex items-center justify-center text-2xl shrink-0">
              🎯
            </div>
            <div>
              <h3 className="font-display text-xl text-[#1A1A18]">¿Listo para el siguiente desafío?</h3>
              <p className="text-sm text-[#6B6960] mt-2 leading-relaxed">Continúa donde lo dejaste y sigue ganando XP.</p>
            </div>
            <Button
              as={Link}
              href="/lesson"
              size="lg"
              fullWidth
              className="font-bold bg-[#E2654A] text-white hover:bg-[#C9553D] active:scale-[0.98] transition-all duration-150 border-0"
            >
              Continuar Aprendiendo →
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
