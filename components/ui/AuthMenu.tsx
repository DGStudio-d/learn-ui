"use client";

import React from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/components/providers/i18n";

interface AuthMenuProps {
  isAuthed: boolean;
  isAdmin?: boolean;
  onLogout: () => void;
}

export default function AuthMenu({ isAuthed, isAdmin, onLogout }: AuthMenuProps) {
  const { t } = useI18n();

  if (!isAuthed) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            {t("auth.login", "Log in")}
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button size="sm">{t("auth.sign_up", "Sign up")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span>{t("auth.account", "Account")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isAdmin ? (
          <Link href="/admin">
            <DropdownMenuItem>{t("nav.admin", "Admin Dashboard")}</DropdownMenuItem>
          </Link>
        ) : null}
        <Link href="/dashboard">
          <DropdownMenuItem>{t("nav.dashboard", "Dashboard")}</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600 flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>{t("auth.logout", "Log out")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
