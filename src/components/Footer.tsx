"use client";

import React from "react";
import Link from "next/link";
import { Github, Instagram, Twitter, Heart, Mail } from "lucide-react";

// Minimal social list (kept casual)
const socials = [
  {
    id: "github",
    href: "https://github.com/kesatiran",
    icon: Github,
    label: "github",
  },
  {
    id: "twitter",
    href: "https://twitter.com/kesatiran",
    icon: Twitter,
    label: "twitter",
  },
  {
    id: "instagram",
    href: "https://instagram.com/kesatiran",
    icon: Instagram,
    label: "instagram",
  },
  {
    id: "mail",
    href: "mailto:hello@kesatiran.com",
    icon: Mail,
    label: "email",
  },
];

const siteLinks = [
  { href: "/team", label: "team" },
  { href: "/works", label: "works" },
  { href: "/games", label: "games" },
  { href: "/profile/john-doe", label: "random profile" },
];

export function Footer() {
  return (
    <footer className="mt-20 relative">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_30%_40%,var(--accent)_0%,transparent_60%)]" />
      <div className="border-t border-border/60 backdrop-blur-sm bg-background/70">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-start gap-12">
            <div className="flex-1 space-y-4">
              <Link
                href="/"
                className="text-2xl font-semibold tracking-tight lowercase hover:text-accent transition-colors"
              >
                kesatiran
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                just a small circle making stuff & sometimes finishing it. no
                hype deck.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium hover:bg-accent hover:text-accent-foreground transition focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <s.icon className="w-3.5 h-3.5" /> {s.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 md:w-[360px]">
              <div className="space-y-3">
                <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  links
                </h4>
                <ul className="space-y-1.5 text-sm">
                  {siteLinks.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-muted-foreground hover:text-foreground transition-colors lowercase"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  tiny note
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  if something looks broken we were probably refactoring at 2am.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} kesatiran • a cozy internet corner
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              made with{" "}
              <Heart className="w-3 h-3 text-red-500" fill="currentColor" /> &
              low pressure energy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
