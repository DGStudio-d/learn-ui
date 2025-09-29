"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number; // pixels
  stroke?: number; // stroke width
}

export function Spinner({ className, size = 20, stroke = 2, ...props }: SpinnerProps) {
  const s = Math.max(8, size);
  const r = (s - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div role="status" aria-live="polite" className={cn("inline-flex items-center justify-center", className)} {...props}>
      <svg
        className="animate-spin text-[var(--primary)]"
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx={s / 2}
          cy={s / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
        />
        <path
          className="opacity-75"
          d={`M ${s / 2} ${s / 2} m 0 -${r} a ${r} ${r} 0 1 1 0 ${2 * r} a ${r} ${r} 0 1 1 0 -${2 * r}`}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c}`}
          strokeDashoffset={`${c * 0.75}`}
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
