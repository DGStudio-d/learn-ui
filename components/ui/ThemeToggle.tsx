"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme, type Theme } from "@/components/providers/theme";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const apply = (t: Theme) => () => setTheme(t);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 inline-flex items-center justify-center"
          aria-label="Toggle theme"
        >
          {/* Show sun for light, moon for dark, sun by default */}
          {theme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-[var(--card)] text-[var(--foreground)] border-[color-mix(in_srgb,_var(--foreground)_10%,_transparent)]">
        <DropdownMenuItem onClick={apply("light")} className={theme === "light" ? "font-semibold" : undefined}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={apply("dark")} className={theme === "dark" ? "font-semibold" : undefined}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={apply("system")} className={theme === "system" ? "font-semibold" : undefined}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
