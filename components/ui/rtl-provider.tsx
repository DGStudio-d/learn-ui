"use client";

import { useEffect } from "react";
import { useI18n } from "@/components/providers/i18n";

export default function RTLProvider() {
  const { locale } = useI18n();
  useEffect(() => {
    if (typeof document !== "undefined") {
      const dir = locale === "ar" ? "rtl" : "ltr";
      document.documentElement.setAttribute("dir", dir);
      document.documentElement.setAttribute("lang", locale);
    }
  }, [locale]);
  return null;
}
