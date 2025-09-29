"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("max-w-6xl mx-auto px-4", className)} {...props} />;
}
