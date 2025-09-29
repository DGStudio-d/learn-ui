"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: string; // e.g. 'md', 'full'
}

export function Skeleton({ className, rounded = "md", ...props }: SkeletonProps) {
  const radius = rounded === "full" ? "rounded-full" : rounded ? `rounded-${rounded}` : "rounded-md";
  return (
    <div
      className={cn(
        "relative overflow-hidden animate-pulse",
        radius,
        // Use design tokens for background so it works in both themes
        "bg-[color-mix(in_srgb,_var(--foreground)_6%,_transparent)]",
        className
      )}
      aria-busy="true"
      aria-live="polite"
      {...props}
    />
  );
}

export default Skeleton;
