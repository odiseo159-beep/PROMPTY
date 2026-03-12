"use client";

import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { motion } from "framer-motion";

const users = [
  { rank: 1, name: "Daniel F.",    username: "@odiseo",         xp: 12400, level: 12, trend: "up",   avatar: "🤖" },
  { rank: 2, name: "Alex Chen",    username: "@alexc",          xp: 11850, level: 11, trend: "same", avatar: "⚡" },
  { rank: 3, name: "Sarah J.",     username: "@sarah_j",        xp: 10200, level: 10, trend: "up",   avatar: "✨" },
  { rank: 4, name: "Mike T.",      username: "@mike_tech",      xp: 9500,  level: 9,  trend: "down", avatar: "👨‍💻" },
  { rank: 5, name: "Elena R.",     username: "@elena_prompts",  xp: 8900,  level: 9,  trend: "up",   avatar: "🎨" },
  { rank: 6, name: "David K.",     username: "@davidk",         xp: 8200,  level: 8,  trend: "same", avatar: "🧠" },
  { rank: 7, name: "AI Whisperer", username: "@whisper",        xp: 7500,  level: 8,  trend: "down", avatar: "🔮" },
  { rank: 8, name: "Leo M.",       username: "@leo_m",          xp: 6800,  level: 7,  trend: "up",   avatar: "🚀" },
];

const TOP3_STYLES = [
  // rank 1
  {
    ring:     "ring-2 ring-amber-400/60 shadow-sm shadow-amber-400/10",
    badge:    "bg-amber-400 text-black",
    xpColor:  "text-amber-600",
    bg:       "bg-amber-50/60",
    medal:    "🥇",
    avatarBg: "bg-amber-50 border border-amber-200",
  },
  // rank 2
  {
    ring:     "ring-2 ring-[#E8E5E0] shadow-sm",
    badge:    "bg-[#6B6960] text-white",
    xpColor:  "text-[#6B6960]",
    bg:       "bg-[#FAFAF8]",
    medal:    "🥈",
    avatarBg: "bg-[#FAFAF8] border border-[#E8E5E0]",
  },
  // rank 3
  {
    ring:     "ring-2 ring-amber-700/40 shadow-sm",
    badge:    "bg-amber-700 text-white",
    xpColor:  "text-amber-700",
    bg:       "bg-amber-50/40",
    medal:    "🥉",
    avatarBg: "bg-amber-50 border border-amber-200/60",
  },
];

const trendIcon = (trend: string) => {
  if (trend === "up")   return <span className="text-[#2D6A6A] text-xs font-bold" aria-label="Subiendo">▲</span>;
  if (trend === "down") return <span className="text-[#E2654A] text-xs font-bold" aria-label="Bajando">▼</span>;
  return <span className="text-[#9C9890] text-xs font-bold" aria-label="Sin cambio">—</span>;
};

export default function LeaderboardPage() {
  const topThree = users.slice(0, 3);
  const rest     = users.slice(3);
  const maxXP    = users[0].xp;

  return (
    <div className="relative min-h-screen px-4 py-14 sm:px-8 bg-[#FAFAF8]">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 18 }}
            className="text-6xl block mb-4"
          >
            🏆
          </motion.span>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-[#1A1A18] mb-3">
            Clasificación Global
          </h1>
          <p className="text-[#6B6960] text-base max-w-md mx-auto leading-relaxed">
            Clasificaciones actualizadas diariamente según lecciones completadas y puntuaciones del Sandbox.
          </p>
        </motion.header>

        {/* Podium — Top 3 */}
        <div className="grid grid-cols-3 gap-3 mb-8 items-end">
          {[topThree[1], topThree[0], topThree[2]].map((user, visualIdx) => {
            const realIdx = [1, 0, 2][visualIdx];
            const style = TOP3_STYLES[realIdx];
            const heights = ["h-28", "h-36", "h-24"];
            return (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + visualIdx * 0.1, type: "spring", stiffness: 260, damping: 22 }}
              >
                <Card className={`${style.ring} border border-[#E8E5E0] ${style.bg}`}>
                  <CardBody className="flex flex-col items-center gap-2 py-4 px-2">
                    <span className="text-xl">{style.medal}</span>
                    <div className={`w-12 h-12 rounded-2xl ${style.avatarBg} flex items-center justify-center text-2xl`}>
                      {user.avatar}
                    </div>
                    <div className="text-center">
                      <p className="font-extrabold text-[#1A1A18] text-sm leading-tight">{user.name}</p>
                      <p className="text-xs text-[#9C9890] font-mono">{user.username}</p>
                    </div>
                    <Chip
                      size="sm"
                      classNames={{ base: `${style.badge} border-0`, content: "font-bold text-xs px-1" }}
                    >
                      {user.xp.toLocaleString()} XP
                    </Chip>
                    <div className={`w-full ${heights[visualIdx]} rounded-b-lg bg-[#F0EDE8] flex items-end justify-center pb-2`}>
                      <span className={`text-xs font-bold ${style.xpColor}`}>#{user.rank}</span>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Full table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 240, damping: 22 }}
        >
          <Card className="bg-white border border-[#E8E5E0] shadow-sm overflow-hidden">
            {/* Table header */}
            <CardHeader className="bg-[#FAFAF8] border-b border-[#E8E5E0] px-5 py-3">
              <div className="grid grid-cols-12 w-full text-xs font-semibold uppercase tracking-widest text-[#9C9890]">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-6 sm:col-span-5 pl-2">Prompt Engineer</div>
                <div className="col-span-2 text-center">Nivel</div>
                <div className="hidden sm:block sm:col-span-3 text-right pr-2">XP Total</div>
                <div className="col-span-3 sm:col-span-1 text-center">Trend</div>
              </div>
            </CardHeader>

            <CardBody className="p-0">
              {users.map((user, i) => {
                const isTop3 = user.rank <= 3;
                const style  = isTop3 ? TOP3_STYLES[user.rank - 1] : null;
                const xpPct  = Math.round((user.xp / maxXP) * 100);

                return (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.05, type: "spring", stiffness: 260, damping: 24 }}
                  >
                    <div
                      className={[
                        "grid grid-cols-12 items-center px-5 py-3.5 gap-2 transition-colors hover:bg-[#FAFAF8]",
                        isTop3 ? style!.bg : "",
                      ].join(" ")}
                    >
                      {/* Rank */}
                      <div className="col-span-1 flex justify-center">
                        <span className={[
                          "w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs",
                          isTop3 ? style!.badge : "bg-[#FAFAF8] border border-[#E8E5E0] text-[#9C9890]",
                        ].join(" ")}>
                          {user.rank}
                        </span>
                      </div>

                      {/* User */}
                      <div className="col-span-6 sm:col-span-5 flex items-center gap-3 pl-1">
                        <div className={[
                          "hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-lg shrink-0",
                          isTop3 ? style!.avatarBg : "bg-[#FAFAF8] border border-[#E8E5E0]",
                        ].join(" ")}>
                          {user.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#1A1A18] text-sm truncate">{user.name}</span>
                            {user.rank === 1 && <span className="text-amber-500 text-xs">👑</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#9C9890] font-mono truncate">{user.username}</span>
                            {/* XP bar — mobile only */}
                            <div className="sm:hidden flex-1 h-1 rounded-full bg-[#E8E5E0] overflow-hidden min-w-[40px]">
                              <div
                                className="h-full bg-[#E2654A]"
                                style={{ width: `${xpPct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Level */}
                      <div className="col-span-2 flex justify-center">
                        <Chip
                          size="sm"
                          variant="flat"
                          classNames={{
                            base: "bg-[#FDF0ED] border border-[#E2654A]/20",
                            content: "text-[#E2654A] font-bold text-xs",
                          }}
                        >
                          Niv. {user.level}
                        </Chip>
                      </div>

                      {/* XP — desktop */}
                      <div className="hidden sm:flex sm:col-span-3 flex-col gap-1 items-end pr-1">
                        <span className={`font-mono font-extrabold text-sm ${isTop3 ? style!.xpColor : "text-[#2D6A6A]"}`}>
                          {user.xp.toLocaleString()} XP
                        </span>
                        <div className="w-full h-1 rounded-full bg-[#E8E5E0] overflow-hidden">
                          <div
                            className="h-full bg-[#E2654A]"
                            style={{ width: `${xpPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Trend */}
                      <div className="col-span-3 sm:col-span-1 flex justify-center">
                        {trendIcon(user.trend)}
                      </div>
                    </div>

                    {i < users.length - 1 && <Divider className="bg-[#E8E5E0]" />}
                  </motion.div>
                );
              })}

              {/* "You" placeholder row */}
              <Divider className="bg-[#E8E5E0]" />
              <div className="grid grid-cols-12 items-center px-5 py-3.5 gap-2 bg-[#FDF0ED]/30">
                <div className="col-span-1 flex justify-center">
                  <span className="w-7 h-7 rounded-full bg-[#FAFAF8] border border-[#E8E5E0] flex items-center justify-center font-extrabold text-xs text-[#9C9890]">?</span>
                </div>
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3 pl-1">
                  <div className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-lg bg-[#FDF0ED] border border-[#E2654A]/20 shrink-0">👤</div>
                  <div>
                    <p className="font-bold text-[#E2654A] text-sm">Tú</p>
                    <p className="text-xs text-[#9C9890]">¡Completa lecciones para aparecer aquí!</p>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center">
                  <Chip size="sm" variant="flat" classNames={{ base: "bg-[#FAFAF8] border border-[#E8E5E0]", content: "text-[#9C9890] font-bold text-xs" }}>
                    Niv. 1
                  </Chip>
                </div>
                <div className="hidden sm:flex sm:col-span-3 justify-end pr-1">
                  <span className="font-mono font-extrabold text-sm text-[#9C9890]">0 XP</span>
                </div>
                <div className="col-span-3 sm:col-span-1 flex justify-center">
                  <span className="text-[#9C9890] text-xs font-bold">—</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-xs text-[#9C9890] mt-6"
        >
          Clasificaciones actualizadas cada 24h · Gana XP completando lecciones y el Sandbox
        </motion.p>

      </div>
    </div>
  );
}
