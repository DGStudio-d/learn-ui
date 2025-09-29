"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
};

export function Button({ className, variant = "default", size = "md", asChild = false, children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)] disabled:opacity-60 disabled:pointer-events-none active:translate-y-[0.5px] shadow-sm";
  const variants: Record<string, string> = {
    default: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
    outline: "border border-[var(--primary)] text-[var(--primary)] hover:bg-[color-mix(in_srgb,_var(--primary)_8%,_transparent)]",
    destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[color-mix(in_srgb,_var(--destructive)_90%,_black)]",
    ghost: "text-[var(--foreground)] hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)]",
  };
  const sizes: Record<string, string> = {
    sm: "text-sm px-3 py-1.5 h-8",
    md: "text-sm px-4 py-2 h-10",
    lg: "text-base px-6 py-3 h-12",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (asChild && React.isValidElement(children)) {
    // Merge className into child element when rendering asChild
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn((children as any).props?.className, classes),
      ...props,
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

