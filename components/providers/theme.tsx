"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const resolved = theme === "system" ? getSystemTheme() : theme;
  root.setAttribute("data-theme", resolved);
}

export default function ThemeProvider({ children, defaultTheme = "system" as Theme }: { children: React.ReactNode; defaultTheme?: Theme; }) {
  // Important: match server render by starting from defaultTheme.
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    // After mount, resolve saved/user preference and apply
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme") as Theme | null;
    const next = (saved && ["light","dark","system"].includes(saved)) ? saved : theme;
    applyTheme(next);
    setThemeState(next);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if ((localStorage.getItem("theme") as Theme) === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const value = useMemo<ThemeContextType>(() => ({ theme, setTheme: (t) => setThemeState(t) }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

