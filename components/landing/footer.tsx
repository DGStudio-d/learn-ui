"use client";

import { useI18n } from "@/components/providers/i18n";
import React from "react";

export default function Footer() {
  const { t } = useI18n();
  const [year, setYear] = React.useState<string>("");
  React.useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);
  return (
    <footer className="bg-[var(--card)] border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-3 gap-8 text-sm text-[var(--foreground)]/80">
        <div>
          <p className="font-semibold mb-2">{t("footer.contact", "Contact us")}</p>
          <p>info@learnacademy.com</p>
          <p>+971 555 000 000</p>
        </div>
        <div>
          <p className="font-semibold mb-2">{t("footer.quick_links", "Quick links")}</p>
          <ul className="space-y-1">
            <li><a className="hover:underline" href="/languages">{t("nav.languages", "Languages")}</a></li>
            <li><a className="hover:underline" href="/auth/register">{t("nav.register", "Register")}</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-2">{t("footer.about", "About")}</p>
          <p className="text-[var(--foreground)]/70">
            {t("footer.about_text", "We offer high‑quality language courses at reasonable prices with expert teachers.")}
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--foreground)]/60">
        © <span suppressHydrationWarning>{year}</span> Learn Academy. {t("footer.rights", "All rights reserved.")}
      </div>
    </footer>
  );
}

