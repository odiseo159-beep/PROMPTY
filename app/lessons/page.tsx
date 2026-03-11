"use client";

import Link from "next/link";
import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  Button,
  Progress,
} from "@heroui/react";
import { motion } from "framer-motion";

const modules = [
  {
    id: 1,
    emoji: "🧱",
    title: "Módulo 1: Fundamentos del Prompt",
    description: "Aprende la sintaxis básica y el comportamiento de los LLMs.",
    color: "from-emerald-500 to-teal-500",
    accent: "border-emerald-500/30",
    glow: "shadow-emerald-500/10",
    lessons: [
      { id: "1-1", title: "Hola Mundo (Zero-Shot)", desc: "La instrucción más simple posible.", status: "completed", xp: 100 },
      { id: "1-2", title: "Añadir Contexto", desc: "Proporcionar información de fondo para guiar las respuestas.", status: "completed", xp: 150 },
      { id: "1-3", title: "Formatear la Salida", desc: "Forzar a la IA a generar JSON, Markdown o tablas.", status: "completed", xp: 200 },
    ],
  },
  {
    id: 2,
    emoji: "⚡",
    title: "Módulo 2: Técnicas Avanzadas",
    description: "Dominando el few-shot prompting y los system personas.",
    color: "from-violet-500 to-purple-500",
    accent: "border-violet-500/30",
    glow: "shadow-violet-500/10",
    lessons: [
      { id: "2-1", title: "Few-Shot Prompting", desc: "Dar ejemplos para enseñar nuevos patrones.", status: "completed", xp: 250 },
      { id: "2-2", title: "Chain of Thought", desc: "Forzar al modelo a razonar paso a paso en matemáticas y lógica.", status: "current", xp: 300 },
      { id: "2-3", title: "System Personas", desc: "Adoptar identidades de experto.", status: "locked", xp: 350 },
    ],
  },
  {
    id: 3,
    emoji: "🛡️",
    title: "Módulo 3: Jailbreaks y Seguridad",
    description: "Comprendiendo la inyección de prompts y las barreras de seguridad.",
    color: "from-rose-500 to-pink-500",
    accent: "border-rose-500/20",
    glow: "shadow-rose-500/10",
    lessons: [
      { id: "3-1", title: "Exploits de Roleplay", desc: "Cómo los actores maliciosos eluden los filtros de seguridad.", status: "locked", xp: 500 },
      { id: "3-2", title: "Prompting Defensivo", desc: "Redactar instrucciones de sistema seguras e inviolables.", status: "locked", xp: 500 },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, type: "spring" as const, stiffness: 260, damping: 22 },
  }),
};

function statusChip(status: string) {
  if (status === "completed")
    return <Chip size="sm" color="success" variant="flat" startContent={<span>✓</span>}>Completada</Chip>;
  if (status === "current")
    return <Chip size="sm" color="warning" variant="flat" className="animate-pulse">Activa</Chip>;
  return <Chip size="sm" variant="flat" classNames={{ base: "bg-white/5", content: "text-gray-500" }}>🔒</Chip>;
}

export default function LessonsPage() {
  return (
    <div className="relative min-h-screen px-4 py-14 sm:px-8">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-emerald-600/8 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="mb-16 text-center"
        >
          <Chip
            variant="flat"
            classNames={{ base: "bg-violet-500/10 border border-violet-500/20 mb-4", content: "text-violet-300 font-semibold" }}
          >
            📚 Currículo Completo
          </Chip>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">
            Tu Ruta de Aprendizaje
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Domina el arte del prompt engineering a través de lecciones interactivas puntuadas por Claude.
          </p>
        </motion.header>

        {/* Modules */}
        <div className="flex flex-col gap-16">
          {modules.map((mod, modIdx) => {
            const completed = mod.lessons.filter(l => l.status === "completed").length;
            const progressPct = Math.round((completed / mod.lessons.length) * 100);
            const allLocked = mod.lessons.every(l => l.status === "locked");

            return (
              <motion.section
                key={mod.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={modIdx}
              >
                {/* Module Header */}
                <div className={`mb-6 pl-5 border-l-2 ${mod.accent}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{mod.emoji}</span>
                    <h2 className={`text-xl sm:text-2xl font-extrabold text-white ${allLocked ? "opacity-40" : ""}`}>
                      {mod.title}
                    </h2>
                  </div>
                  <p className={`text-sm text-gray-400 mb-3 ${allLocked ? "opacity-40" : ""}`}>
                    {mod.description}
                  </p>
                  {!allLocked && (
                    <div className="flex items-center gap-3 max-w-xs">
                      <Progress
                        size="sm"
                        value={progressPct}
                        classNames={{
                          track: "bg-white/5",
                          indicator: `bg-gradient-to-r ${mod.color}`,
                        }}
                        aria-label={`${progressPct}% completado`}
                      />
                      <span className="text-xs font-semibold text-gray-500 shrink-0">
                        {completed}/{mod.lessons.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Lesson Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mod.lessons.map((lesson, lessonIdx) => {
                    const isLocked = lesson.status === "locked";
                    const isCurrent = lesson.status === "current";

                    const cardInner = (
                      <Card
                        key={lesson.id}
                        isPressable={!isLocked}
                        className={[
                          "border transition-all duration-200 shadow-lg",
                          isLocked
                            ? "bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed"
                            : isCurrent
                            ? `bg-gradient-to-br from-violet-500/10 to-purple-500/5 border-violet-500/40 ${mod.glow} hover:border-violet-400/60`
                            : "bg-white/[0.04] border-white/10 hover:border-white/25 hover:bg-white/[0.07]",
                        ].join(" ")}
                      >
                        <CardBody className="p-5 flex flex-col gap-3">
                          {/* Top row */}
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-xs font-mono font-semibold ${isLocked ? "text-gray-600" : "text-emerald-400"}`}>
                              Lección {lesson.id}
                            </span>
                            {statusChip(lesson.status)}
                          </div>

                          {/* Title & desc */}
                          <div>
                            <h3 className={`font-bold text-base leading-snug ${isLocked ? "text-gray-600" : "text-white"}`}>
                              {lesson.title}
                            </h3>
                            <p className={`mt-1 text-sm leading-relaxed ${isLocked ? "text-gray-700" : "text-gray-400"}`}>
                              {lesson.desc}
                            </p>
                          </div>
                        </CardBody>

                        <CardFooter className="px-5 pt-0 pb-4 flex items-center justify-between">
                          <Chip
                            size="sm"
                            variant="flat"
                            classNames={{
                              base: isLocked ? "bg-white/[0.03]" : "bg-amber-500/10 border border-amber-500/20",
                              content: isLocked ? "text-gray-700 font-bold" : "text-amber-400 font-bold",
                            }}
                          >
                            +{lesson.xp} XP
                          </Chip>

                          {!isLocked && (
                            <Button
                              size="sm"
                              variant={isCurrent ? "solid" : "flat"}
                              className={
                                isCurrent
                                  ? "bg-violet-500 text-white font-semibold shadow-md shadow-violet-500/30"
                                  : "text-gray-400 font-semibold hover:text-white"
                              }
                              endContent={<span>→</span>}
                            >
                              {isCurrent ? "Empezar" : "Repasar"}
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );

                    return isLocked ? (
                      <div key={lesson.id}>{cardInner}</div>
                    ) : (
                      <Link key={lesson.id} href="/lesson">
                        {cardInner}
                      </Link>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.2 }}
          className="mt-20 text-center"
        >
          <Card className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-fuchsia-900/20 border border-violet-500/20 max-w-lg mx-auto">
            <CardBody className="p-8 flex flex-col items-center gap-4">
              <p className="text-4xl">🎯</p>
              <h3 className="text-xl font-extrabold text-white">¿Listo para el siguiente desafío?</h3>
              <p className="text-sm text-gray-400">Continúa donde lo dejaste y sigue ganando XP.</p>
              <Button
                as={Link}
                href="/lesson"
                size="lg"
                className="font-bold bg-violet-500 text-white shadow-[0_6px_0_#4c1d95] hover:shadow-[0_3px_0_#4c1d95] hover:translate-y-[3px] transition-all duration-100 mt-1"
              >
                Continuar Aprendiendo →
              </Button>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
