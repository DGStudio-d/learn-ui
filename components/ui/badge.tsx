"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "success" | "destructive" | "outline";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-2 py-0.5 text-xs",
    secondary: "inline-flex items-center rounded-full bg-gray-200 text-gray-800 px-2 py-0.5 text-xs",
    success: "inline-flex items-center rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs",
    destructive: "inline-flex items-center rounded-full bg-red-100 text-red-800 px-2 py-0.5 text-xs",
    outline: "inline-flex items-center rounded-full border border-gray-300 text-gray-700 px-2 py-0.5 text-xs",
  };
  return <span className={cn(variants[variant], className)} {...props} />;
}
