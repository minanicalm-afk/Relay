import type { DeviceStatus, Role, SubmissionStatus, SubmissionType } from "@prisma/client";

export const submissionTypeLabels: Record<SubmissionType, string> = {
  CONTACT: "Contact",
  PICKUP: "Pickup",
  DONATION: "Donation",
  PARTNERSHIP: "Partnership",
  SELL: "Sell / buyback",
};

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ARCHIVED: "Archived",
};

export const deviceStatusLabels: Record<DeviceStatus, string> = {
  RECEIVED: "Received",
  DIAGNOSING: "Diagnosing",
  REPAIRING: "Repairing",
  REFURBISHED: "Refurbished",
  DONATED: "Donated",
  RECYCLED: "Recycled",
  SOLD: "Sold",
  DISPOSED: "Disposed",
};

export const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin",
  STAFF: "Staff",
  VIEWER: "Viewer",
};

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDay(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatAmount(value: number | bigint | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `KSh ${new Intl.NumberFormat("en-KE").format(Number(value))}`;
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export function statusTone(status: string): string {
  const tones: Record<string, string> = {
    NEW: "bg-lime-100 text-forest-800",
    IN_PROGRESS: "bg-amber-100 text-amber-900",
    SCHEDULED: "bg-sky-100 text-sky-900",
    COMPLETED: "bg-emerald-100 text-emerald-900",
    CANCELLED: "bg-red-100 text-red-800",
    ARCHIVED: "bg-slate-200 text-slate-700",
    RECEIVED: "bg-lime-100 text-forest-800",
    DIAGNOSING: "bg-sky-100 text-sky-900",
    REPAIRING: "bg-amber-100 text-amber-900",
    REFURBISHED: "bg-emerald-100 text-emerald-900",
    DONATED: "bg-emerald-100 text-emerald-900",
    RECYCLED: "bg-emerald-100 text-emerald-900",
    SOLD: "bg-emerald-100 text-emerald-900",
    DISPOSED: "bg-slate-200 text-slate-700",
  };
  return tones[status] ?? "bg-forest-100 text-forest-800";
}
