"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button, Progress } from "@heroui/react";

// ── Data ──────────────────────────────────────────────────────────────────────

const leaderboard = [
  { initials: "PF", name: "promptfox",  xp: 4820, rank: 1 },
  { initials: "NW", name: "neuralwolf", xp: 3910, rank: 2 },
  { initials: "DD", name: "dragondev",  xp: 3210, rank: 3 },
  { initials: "BB", name: "bytebee",    xp: 2750, rank: 4 },
  { initials: "LL", name: "llmlion",    xp: 2100, rank: 5 },
];

const DEMO_PROMPTS = [
  "Actúa como un experto en marketing y dame 5 ideas creativas para...",
  "Resume este artículo en 3 puntos clave con un tono profesional...",
  "Genera un plan paso a paso para aprender Python desde cero en...",
];

const steps = [
  {
    label: "Aprende",
    desc: "Lecciones breves e interactivas sobre los fundamentos del prompting con IA.",
    href: "/lessons",
    cta: "Ver lecciones",
  },
  {
    label: "Practica",
    desc: "Completa retos reales puntuados por IA en tiempo real.",
    href: "/lesson",
    cta: "Empezar reto",
  },
  {
    label: "Domina",
    desc: "Sube en la clasificación y desbloquea insignias exclusivas.",
    href: "/leaderboard",
    cta: "Ver ranking",
  },
];

// ── Animation variant ─────────────────────────────────────────────────────────

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 21 16 21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M17 6h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 5" />
      <path d="M7 6H5a2 2 0 0 0-2 2v1a4 4 0 0 0 4 5" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M5 20 3 7l7 4 4-7 4 7 7-4-2 13" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

const stepIcons = [<BookIcon key="book" />, <PlayIcon key="play" />, <TrophyIcon key="trophy" />];

// ── Product Demo ──────────────────────────────────────────────────────────────

function ProductDemo() {
  const [idx, setIdx]           = useState(0);
  const [display, setDisplay]   = useState("");
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto lg:max-w-none"
    >
      <div className="rounded-2xl border border-[#E8E5E0] bg-white shadow-lg p-4 space-y-3">
        {/* Browser bar */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-rose-300" />
            <div className="w-3 h-3 rounded-full bg-amber-300" />
            <div className="w-3 h-3 rounded-full bg-emerald-300" />
          </div>
          <div className="flex-1 h-6 rounded-md bg-[#F5F4F0] border border-[#E8E5E0] flex items-center px-2.5 gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#2D6A6A]/50 shrink-0" />
            <span className="text-[11px] text-[#9C9890] truncate">promptly.app/sandbox</span>
          </div>
        </div>

        {/* Prompt label */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#9C9890] uppercase tracking-widest">Tu Prompt</span>
          <span className="text-[10px] font-semibold text-[#2D6A6A] bg-[#EFF6F6] border border-[#2D6A6A]/20 rounded-full px-2 py-0.5">
            Sandbox IA
          </span>
        </div>

        {/* Prompt area */}
        <div className="rounded-xl bg-[#FAFAF8] border border-[#E8E5E0] p-3.5 min-h-[80px]">
          <p className="text-sm text-[#1A1A18] leading-relaxed">
            {display}
            <span className="inline-block w-[2px] h-[14px] bg-[#E2654A] ml-0.5 align-middle rounded-full animate-pulse" />
          </p>
        </div>

        {/* Score */}
        <motion.div
          animate={{ opacity: showScore ? 1 : 0, y: showScore ? 0 : 6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="rounded-xl bg-[#FDF0ED] border border-[#E2654A]/20 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6B6960] font-medium">Puntuación IA</span>
              <span className="text-sm font-bold text-[#E2654A]">94 / 100</span>
            </div>
            <Progress
              value={94}
              size="sm"
              classNames={{ track: "bg-[#E8E5E0]", indicator: "bg-[#E2654A]" }}
              aria-label="Puntuación 94"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-[#E2654A] bg-white border border-[#E2654A]/25 rounded-full px-2 py-0.5">
                +150 XP
              </span>
              <span className="text-[11px] font-semibold text-[#6B6960] bg-white border border-[#E8E5E0] rounded-full px-2 py-0.5">
                🔥 Racha x3
              </span>
              <span className="text-[11px] font-semibold text-[#2D6A6A] bg-[#EFF6F6] border border-[#2D6A6A]/20 rounded-full px-2 py-0.5">
                Top 10%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden bg-[#FAFAF8]">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[92svh] flex flex-col items-center justify-center px-5 pt-24 pb-20 overflow-hidden">

        {/* Geometric decoration — subtle circles, no glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute right-[-8%] top-[8%] w-[420px] h-[420px] rounded-full border border-[#E8E5E0]" />
          <div className="absolute right-[4%] top-[18%] w-[280px] h-[280px] rounded-full border border-[#E8E5E0]" />
          <div
            className="absolute left-[-10%] bottom-[10%] w-[300px] h-[300px] rounded-full bg-[#FDF0ED]"
            style={{ filter: "blur(70px)" }}
          />
        </div>

        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: copy */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-7"
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E2654A] bg-[#FDF0ED] border border-[#E2654A]/25 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2654A] animate-pulse shrink-0" />
                Acceso Anticipado — Únete Gratis
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] text-[#1A1A18] leading-[1.08] tracking-[-0.02em]"
            >
              Sube de Nivel<br />
              en IA Prompting
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
              className="mt-5 text-base sm:text-lg text-[#6B6960] max-w-md leading-relaxed"
            >
              El{" "}
              <span className="text-[#1A1A18] font-medium">Duolingo de la IA</span>.
              {" "}Retos diarios, puntuaciones reales, XP, streaks y tu nombre en el top.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
            >
              <Button
                as={Link}
                href="/lesson"
                size="lg"
                className="w-[260px] sm:w-auto font-semibold text-base bg-[#E2654A] text-white rounded-xl hover:bg-[#C9553D] active:scale-[0.98] transition-all duration-150 px-8 border-0"
              >
                Empieza Gratis
              </Button>
              <Button
                as={Link}
                href="/sandbox"
                size="lg"
                variant="bordered"
                className="w-[260px] sm:w-auto font-semibold text-[#1A1A18] border-2 border-[#E8E5E0] bg-transparent rounded-xl hover:border-[#E2654A] hover:text-[#E2654A] active:scale-[0.98] transition-all duration-150"
              >
                Ver Sandbox
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="mt-4 text-xs text-[#9C9890]"
            >
              Sin tarjeta · Plan gratuito para siempre
            </motion.p>
          </div>

          {/* Right: product demo */}
          <div className="flex-1 w-full lg:max-w-[420px]">
            <ProductDemo />
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ─────────────────────────────────────────────────── */}
      <section className="w-full bg-white border-t border-[#E8E5E0] px-5 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto">

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A18] tracking-[-0.02em] mb-3">
              Cómo Funciona
            </h2>
            <p className="text-[#6B6960] text-base max-w-sm mx-auto">
              Tres pasos para pasar de cero a prompt engineer.
            </p>
          </motion.div>

          {/* Step 1 — featured */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeIn}
            className="mb-4"
          >
            <div className="rounded-2xl border border-[#E8E5E0] bg-white shadow-sm hover:shadow-md hover:border-[#D0CDC6] transition-all duration-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-[#FDF0ED] border border-[#E2654A]/20 flex items-center justify-center text-[#E2654A]">
                {stepIcons[0]}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs font-semibold text-[#E2654A] uppercase tracking-widest">Paso 1</span>
                <h3 className="font-display text-2xl text-[#1A1A18] mt-1 mb-2 tracking-[-0.01em]">
                  {steps[0].label}
                </h3>
                <p className="text-[#6B6960] text-base leading-relaxed">{steps[0].desc}</p>
              </div>
              <Link
                href={steps[0].href}
                className="shrink-0 font-semibold text-sm text-[#E2654A] border border-[#E2654A]/30 bg-[#FDF0ED] hover:bg-[#E2654A] hover:text-white rounded-xl px-5 py-2.5 transition-all duration-150 min-h-[44px] flex items-center"
              >
                {steps[0].cta} →
              </Link>
            </div>
          </motion.div>

          {/* Steps 2 & 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.slice(1).map((step, i) => (
              <motion.div
                key={step.label}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="rounded-2xl border border-[#E8E5E0] bg-white shadow-sm hover:shadow-md hover:border-[#D0CDC6] transition-all duration-200 p-6 h-full flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] border border-[#E8E5E0] flex items-center justify-center text-[#6B6960]">
                      {stepIcons[i + 1]}
                    </div>
                    <span className="text-xs font-semibold text-[#9C9890] uppercase tracking-widest">
                      Paso {i + 2}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-[#1A1A18] mb-2 tracking-[-0.01em]">
                      {step.label}
                    </h3>
                    <p className="text-[#6B6960] text-base leading-relaxed">{step.desc}</p>
                  </div>
                  <Link
                    href={step.href}
                    className="text-sm font-semibold text-[#E2654A] hover:underline mt-auto inline-flex items-center min-h-[44px]"
                  >
                    {step.cta} →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeIn}
            className="mt-10 flex justify-center"
          >
            <Button
              as={Link}
              href="/lesson"
              size="lg"
              className="font-semibold px-10 bg-[#E2654A] text-white rounded-xl hover:bg-[#C9553D] active:scale-[0.98] transition-all duration-150 border-0"
            >
              ¡Vamos! →
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── LEADERBOARD PREVIEW ───────────────────────────────────────────── */}
      <section className="w-full bg-[#FAFAF8] px-5 py-20 sm:py-28">
        <div className="max-w-md mx-auto">

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A18] tracking-[-0.02em] mb-2">
              Mejores Prompers
            </h2>
            <p className="text-[#6B6960] text-base">¿Aparecerá tu nombre aquí?</p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeIn}
            className="rounded-2xl border border-[#E8E5E0] bg-white shadow-sm overflow-hidden"
          >
            {/* #1 featured row */}
            <div className="bg-[#FDF0ED] border-b border-[#E8E5E0] px-5 py-4 flex items-center gap-3">
              <span className="shrink-0 w-8 h-8 rounded-full bg-[#E2654A] text-white flex items-center justify-center font-bold text-sm">
                1
              </span>
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#E2654A]/10 border border-[#E2654A]/20 flex items-center justify-center font-bold text-[#E2654A] text-sm">
                {leaderboard[0].initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="font-semibold text-[#1A1A18] text-sm truncate">{leaderboard[0].name}</p>
                  <span className="text-[#E2654A] shrink-0"><CrownIcon /></span>
                </div>
                <Progress
                  value={Math.round((leaderboard[0].xp / 5000) * 100)}
                  size="sm"
                  classNames={{ track: "bg-[#E8E5E0]", indicator: "bg-[#E2654A]" }}
                  aria-label={`${leaderboard[0].xp} XP`}
                />
              </div>
              <span className="shrink-0 font-bold text-[#E2654A] text-sm whitespace-nowrap">
                {leaderboard[0].xp.toLocaleString()} <span className="text-[11px] font-normal text-[#9C9890]">XP</span>
              </span>
            </div>

            {/* #2–#5 */}
            {leaderboard.slice(1).map((player, i) => (
              <div
                key={player.name}
                className={`flex items-center gap-3 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors ${i < leaderboard.slice(1).length - 1 ? "border-b border-[#E8E5E0]" : ""}`}
              >
                <span className="shrink-0 w-8 h-8 rounded-full bg-[#F5F4F0] border border-[#E8E5E0] flex items-center justify-center font-semibold text-sm text-[#6B6960]">
                  {player.rank}
                </span>
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#F5F4F0] border border-[#E8E5E0] flex items-center justify-center font-semibold text-sm text-[#6B6960]">
                  {player.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1A1A18] text-sm truncate mb-1">{player.name}</p>
                  <Progress
                    size="sm"
                    value={Math.round((player.xp / 5000) * 100)}
                    classNames={{ track: "bg-[#E8E5E0]", indicator: "bg-[#9C9890]" }}
                    aria-label={`${player.xp} XP`}
                  />
                </div>
                <span className="shrink-0 text-sm font-semibold text-[#6B6960] whitespace-nowrap">
                  {player.xp.toLocaleString()} <span className="text-[11px] font-normal text-[#9C9890]">XP</span>
                </span>
              </div>
            ))}

            {/* Tú */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-t-2 border-dashed border-[#E2654A]/20 bg-[#FDF0ED]/50">
              <span className="shrink-0 w-8 h-8 rounded-full border border-dashed border-[#E2654A]/35 flex items-center justify-center font-semibold text-sm text-[#E2654A]/60">
                ?
              </span>
              <div className="shrink-0 w-10 h-10 rounded-full border border-dashed border-[#E2654A]/30 flex items-center justify-center text-[#E2654A]/40">
                <UserIcon />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#E2654A] text-sm">Tú</p>
                <p className="text-xs text-[#9C9890]">¡Empieza a practicar para subir!</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-[#9C9890]">0 XP</span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeIn}
            className="mt-6 flex justify-center"
          >
            <Link
              href="/leaderboard"
              className="text-sm font-semibold text-[#6B6960] hover:text-[#E2654A] transition-colors py-2 min-h-[44px] inline-flex items-center gap-1"
            >
              Ver clasificación completa →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="w-full bg-white border-t border-[#E8E5E0] px-5 py-20 sm:py-28">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="rounded-2xl border border-[#E2654A]/20 bg-white shadow-sm p-8 sm:p-12 text-center flex flex-col items-center gap-6">

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E2654A] bg-[#FDF0ED] border border-[#E2654A]/25 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2654A] animate-pulse shrink-0" />
                847 personas practicando ahora
              </span>

              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A18] tracking-[-0.02em] leading-tight">
                  ¿Listo para ser un<br />Prompt Engineer?
                </h2>
                <p className="mt-3 text-[#6B6960] text-base leading-relaxed max-w-xs mx-auto">
                  Miles de personas ya están afilando sus habilidades de IA con Promptly.
                </p>
              </div>

              <div className="w-full h-px bg-[#E8E5E0]" />

              <div className="flex flex-col w-full gap-3">
                <Button
                  as={Link}
                  href="/lesson"
                  size="lg"
                  fullWidth
                  className="font-semibold text-base bg-[#E2654A] text-white rounded-xl hover:bg-[#C9553D] active:scale-[0.98] transition-all duration-150 border-0"
                >
                  Empieza Gratis
                </Button>
                <Button
                  as={Link}
                  href="/sandbox"
                  size="lg"
                  fullWidth
                  variant="bordered"
                  className="font-semibold text-[#1A1A18] border-2 border-[#E8E5E0] bg-transparent rounded-xl hover:border-[#E2654A] hover:text-[#E2654A] active:scale-[0.98] transition-all duration-150"
                >
                  Probar el Sandbox
                </Button>
              </div>

              <p className="text-xs text-[#9C9890]">Sin tarjeta · Gratis para siempre</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-[#E8E5E0] bg-[#FAFAF8] px-5 py-10">
        <div className="mx-auto max-w-2xl flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:gap-4 text-sm">
          <div className="flex items-center gap-2 font-semibold text-[#1A1A18] shrink-0">
            <span className="w-6 h-6 rounded-md bg-[#E2654A] flex items-center justify-center text-white text-xs font-bold">
              P
            </span>
            <span>Promptly</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-1 gap-y-1">
            <Link href="/lessons"     className="py-2 px-2 text-[#6B6960] hover:text-[#E2654A] transition-colors inline-flex items-center min-h-[44px]">Lecciones</Link>
            <Link href="/sandbox"     className="py-2 px-2 text-[#6B6960] hover:text-[#E2654A] transition-colors inline-flex items-center min-h-[44px]">Sandbox</Link>
            <Link href="/leaderboard" className="py-2 px-2 text-[#6B6960] hover:text-[#E2654A] transition-colors inline-flex items-center min-h-[44px]">Clasificación</Link>
          </nav>
          <p className="text-[#9C9890] text-center sm:text-right shrink-0">
            © {new Date().getFullYear()} Promptly
          </p>
        </div>
      </footer>

    </div>
  );
}
