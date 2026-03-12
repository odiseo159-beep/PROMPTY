"use client";

import React from "react";
import { Button } from "./Button";
import { ProgressBar } from "./ProgressBar";

interface Badge {
  id: string;
  label: string;
  emoji: string;
  earned: boolean;
}

interface ScoreCardProps {
  score: number;
  title?: string;
  feedback?: string;
  badges?: Badge[];
  xpEarned?: number;
  timeSpent?: string;
  onRetry?: () => void;
  onNext?: () => void;
}

function getScoreColor(score: number): {
  text: string;
  ring: string;
  label: string;
  progressColor: "purple" | "amber" | "emerald" | "blue";
} {
  if (score >= 90)
    return { text: "text-[#2D6A6A]",  ring: "border-[#2D6A6A]",  label: "Excellent",    progressColor: "emerald" };
  if (score >= 75)
    return { text: "text-[#E2654A]",  ring: "border-[#E2654A]",  label: "Great",        progressColor: "purple"  };
  if (score >= 50)
    return { text: "text-amber-600",  ring: "border-amber-500",  label: "Good",         progressColor: "amber"   };
  return   { text: "text-[#E2654A]",  ring: "border-[#E2654A]",  label: "Keep Trying",  progressColor: "purple"  };
}

export function ScoreCard({
  score,
  title = "Prompt Evaluation Result",
  feedback,
  badges = [],
  xpEarned,
  timeSpent,
  onRetry,
  onNext,
}: ScoreCardProps) {
  const clamped = Math.min(Math.max(score, 0), 100);
  const colors = getScoreColor(clamped);

  return (
    <div className="relative w-full max-w-lg mx-auto bg-white border border-[#E8E5E0] rounded-2xl shadow-sm p-6 sm:p-8 overflow-hidden">

      {/* Title */}
      <h2 className="text-lg font-bold text-[#1A1A18] text-center mb-6 tracking-wide">
        {title}
      </h2>

      {/* Score Circle */}
      <div className="flex flex-col items-center mb-6">
        <div
          className={[
            "w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center",
            "shadow-sm bg-[#FAFAF8]",
            colors.ring,
          ].join(" ")}
        >
          <span className={["text-4xl font-extrabold tabular-nums", colors.text].join(" ")}>
            {clamped}
          </span>
          <span className="text-xs text-[#9C9890] font-medium mt-0.5">/ 100</span>
        </div>
        <span className={["mt-2 text-sm font-semibold", colors.text].join(" ")}>
          {colors.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <ProgressBar
          value={clamped}
          max={100}
          color={colors.progressColor}
          size="md"
          animated={clamped >= 75}
        />
      </div>

      {/* Stats Row */}
      {(xpEarned !== undefined || timeSpent) && (
        <div className="flex items-center justify-center gap-6 mb-6">
          {xpEarned !== undefined && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              <span className="text-base">⚡</span>
              <span className="text-amber-700 font-bold text-sm">+{xpEarned} XP</span>
            </div>
          )}
          {timeSpent && (
            <div className="flex items-center gap-1.5 bg-[#FAFAF8] border border-[#E8E5E0] rounded-lg px-3 py-1.5">
              <span className="text-base">⏱</span>
              <span className="text-[#6B6960] font-medium text-sm">{timeSpent}</span>
            </div>
          )}
        </div>
      )}

      {/* Feedback Box */}
      {feedback && (
        <div className="mb-6 bg-[#FAFAF8] border border-[#E8E5E0] rounded-xl p-4">
          <p className="text-sm text-[#6B6960] leading-relaxed">{feedback}</p>
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-[#9C9890] uppercase tracking-widest mb-3">
            Badges
          </p>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={[
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border transition-all",
                  badge.earned
                    ? "bg-[#FDF0ED] border-[#E2654A]/40 text-[#E2654A]"
                    : "bg-[#FAFAF8] border-[#E8E5E0] text-[#9C9890] opacity-50 grayscale",
                ].join(" ")}
                title={badge.earned ? "Earned!" : "Not yet earned"}
              >
                <span>{badge.emoji}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {(onRetry || onNext) && (
        <div className="flex items-center gap-3 pt-2">
          {onRetry && (
            <Button variant="outline" size="md" onClick={onRetry} className="flex-1">
              Try Again
            </Button>
          )}
          {onNext && (
            <Button variant="primary" size="md" onClick={onNext} className="flex-1">
              Next Lesson
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ScoreCard;
