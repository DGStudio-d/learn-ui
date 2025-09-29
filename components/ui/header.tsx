"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, GraduationCap } from "lucide-react";
import { useI18n } from "@/components/providers/i18n";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setToken } from "@/lib/api";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AuthMenu from "@/components/ui/AuthMenu";
import LocaleSwitcher from "@/components/ui/locale-switcher";
import MobileMenu from "@/components/ui/MobileMenu";

export default function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const { isAuthed, isAdmin } = useUser();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    setToken(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: t("nav.home", "Home") },
    { href: "/languages", label: t("nav.languages", "Languages") },
    { href: "/pricing", label: t("nav.pricing", "Pricing") },
    { href: "/contact", label: t("nav.contact", "Contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[var(--card)]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
        >
          <GraduationCap className="h-7 w-7" />
          <span className="font-extrabold">{t("app.title", "Learn Academy")}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,_var(--foreground)_5%,_transparent)] p-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all",
                  isActive
                    ? "bg-[var(--card)] text-[var(--primary)] shadow-sm"
                    : "text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[color-mix(in_srgb,_var(--foreground)_6%,_transparent)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          <AuthMenu isAuthed={isAuthed} isAdmin={isAdmin} onLogout={handleLogout} />
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden h-11 w-11"
          aria-label={
            isMobileMenuOpen ? t("nav.close_menu", "Close menu") : t("nav.open_menu", "Open menu")
          }
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((v) => !v)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        navLinks={navLinks}
        isAuthed={isAuthed}
        isAdmin={isAdmin}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}
