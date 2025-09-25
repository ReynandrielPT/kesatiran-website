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
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon";
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
      pill = false,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative font-medium inline-flex items-center justify-center gap-2 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent disabled:opacity-55 disabled:cursor-not-allowed active:scale-[.97] transition-all duration-200";

    const sizeStyles: Record<string, string> = {
      xs: "h-7 px-3 text-[11px]",
      sm: "h-8 px-4 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-7 text-base",
      xl: "h-14 px-9 text-lg",
      icon: "h-9 w-9 text-sm",
    };

    const variantStyles: Record<string, string> = {
      solid: "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90",
      outline:
        "border border-border bg-transparent hover:bg-tertiary hover:text-foreground",
      ghost: "bg-transparent hover:bg-tertiary hover:text-foreground",
      subtle: "bg-tertiary text-foreground hover:bg-secondary",
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
