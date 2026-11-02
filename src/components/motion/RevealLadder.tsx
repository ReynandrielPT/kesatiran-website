"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion/use-reveal";

/**
 * Adds `.is-revealed` to a block once it crosses the 85% viewport line, which
 * lets the CSS ladder in `globals.css` do the animating.
 *
 * Why have both this and `<Reveal>`: framer-motion is right when a component
 * already needs to animate per-element (individual delays, layout changes,
 * gesture state). It is wasteful when the same eight transitions are applied to
 * forty static rows — that is forty observers and forty variant trees. The
 * original site drew the same line, using `toggleClass: "tp-st-active"` for
 * content blocks and GSAP tweens only where values had to be computed.
 *
 * Timing note: the observer is disconnected after the first reveal. The original
 * uses `once: true` for desktop and re-arms only in a mobile portrait branch;
 * we keep the simpler once-only behaviour and document it rather than silently
 * matching a branch nobody can see.
 */
export function RevealLadder({
  children,
  className,
  as: Tag = "div",
  threshold = 0.15,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "ul";
  threshold?: number;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced || typeof IntersectionObserver === "undefined") {
      node.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -15% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, threshold]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal
      className={cn(className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
