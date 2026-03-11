"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const steps = [
  { emoji: "📖", label: "Aprende", desc: "Lecciones breves sobre los fundamentos del prompting." },
  { emoji: "🎮", label: "Practica", desc: "Completa retos reales puntuados por IA en tiempo real." },
  { emoji: "🏆", label: "Domina", desc: "Sube en la clasificación y desbloquea insignias exclusivas." },
];

const leaderboard = [
  { avatar: "🦊", name: "promptfox", xp: 4820, rank: 1, color: "from-amber-400 to-orange-500" },
  { avatar: "🐺", name: "neuralwolf", xp: 3910, rank: 2, color: "from-violet-400 to-purple-500" },
  { avatar: "🐉", name: "dragondev", xp: 3210, rank: 3, color: "from-emerald-400 to-teal-500" },
  { avatar: "🦋", name: "bytebee", xp: 2750, rank: 4, color: "from-pink-400 to-rose-500" },
  { avatar: "🦁", name: "llmlion", xp: 2100, rank: 5, color: "from-yellow-400 to-amber-500" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, type: "spring", stiffness: 260, damping: 20 },
  }),
};

const popIn = {
  hidden: { opacity: 0, scale: 0.7 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, type: "spring", stiffness: 320, damping: 18 },
  }),
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90svh] flex flex-col items-center justify-center px-5 pt-20 pb-16 text-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10%] -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-violet-600/30 blur-[130px]" />
          <div className="absolute left-[10%] bottom-[5%] w-[260px] h-[260px] rounded-full bg-fuchsia-600/20 blur-[100px]" />
          <div className="absolute right-[5%] top-[30%] w-[200px] h-[200px] rounded-full bg-cyan-500/15 blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-4 py-1.5 text-sm font-semibold text-violet-300"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_2px] shadow-emerald-400/60" />
          Acceso Anticipado — Únete Gratis
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 18 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white max-w-3xl"
        >
          Sube de Nivel en{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            IA Prompting
          </span>{" "}
          ⚡
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, type: "spring", stiffness: 200, damping: 20 }}
          className="mt-5 text-lg sm:text-xl text-gray-400 max-w-xl leading-relaxed"
        >
          Promptly es el <span className="text-white font-semibold">Duolingo de la IA</span>.
          Completa retos diarios, obtén puntuaciones de IA real, gana XP y domina la clasificación.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, type: "spring", stiffness: 240, damping: 20 }}
          className="mt-8 flex flex-col w-full max-w-xs gap-3 sm:max-w-sm"
        >
          <Link
            href="/lesson"
            className="flex items-center justify-center gap-2 w-full min-h-[60px] rounded-2xl bg-violet-500 text-white font-extrabold text-lg
              shadow-[0_6px_0_#4c1d95] hover:shadow-[0_3px_0_#4c1d95] hover:translate-y-[3px]
              active:shadow-[0_1px_0_#4c1d95] active:translate-y-[5px]
              transition-all duration-100 select-none"
          >
            🚀 Empieza Gratis
          </Link>
          <Link
            href="/sandbox"
            className="flex items-center justify-center gap-2 w-full min-h-[60px] rounded-2xl border-2 border-white/15 bg-white/5 text-gray-300 font-bold text-base
              hover:border-white/30 hover:bg-white/10 hover:text-white
              transition-all duration-150 select-none"
          >
            🧪 Probar el Sandbox
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-xs text-gray-600"
        >
          Sin tarjeta · Plan gratuito para siempre
        </motion.p>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="w-full px-5 py-16 max-w-2xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
          className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-10"
        >
          Cómo Funciona
        </motion.h2>

        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i + 1}
              className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.04] p-5"
            >
              <div className="shrink-0 w-14 h-14 rounded-xl bg-white/[0.07] flex items-center justify-center text-3xl shadow-inner">
                {step.emoji}
              </div>
              <div>
                <p className="font-extrabold text-white text-lg leading-tight">{step.label}</p>
                <p className="mt-1 text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
              <span className="ml-auto shrink-0 self-center text-xs font-bold text-gray-600 border border-white/10 rounded-full w-6 h-6 flex items-center justify-center">
                {i + 1}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={4}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/lesson"
            className="flex items-center justify-center gap-2 min-h-[60px] px-8 rounded-2xl bg-fuchsia-500 text-white font-extrabold text-base
              shadow-[0_6px_0_#86198f] hover:shadow-[0_3px_0_#86198f] hover:translate-y-[3px]
              active:shadow-[0_1px_0_#86198f] active:translate-y-[5px]
              transition-all duration-100 select-none"
          >
            ¡Vamos! →
          </Link>
        </motion.div>
      </section>

      {/* ── CLASIFICACIÓN ── */}
      <section className="w-full px-5 py-16 max-w-md mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
          className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-2"
        >
          🏆 Mejores Prompers
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0.5}
          className="text-center text-gray-500 text-sm mb-8"
        >
          ¿Aparecerá tu nombre aquí?
        </motion.p>

        <div className="flex flex-col gap-3">
          {leaderboard.map((player, i) => (
            <motion.div
              key={player.name}
              variants={popIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3"
            >
              <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${
                i === 0 ? "bg-amber-400 text-black" :
                i === 1 ? "bg-gray-300 text-black" :
                i === 2 ? "bg-amber-700 text-white" :
                "bg-white/10 text-gray-400"
              }`}>
                {player.rank}
              </span>

              <div className={`shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${player.color} flex items-center justify-center text-xl shadow-lg`}>
                {player.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{player.name}</p>
                <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden w-full">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${player.color}`}
                    style={{ width: `${Math.round((player.xp / 5000) * 100)}%` }}
                  />
                </div>
              </div>

              <span className="shrink-0 text-sm font-extrabold text-amber-400">
                {player.xp.toLocaleString()} XP
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={6}
          className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-dashed border-violet-500/40 bg-violet-500/10 px-4 py-3"
        >
          <span className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-extrabold text-sm text-gray-500">?</span>
          <div className="shrink-0 w-10 h-10 rounded-full border-2 border-dashed border-violet-400/40 flex items-center justify-center text-xl">👤</div>
          <div className="flex-1">
            <p className="font-bold text-violet-400">Tú</p>
            <p className="text-xs text-gray-500">¡Empieza a jugar para subir!</p>
          </div>
          <span className="shrink-0 text-sm font-extrabold text-gray-600">0 XP</span>
        </motion.div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="w-full px-5 pb-20 pt-4 max-w-md mx-auto">
        <motion.div
          variants={popIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
          className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/50 via-purple-900/40 to-fuchsia-900/30 p-8 text-center"
        >
          <p className="text-5xl mb-4">⚡</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            ¿Listo para ser un<br />prompt engineer?
          </h2>
          <p className="mt-3 text-gray-400 text-sm leading-relaxed">
            Miles de personas ya están afilando sus habilidades de IA con Promptly. No te quedes atrás.
          </p>
          <Link
            href="/lesson"
            className="mt-6 flex items-center justify-center gap-2 w-full min-h-[60px] rounded-2xl bg-violet-500 text-white font-extrabold text-lg
              shadow-[0_6px_0_#4c1d95] hover:shadow-[0_3px_0_#4c1d95] hover:translate-y-[3px]
              active:shadow-[0_1px_0_#4c1d95] active:translate-y-[5px]
              transition-all duration-100 select-none"
          >
            🚀 Empieza Gratis
          </Link>
          <p className="mt-3 text-xs text-gray-600">Sin tarjeta · Gratis para siempre</p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full border-t border-white/5 px-5 py-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-4 text-sm text-gray-600 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-gray-500">
            <span>⚡</span>
            <span>Promptly</span>
          </div>
          <p>© {new Date().getFullYear()} Promptly. Todos los derechos reservados.</p>
          <div className="flex gap-5">
            <Link href="/lessons" className="hover:text-gray-400 transition-colors">Lecciones</Link>
            <Link href="/sandbox" className="hover:text-gray-400 transition-colors">Sandbox</Link>
            <Link href="/leaderboard" className="hover:text-gray-400 transition-colors">Clasificación</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
