"use client";

import { motion } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface TrueFalseComponentProps {
  questionText: string;
  /** The ID the user tapped: "true" | "false" | null */
  selectedId: string | null;
  onSelect: (id: "true" | "false") => void;
  /** Pass the correct answer once the user has checked */
  correctId?: "true" | "false";
  isChecked?: boolean;
}

// ── TF Card ────────────────────────────────────────────────────────────────────

function TFCard({
  label,
  emoji,
  isSelected,
  isCorrect,
  isWrong,
  isChecked,
  isDimmed,
  onSelect,
}: {
  label: string;
  emoji: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isChecked: boolean;
  isDimmed: boolean;
  onSelect: () => void;
}) {
  let borderColor = "border-white/10";
  let bgColor = "bg-white/5";
  let textColor = "text-white";
  let emojiRingColor = "bg-white/10";
  let glowStyle: React.CSSProperties = {};

  if (!isChecked && isSelected) {
    borderColor = "border-emerald-400";
    bgColor = "bg-emerald-500/10";
    emojiRingColor = "bg-emerald-400/20";
    glowStyle = { boxShadow: "0 0 0 3px rgba(52,211,153,0.35), 0 0 28px rgba(52,211,153,0.2)" };
  }

  if (isChecked && isCorrect) {
    borderColor = "border-emerald-400";
    bgColor = "bg-emerald-500/15";
    emojiRingColor = "bg-emerald-400/20";
    glowStyle = { boxShadow: "0 0 0 3px rgba(52,211,153,0.45), 0 0 32px rgba(52,211,153,0.25)" };
  }

  if (isChecked && isWrong) {
    borderColor = "border-red-500";
    bgColor = "bg-red-500/10";
    textColor = "text-red-300";
    emojiRingColor = "bg-red-500/20";
    glowStyle = { boxShadow: "0 0 0 3px rgba(239,68,68,0.35)" };
  }

  return (
    <motion.button
      onClick={onSelect}
      disabled={isChecked}
      whileTap={!isChecked ? { scale: 0.95 } : undefined}
      animate={isSelected && !isChecked ? { scale: [1, 0.96, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.25 }}
      style={glowStyle}
      className={`
        relative flex-1 min-h-[120px] flex flex-col items-center justify-center gap-3
        rounded-2xl border-2 p-5
        transition-all duration-200 cursor-pointer
        disabled:cursor-default
        ${borderColor} ${bgColor} ${textColor}
        ${isDimmed && !isSelected ? "opacity-35" : "opacity-100"}
      `}
    >
      <motion.div
        animate={isSelected && !isChecked ? { rotate: [0, -8, 8, 0] } : {}}
        transition={{ duration: 0.3 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-colors ${emojiRingColor}`}
      >
        {emoji}
      </motion.div>

      <span className="font-extrabold text-xl tracking-wide">{label}</span>

      {isChecked && isCorrect && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="absolute top-3 right-3 text-emerald-400 text-2xl"
        >
          ✓
        </motion.span>
      )}
      {isChecked && isWrong && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="absolute top-3 right-3 text-red-400 text-2xl"
        >
          ✗
        </motion.span>
      )}
    </motion.button>
  );
}

// ── TrueFalseComponent ─────────────────────────────────────────────────────────

export function TrueFalseComponent({
  questionText,
  selectedId,
  onSelect,
  correctId,
  isChecked = false,
}: TrueFalseComponentProps) {
  const trueIsSelected = selectedId === "true";
  const falseIsSelected = selectedId === "false";
  const anySelected = selectedId !== null;

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-white text-2xl font-bold leading-snug">{questionText}</h2>

      <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 flex items-start gap-3">
        <span className="text-yellow-400 text-xl mt-0.5">💡</span>
        <p className="text-gray-300 text-base leading-relaxed">
          Lee el enunciado y decide si es verdadero o falso.
        </p>
      </div>

      <div className="flex gap-3">
        <TFCard
          label="Verdadero"
          emoji="✅"
          isSelected={trueIsSelected}
          isCorrect={isChecked && correctId === "true"}
          isWrong={isChecked && trueIsSelected && correctId !== "true"}
          isChecked={isChecked}
          isDimmed={anySelected && !trueIsSelected}
          onSelect={() => !isChecked && onSelect("true")}
        />
        <TFCard
          label="Falso"
          emoji="❌"
          isSelected={falseIsSelected}
          isCorrect={isChecked && correctId === "false"}
          isWrong={isChecked && falseIsSelected && correctId !== "false"}
          isChecked={isChecked}
          isDimmed={anySelected && !falseIsSelected}
          onSelect={() => !isChecked && onSelect("false")}
        />
      </div>
    </div>
  );
}
