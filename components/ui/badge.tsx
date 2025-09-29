"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "success" | "destructive" | "outline";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "inline-flex items-center rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] px-2 py-0.5 text-xs",
    secondary: "inline-flex items-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 text-xs",
    success: "inline-flex items-center rounded-full bg-[color-mix(in_srgb,_var(--success)_15%,_transparent)] text-[var(--success)] px-2 py-0.5 text-xs",
    destructive: "inline-flex items-center rounded-full bg-[color-mix(in_srgb,_var(--destructive)_15%,_transparent)] text-[var(--destructive)] px-2 py-0.5 text-xs",
    outline: "inline-flex items-center rounded-full border border-[var(--border)] text-[var(--foreground)] px-2 py-0.5 text-xs",
  };
  return <span className={cn(variants[variant], className)} {...props} />;
}
