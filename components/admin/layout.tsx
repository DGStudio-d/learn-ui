"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils"; // utility for conditional classes

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/languages", label: "Languages" },
  { href: "/admin/levels", label: "Levels" },
  { href: "/admin/programs", label: "Programs" },
  { href: "/admin/meetings", label: "Meetings" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen grid md:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-[var(--border)] bg-[var(--card)]">
        <div className="p-4 font-bold text-[var(--primary)] text-lg">Admin</div>
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
                  isActive
                    ? "bg-[color-mix(in_srgb,_var(--primary)_15%,_transparent)] text-[var(--primary)] font-medium"
                    : "text-[var(--foreground)] hover:bg-[var(--secondary)]"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="bg-[var(--background)]">
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
