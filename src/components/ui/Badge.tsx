"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "solid" | "outline" | "soft" | "accent";
  size?: "xs" | "sm" | "md";
  rounded?: boolean;
}

export function Badge({
  className,
  children,
  variant = "soft",
  size = "sm",
  rounded = true,
  ...props
}: BadgeProps) {
  const sizeMap = {
    xs: "text-[10px] px-2 py-0.5",
    sm: "text-[11px] px-2.5 py-0.5",
    md: "text-xs px-3 py-1",
  };
  const variantMap = {
    soft: "bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]",
    solid: "bg-[var(--accent)] text-white",
    outline:
      "border border-[color-mix(in_srgb,var(--accent)_55%,transparent)] text-[var(--accent)]",
    accent:
      "bg-[linear-gradient(120deg,#6366f1,#8b5cf6,#ec4899,#f59e0b)] text-white",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium tracking-wide select-none",
        sizeMap[size],
        variantMap[variant],
        rounded ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
