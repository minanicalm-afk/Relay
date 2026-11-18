import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKES(amount: number): string {
  return `KSh ${Math.round(amount).toLocaleString("en-KE")}`;
}

export function formatRange(min: number, max: number): string {
  return `${formatKES(min)} – ${formatKES(max)}`;
}

export function generateReference(prefix = "TG"): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${stamp}${random}`;
}
