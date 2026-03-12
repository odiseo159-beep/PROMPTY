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

const colorClasses: Record<NonNullable<ProgressBarProps["color"]>, string> = {
  purple:  "bg-[#E2654A]",
  amber:   "bg-amber-500",
  emerald: "bg-[#2D6A6A]",
  blue:    "bg-sky-600",
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
            <span className="text-sm font-medium text-[#6B6960]">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-bold text-[#1A1A18] tabular-nums">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        className={[
          "w-full rounded-full bg-[#E8E5E0] overflow-hidden",
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
            "h-full rounded-full",
            "transition-[width] duration-700 ease-out",
            colorClasses[color],
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
