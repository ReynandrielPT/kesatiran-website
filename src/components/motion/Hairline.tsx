"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DUR, EASE, REVEAL_VIEWPORT } from "@/lib/motion/tokens";

/**
 * `data-line` / `data-line-100` from the original system.
 *
 * The original animates **width** from 0 to `auto`, not `scaleX`. That matters:
 * a 0.1rem hairline scaled from 0.01 renders as a blurry sub-pixel smear on
 * some GPUs, while a real width animation stays exactly one hairline thick. We
 * keep the width animation and use `inOut` easing, matching
 * `cubic-bezier(.645,.045,.355,1)`.
 *
 * Renders as a horizontal rule by default; pass `orientation="vertical"` for
 * the scroll-progress line used in the hero.
 */
export function Hairline({
  className,
  delay = 0,
  early = false,
  orientation = "horizontal",
  thickness = "1px",
}: {
  className?: string;
  delay?: number;
  early?: boolean;
  orientation?: "horizontal" | "vertical";
  thickness?: string;
}) {
  const vertical = orientation === "vertical";

  return (
    <motion.div
      aria-hidden
      data-motion-reveal
      className={cn("bg-current", className)}
      style={
        vertical
          ? { width: thickness, transformOrigin: "top center" }
          : { height: thickness, transformOrigin: "left center" }
      }
      initial={vertical ? { scaleY: 0 } : { width: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { width: "100%" }}
      viewport={early ? REVEAL_VIEWPORT.early : REVEAL_VIEWPORT.standard}
      transition={{ duration: DUR.reveal, delay, ease: EASE.inOut }}
    />
  );
}
