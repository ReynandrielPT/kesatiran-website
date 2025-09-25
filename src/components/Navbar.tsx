"use client";

import React from "react";
import Link from "next/link";
import { useTheme, themeNames } from "@/contexts/ThemeContext";
import {
  Menu,
  X,
  Palette,
  Home,
  Users,
  Briefcase,
  Gamepad2,
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Team", href: "/team", icon: Users },
  { name: "Works", href: "/works", icon: Briefcase },
  { name: "Games", href: "/games", icon: Gamepad2 },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--accent)_55%,transparent)] to-transparent" />
      <nav className="mx-auto max-w-7xl px-5 flex items-center h-16 gap-6">
        {/* Brand / Logo mark */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-8 rounded-md bg-[var(--accent)]/90 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:rotate-6 transition-transform">
            K
          </div>
          <span className="text-lg font-semibold gradient-title tracking-tight">
            Kesatiran
          </span>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "hover:text-[var(--accent)]",
                  active && "text-[var(--accent)]"
                )}
              >
                <span className="flex items-center gap-2">
                  <item.icon size={14} /> {item.name}
                </span>
                <span
                  className={cn(
                    "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[2px] h-[3px] rounded-full bg-[var(--accent)]/80 transition-all duration-300",
                    active ? "w-5 opacity-100" : "w-0 opacity-0 group-hover:w-5"
                  )}
                />
              </Link>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {/* Theme quick toggle */}
          <div className="relative">
            <button
              onClick={() => setShowThemeSelector((p) => !p)}
              className="h-9 px-3 rounded-full flex items-center gap-2 text-xs font-medium soft-border bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] hover:bg-[color-mix(in_srgb,var(--foreground)_12%,transparent)] transition-colors"
            >
              <Palette size={16} />
              <span className="hidden sm:inline max-w-[80px] truncate">
                {themeNames[theme]}
              </span>
            </button>
            {showThemeSelector && (
              <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl p-2 flex flex-col gap-1 z-50">
                {Object.entries(themeNames).map(([key, name]) => {
                  const active = key === theme;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setTheme(key as any);
                        setShowThemeSelector(false);
                      }}
                      className={cn(
                        "text-left text-xs px-3 py-2 rounded-md transition-colors",
                        active
                          ? "bg-[color-mix(in_srgb,var(--accent)_25%,transparent)] text-[var(--accent)] font-medium"
                          : "hover:bg-[color-mix(in_srgb,var(--accent)_18%,transparent)]/40"
                      )}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* Mobile menu */}
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="md:hidden size-9 rounded-md soft-border flex items-center justify-center hover:bg-[color-mix(in_srgb,var(--foreground)_12%,transparent)]"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 animate-fadeInUp">
          <div className="glass-panel rounded-xl p-3 flex flex-col gap-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                    active
                      ? "bg-[color-mix(in_srgb,var(--accent)_25%,transparent)] text-[var(--accent)]"
                      : "hover:bg-[color-mix(in_srgb,var(--accent)_18%,transparent)]/40"
                  )}
                >
                  <item.icon size={16} /> {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
