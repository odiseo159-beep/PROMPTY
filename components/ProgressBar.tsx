"use client";

import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: "purple" | "amber" | "emerald" | "blue";
  animated?: boolean;
  size?: "sm" | "md" | "lg";
}

const colorGradients: Record<NonNullable<ProgressBarProps["color"]>, string> = {
  purple: "from-violet-600 to-purple-500",
  amber: "from-amber-500 to-yellow-400",
  emerald: "from-emerald-500 to-green-400",
  blue: "from-blue-600 to-cyan-400",
};

const colorGlow: Record<NonNullable<ProgressBarProps["color"]>, string> = {
  purple: "shadow-violet-500/50",
  amber: "shadow-amber-400/50",
  emerald: "shadow-emerald-500/50",
  blue: "shadow-blue-500/50",
};

const trackHeights: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  sm: "h-2",
  md: "h-3",
  lg: "h-5",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  color = "purple",
  animated = false,
  size = "md",
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percentage = Math.round((clamped / max) * 100);

  return (
    <div className="w-full space-y-1.5">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-gray-300">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-bold text-gray-200 tabular-nums">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        className={[
          "w-full rounded-full bg-gray-700/60 overflow-hidden",
          trackHeights[size],
        ].join(" ")}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={[
            "h-full rounded-full bg-gradient-to-r shadow-md",
            "transition-[width] duration-700 ease-out",
            colorGradients[color],
            colorGlow[color],
            animated ? "animate-pulse" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="h-full w-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
