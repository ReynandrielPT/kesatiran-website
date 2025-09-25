"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "solid" | "ghost" | "outline" | "glass";
}

export function Card({
  className,
  children,
  interactive = true,
  padding = "md",
  variant = "glass",
  ...props
}: CardProps) {
  const paddingMap = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  const variantMap = {
    glass: "glass-panel",
    solid: "bg-secondary border border-border",
    ghost: "bg-transparent",
    outline: "bg-transparent border border-border",
  };

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden",
        variantMap[variant],
        paddingMap[padding],
        interactive && "card-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
