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
      <aside className="border-r bg-white">
        <div className="p-4 font-bold text-green-700 text-lg">Admin</div>
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
                    ? "bg-green-100 text-green-700 font-medium"
                    : "hover:bg-gray-50"
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
