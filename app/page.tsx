"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Progress,
  Divider,
} from "@heroui/react";

// ── Data ──────────────────────────────────────────────────────────────────────

const leaderboard = [
  { avatar: "🦊", name: "promptfox",  xp: 4820, rank: 1, color: "from-amber-400 to-orange-500"   },
  { avatar: "🐺", name: "neuralwolf", xp: 3910, rank: 2, color: "from-violet-400 to-purple-500"  },
  { avatar: "🐉", name: "dragondev",  xp: 3210, rank: 3, color: "from-emerald-400 to-teal-500"   },
  { avatar: "🦋", name: "bytebee",    xp: 2750, rank: 4, color: "from-pink-400 to-rose-500"      },
  { avatar: "🦁", name: "llmlion",    xp: 2100, rank: 5, color: "from-yellow-400 to-amber-500"   },
];

const DEMO_PROMPTS = [
  "Actúa como un experto en marketing y dame 5 ideas creativas para...",
  "Resume este artículo en 3 puntos clave con un tono profesional...",
  "Genera un plan paso a paso para aprender Python desde cero en...",
];

const steps = [
  {
    emoji: "📖",
    label: "Aprende",
    desc: "Lecciones breves e interactivas sobre los fundamentos del prompting con IA.",
    accent: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/20",
    glow: "bg-violet-500/15",
    chip: "text-violet-300",
    chipBg: "bg-violet-500/15 border-violet-500/30",
    href: "/lessons",
  },
  {
    emoji: "🎮",
    label: "Practica",
    desc: "Completa retos reales puntuados por IA en tiempo real.",
    accent: "from-fuchsia-500/15 to-fuchsia-600/5",
    border: "border-fuchsia-500/20",
    glow: "bg-fuchsia-500/15",
    chip: "text-fuchsia-300",
    chipBg: "bg-fuchsia-500/15 border-fuchsia-500/30",
    href: "/lesson",
  },
  {
    emoji: "🏆",
    label: "Domina",
    desc: "Sube en la clasificación y desbloquea insignias exclusivas.",
    accent: "from-amber-500/15 to-amber-600/5",
    border: "border-amber-500/20",
    glow: "bg-amber-500/15",
    chip: "text-amber-300",
    chipBg: "bg-amber-500/15 border-amber-500/30",
    href: "/leaderboard",
  },
];

// ── Variants ──────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, type: "spring", stiffness: 260, damping: 20 },
  }),
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, type: "spring", stiffness: 320, damping: 18 },
  }),
};

// ── Product Demo ──────────────────────────────────────────────────────────────

function ProductDemo() {
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState("");
  const [showScore, setShowScore] = useState(false);
  const current = DEMO_PROMPTS[idx];

  useEffect(() => {
    if (display.length < current.length) {
      const t = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), 38);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setShowScore(true), 500);
    const t2 = setTimeout(() => {
      setShowScore(false);
      setDisplay("");
      setIdx((i) => (i + 1) % DEMO_PROMPTS.length);
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [display, current, idx]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 180, damping: 22 }}
      className="w-full max-w-sm mx-auto lg:max-w-none"
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Glow under card */}
        <div className="absolute inset-0 rounded-3xl bg-violet-500/25 blur-3xl scale-90 translate-y-6 -z-10" />

        <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-4 space-y-3 shadow-2xl">
          {/* Fake browser bar */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-rose-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            </div>
            <div className="flex-1 h-6 rounded-md bg-white/[0.05] border border-white/8 flex items-center px-2.5 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60 shrink-0" />
              <span className="text-[11px] text-gray-500 truncate">promptly.app/sandbox</span>
            </div>
          </div>

          {/* Prompt label */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Tu Prompt</span>
            <Chip
              size="sm"
              classNames={{
                base: "bg-cyan-500/10 border border-cyan-500/20 h-5",
                content: "text-cyan-400 text-[10px] font-semibold px-1",
              }}
            >
              Sandbox IA
            </Chip>
          </div>

          {/* Prompt input area */}
          <div className="rounded-xl bg-[#0a0a0f]/60 border border-white/8 p-3.5 min-h-[80px]">
            <p className="text-sm text-gray-200 leading-relaxed">
              {display}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.55, repeat: Infinity }}
                className="inline-block w-[2px] h-[15px] bg-violet-400 ml-0.5 align-middle rounded-full"
              />
            </p>
          </div>

          {/* Score reveal */}
          <motion.div
            animate={{ opacity: showScore ? 1 : 0, y: showScore ? 0 : 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">Puntuación IA</span>
                <span className="text-sm font-extrabold text-emerald-400">94 / 100</span>
              </div>
              <Progress
                value={94}
                size="sm"
                classNames={{
                  track: "bg-white/10",
                  indicator: "bg-gradient-to-r from-emerald-400 to-cyan-400",
                }}
                aria-label="Puntuación 94"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <Chip
                  size="sm"
                  classNames={{
                    base: "bg-emerald-500/15 border border-emerald-500/30 h-6",
                    content: "text-emerald-400 font-bold text-xs",
                  }}
                >
                  +150 XP
                </Chip>
                <Chip
                  size="sm"
                  classNames={{
                    base: "bg-amber-500/15 border border-amber-500/30 h-6",
                    content: "text-amber-400 font-bold text-xs",
                  }}
                >
                  🔥 Racha x3
                </Chip>
                <Chip
                  size="sm"
                  classNames={{
                    base: "bg-violet-500/15 border border-violet-500/30 h-6",
                    content: "text-violet-300 font-bold text-xs",
                  }}
                >
                  🥇 Top 10%
                </Chip>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[95svh] flex flex-col items-center justify-center px-4 pt-24 pb-20 overflow-hidden">

        {/* Asymmetric glow blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[52%] top-[-10%] -translate-x-1/2 w-[500px] h-[540px] rounded-[60%_40%_55%_45%/50%_60%_40%_50%] bg-violet-600/25 blur-[130px]" />
          <div className="absolute left-[-8%] bottom-[12%] w-[280px] h-[220px] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] bg-fuchsia-600/20 blur-[100px]" />
          <div className="absolute right-[1%] top-[18%] w-[200px] h-[300px] rounded-[55%_45%_40%_60%/45%_55%_45%_55%] bg-cyan-500/15 blur-[90px]" />
          <div className="absolute left-[38%] bottom-[3%] w-[220px] h-[140px] rounded-full bg-amber-500/8 blur-[80px]" />
        </div>

        {/* Two-column layout on lg+ */}
        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-10">

          {/* Left: copy */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="mb-6"
            >
              <Chip
                startContent={
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_2px] shadow-emerald-400/60 ml-1" />
                }
                variant="bordered"
                classNames={{
                  base: "border-violet-400/40 bg-violet-500/10 px-1",
                  content: "text-violet-300 font-semibold text-sm",
                }}
              >
                Acceso Anticipado — Únete Gratis
              </Chip>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 18 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-extrabold tracking-tight leading-[1.07] text-white"
            >
              Sube de Nivel{" "}
              <br className="hidden sm:block" />
              en{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                IA Prompting
              </span>{" "}
              ⚡
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, type: "spring", stiffness: 200, damping: 20 }}
              className="mt-5 text-base sm:text-lg text-gray-400 max-w-md leading-relaxed"
            >
              El{" "}
              <span className="text-white font-semibold">Duolingo de la IA</span>.
              {" "}Retos diarios, puntuaciones reales, XP, streaks y tu nombre en el top.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, type: "spring", stiffness: 240, damping: 20 }}
              className="mt-8 flex flex-col w-full sm:flex-row gap-3 max-w-xs sm:max-w-none"
            >
              <Button
                as={Link}
                href="/lesson"
                size="lg"
                className="w-full sm:w-auto font-extrabold text-base bg-violet-500 text-white shadow-[0_6px_0_#4c1d95] hover:shadow-[0_3px_0_#4c1d95] hover:translate-y-[3px] active:shadow-[0_1px_0_#4c1d95] active:translate-y-[5px] transition-all duration-100 px-8"
                startContent={<span>🚀</span>}
              >
                Empieza Gratis
              </Button>
              <Button
                as={Link}
                href="/sandbox"
                size="lg"
                variant="bordered"
                className="w-full sm:w-auto font-bold text-gray-300 border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10 hover:text-white"
                startContent={<span>🧪</span>}
              >
                Ver Sandbox
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.52 }}
              className="mt-4 text-xs text-gray-600"
            >
              Sin tarjeta · Plan gratuito para siempre
            </motion.p>
          </div>

          {/* Right: animated product mockup */}
          <div className="flex-1 w-full lg:max-w-[420px]">
            <ProductDemo />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-white/35" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────────────── */}
      <section className="w-full px-4 py-20 max-w-4xl mx-auto">
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show"
          viewport={{ once: true }} custom={0}
          className="font-display text-3xl sm:text-4xl font-extrabold text-center text-white mb-3"
        >
          Cómo Funciona
        </motion.h2>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show"
          viewport={{ once: true }} custom={0.4}
          className="text-center text-gray-500 text-base mb-10 max-w-sm mx-auto"
        >
          Tres pasos para pasar de cero a prompt engineer.
        </motion.p>

        {/* Step 1 — featured full-width */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show"
          viewport={{ once: true }} custom={1}
          className="mb-4"
        >
          <Card
            className={`border bg-gradient-to-br ${steps[0].accent} ${steps[0].border} shadow-none hover:scale-[1.01] transition-transform duration-200`}
            classNames={{ base: "backdrop-blur-sm" }}
          >
            <CardBody className="flex flex-col sm:flex-row items-center gap-5 p-6 sm:p-8">
              <div className={`shrink-0 w-20 h-20 rounded-2xl ${steps[0].glow} flex items-center justify-center text-5xl shadow-lg shadow-violet-500/10 border border-violet-500/15`}>
                {steps[0].emoji}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <Chip
                  size="sm"
                  classNames={{ base: `${steps[0].chipBg} mb-2`, content: `${steps[0].chip} font-bold text-xs` }}
                >
                  Paso 1
                </Chip>
                <p className="font-display font-extrabold text-white text-2xl leading-tight mb-1.5">{steps[0].label}</p>
                <p className="text-gray-400 leading-relaxed text-base">{steps[0].desc}</p>
              </div>
              <Button
                as={Link}
                href={steps[0].href}
                size="md"
                variant="bordered"
                className="shrink-0 font-bold text-violet-300 border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 hover:border-violet-400/40"
              >
                Ver lecciones →
              </Button>
            </CardBody>
          </Card>
        </motion.div>

        {/* Steps 2 & 3 — side by side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.slice(1).map((step, i) => (
            <motion.div
              key={step.label}
              variants={fadeUp} initial="hidden" whileInView="show"
              viewport={{ once: true }} custom={i + 2}
            >
              <Card
                className={`border bg-gradient-to-br ${step.accent} ${step.border} shadow-none h-full hover:scale-[1.02] transition-transform duration-200`}
                classNames={{ base: "backdrop-blur-sm" }}
              >
                <CardBody className="flex flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-xl ${step.glow} border ${step.border} flex items-center justify-center text-3xl`}>
                      {step.emoji}
                    </div>
                    <Chip
                      size="sm"
                      classNames={{ base: step.chipBg, content: `${step.chip} font-bold text-xs` }}
                    >
                      Paso {i + 2}
                    </Chip>
                  </div>
                  <div>
                    <p className="font-display font-extrabold text-white text-xl mb-1.5">{step.label}</p>
                    <p className="text-gray-400 text-base leading-relaxed">{step.desc}</p>
                  </div>
                  <Link
                    href={step.href}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-300 transition-colors mt-auto"
                  >
                    Ir →
                  </Link>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show"
          viewport={{ once: true }} custom={4}
          className="mt-10 flex justify-center"
        >
          <Button
            as={Link}
            href="/lesson"
            size="lg"
            className="font-extrabold px-10 bg-fuchsia-500 text-white shadow-[0_6px_0_#86198f] hover:shadow-[0_3px_0_#86198f] hover:translate-y-[3px] active:shadow-[0_1px_0_#86198f] active:translate-y-[5px] transition-all duration-100"
          >
            ¡Vamos! →
          </Button>
        </motion.div>
      </section>

      {/* ── LEADERBOARD PREVIEW ──────────────────────────────────────────── */}
      <section className="w-full px-4 py-20 max-w-md mx-auto">
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="show"
          viewport={{ once: true }} custom={0}
          className="font-display text-3xl sm:text-4xl font-extrabold text-center text-white mb-2"
        >
          🏆 Mejores Prompers
        </motion.h2>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show"
          viewport={{ once: true }} custom={0.4}
          className="text-center text-gray-500 text-base mb-8"
        >
          ¿Aparecerá tu nombre aquí?
        </motion.p>

        <div className="flex flex-col gap-3">
          {/* ── #1 FEATURED ── */}
          <motion.div
            variants={popIn} initial="hidden" whileInView="show"
            viewport={{ once: true }} custom={0}
          >
            <div className="relative">
              {/* Amber glow */}
              <div className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-2xl scale-105 translate-y-2 -z-10" />
              <Card className="border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent shadow-xl shadow-amber-500/15">
                <CardBody className="px-5 py-5">
                  {/* Crown + label */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <motion.span
                      animate={{ rotate: [-8, 8, -8] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="text-2xl"
                    >
                      👑
                    </motion.span>
                    <span className="font-display font-extrabold text-amber-300 text-sm uppercase tracking-widest">
                      #1 del ranking
                    </span>
                    <motion.span
                      animate={{ rotate: [8, -8, 8] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="text-2xl"
                    >
                      👑
                    </motion.span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Avatar — bigger for #1 */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/40 ring-2 ring-amber-400/50 ring-offset-2 ring-offset-[#0a0a0f]">
                        {leaderboard[0].avatar}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-display font-extrabold text-amber-200 text-2xl truncate leading-none mb-2">
                        {leaderboard[0].name}
                      </p>
                      <Progress
                        value={Math.round((leaderboard[0].xp / 5000) * 100)}
                        size="sm"
                        classNames={{
                          track: "bg-white/10",
                          indicator: "bg-gradient-to-r from-amber-400 to-orange-400",
                        }}
                        aria-label={`${leaderboard[0].xp} XP`}
                      />
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-extrabold text-amber-400 text-xl leading-none">
                        {leaderboard[0].xp.toLocaleString()}
                      </p>
                      <p className="text-xs text-amber-600 font-bold mt-0.5">XP</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </motion.div>

          {/* ── #2–#5 ── */}
          {leaderboard.slice(1).map((player, i) => (
            <motion.div
              key={player.name}
              variants={popIn} initial="hidden" whileInView="show"
              viewport={{ once: true }} custom={i + 1}
            >
              <Card className="bg-white/[0.04] border border-white/8 shadow-none hover:bg-white/[0.07] transition-colors duration-200">
                <CardBody className="flex flex-row items-center gap-3 px-4 py-3">
                  <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${
                    i === 0 ? "bg-gray-300 text-black" :
                    i === 1 ? "bg-amber-700 text-white" :
                    "bg-white/10 text-gray-400"
                  }`}>
                    {player.rank}
                  </span>
                  <div className={`shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${player.color} flex items-center justify-center text-xl shadow-md`}>
                    {player.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate text-base">{player.name}</p>
                    <Progress
                      size="sm"
                      value={Math.round((player.xp / 5000) * 100)}
                      classNames={{
                        base: "mt-1",
                        track: "bg-white/10",
                        indicator: `bg-gradient-to-r ${player.color}`,
                      }}
                      aria-label={`${player.xp} XP`}
                    />
                  </div>
                  <span className="shrink-0 text-sm font-extrabold text-amber-400">
                    {player.xp.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-amber-600">XP</span>
                  </span>
                </CardBody>
              </Card>
            </motion.div>
          ))}

          {/* Tu posición */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }} custom={6}
          >
            <Card className="bg-violet-500/10 border-2 border-dashed border-violet-500/40 shadow-none">
              <CardBody className="flex flex-row items-center gap-3 px-4 py-3">
                <span className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-extrabold text-sm text-gray-500">?</span>
                <div className="shrink-0 w-10 h-10 rounded-full border-2 border-dashed border-violet-400/40 flex items-center justify-center text-xl">👤</div>
                <div className="flex-1">
                  <p className="font-bold text-violet-400 text-base">Tú</p>
                  <p className="text-sm text-gray-500">¡Empieza a jugar para subir!</p>
                </div>
                <span className="shrink-0 text-sm font-extrabold text-gray-600">0 XP</span>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show"
          viewport={{ once: true }} custom={7}
          className="mt-6 flex justify-center"
        >
          <Button
            as={Link}
            href="/leaderboard"
            variant="bordered"
            className="font-bold text-gray-500 border-white/15 hover:border-white/30 hover:text-gray-300"
          >
            Ver clasificación completa →
          </Button>
        </motion.div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="w-full px-4 pb-24 pt-4 max-w-lg mx-auto">
        <motion.div
          variants={popIn} initial="hidden" whileInView="show"
          viewport={{ once: true }} custom={0}
        >
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-violet-500/20 blur-3xl scale-90 translate-y-6 -z-10" />

            <Card className="border border-violet-500/25 bg-gradient-to-br from-violet-900/60 via-purple-900/50 to-fuchsia-900/40 shadow-2xl shadow-violet-900/30">
              <CardBody className="p-7 sm:p-10 text-center flex flex-col items-center gap-5">

                {/* Live counter */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
                >
                  <Chip
                    startContent={
                      <motion.span
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-rose-500 ml-1 shadow-[0_0_6px_2px] shadow-rose-500/60 shrink-0"
                      />
                    }
                    classNames={{
                      base: "bg-rose-500/15 border border-rose-500/30 px-1",
                      content: "text-rose-300 font-semibold text-sm",
                    }}
                  >
                    847 personas practicando ahora
                  </Chip>
                </motion.div>

                <p className="text-5xl">⚡</p>

                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    ¿Listo para ser un<br />
                    <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                      Prompt Engineer?
                    </span>
                  </h2>
                  <p className="mt-3 text-gray-400 text-base leading-relaxed max-w-xs mx-auto">
                    Miles de personas ya están afilando sus habilidades de IA con Promptly. No te quedes atrás.
                  </p>
                </div>

                <Divider className="bg-white/10 w-full" />

                <div className="flex flex-col w-full gap-3">
                  <Button
                    as={Link}
                    href="/lesson"
                    size="lg"
                    fullWidth
                    className="font-extrabold text-base bg-violet-500 text-white shadow-[0_6px_0_#4c1d95] hover:shadow-[0_3px_0_#4c1d95] hover:translate-y-[3px] active:shadow-[0_1px_0_#4c1d95] active:translate-y-[5px] transition-all duration-100"
                    startContent={<span>🚀</span>}
                  >
                    Empieza Gratis
                  </Button>
                  <Button
                    as={Link}
                    href="/sandbox"
                    size="lg"
                    fullWidth
                    variant="bordered"
                    className="font-bold text-gray-300 border-white/15 bg-white/5 hover:border-white/25 hover:bg-white/10 hover:text-white"
                    startContent={<span>🧪</span>}
                  >
                    Probar el Sandbox
                  </Button>
                </div>

                <p className="text-xs text-gray-600">Sin tarjeta · Gratis para siempre</p>
              </CardBody>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-white/5 px-4 py-10">
        <div className="mx-auto max-w-2xl flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2 font-bold text-gray-500 shrink-0">
            <span>⚡</span>
            <span>Promptly</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-center">
            <Link href="/lessons"     className="hover:text-gray-400 transition-colors">Lecciones</Link>
            <Link href="/sandbox"     className="hover:text-gray-400 transition-colors">Sandbox</Link>
            <Link href="/leaderboard" className="hover:text-gray-400 transition-colors">Clasificación</Link>
          </nav>
          <p className="text-center sm:text-right shrink-0">
            © {new Date().getFullYear()} Promptly. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
