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
  let borderColor = "border-[#E8E5E0]";
  let bgColor     = "bg-white";
  let textColor   = "text-[#1A1A18]";
  let emojiRing   = "bg-[#FAFAF8]";

  if (!isChecked && isSelected) {
    borderColor = "border-[#E2654A]";
    bgColor     = "bg-[#FDF0ED]";
    emojiRing   = "bg-[#FDF0ED]";
  }

  if (isChecked && isCorrect) {
    borderColor = "border-[#2D6A6A]";
    bgColor     = "bg-[#EFF6F6]";
    textColor   = "text-[#2D6A6A]";
    emojiRing   = "bg-[#EFF6F6]";
  }

  if (isChecked && isWrong) {
    borderColor = "border-[#E2654A]";
    bgColor     = "bg-[#FDF0ED]";
    textColor   = "text-[#E2654A]";
    emojiRing   = "bg-[#FDF0ED]";
  }

  return (
    <motion.button
      onClick={onSelect}
      disabled={isChecked}
      whileTap={!isChecked ? { scale: 0.95 } : undefined}
      animate={isSelected && !isChecked ? { scale: [1, 0.96, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`
        relative flex-1 min-h-[120px] flex flex-col items-center justify-center gap-3
        rounded-2xl border-2 p-5
        transition-all duration-200 cursor-pointer
        disabled:cursor-default
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2654A] focus-visible:ring-offset-2 focus-visible:ring-offset-white
        ${borderColor} ${bgColor} ${textColor}
        ${isDimmed && !isSelected ? "opacity-35" : "opacity-100"}
      `}
    >
      <motion.div
        animate={isSelected && !isChecked ? { rotate: [0, -8, 8, 0] } : {}}
        transition={{ duration: 0.3 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-colors ${emojiRing}`}
      >
        {emoji}
      </motion.div>

      <span className="font-extrabold text-xl tracking-wide">{label}</span>

      {isChecked && isCorrect && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="absolute top-3 right-3 text-[#2D6A6A] text-2xl"
        >
          ✓
        </motion.span>
      )}
      {isChecked && isWrong && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="absolute top-3 right-3 text-[#E2654A] text-2xl"
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
  const trueIsSelected  = selectedId === "true";
  const falseIsSelected = selectedId === "false";
  const anySelected     = selectedId !== null;

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-[#1A1A18] text-2xl font-bold leading-snug">{questionText}</h2>

      <div className="rounded-2xl bg-[#FDF0ED] border border-[#E2654A]/20 px-5 py-4 flex items-start gap-3">
        <span className="text-[#E2654A] text-xl mt-0.5">💡</span>
        <p className="text-[#6B6960] text-base leading-relaxed">
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
