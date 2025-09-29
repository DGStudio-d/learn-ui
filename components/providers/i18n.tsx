"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import en from "@/i18n/en.json";
import ar from "@/i18n/ar.json";
import es from "@/i18n/es.json";

export type Locale = "en" | "ar" | "es";

type Dict = Record<string, any>;

const DICTS: Record<Locale, Dict> = { en, ar, es };

function getFromDict(dict: Dict, key: string): string | undefined {
  // support nested keys like "auth.login.title"
  return key.split(".").reduce<any>((acc, k) => (acc ? acc[k] : undefined), dict);
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export default function I18nProvider({ children, initialLocale = "en" as Locale }: { children: ReactNode; initialLocale?: Locale }) {
  // Important: match server render by starting from initialLocale.
  const [locale, setLocale] = useState<Locale>(initialLocale);

  // After mount, resolve preferred locale and update.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && ["en","ar","es"].includes(saved)) {
      setLocale(saved);
      return;
    }
    const htmlLang = document.documentElement.getAttribute("lang") as Locale | null;
    if (htmlLang && ["en","ar","es"].includes(htmlLang)) {
      setLocale(htmlLang);
      return;
    }
    const nav = (navigator.language || navigator.languages?.[0] || "en").slice(0,2) as Locale;
    if (["en","ar","es"].includes(nav)) {
      setLocale(nav);
    }
  }, []);

  // Persist locale on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
    }
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale,
    t: (key: string, fallback?: string, params?: Record<string, string | number>) => {
      let str = (getFromDict(DICTS[locale], key) ?? getFromDict(DICTS.en, key) ?? fallback ?? key) as string;
      if (params && typeof str === "string") {
        for (const [k, v] of Object.entries(params)) {
          const re = new RegExp(`\\{${k}\\}`, "g");
          str = str.replace(re, String(v));
        }
      }
      return str;
    },
  }), [locale]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
