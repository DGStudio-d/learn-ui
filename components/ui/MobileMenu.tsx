"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import AuthMenu from "./AuthMenu";
import LocaleSwitcher from "@/components/ui/locale-switcher";

type NavLink = {
  href: string;
  label: string;
};

interface MobileMenuProps {
  navLinks: NavLink[];
  isAuthed: boolean;
  isAdmin: boolean;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function MobileMenu({
  navLinks,
  isAuthed,
  isAdmin,
  isOpen,
  onClose,
  onLogout,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed inset-x-0 top-0 z-50 rounded-b-2xl border-b bg-[var(--card)] shadow-lg"
        role="dialog"
        aria-modal="true"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Nav links */}
          <nav className="flex flex-col gap-1 py-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                className="rounded-lg px-3 py-2 text-[var(--foreground)] hover:bg-[color-mix(in_srgb,_var(--foreground)_6%,_transparent)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="mt-3 flex items-center gap-3">
            <LocaleSwitcher />
            <ThemeToggle />
            <AuthMenu isAuthed={isAuthed} isAdmin={isAdmin} onLogout={onLogout} />
            <Button variant="ghost" size="sm" onClick={onClose} className="ml-auto">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
