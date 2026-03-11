"use client";

import { motion } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface QuizOption {
  id: string;
  text: string;
  /** Optional emoji/icon shown to the left of the text */
  icon?: string;
}

export interface QuizComponentProps {
  questionText: string;
  options: QuizOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** When true, correct/incorrect styling is locked (post-check state) */
  correctId?: string;
  isChecked?: boolean;
}

// ── Option Card ────────────────────────────────────────────────────────────────

function OptionCard({
  option,
  isSelected,
  isCorrect,
  isWrong,
  isChecked,
  isDimmed,
  onSelect,
}: {
  option: QuizOption;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isChecked: boolean;
  isDimmed: boolean;
  onSelect: () => void;
}) {
  // Border & background resolve
  let borderColor = "border-white/10";
  let bgColor = "bg-white/5";
  let textColor = "text-white";
  let glowStyle: React.CSSProperties = {};
  let labelBg = "bg-white/10 text-gray-400";

  if (!isChecked && isSelected) {
    borderColor = "border-emerald-400";
    bgColor = "bg-emerald-500/10";
    glowStyle = { boxShadow: "0 0 0 3px rgba(52,211,153,0.35), 0 0 20px rgba(52,211,153,0.2)" };
    labelBg = "bg-emerald-400/20 text-emerald-300";
  }

  if (isChecked && isCorrect) {
    borderColor = "border-emerald-400";
    bgColor = "bg-emerald-500/15";
    glowStyle = { boxShadow: "0 0 0 3px rgba(52,211,153,0.4), 0 0 24px rgba(52,211,153,0.25)" };
    labelBg = "bg-emerald-400/20 text-emerald-300";
  }

  if (isChecked && isWrong) {
    borderColor = "border-red-500";
    bgColor = "bg-red-500/10";
    glowStyle = { boxShadow: "0 0 0 3px rgba(239,68,68,0.35)" };
    textColor = "text-red-300";
    labelBg = "bg-red-500/20 text-red-400";
  }

  return (
    <motion.button
      onClick={onSelect}
      disabled={isChecked}
      whileTap={!isChecked ? { scale: 0.96 } : undefined}
      animate={isSelected && !isChecked ? { scale: [1, 0.97, 1.01, 1] } : { scale: 1 }}
      transition={{ duration: 0.25 }}
      style={glowStyle}
      className={`
        relative w-full min-h-[80px] flex items-center gap-4 px-4 py-4
        rounded-2xl border-2 text-left
        transition-all duration-200 cursor-pointer
        disabled:cursor-default
        ${borderColor} ${bgColor} ${textColor}
        ${isDimmed && !isSelected ? "opacity-40" : "opacity-100"}
      `}
    >
      {/* Letter badge */}
      <span
        className={`
          shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
          font-bold text-sm transition-colors duration-200
          ${labelBg}
        `}
      >
        {option.icon ?? ""}
      </span>

      {/* Text */}
      <span className="font-semibold text-base leading-snug flex-1">{option.text}</span>

      {/* Check / X icon when checked */}
      {isChecked && isCorrect && (
        <span className="shrink-0 text-emerald-400 text-xl">✓</span>
      )}
      {isChecked && isWrong && (
        <span className="shrink-0 text-red-400 text-xl">✗</span>
      )}
    </motion.button>
  );
}

// ── QuizComponent ──────────────────────────────────────────────────────────────

export function QuizComponent({
  questionText,
  options,
  selectedId,
  onSelect,
  correctId,
  isChecked = false,
}: QuizComponentProps) {
  return (
    <div className="w-full flex flex-col gap-5">
      {/* Question */}
      <h2 className="text-white text-2xl font-bold leading-snug">{questionText}</h2>

      {/* Options — stacked on mobile, 2-col grid on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect = isChecked && correctId === option.id;
          const isWrong = isChecked && isSelected && correctId !== option.id;
          const isDimmed = selectedId !== null && !isSelected;

          return (
            <OptionCard
              key={option.id}
              option={option}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isWrong={isWrong}
              isChecked={isChecked}
              isDimmed={isDimmed}
              onSelect={() => !isChecked && onSelect(option.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
