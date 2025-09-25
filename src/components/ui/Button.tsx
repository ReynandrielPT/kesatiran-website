"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "solid"
    | "outline"
    | "ghost"
    | "subtle"
    | "gradient"
    | "destructive";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  pill?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      pill = true,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative font-medium inline-flex items-center justify-center gap-2 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)] disabled:opacity-55 disabled:cursor-not-allowed active:scale-[.97] transition-all duration-200";

    const sizeStyles: Record<string, string> = {
      xs: "h-7 px-3 text-[11px]",
      sm: "h-8 px-4 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-7 text-base",
      xl: "h-14 px-9 text-lg",
    };

    const variantStyles: Record<string, string> = {
      solid:
        "bg-[var(--accent)] text-white shadow-sm hover:shadow-md hover:brightness-[1.05]",
      outline:
        "border border-[color-mix(in_srgb,var(--accent)_60%,transparent)] text-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]",
      ghost:
        "text-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_15%,transparent)]/40",
      subtle:
        "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_18%,transparent)]",
      gradient:
        "text-white bg-[linear-gradient(120deg,#6366f1,#8b5cf6,#ec4899,#f59e0b)] bg-[length:180%_180%] animate-[gradientShift_8s_ease_infinite] shadow-md hover:shadow-lg",
      destructive:
        "bg-red-500/90 text-white hover:bg-red-500 focus-visible:ring-red-500",
    };

    const radius = pill ? "rounded-full" : "rounded-lg";

    const width = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          radius,
          width,
          isLoading && "cursor-wait",
          className
        )}
        disabled={disabled || isLoading}
        style={{ "--accent": "var(--accent)" } as React.CSSProperties}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
