"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RollText } from "./motion/RollText";
const links = [
  ["The circle", "/team"],
  ["Selected works", "/works"],
  ["After hours", "/games"],
];
export function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLAnchorElement>("a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes = [
          button.current,
          ...Array.from(
            panel.current?.querySelectorAll<HTMLAnchorElement>("a") || [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const i = nodes.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey
          ? (i - 1 + nodes.length) % nodes.length
          : (i + 1) % nodes.length;
        e.preventDefault();
        nodes[next]?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <>
      <header className={`editorial-nav ${open ? "menu-is-open" : ""}`}>
        <Link
          href="/"
          className="wordmark"
          onClick={() => setOpen(false)}
          aria-label="Kesatiran home"
        >
          K<span>ESATIRAN</span>
          <sup>®</sup>
        </Link>
        <span className="nav-note">Independent minds. Shared playground.</span>
        <button
          ref={button}
          aria-expanded={open}
          aria-controls="chapter-menu"
          className="menu-toggle"
          onClick={() => setOpen(!open)}
        >
          <RollText>{open ? "Close" : "Chapters"}</RollText>
          <span aria-hidden>{open ? "−" : "+"}</span>
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id="chapter-menu"
            className="chapter-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Chapters"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{
              duration: reduced ? 0 : 0.55,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <p className="eyebrow">Explore our world</p>
            <nav>
              {[["Home", "/"], ...links].map(([label, href], i) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={path === href ? "page" : undefined}
                  onClick={() => {
                    setOpen(false);
                    button.current?.focus();
                  }}
                >
                  <span className="menu-index">0{i + 1}</span>
                  <RollText>{label}</RollText>
                  <span className="menu-arrow">↗</span>
                </Link>
              ))}
            </nav>
            <div className="menu-bottom">
              <span>A small circle from Indonesia.</span>
              <a href="https://github.com/kesatiran">Github ↗</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
