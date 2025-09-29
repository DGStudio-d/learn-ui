"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DropdownMenuRootProps = { children: React.ReactNode };

export function DropdownMenu({ children }: DropdownMenuRootProps) {
  return <div className="relative inline-block text-left">{children}</div>;
}

export function DropdownMenuTrigger({ children, asChild = false }: { children: React.ReactNode; asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) return children as any;
  return (
    <button type="button" className="inline-flex items-center justify-center">
      {children}
    </button>
  );
}

export function DropdownMenuContent({ className, align = "end", children }: { className?: string; align?: "start" | "end"; children: React.ReactNode }) {
  return (
    <div className={cn("absolute mt-2 w-56 rounded-md border border-[var(--border)] bg-[var(--popover)] text-[var(--popover-foreground)] shadow-lg focus:outline-none z-50", align === "end" ? "right-0" : "left-0", className)}>
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-[var(--border)]" />;
}

export function DropdownMenuItem({ className, children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("w-full text-left px-3 py-2 text-sm text-[var(--popover-foreground)] hover:bg-[var(--secondary)]", className)}>
      {children}
    </button>
  );
}
