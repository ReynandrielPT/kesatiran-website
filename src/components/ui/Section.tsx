import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  width?: "default" | "wide" | "full";
  bleed?: boolean;
}

export function Section({
  className,
  children,
  width = "default",
  bleed = false,
  ...props
}: SectionProps) {
  const widthMap = {
    default: "max-w-6xl",
    wide: "max-w-7xl",
    full: "max-w-[2000px]",
  };
  return (
    <section
      className={cn(
        bleed ? "w-full" : "px-6",
        "mx-auto",
        widthMap[width],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
