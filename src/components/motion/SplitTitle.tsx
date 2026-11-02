"use client";
import { usePrefersReducedMotion } from "@/lib/motion/use-reveal";

import React, { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { DUR, EASE } from "@/lib/motion/tokens";

/**
 * Character-split title reveal, ported from `L4.reveal()` on the reference site.
 *
 * Original (chunk 207):
 *   fromTo(chars, { yPercent: 110, scale: 0.85 },
 *                 { yPercent: 0, scale: 1, duration: 1.8, ease: "power3.inOut",
 *                   stagger: { from: "left", amount: 0.3 } })
 *
 * Two things are load-bearing and easy to lose:
 *
 * 1. `scale: 0.85 → 1` runs *with* the vertical travel. Dropping the scale turns
 *    a cinematic title into a plain slide-up.
 * 2. The mask is per-word, not per-character. A per-character mask lets letters
 *    with descenders (g, y, p) clip against their own neighbours. The original
 *    splits words with `wordsClass: "word"` and puts `overflow-hidden` on the
 *    word, then staggers the chars inside. We do the same.
 *
 * Accessibility: the full string is rendered once for assistive tech and the
 * animated characters are `aria-hidden`, so screen readers announce the title
 * instead of spelling it out letter by letter.
 */
export function SplitTitle({
  text,
  as: Tag = "h1",
  className,
  wordClassName,
  charClassName,
  delay = 0,
  stagger = 0.12,
  once = true,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  wordClassName?: string;
  charClassName?: string;
  delay?: number;
  /** Total stagger budget spread across all characters. */
  stagger?: number;
  once?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const words = useMemo(() => text.split(/(\s+)/).filter(Boolean), [text]);
  const totalChars = useMemo(() => text.replace(/\s/g, "").length || 1, [text]);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { delayChildren: delay, staggerChildren: 0 },
    },
  };

  // Spread the stagger budget across characters left-to-right.
  const perChar = stagger / totalChars;

  let charIndex = 0;

  return (
    <Tag className={cn("relative", className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        data-motion-reveal
        className="inline-block"
        variants={container}
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once, amount: 0.2 }}
      >
        {words.map((word, wi) => {
          if (/^\s+$/.test(word)) {
            return (
              <span key={`space-${wi}`} className="inline-block whitespace-pre">
                {" "}
              </span>
            );
          }
          return (
            <span
              key={`word-${wi}`}
              className={cn(
                // The mask. Padding/negative margin gives descenders room to
                // breathe without opening a visible gap between lines.
                "inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom",
                wordClassName,
              )}
            >
              {Array.from(word).map((char) => {
                const thisIndex = charIndex++;
                return (
                  <motion.span
                    key={`${char}-${thisIndex}`}
                    className={cn(
                      "inline-block will-change-transform",
                      charClassName,
                    )}
                    variants={{
                      hidden: { y: "110%", scale: 0.85, opacity: 0.001 },
                      visible: {
                        y: "0%",
                        scale: 1,
                        opacity: 1,
                        transition: {
                          duration: DUR.hero,
                          ease: EASE.power3,
                          delay: thisIndex * perChar,
                        },
                      },
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
