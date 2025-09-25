"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme =
  | "formal-light"
  | "formal-dark"
  | "aesthetic-light"
  | "aesthetic-dark"
  | "gaming";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("formal-light");

  // Handle client-side theme loading
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const themes: Theme[] = [
      "formal-light",
      "formal-dark",
      "aesthetic-light",
      "aesthetic-dark",
      "gaming",
    ];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
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
  "formal-light": "Formal Light",
  "formal-dark": "Formal Dark",
  "aesthetic-light": "Aesthetic Light",
  "aesthetic-dark": "Aesthetic Dark",
  gaming: "Gaming",
};
