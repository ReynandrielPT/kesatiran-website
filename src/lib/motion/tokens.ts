/**
 * Motion tokens derived from the reverse-engineering pass documented in
 * `docs/motion-reverse-engineering.md`.
 *
 * Easings come from the reference; durations are shortened for this site.
 * Keep the CSS motion durations in globals.css aligned with these tokens.
 */

/** Cubic-bezier control points, as framer-motion expects them. */
export const EASE = {
  /** `cubic-bezier(.215,.61,.355,1)` — ease-out-cubic. Reveals, card lifts. */
  out: [0.215, 0.61, 0.355, 1] as const,
  /** `cubic-bezier(.645,.045,.355,1)` — ease-in-out-cubic. Hairline growth. */
  inOut: [0.645, 0.045, 0.355, 1] as const,
  /** `cubic-bezier(0,0,.2,1)` — material standard. Hover rolls. */
  material: [0, 0, 0.2, 1] as const,
  /** GSAP `power2.out`. */
  power2: [0.25, 0.46, 0.45, 0.94] as const,
  /** GSAP `power3.inOut`. Title masks, veil. */
  power3: [0.215, 0.61, 0.355, 1] as const,
  /** GSAP `power4.inOut`. Only for the hero title settle. */
  power4: [0.77, 0, 0.175, 1] as const,
} as const;

/** Durations in seconds. */
export const DUR = {
  /** Veil rectangle collapse. */
  veil: 0.1,
  /** Total veil stagger budget (the `amount`, not per-element). */
  veilStagger: 0.22,
  /** Hover roll. */
  roll: 0.25,
  /** Hairline / small reveal. */
  quick: 0.3,
  /** Standard scroll reveal. */
  reveal: 0.45,
  /** Column cascade. */
  column: 0.55,
  /** Hero title characters. */
  hero: 0.65,
} as const;

/**
 * The vertical travel ladder.
 *
 * The original grows distance *and* delay as you go down the reading order
 * (title → media → paragraph). That ordering is what reads as a cascade; using
 * one shared distance flattens it into a single fade.
 */
export const REVEAL_LADDER = {
  title: { y: 50, delay: 0 },
  media: { y: 100, delay: 0.1 },
  paragraph: { y: 150, delay: 0.2 },
} as const;

/** Shared ScrollTrigger-style stagger across every reveal variant. */
export const REVEAL_STAGGER = 0.07;

/** Where a block must sit in the viewport before it plays. */
export const REVEAL_VIEWPORT = {
  /** `start: "top 85%"` */
  standard: { once: true, amount: 0.15, margin: "0px 0px -15% 0px" },
  /** `start: "top 100%"` — fires as soon as the top edge enters. */
  early: { once: true, amount: 0, margin: "0px 0px -1% 0px" },
} as const;
