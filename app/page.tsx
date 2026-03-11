"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Progress,
  Divider,
} from "@heroui/react";

const steps = [
  { emoji: "📖", label: "Aprende", desc: "Lecciones breves sobre los fundamentos del prompting." },
  { emoji: "🎮", label: "Practica", desc: "Completa retos reales puntuados por IA en tiempo real." },
  { emoji: "🏆", label: "Domina", desc: "Sube en la clasificación y desbloquea insignias exclusivas." },
];

const leaderboard = [
  { avatar: "🦊", name: "promptfox", xp: 4820, rank: 1, color: "bg-gradient-to-br from-amber-400 to-orange-500" },
  { avatar: "🐺", name: "neuralwolf", xp: 3910, rank: 2, color: "bg-gradient-to-br from-violet-400 to-purple-500" },
  { avatar: "🐉", name: "dragondev", xp: 3210, rank: 3, color: "bg-gradient-to-br from-emerald-400 to-teal-500" },
  { avatar: "🦋", name: "bytebee", xp: 2750, rank: 4, color: "bg-gradient-to-br from-pink-400 to-rose-500" },
  { avatar: "🦁", name: "llmlion", xp: 2100, rank: 5, color: "bg-gradient-to-br from-yellow-400 to-amber-500" },
];

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

const rankColor = (i: number) =>
  i === 0
    ? "bg-amber-400 text-black"
    : i === 1
    ? "bg-gray-300 text-black"
    : i === 2
    ? "bg-amber-700 text-white"
    : "bg-white/10 text-gray-400";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90svh] flex flex-col items-center justify-center px-5 pt-20 pb-16 text-center overflow-hidden">
        {/* Glow blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10%] -translate-x-1/2 w-[540px] h-[540px] rounded-full bg-violet-600/25 blur-[140px]" />
          <div className="absolute left-[8%] bottom-[8%] w-[280px] h-[280px] rounded-full bg-fuchsia-600/20 blur-[110px]" />
          <div className="absolute right-[6%] top-[28%] w-[220px] h-[220px] rounded-full bg-cyan-500/15 blur-[90px]" />
        </div>

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
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white max-w-3xl"
        >
          Sube de Nivel en{" "}
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
          className="mt-5 text-lg sm:text-xl text-gray-400 max-w-xl leading-relaxed"
        >
          Promptly es el{" "}
          <span className="text-white font-semibold">Duolingo de la IA</span>.
          Completa retos diarios, obtén puntuaciones de IA real, gana XP y domina la clasificación.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, type: "spring", stiffness: 240, damping: 20 }}
          className="mt-8 flex flex-col w-full max-w-xs gap-3 sm:max-w-sm"
        >
          <Button
            as={Link}
            href="/lesson"
            size="lg"
            className="w-full font-extrabold text-lg bg-violet-500 text-white shadow-[0_6px_0_#4c1d95] hover:shadow-[0_3px_0_#4c1d95] hover:translate-y-[3px] active:shadow-[0_1px_0_#4c1d95] active:translate-y-[5px] transition-all duration-100"
            startContent={<span>🚀</span>}
          >
            Empieza Gratis
          </Button>
          <Button
            as={Link}
            href="/sandbox"
            size="lg"
            variant="bordered"
            className="w-full font-bold text-gray-300 border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10 hover:text-white"
            startContent={<span>🧪</span>}
          >
            Probar el Sandbox
          </Button>
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
            >
              <Card
                className="bg-white/[0.04] border border-white/8 shadow-none"
                classNames={{ base: "backdrop-blur-sm" }}
              >
                <CardBody className="flex flex-row items-center gap-4 p-5">
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-white/[0.07] flex items-center justify-center text-3xl">
                    {step.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-white text-lg leading-tight">{step.label}</p>
                    <p className="mt-1 text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                  <Chip
                    size="sm"
                    variant="bordered"
                    classNames={{
                      base: "border-white/10",
                      content: "text-gray-600 font-bold text-xs",
                    }}
                  >
                    {i + 1}
                  </Chip>
                </CardBody>
              </Card>
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
          <Button
            as={Link}
            href="/lesson"
            size="lg"
            className="font-extrabold px-8 bg-fuchsia-500 text-white shadow-[0_6px_0_#86198f] hover:shadow-[0_3px_0_#86198f] hover:translate-y-[3px] active:shadow-[0_1px_0_#86198f] active:translate-y-[5px] transition-all duration-100"
          >
            ¡Vamos! →
          </Button>
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
            >
              <Card className="bg-white/[0.04] border border-white/8 shadow-none">
                <CardBody className="flex flex-row items-center gap-3 px-4 py-3">
                  <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${rankColor(i)}`}>
                    {player.rank}
                  </span>
                  <div className={`shrink-0 w-10 h-10 rounded-full ${player.color} flex items-center justify-center text-xl shadow-lg`}>
                    {player.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{player.name}</p>
                    <Progress
                      size="sm"
                      value={Math.round((player.xp / 5000) * 100)}
                      classNames={{
                        base: "mt-1",
                        track: "bg-white/10",
                        indicator: player.color.replace("bg-gradient-to-br", "bg-gradient-to-r"),
                      }}
                      aria-label={`${player.xp} XP`}
                    />
                  </div>
                  <span className="shrink-0 text-sm font-extrabold text-amber-400">
                    {player.xp.toLocaleString()} XP
                  </span>
                </CardBody>
              </Card>
            </motion.div>
          ))}

          {/* Tu posición */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={6}
          >
            <Card className="bg-violet-500/10 border-2 border-dashed border-violet-500/40 shadow-none">
              <CardBody className="flex flex-row items-center gap-3 px-4 py-3">
                <span className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-extrabold text-sm text-gray-500">?</span>
                <div className="shrink-0 w-10 h-10 rounded-full border-2 border-dashed border-violet-400/40 flex items-center justify-center text-xl">👤</div>
                <div className="flex-1">
                  <p className="font-bold text-violet-400">Tú</p>
                  <p className="text-xs text-gray-500">¡Empieza a jugar para subir!</p>
                </div>
                <span className="shrink-0 text-sm font-extrabold text-gray-600">0 XP</span>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="w-full px-5 pb-20 pt-4 max-w-md mx-auto">
        <motion.div
          variants={popIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
        >
          <Card className="border border-violet-500/20 bg-gradient-to-br from-violet-900/50 via-purple-900/40 to-fuchsia-900/30 shadow-xl shadow-violet-900/20">
            <CardBody className="p-8 text-center flex flex-col items-center gap-4">
              <p className="text-5xl">⚡</p>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  ¿Listo para ser un<br />prompt engineer?
                </h2>
                <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                  Miles de personas ya están afilando sus habilidades de IA con Promptly. No te quedes atrás.
                </p>
              </div>
              <Divider className="bg-white/10" />
              <Button
                as={Link}
                href="/lesson"
                size="lg"
                fullWidth
                className="font-extrabold text-lg bg-violet-500 text-white shadow-[0_6px_0_#4c1d95] hover:shadow-[0_3px_0_#4c1d95] hover:translate-y-[3px] active:shadow-[0_1px_0_#4c1d95] active:translate-y-[5px] transition-all duration-100"
                startContent={<span>🚀</span>}
              >
                Empieza Gratis
              </Button>
              <p className="text-xs text-gray-600">Sin tarjeta · Gratis para siempre</p>
            </CardBody>
          </Card>
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
