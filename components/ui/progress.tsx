"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number; // 0-100
};

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full h-2 bg-[var(--secondary)] rounded", className)} {...props}>
      <div className="h-2 bg-[var(--primary)] rounded transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}
