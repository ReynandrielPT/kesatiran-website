"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DUR, EASE } from "@/lib/motion/tokens";

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number; // Delay in seconds
  className?: string;
  variants?: {
    hidden: { opacity: number; y?: number };
    visible: { opacity: number; y?: number };
  };
}

const defaultVariants = {
  hidden: { opacity: 0, y: 75 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Scroll reveal used by the inner pages (team / works / games / profile).
 *
 * Kept as-is so those pages did not need to be rewritten when the motion
 * primitives landed, but its internals were corrected:
 *
 * - `amount: 0.5` required half the element to be visible, which never happens
 *   for a block taller than the viewport — those stayed at opacity 0 forever.
 *   `0.15` matches the reveal ladder used elsewhere.
 * - Reduced motion now renders straight to the visible state. framer-motion's
 *   `reducedMotion="user"` suppresses transforms but not opacity, so an element
 *   waiting on the viewport would still be invisible.
 * - Blocks whose trigger line was already crossed on mount (restored scroll
 *   position, deep link) are shown immediately rather than waiting for an
 *   intersection that never arrives.
 */
const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  delay = 0,
  className,
  variants = defaultVariants,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial={reduced ? false : "hidden"}
      animate={reduced || isInView ? "visible" : "hidden"}
      transition={{ duration: DUR.quick, delay: reduced ? 0 : delay, ease: EASE.power2 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
