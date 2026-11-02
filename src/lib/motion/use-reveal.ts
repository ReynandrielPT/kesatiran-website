"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reports whether the user has asked for reduced motion.
 *
 * Reads the media query on mount rather than during render so server and first
 * client paint agree. Returns `false` until measured, which means the first
 * frame always animates from the *animated* state — the safe direction: content
 * is never left hidden because a query had not resolved yet.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Has this element's trigger line already been crossed?
 *
 * ScrollTrigger is not edge-triggered on entry alone: when a page loads with the
 * scroll position restored part-way down (or a `#hash` link jumps in), every
 * trigger above the fold reports `progress: 1` and its element is shown
 * immediately. An IntersectionObserver does the opposite — an element that is
 * already scrolled past never intersects, so it would sit at opacity 0 forever.
 *
 * Call this once on mount and treat `true` as "reveal now, do not wait".
 */
export function isAboveTrigger(
  node: HTMLElement,
  /** Fraction of the viewport height used as the trigger line, e.g. `0.85`. */
  line = 0.85
): boolean {
  // Only meaningful when the document is actually scrolled. At scroll 0 every
  // block in the first viewport sits above the trigger line, and treating those
  // as "already passed" would skip the opening animation entirely.
  if (window.scrollY <= 0) return false;
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight * line;
}

/**
 * Fires once when the element first enters the viewport.
 *
 * Mirrors `ScrollTrigger.create({ start: "top 85%", once: true })`: the
 * `rootMargin` bottom inset of -15% is the "85%" line, so a block starts
 * animating when its top edge crosses the lower 15% of the viewport.
 *
 * Returns `true` immediately when IntersectionObserver is unavailable, and
 * always returns `true` for reduced-motion users so nothing depends on a
 * transition that will not run.
 */
export function useRevealOnce<T extends HTMLElement = HTMLDivElement>(
  options: { amount?: number; margin?: string } = {}
) {
  const { amount = 0.15, margin = "0px 0px -15% 0px" } = options;
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    // Already past the trigger line (restored scroll, `#hash` jump, deep link):
    // show immediately instead of waiting for an intersection that never comes.
    if (isAboveTrigger(node)) {
      setShown(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: amount, rootMargin: margin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount, margin, reduced]);

  return { ref, shown, reduced } as const;
}
