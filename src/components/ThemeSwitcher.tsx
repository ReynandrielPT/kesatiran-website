"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTheme, themeNames, Theme } from "@/contexts/ThemeContext";
import { Sun, Moon, Gamepad2, Sparkles } from "lucide-react";

const ICONS: Record<Theme, React.ReactNode> = {
  light: <Sun className="h-[18px] w-[18px]" />,
  dark: <Moon className="h-[18px] w-[18px]" />,
  aesthetic: <Sparkles className="h-[18px] w-[18px]" />,
  gaming: <Gamepad2 className="h-[18px] w-[18px]" />,
};

/**
 * Compact single-button theme cycler.
 * Click / Enter / Space => cycles to next theme in ordered list.
 * Provides accessible label including current & next theme.
 */
export function ThemeSwitcher() {
  const { theme, cycleTheme, themes } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const idx = themes.indexOf(theme);
  const next = themes[(idx + 1) % themes.length];

  const label = useMemo(
    () => `Theme: ${themeNames[theme]} (next: ${themeNames[next]})`,
    [theme, next]
  );

  // Server + pre-mount placeholder (stable markup) to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Loading theme switcher"
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-md border border-border bg-secondary/40 animate-pulse"
        disabled
      >
        <span className="sr-only">Loading theme switcher</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className="relative inline-flex items-center justify-center h-9 w-9 rounded-md border border-border bg-secondary/70 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-colors active:scale-95 overflow-hidden group"
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_30%,var(--accent)_0%,transparent_70%)]" />
      <span className="relative flex items-center justify-center text-foreground">
        {ICONS[theme]}
        <span className="sr-only">Current: {themeNames[theme]}</span>
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-1 right-1 size-2 rounded-full bg-accent shadow [transition:background-color_.3s]"
      />
    </button>
  );
}

export default ThemeSwitcher;
