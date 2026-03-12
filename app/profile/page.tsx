"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Chip, Divider } from "@heroui/react";

// ── Sistema de niveles ────────────────────────────────────────────────────────

const LEVELS = [
  { level: 1, name: "Curioso",     xpMin: 0,    xpMax: 199,  color: "#9C9890", bg: "#F5F4F0", border: "#E8E5E0" },
  { level: 2, name: "Aprendiz",    xpMin: 200,  xpMax: 499,  color: "#2D6A6A", bg: "#EFF6F6", border: "#2D6A6A" },
  { level: 3, name: "Practicante", xpMin: 500,  xpMax: 999,  color: "#2D6A6A", bg: "#EFF6F6", border: "#2D6A6A" },
  { level: 4, name: "Intermedio",  xpMin: 1000, xpMax: 1999, color: "#E2654A", bg: "#FDF0ED", border: "#E2654A" },
  { level: 5, name: "Avanzado",    xpMin: 2000, xpMax: 3499, color: "#E2654A", bg: "#FDF0ED", border: "#E2654A" },
  { level: 6, name: "Experto",     xpMin: 3500, xpMax: 5499, color: "#D97706", bg: "#FFFBEB", border: "#D97706" },
  { level: 7, name: "Maestro",     xpMin: 5500, xpMax: 7999, color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED" },
  { level: 8, name: "Élite",       xpMin: 8000, xpMax: 9999, color: "#1A1A18", bg: "#F5F4F0", border: "#1A1A18" },
];

function getLevel(xp: number) {
  return [...LEVELS].reverse().find((l) => xp >= l.xpMin) ?? LEVELS[0];
}

// ── Datos simulados del usuario ───────────────────────────────────────────────

const USER = {
  name:       "Daniel F.",
  username:   "@odiseo",
  initials:   "DF",
  totalXP:    1240,
  streak:     7,
  rank:       1,
  lessonsCompleted: 5,
  memberSince: "Febrero 2026",
};

const BADGES = [
  { id: "first",    emoji: "⚡", label: "Primera Lección",    desc: "Completaste tu primera lección",        earned: true  },
  { id: "streak7",  emoji: "🔥", label: "Racha de 7 días",    desc: "7 días seguidos practicando",           earned: true  },
  { id: "top10",    emoji: "🏆", label: "Top 10 Global",       desc: "Entraste al top 10 del leaderboard",   earned: true  },
  { id: "perfect",  emoji: "🎯", label: "Prompt Perfecto",     desc: "Obtuviste 100 puntos en el Sandbox",   earned: true  },
  { id: "mod1",     emoji: "🎓", label: "Módulo 1 Completo",   desc: "Terminaste todos los fundamentos",     earned: true  },
  { id: "chat",     emoji: "💬", label: "Conversador",         desc: "Completaste todos los ejercicios chat",earned: true  },
  { id: "streak30", emoji: "🌟", label: "Racha de 30 días",    desc: "30 días seguidos practicando",         earned: false },
  { id: "role",     emoji: "🎭", label: "Maestro del Rol",     desc: "Domina el role prompting",             earned: false },
  { id: "expert",   emoji: "🔮", label: "Nivel Experto",       desc: "Alcanza el nivel 6",                  earned: false },
  { id: "elite",    emoji: "💎", label: "Élite",               desc: "Alcanza el nivel 8",                  earned: false },
  { id: "sandbox",  emoji: "🧪", label: "Científico",          desc: "50 pruebas en el Sandbox",             earned: false },
  { id: "speed",    emoji: "⚡", label: "Velocista",           desc: "Completa una lección en menos de 2 min",earned: false},
];

const MODULE_PROGRESS = [
  { id: 1, emoji: "🌱", title: "Tus Primeros Prompts", total: 3, done: 3 },
  { id: 2, emoji: "⚡", title: "Mejora tus Prompts",   total: 3, done: 1 },
  { id: 3, emoji: "🚀", title: "Nivel Avanzado",        total: 2, done: 0 },
];

const SETTINGS = [
  {
    group: "Preferencias",
    items: [
      { icon: "🔔", label: "Recordatorio diario",    value: "Activado",  type: "toggle", on: true  },
      { icon: "🌐", label: "Idioma",                 value: "Español",   type: "select"            },
      { icon: "🔥", label: "Alerta de racha",        value: "Activado",  type: "toggle", on: true  },
      { icon: "🎵", label: "Sonidos",                value: "Desactivado",type: "toggle", on: false },
    ],
  },
  {
    group: "Cuenta",
    items: [
      { icon: "👤", label: "Editar perfil",          value: "",          type: "link"   },
      { icon: "🔒", label: "Privacidad del perfil",  value: "Público",   type: "select" },
      { icon: "📧", label: "Correo electrónico",     value: "dan***@gmail.com", type: "info" },
      { icon: "🚪", label: "Cerrar sesión",          value: "",          type: "danger" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" as const },
  }),
};

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function FlameIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 21 16 21" /><line x1="12" y1="17" x2="12" y2="21" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M17 6h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 5" />
      <path d="M7 6H5a2 2 0 0 0-2 2v1a4 4 0 0 0 4 5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const currentLevel = getLevel(USER.totalXP);
  const nextLevel    = LEVELS.find((l) => l.level === currentLevel.level + 1);
  const xpIntoLevel  = USER.totalXP - currentLevel.xpMin;
  const xpNeeded     = (nextLevel?.xpMin ?? currentLevel.xpMax + 1) - currentLevel.xpMin;
  const xpPct        = Math.min(Math.round((xpIntoLevel / xpNeeded) * 100), 100);

  const earnedCount  = BADGES.filter((b) => b.earned).length;

  return (
    <div className="min-h-screen bg-[#FAFAF8] px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl flex flex-col gap-6">

        {/* ── HERO ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <div className="bg-white border border-[#E8E5E0] rounded-2xl shadow-sm overflow-hidden">

            {/* Cover band */}
            <div className="h-24 w-full" style={{ background: `linear-gradient(135deg, ${currentLevel.bg} 0%, #ffffff 100%)` }} />

            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div
                  className="w-20 h-20 rounded-2xl border-4 border-white flex items-center justify-center font-extrabold text-2xl text-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${currentLevel.color} 0%, ${currentLevel.color}cc 100%)` }}
                >
                  {USER.initials}
                </div>
                <Link
                  href="#settings"
                  className="text-xs font-semibold text-[#6B6960] border border-[#E8E5E0] bg-[#FAFAF8] hover:border-[#E2654A] hover:text-[#E2654A] rounded-xl px-4 py-2 transition-all duration-150 min-h-[36px] flex items-center"
                >
                  Editar perfil
                </Link>
              </div>

              {/* Name + level badge */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-display text-2xl text-[#1A1A18] tracking-tight">{USER.name}</h1>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full border"
                  style={{ color: currentLevel.color, background: currentLevel.bg, borderColor: currentLevel.border + "40" }}
                >
                  Niv. {currentLevel.level} · {currentLevel.name}
                </span>
              </div>
              <p className="text-sm text-[#9C9890] font-mono mb-4">{USER.username} · Miembro desde {USER.memberSince}</p>

              {/* XP progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B6960] font-medium">{USER.totalXP.toLocaleString()} XP</span>
                  {nextLevel ? (
                    <span className="text-[#9C9890]">
                      Siguiente nivel: <span className="font-semibold" style={{ color: currentLevel.color }}>{nextLevel.name}</span> · {(nextLevel.xpMin - USER.totalXP).toLocaleString()} XP restantes
                    </span>
                  ) : (
                    <span className="text-[#9C9890] font-semibold">¡Nivel máximo! 🏅</span>
                  )}
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#E8E5E0] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: currentLevel.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#9C9890]">
                  <span>Niv. {currentLevel.level}</span>
                  {nextLevel && <span>Niv. {nextLevel.level}</span>}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── STATS ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: <FlameIcon />, value: `${USER.streak}`, label: "Racha",    color: "#D97706", bg: "#FFFBEB" },
              { icon: <BookIcon />,  value: `${USER.lessonsCompleted}`, label: "Lecciones", color: "#2D6A6A", bg: "#EFF6F6" },
              { icon: <StarIcon />,  value: USER.totalXP.toLocaleString(), label: "XP Total", color: "#E2654A", bg: "#FDF0ED" },
              { icon: <TrophyIcon />,value: `#${USER.rank}`,  label: "Global",   color: "#E2654A", bg: "#FDF0ED" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-[#E8E5E0] rounded-2xl p-4 flex flex-col items-center gap-1.5 shadow-sm"
              >
                <span style={{ color: stat.color }}>{stat.icon}</span>
                <span className="font-extrabold text-lg text-[#1A1A18] tabular-nums leading-none">{stat.value}</span>
                <span className="text-[10px] text-[#9C9890] font-semibold uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── LOGROS ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}>
          <div className="bg-white border border-[#E8E5E0] rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg text-[#1A1A18]">Logros</h2>
                <p className="text-xs text-[#9C9890] mt-0.5">{earnedCount} de {BADGES.length} desbloqueados</p>
              </div>
              <Chip
                size="sm"
                classNames={{ base: "bg-[#FDF0ED] border border-[#E2654A]/20", content: "text-[#E2654A] font-bold text-xs" }}
              >
                {earnedCount}/{BADGES.length}
              </Chip>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-[#E8E5E0] overflow-hidden mb-5">
              <div
                className="h-full rounded-full bg-[#E2654A] transition-all"
                style={{ width: `${Math.round((earnedCount / BADGES.length) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {BADGES.map((badge) => (
                <div
                  key={badge.id}
                  title={badge.earned ? badge.desc : `🔒 ${badge.desc}`}
                  className={[
                    "flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all duration-150",
                    badge.earned
                      ? "bg-[#FAFAF8] border-[#E8E5E0] hover:border-[#E2654A]/30 hover:bg-[#FDF0ED]"
                      : "bg-[#F5F4F0] border-[#E8E5E0] opacity-40 grayscale",
                  ].join(" ")}
                >
                  <span className="text-2xl leading-none">{badge.emoji}</span>
                  <span className={`text-[10px] font-semibold leading-tight ${badge.earned ? "text-[#1A1A18]" : "text-[#9C9890]"}`}>
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── PROGRESO DEL CURRÍCULO ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}>
          <div className="bg-white border border-[#E8E5E0] rounded-2xl shadow-sm p-6">
            <h2 className="font-display text-lg text-[#1A1A18] mb-4">Progreso del Currículo</h2>

            <div className="flex flex-col gap-4">
              {MODULE_PROGRESS.map((mod) => {
                const pct = Math.round((mod.done / mod.total) * 100);
                const done = mod.done === mod.total;
                const locked = mod.done === 0 && mod.id > 1;
                return (
                  <div key={mod.id} className={locked ? "opacity-40" : ""}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{mod.emoji}</span>
                        <span className="text-sm font-semibold text-[#1A1A18]">{mod.title}</span>
                        {done && (
                          <span className="text-[10px] font-bold text-[#2D6A6A] bg-[#EFF6F6] border border-[#2D6A6A]/20 rounded-full px-2 py-0.5">
                            ✓ Completado
                          </span>
                        )}
                        {locked && (
                          <span className="text-[10px] font-bold text-[#9C9890] bg-[#F5F4F0] border border-[#E8E5E0] rounded-full px-2 py-0.5">
                            🔒 Bloqueado
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#9C9890] font-semibold tabular-nums shrink-0">{mod.done}/{mod.total}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E8E5E0] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: done ? "#2D6A6A" : "#E2654A" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 + mod.id * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-[#E8E5E0]">
              <Link
                href="/lessons"
                className="text-sm font-semibold text-[#E2654A] hover:underline inline-flex items-center gap-1 min-h-[44px]"
              >
                Ver currículo completo →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── TODOS LOS NIVELES ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}>
          <div className="bg-white border border-[#E8E5E0] rounded-2xl shadow-sm p-6">
            <h2 className="font-display text-lg text-[#1A1A18] mb-4">Camino de Niveles</h2>
            <div className="flex flex-col gap-2">
              {LEVELS.map((lvl, i) => {
                const isCurrentLvl = lvl.level === currentLevel.level;
                const isPast = USER.totalXP >= lvl.xpMin;
                return (
                  <div
                    key={lvl.level}
                    className={[
                      "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                      isCurrentLvl
                        ? "border-[#E2654A]/40 bg-[#FDF0ED]"
                        : isPast
                        ? "border-[#E8E5E0] bg-[#FAFAF8]"
                        : "border-[#E8E5E0] bg-white opacity-50",
                    ].join(" ")}
                  >
                    {/* Level number */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0"
                      style={{
                        backgroundColor: isPast ? lvl.bg : "#F5F4F0",
                        color: isPast ? lvl.color : "#9C9890",
                        border: `1.5px solid ${isPast ? lvl.border + "40" : "#E8E5E0"}`,
                      }}
                    >
                      {isPast && !isCurrentLvl ? "✓" : lvl.level}
                    </div>

                    {/* Name + XP range */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isCurrentLvl ? "text-[#1A1A18]" : isPast ? "text-[#1A1A18]" : "text-[#9C9890]"}`}>
                          {lvl.name}
                        </span>
                        {isCurrentLvl && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: lvl.color, background: lvl.bg }}>
                            Tú estás aquí
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#9C9890]">{lvl.xpMin.toLocaleString()} XP{lvl.level < 8 ? ` – ${(LEVELS[i + 1]?.xpMin - 1).toLocaleString()} XP` : "+"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── AJUSTES ── */}
        <motion.div id="settings" variants={fadeUp} initial="hidden" animate="show" custom={5}>
          <div className="bg-white border border-[#E8E5E0] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E8E5E0]">
              <h2 className="font-display text-lg text-[#1A1A18]">Ajustes</h2>
            </div>
            {SETTINGS.map((group, gi) => (
              <div key={group.group}>
                {gi > 0 && <Divider className="bg-[#E8E5E0]" />}
                <div className="px-6 py-3">
                  <p className="text-[10px] font-bold text-[#9C9890] uppercase tracking-widest mb-2">{group.group}</p>
                  <div className="flex flex-col">
                    {group.items.map((item, ii) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between py-3 min-h-[52px]">
                          <div className="flex items-center gap-3">
                            <span className="text-lg w-6 text-center shrink-0">{item.icon}</span>
                            <span className={`text-sm font-medium ${item.type === "danger" ? "text-red-500" : "text-[#1A1A18]"}`}>
                              {item.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {item.type === "toggle" && (
                              <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${item.on ? "bg-[#E2654A]" : "bg-[#E8E5E0]"}`}>
                                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${item.on ? "translate-x-5" : "translate-x-0"}`} />
                              </div>
                            )}
                            {(item.type === "select" || item.type === "info") && item.value && (
                              <span className="text-sm text-[#9C9890]">{item.value}</span>
                            )}
                            {(item.type === "select" || item.type === "link") && (
                              <span className="text-[#9C9890]"><ChevronIcon /></span>
                            )}
                          </div>
                        </div>
                        {ii < group.items.length - 1 && <Divider className="bg-[#E8E5E0]" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="h-4" />

      </div>
    </div>
  );
}
