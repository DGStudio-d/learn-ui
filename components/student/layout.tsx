"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/i18n";

export default function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const navItems = [
    { href: "/student", label: t("student.nav.dashboard", "Dashboard") },
    { href: "/programs", label: t("student.nav.programs", "Programs") },
    { href: "/teachers", label: t("student.nav.teachers", "Teachers") },
    { href: "/contact", label: t("student.nav.contact", "Contact") },
  ];

  return (
    <div className="min-h-screen grid md:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="border-r bg-white">
        <div className="p-4 font-bold text-green-700 text-lg">{t("student.sidebar.title", "Student")}</div>
        <nav className="p-2 grid gap-1 text-sm">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "px-3 py-2 rounded transition-colors",
                  isActive ? "bg-green-100 text-green-700 font-medium" : "hover:bg-gray-50"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
