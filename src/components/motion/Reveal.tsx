"use client";

import React from "react";
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { DUR, EASE, REVEAL_VIEWPORT } from "@/lib/motion/tokens";
import { isAboveTrigger } from "@/lib/motion/use-reveal";

/**
 * The reveal vocabulary, ported from the `data-*` attribute system on
 * charlesleclerc.com (see `docs/motion-reverse-engineering.md` §2).
 *
 * Each direction keeps the original travel distance and easing so a page built
 * from these primitives inherits the same rhythm rather than an approximation
 * of it. The one change: the original staggered *sibling elements* via
 * `ScrollTrigger.batch`; here each element reveals on its own. Use `<RevealGroup>`
 * when you want the batched stagger back.
 *
 * Reduced motion is handled by rendering with `initial={false}` rather than by
 * shortening durations. framer-motion's `reducedMotion="user"` setting only
 * suppresses transform and layout animations — opacity still fades, and an
 * element waiting on a viewport observer still sits at opacity 0. Rendering
 * straight to the visible state is the only version that cannot leave content
 * hidden.
 */
export type RevealDirection =
  | "up"
  | "up-sm"
  | "left"
  | "right"
  | "fade"
  | "scale";

const offsets: Record<RevealDirection, { x?: number; y?: number; scale?: number }> = {
  up: { y: 40 },
  "up-sm": { y: 10 },
  left: { x: -40, y: 40 },
  right: { x: 40, y: 40 },
  fade: {},
  scale: { scale: 0.85 },
};

function hiddenState(direction: RevealDirection) {
  const offset = offsets[direction];
  return {
    opacity: 0,
    ...(offset.x !== undefined ? { x: offset.x } : null),
    ...(offset.y !== undefined ? { y: offset.y } : null),
    ...(offset.scale !== undefined ? { scale: offset.scale } : null),
  };
}

function visibleState(direction: RevealDirection) {
  const offset = offsets[direction];
  return {
    opacity: 1,
    ...(offset.x !== undefined ? { x: 0 } : null),
    ...(offset.y !== undefined ? { y: 0 } : null),
    ...(offset.scale !== undefined ? { scale: 1 } : null),
  };
}

export interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  direction?: RevealDirection;
  /** Seconds. */
  delay?: number;
  /** Seconds. */
  duration?: number;
  /** `start: "top 100%"` instead of `"top 85%"`. */
  early?: boolean;
  as?: "div" | "section" | "article" | "li" | "span" | "p" | "h2" | "h3";
  children: React.ReactNode;
}

/**
 * `true` once we know the element's trigger line was already crossed on mount.
 *
 * ScrollTrigger shows such blocks immediately (they are above the viewport, so
 * `progress` is already 1). `whileInView` never fires for them, which would
 * leave content permanently invisible after a restored scroll position or a
 * deep link. Rendering with `initial={false}` reveals them without animating
 * something the visitor is already looking at.
 */
function usePassedTrigger(early: boolean) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [passed, setPassed] = React.useState(false);

  // `useLayoutEffect` so the decision lands before the first paint: the block is
  // already on screen, and a frame at opacity 0 would read as a flicker.
  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (isAboveTrigger(node, early ? 1 : 0.85)) setPassed(true);
  }, [early]);

  return { ref, passed } as const;
}

/**
 * Lets `<RevealItem>` know its group was already on screen at load, so it snaps
 * in with its siblings instead of staggering in one by one.
 */
const PassedTriggerContext = React.createContext(false);

export function Reveal({
  direction = "up",
  delay = 0,
  duration = DUR.reveal,
  early = false,
  as = "div",
  className,
  children,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  const { ref, passed } = usePassedTrigger(early);

  const variants: Variants = {
    hidden: hiddenState(direction),
    visible: {
      ...visibleState(direction),
      // Already on screen when the page loaded: show it, don't animate it.
      transition: { duration: passed ? 0 : duration, delay: passed ? 0 : delay, ease: EASE.power2 },
    },
  };

  return (
    <MotionTag
      ref={ref}
      data-motion-reveal
      className={cn(className)}
      variants={variants}
      initial={reduced ? false : "hidden"}
      animate={passed ? "visible" : undefined}
      whileInView="visible"
      viewport={early ? REVEAL_VIEWPORT.early : REVEAL_VIEWPORT.standard}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Batched stagger container — the `stagger: 0.15` from the original system.
 *
 * Children must be `<RevealItem>` (or any motion element that inherits
 * variants). Keeping the stagger on the parent means one IntersectionObserver
 * per block instead of one per child, which is how the original behaved too.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.15,
  delayChildren = 0,
  early = false,
  as = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  early?: boolean;
  as?: "div" | "section" | "article" | "ul";
} & Omit<HTMLMotionProps<"div">, "children">) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  const { ref, passed } = usePassedTrigger(early);

  return (
    <MotionTag
      ref={ref}
      data-motion-reveal
      className={cn(className)}
      initial={reduced ? false : "hidden"}
      animate={passed ? "visible" : undefined}
      whileInView="visible"
      viewport={early ? REVEAL_VIEWPORT.early : REVEAL_VIEWPORT.standard}
      variants={{
        hidden: {},
        visible: {
          transition: passed
            ? { staggerChildren: 0, delayChildren: 0 }
            : { staggerChildren: stagger, delayChildren },
        },
      }}
      {...props}
    >
      <PassedTriggerContext.Provider value={passed}>{children}</PassedTriggerContext.Provider>
    </MotionTag>
  );
}

/** A child of `<RevealGroup>`. Inherits timing from the parent. */
export function RevealItem({
  children,
  className,
  direction = "up",
  as = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  direction?: RevealDirection;
  as?: "div" | "li" | "article" | "span";
} & Omit<HTMLMotionProps<"div">, "children">) {
  const MotionTag = motion[as] as typeof motion.div;
  const passed = React.useContext(PassedTriggerContext);

  return (
    <MotionTag
      data-motion-reveal
      className={cn(className)}
      variants={{
        hidden: hiddenState(direction),
        visible: {
          ...visibleState(direction),
          transition: { duration: passed ? 0 : DUR.reveal, ease: EASE.power2 },
        },
      }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
