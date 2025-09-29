// Simple class name combiner utility used across the app
// Accepts strings and falsy values; filters out falsy and joins the rest with spaces
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}