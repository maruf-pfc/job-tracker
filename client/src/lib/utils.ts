import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  if (dateString.startsWith("0001-01-01")) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime()) || d.getFullYear() <= 1970) return "N/A";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}
