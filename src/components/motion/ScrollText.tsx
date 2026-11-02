"use client";

import { usePrefersReducedMotion } from "@/lib/motion/use-reveal";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const opacity = useTransform(
    progress,
    [start, Math.min(1, start + 1.5 / total)],
    [0.2, 1],
  );
  const y = useTransform(
    progress,
    [start, Math.min(1, start + 1.5 / total)],
    [12, 0],
  );
  return (
    <motion.span style={{ opacity, y }} className="scroll-word">
      {word}{" "}
    </motion.span>
  );
}

/** Scrub the reading emphasis with native scroll; reversing scroll reverses it. */
export function ScrollText({
  text,
  className = "",
  as = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h2";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 45%"],
  });
  const words = text.split(/\s+/);
  const Tag = as;
  return (
    <div ref={ref} className={className}>
      <Tag>
        {reduced ? (
          text
        ) : (
          <>
            <span className="sr-only">{text}</span>
            <span aria-hidden>
              {words.map((word, i) => (
                <Word
                  key={i}
                  word={word}
                  index={i}
                  total={words.length}
                  progress={scrollYProgress}
                />
              ))}
            </span>
          </>
        )}
      </Tag>
    </div>
  );
}
