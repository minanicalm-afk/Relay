import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import {
  asRecord,
  asStringArray,
  deviceStatusLabels,
  formatAmount,
  formatDate,
  statusTone,
  submissionStatusLabels,
  submissionTypeLabels,
} from "@/lib/admin";
import type { DeviceStatusValue, SubmissionStatusValue } from "@/lib/options";
import { SubmissionUpdateForm } from "@/components/admin/SubmissionUpdateForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function SubmissionDetailPage({ params }: Props) {
  const session = await requirePermission("submissions:read");
  const { id } = await params;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      devices: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!submission) notFound();

  const users = await prisma.user.findMany({
    where: { active: true, role: { not: "VIEWER" } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  const details = asRecord(submission.details);
  const canWrite = can(session.role, "submissions:write");

  return (
    <div className="space-y-7">
      <Link href="/admin/submissions" className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to submissions
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-forest-600">TG-{submission.id.slice(0, 8).toUpperCase()}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-forest-950 sm:text-4xl">{submission.name}</h1>
          <p className="mt-2 text-sm text-forest-900/75">
            {submissionTypeLabels[submission.type]} · Received {formatDate(submission.createdAt)}
          </p>
        </div>
        <span className={`rounded-full px-4 py-2 text-xs font-bold ${statusTone(submission.status)}`}>
          {submissionStatusLabels[submission.status]}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-forest-950">Contact & submission</h2>
            <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Detail label="Name" value={submission.name} />
              <Detail label="Email" value={submission.email ?? "—"} />
              <Detail label="Phone" value={submission.phone ?? "—"} />
              <Detail label="Location" value={submission.location ?? "—"} />
              <Detail label="Scheduled for" value={formatDate(submission.scheduledAt)} />
              <Detail label="Assigned to" value={submission.assignedTo?.name ?? "Unassigned"} />
              <Detail label="Completed" value={submission.completedAt ? formatDate(submission.completedAt) : "—"} />
              <Detail label="Last updated" value={formatDate(submission.updatedAt)} />
            </dl>
            {submission.message && (
              <div className="mt-6 rounded-2xl bg-forest-50/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-forest-600">Message</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-forest-900">{submission.message}</p>
              </div>
            )}
            {Object.keys(details).length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wide text-forest-600">Additional details</p>
                <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {Object.entries(details).map(([key, value]) => (
                    <Detail key={key} label={humanise(key)} value={displayValue(value)} />
                  ))}
                </dl>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-forest-950">Linked devices</h2>
              <span className="text-xs font-semibold text-forest-900/70">{submission.devices.length}</span>
            </div>
            {submission.devices.length === 0 ? (
              <p className="mt-4 text-sm text-forest-900/70">No device records linked to this submission.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {submission.devices.map((device) => (
                  <Link
                    key={device.id}
                    href={`/admin/devices/${device.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest-100 px-4 py-3 transition hover:border-forest-300 hover:bg-forest-50/50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-forest-950">{device.deviceType} · {device.brand ?? "Unknown brand"}</p>
                      <p className="text-xs text-forest-900/70">
                        {device.reference ?? `DEV-${device.id.slice(0, 8).toUpperCase()}`} · {formatAmount(device.offerAmount)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusTone(device.status)}`}>
                        {deviceStatusLabels[device.status as DeviceStatusValue]}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-forest-600" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <SubmissionUpdateForm
            id={submission.id}
            status={submission.status as SubmissionStatusValue}
            assignedToId={submission.assignedToId}
            scheduledAt={toLocalInput(submission.scheduledAt)}
            notes={submission.notes ?? ""}
            users={users}
            canWrite={canWrite}
          />
          {submission.notes && (
            <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
              <h2 className="text-base font-semibold text-forest-950">Internal notes</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-forest-900/80">{submission.notes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-forest-600">{label}</dt>
      <dd className="mt-1 text-sm text-forest-900">{value}</dd>
    </div>
  );
}

function humanise(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return asStringArray(value).join(", ") || "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function toLocalInput(date: Date | null): string {
  if (!date) return "";
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return adjusted.toISOString().slice(0, 16);
}
