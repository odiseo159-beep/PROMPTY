"use client";

import React from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[#E2654A] hover:bg-[#C9553D] text-white border border-transparent",
  secondary:
    "bg-[#FAFAF8] border-2 border-[#E8E5E0] text-[#1A1A18] hover:border-[#E2654A] hover:text-[#E2654A]",
  outline:
    "bg-transparent border-2 border-[#E8E5E0] text-[#6B6960] hover:border-[#E2654A] hover:text-[#E2654A]",
  ghost:
    "bg-transparent text-[#6B6960] hover:bg-[#FAFAF8] hover:text-[#1A1A18]",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-xl font-semibold",
        "transition-all duration-150 ease-out",
        "active:scale-[0.98]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E2654A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        "cursor-pointer select-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

export default Button;
