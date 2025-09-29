"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "info" | "success" | "error" | "warning";
};

export function Alert({ className, variant = "info", ...props }: AlertProps) {
  const variants: Record<string, string> = {
    info: "text-[var(--info)] border-[color-mix(in_srgb,_var(--info)_30%,_transparent)] bg-[color-mix(in_srgb,_var(--info)_8%,_transparent)]",
    success: "text-[var(--success)] border-[color-mix(in_srgb,_var(--success)_30%,_transparent)] bg-[color-mix(in_srgb,_var(--success)_8%,_transparent)]",
    error: "text-[var(--error)] border-[color-mix(in_srgb,_var(--error)_30%,_transparent)] bg-[color-mix(in_srgb,_var(--error)_8%,_transparent)]",
    warning: "text-[var(--warning)] border-[color-mix(in_srgb,_var(--warning)_30%,_transparent)] bg-[color-mix(in_srgb,_var(--warning)_8%,_transparent)]",
  };
  return <div role="status" className={cn("border rounded p-4 text-sm", variants[variant], className)} {...props} />;
}

