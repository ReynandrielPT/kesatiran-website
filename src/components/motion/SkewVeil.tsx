"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DUR } from "@/lib/motion/tokens";
import { usePrefersReducedMotion } from "@/lib/motion/use-reveal";

/**
 * The skewed-rectangle veil.
 *
 * Reverse-engineered from chunk 872 on charlesleclerc.com:
 *
 *   gsap.to(rects, {
 *     clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
 *     duration: 0.15,
 *     stagger: { amount: 0.7, from: "random" },
 *   });
 *
 * The layer is 20 grids × 8 cells = 160 rectangles, the whole thing skewed
 * -10deg, and each rectangle collapses from full height to zero by animating
 * `clip-path`. Three properties do the work:
 *
 * 1. `clip-path` on a polygon rather than `height`/`scaleY` — the rectangles sit
 *    in a CSS grid, so animating layout properties would reflow 160 cells every
 *    frame. Clipping is composited.
 * 2. `from: "random"` — a swept wave is predictable and reads as a loading
 *    spinner; a stochastic dissolve reads as a designed transition.
 * 3. The parent `skew(-10deg)` — every edge is slanted. Axis-aligned wipes look
 *    like progress bars.
 *
 * Behaviour here mirrors the original's two directions:
 * - `unveil` on first mount, after a short hold.
 * - `cover` on an internal navigation, held until the route has actually
 *   changed, then `unveil`. Covering *before* the push is what stops the new
 *   page flashing for a frame.
 */

const COLS = 8;
const ROWS = 20;
const CELL_COUNT = COLS * ROWS;

const OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
/*
 * Collapse target: a 1px strip *above* the cell box, i.e. entirely outside it.
 *
 * The reference collapses to `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)`, a
 * zero-area region on the top edge. On a grid of 160 cells with `margin: -1px`
 * overlaps, that leaves a sub-pixel sliver on cells caught mid-transition, which
 * shows up as a hairline of page colour cutting through the curtain. Pushing the
 * region outside the box guarantees zero painted pixels.
 */
const COLLAPSED_TOP = "polygon(0% -1px, 100% -1px, 100% 0%, 0% 0%)";

/** Deterministic shuffle so server and client agree on the paint order. */
function shuffledOrder(count: number): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  let seed = 0x2f6e2b1;
  for (let i = order.length - 1; i > 0; i--) {
    // xorshift32 — stable across renders, unlike Math.random()
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    const j = Math.abs(seed) % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Total wall-clock length of one stagger pass, in ms. */
const PASS_MS = DUR.veilStagger * 1000 + DUR.veil * 1000;

export function SkewVeil({
  /** How long the veil stays fully closed before it starts to open. */
  holdMs = 30,
}: {
  holdMs?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = usePrefersReducedMotion();

  // `closed` = fully covering, `opening` = dissolving, `open` = out of the way.
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const [order] = useState(() => shuffledOrder(CELL_COUNT));

  const timers = useRef<number[]>([]);
  const pendingHref = useRef<string | null>(null);
  const skipNextRouteReveal = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const unveil = useCallback(
    (delay = 0) => {
      later(() => setPhase("opening"), delay);
      later(() => setPhase("open"), delay + PASS_MS + 100);
    },
    [later],
  );

  /** Per-cell delay in ms, matching `stagger: { amount: 0.7, from: "random" }`. */
  const delays = useMemo(() => {
    const perCell = (DUR.veilStagger * 1000) / Math.max(CELL_COUNT - 1, 1);
    const out = new Array<number>(CELL_COUNT).fill(0);
    order.forEach((cell, i) => {
      out[cell] = i * perCell;
    });
    return out;
  }, [order]);

  // ── first paint: reveal ───────────────────────────────────────────────────
  useEffect(() => {
    if (reduced) {
      setPhase("open");
      return;
    }
    // Honour a deep link: the visitor asked to land at an anchor, not to watch
    // a curtain.
    if (window.location.hash) {
      setPhase("open");
      return;
    }
    later(() => setPhase("opening"), holdMs);
    later(() => setPhase("open"), holdMs + PASS_MS + 100);
    return clearTimers;
    // Runs once; navigation is handled separately below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── intercept internal navigations so we can cover first ─────────────────
  useEffect(() => {
    if (reduced) return;

    const onClick = (event: MouseEvent) => {
      // Modified clicks must keep their browser meaning (new tab, download…).
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      if (event.button !== 0) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.dataset.noVeil === "true") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return; // same page — let it be a no-op / hash jump
      }

      // `preventDefault` here is what stops Next's <Link> from pushing on its
      // own; we push below once the curtain is actually on screen. We must not
      // bail on `defaultPrevented`, because by the time this bubbles out of a
      // <Link> that flag is already true.
      event.preventDefault();
      pendingHref.current = url.pathname + url.search + url.hash;
      skipNextRouteReveal.current = true;
      clearTimers();
      // Snap to fully covering with no transition, then dissolve.
      setPhase("closed");
      later(() => {
        router.push(pendingHref.current as never);
      }, 60);
      // Give the push time to commit, then uncover the new route.
      later(() => setPhase("opening"), 60 + 80);
      later(() => setPhase("open"), 60 + 80 + PASS_MS + 100);
    };

    // Capture phase: Next attaches its Link handler to the root container, so a
    // bubble-phase listener on `document` would run after it had already
    // navigated.
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, [reduced, router, clearTimers, later]);

  // ── back/forward and any navigation we did not intercept ─────────────────
  useEffect(() => {
    if (reduced) return;
    if (skipNextRouteReveal.current) {
      skipNextRouteReveal.current = false;
      return;
    }
    // Only replay if the veil is currently out of the way; otherwise an
    // intercepted push would double-fire.
    if (phase === "open") {
      clearTimers();
      setPhase("closed");
      unveil(60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => clearTimers, [clearTimers]);

  if (reduced || phase === "open") return null;

  const dissolving = phase !== "closed";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[998] overflow-hidden",
      )}
    >
      {/* The -10deg skew lives on the layer, not the cells, so the cell grid
          stays rectangular and the clip polygons remain axis-aligned. */}
      <div
        className="absolute left-[-20%] top-1/2 w-[140%] -translate-y-1/2 -skew-x-10 lg:left-[-10%] lg:w-[120%]"
        style={{ height: `${ROWS * 12}vw` }}
      >
        {Array.from({ length: ROWS }, (_, row) => (
          <div
            key={row}
            className="grid"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: COLS }, (_, col) => {
              const index = row * COLS + col;
              const delay = delays[index] ?? 0;
              return (
                <div
                  key={col}
                  className="h-[12vw] -m-px bg-[var(--veil-color)]"
                  style={{
                    clipPath: dissolving ? COLLAPSED_TOP : OPEN,
                    // The transition belongs to the state that *starts* moving.
                    // Gating it on `open` (the settled state) left the clip
                    // snapping to its collapsed value with nothing to animate.
                    transition: dissolving
                      ? `clip-path ${DUR.veil}s cubic-bezier(.215,.61,.355,1) ${delay}ms`
                      : "none",
                    willChange: "clip-path",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
