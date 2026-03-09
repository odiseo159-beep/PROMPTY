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
  glow: string;
  label: string;
  progressColor: "purple" | "amber" | "emerald" | "blue";
} {
  if (score >= 90)
    return {
      text: "text-emerald-400",
      ring: "border-emerald-500",
      glow: "shadow-emerald-500/40",
      label: "Excellent",
      progressColor: "emerald",
    };
  if (score >= 75)
    return {
      text: "text-violet-400",
      ring: "border-violet-500",
      glow: "shadow-violet-500/40",
      label: "Great",
      progressColor: "purple",
    };
  if (score >= 50)
    return {
      text: "text-amber-400",
      ring: "border-amber-500",
      glow: "shadow-amber-500/40",
      label: "Good",
      progressColor: "amber",
    };
  return {
    text: "text-red-400",
    ring: "border-red-500",
    glow: "shadow-red-500/40",
    label: "Keep Trying",
    progressColor: "amber",
  };
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
    <div
      className={[
        "relative w-full max-w-lg mx-auto",
        "bg-[#1a1a2e] border border-gray-700/60 rounded-2xl",
        "shadow-2xl",
        "p-6 sm:p-8",
        "overflow-hidden",
      ].join(" ")}
    >
      {/* Ambient glow background */}
      <div
        className={[
          "absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20",
          clamped >= 90
            ? "bg-emerald-500"
            : clamped >= 75
            ? "bg-violet-600"
            : clamped >= 50
            ? "bg-amber-500"
            : "bg-red-500",
        ].join(" ")}
      />

      {/* Title */}
      <h2 className="relative text-lg font-bold text-gray-100 text-center mb-6 tracking-wide">
        {title}
      </h2>

      {/* Score Circle */}
      <div className="relative flex flex-col items-center mb-6">
        <div
          className={[
            "w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center",
            "shadow-xl",
            colors.ring,
            colors.glow,
            "bg-gray-800/80",
          ].join(" ")}
        >
          <span className={["text-4xl font-extrabold tabular-nums", colors.text].join(" ")}>
            {clamped}
          </span>
          <span className="text-xs text-gray-400 font-medium mt-0.5">/ 100</span>
        </div>
        <span className={["mt-2 text-sm font-semibold", colors.text].join(" ")}>
          {colors.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-6">
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
        <div className="relative flex items-center justify-center gap-6 mb-6">
          {xpEarned !== undefined && (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5">
              <span className="text-base">⚡</span>
              <span className="text-amber-400 font-bold text-sm">
                +{xpEarned} XP
              </span>
            </div>
          )}
          {timeSpent && (
            <div className="flex items-center gap-1.5 bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-1.5">
              <span className="text-base">⏱</span>
              <span className="text-gray-300 font-medium text-sm">{timeSpent}</span>
            </div>
          )}
        </div>
      )}

      {/* Feedback Box */}
      {feedback && (
        <div className="relative mb-6 bg-gray-800/60 border border-gray-600/40 rounded-xl p-4">
          <p className="text-sm text-gray-300 leading-relaxed">{feedback}</p>
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div className="relative mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Badges
          </p>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={[
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium border transition-all",
                  badge.earned
                    ? "bg-violet-600/20 border-violet-500/40 text-violet-200"
                    : "bg-gray-800/40 border-gray-700/40 text-gray-500 opacity-50 grayscale",
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
        <div className="relative flex items-center gap-3 pt-2">
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
