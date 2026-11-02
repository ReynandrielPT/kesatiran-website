"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * The two-layer text roll — `.ah` / `.ah2` on the reference site.
 *
 * Original CSS:
 *   .hover-up { position: relative; overflow: hidden; display: inline-block }
 *   .ah2      { position: absolute; top: 0; left: 0; transform: translateY(100%) }
 *   @media (pointer: fine) {
 *     .hover-animate:hover .ah  { transform: translateY(-105%); opacity: .7 }
 *     .hover-animate:hover .ah2 { transform: translateY(0) }
 *   }
 *
 * Three details that make it work:
 *
 * 1. The outgoing copy keeps `opacity: .7`. Without it the roll reads as a wipe;
 *    with it, it reads as the label receding in depth.
 * 2. The outgoing copy travels 105%, not 100%. The extra 5% clears the mask's
 *    own hairline so no sliver of the old glyphs is left at the top edge.
 * 3. `(pointer: fine)` — on touch there is no hover, so the duplicate layer is
 *    never rendered as a stuck second label.
 *
 * Implemented in CSS rather than JS: the original drives it from jQuery
 * `mouseenter` because it needs to also drive `.button` slabs, but a pure CSS
 * transition is composited, works before hydration, and cannot desync.
 */
export function RollText({
  children,
  className,
  /** Axis of travel. The carousel prev/next buttons use horizontal. */
  axis = "y",
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  axis?: "x" | "y";
  as?: "span" | "div";
}) {
  const from = axis === "y" ? "translateY(100%)" : "translateX(110%)";
  const out = axis === "y" ? "translateY(-105%)" : "translateX(-110%)";

  return (
    <Tag
      className={cn(
        "group/roll relative inline-block overflow-hidden align-bottom",
        className
      )}
      style={
        {
          "--roll-from": from,
          "--roll-out": out,
        } as React.CSSProperties
      }
    >
      <span className="roll-a block will-change-transform">{children}</span>
      <span aria-hidden className="roll-b block will-change-transform">
        {children}
      </span>
    </Tag>
  );
}
