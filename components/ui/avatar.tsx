"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AvatarProps = React.HTMLAttributes<HTMLDivElement>;

type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>;

export function Avatar({ className, ...props }: AvatarProps) {
  return <div className={cn("inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden", className)} {...props} />;
}

export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return <img className={cn("w-full h-full object-cover", className)} {...props} />;
}

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return <span className={cn("text-gray-500", className)} {...props} />;
}
