"use client";

import { useI18n, Locale } from "@/components/providers/i18n";

export default function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <select
      className="border rounded px-2 py-1 text-sm bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]"
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label={t("nav.language", "Language")}
    >
      <option value="en">EN</option>
      <option value="ar">AR</option>
      <option value="es">ES</option>
    </select>
  );
}
