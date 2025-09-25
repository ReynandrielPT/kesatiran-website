"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Supported theme tokens (must match data-theme values defined in globals.css)
export type Theme = "light" | "dark" | "aesthetic" | "gaming";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void; // cycles through the theme list
  themes: Theme[]; // available themes (UI can iterate)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "theme";
const ORDER: Theme[] = ["light", "dark", "aesthetic", "gaming"];

function mapLegacyTheme(value: string | null): Theme | null {
  if (!value) return null;
  switch (value) {
    case "formal-light":
    case "aesthetic-light":
      return "light"; // map old light variants to new neutral light
    case "formal-dark":
      return "dark";
    case "aesthetic-dark":
      return "aesthetic"; // collapse old aesthetic dark into single aesthetic palette
    case "gaming":
      return "gaming";
    case "light":
    case "dark":
    case "aesthetic":
    case "gaming":
      return value as Theme;
    default:
      return null;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Initial load (client only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedRaw = localStorage.getItem(STORAGE_KEY);
    let mapped = mapLegacyTheme(storedRaw);
    // If nothing stored, respect prefers-color-scheme
    if (!mapped) {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      mapped = prefersDark ? "dark" : "light";
    }
    setTheme(mapped);
    // debug
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[ThemeProvider] initial theme",
        mapped,
        "(stored:",
        storedRaw,
        ")"
      );
    }
  }, []);

  // Persist + apply to DOM
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
    if (process.env.NODE_ENV !== "production") {
      console.log("[ThemeProvider] applied theme", theme);
    }
  }, [theme]);

  const cycleTheme = () => {
    const idx = ORDER.indexOf(theme);
    const next = ORDER[(idx + 1) % ORDER.length];
    setTheme(next);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    cycleTheme,
    themes: ORDER,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export const themeNames: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  aesthetic: "Aesthetic",
  gaming: "Gaming",
};
