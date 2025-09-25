"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number; // seconds for one loop
  pauseOnHover?: boolean;
  gradient?: boolean;
  items: string[];
}

export function Marquee({
  className,
  speed = 28,
  pauseOnHover = true,
  gradient = true,
  items,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden w-full",
        pauseOnHover && "marquee-paused",
        gradient &&
          "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
      {...props}
      style={
        {
          ["--marquee-duration" as any]: `${speed}s`,
        } as React.CSSProperties
      }
    >
      <div
        className="marquee-track gap-10 pr-10"
        style={{ animationDuration: `var(--marquee-duration)` }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i + item}
            className="text-sm tracking-wide text-[color-mix(in_srgb,var(--foreground)_70%,transparent)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
