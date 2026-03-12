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
  let borderColor = "border-[#E8E5E0]";
  let bgColor     = "bg-white";
  let textColor   = "text-[#1A1A18]";
  let labelBg     = "bg-[#FAFAF8] text-[#6B6960]";

  if (!isChecked && isSelected) {
    borderColor = "border-[#E2654A]";
    bgColor     = "bg-[#FDF0ED]";
    labelBg     = "bg-[#FDF0ED] text-[#E2654A]";
  }

  if (isChecked && isCorrect) {
    borderColor = "border-[#2D6A6A]";
    bgColor     = "bg-[#EFF6F6]";
    textColor   = "text-[#2D6A6A]";
    labelBg     = "bg-[#EFF6F6] text-[#2D6A6A]";
  }

  if (isChecked && isWrong) {
    borderColor = "border-[#E2654A]/60";
    bgColor     = "bg-[#FDF0ED]/50";
    textColor   = "text-[#E2654A]";
    labelBg     = "bg-[#FDF0ED] text-[#E2654A]";
  }

  return (
    <motion.button
      onClick={onSelect}
      disabled={isChecked}
      whileTap={!isChecked ? { scale: 0.96 } : undefined}
      animate={isSelected && !isChecked ? { scale: [1, 0.97, 1.01, 1] } : { scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`
        relative w-full min-h-[80px] flex items-center gap-4 px-4 py-4
        rounded-2xl border-2 text-left
        transition-all duration-200 cursor-pointer
        disabled:cursor-default
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2654A] focus-visible:ring-offset-2 focus-visible:ring-offset-white
        ${borderColor} ${bgColor} ${textColor}
        ${isDimmed && !isSelected ? "opacity-40" : "opacity-100"}
      `}
    >
      {/* Letter/icon badge */}
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
        <span className="shrink-0 text-[#2D6A6A] text-xl">✓</span>
      )}
      {isChecked && isWrong && (
        <span className="shrink-0 text-[#E2654A] text-xl">✗</span>
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
      <h2 className="text-[#1A1A18] text-2xl font-bold leading-snug">{questionText}</h2>

      {/* Options — stacked on mobile, 2-col grid on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect  = isChecked && correctId === option.id;
          const isWrong    = isChecked && isSelected && correctId !== option.id;
          const isDimmed   = selectedId !== null && !isSelected;

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
