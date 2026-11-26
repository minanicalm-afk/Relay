import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatDate,
  statusTone,
  submissionStatusLabels,
  submissionTypeLabels,
} from "@/lib/admin";
import {
  submissionStatuses,
  submissionTypes,
  type SubmissionStatusValue,
  type SubmissionTypeValue,
} from "@/lib/options";

export const dynamic = "force-dynamic";
export const metadata = { title: "Submissions" };

type Props = {
  searchParams: Promise<{ type?: string; status?: string; q?: string }>;
};

export default async function SubmissionsPage({ searchParams }: Props) {
  await requirePermission("submissions:read");
  const params = await searchParams;
  const type = submissionTypes.includes(params.type as SubmissionTypeValue)
    ? (params.type as SubmissionTypeValue)
    : undefined;
  const status = submissionStatuses.includes(params.status as SubmissionStatusValue)
    ? (params.status as SubmissionStatusValue)
    : undefined;
  const query = params.q?.trim() ?? "";

  const where: Prisma.SubmissionWhereInput = {
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
            { id: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const submissions = await prisma.submission.findMany({
    where,
    take: 150,
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: { select: { name: true } },
      _count: { select: { devices: true } },
    },
  });

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-500">Inbox</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-forest-950 sm:text-4xl">Submissions</h1>
          <p className="mt-2 text-sm text-forest-900/75">
            Contact, pickup, donation, partnership and buyback enquiries in one place.
          </p>
        </div>
        <p className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-forest-800 shadow-card">
          {submissions.length} record{submissions.length === 1 ? "" : "s"} shown
        </p>
      </div>

      <form method="get" className="grid gap-3 rounded-3xl border border-forest-100 bg-white p-4 sm:grid-cols-4 sm:p-5">
        <div>
          <label className="field-label" htmlFor="filter-type">Type</label>
          <select id="filter-type" name="type" defaultValue={type ?? ""} className="field-input h-11 py-0 text-xs">
            <option value="">All types</option>
            {submissionTypes.map((value) => <option key={value} value={value}>{submissionTypeLabels[value]}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="filter-status">Status</label>
          <select id="filter-status" name="status" defaultValue={status ?? ""} className="field-input h-11 py-0 text-xs">
            <option value="">All statuses</option>
            {submissionStatuses.map((value) => <option key={value} value={value}>{submissionStatusLabels[value]}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="filter-query">Search</label>
          <input id="filter-query" name="q" defaultValue={query} className="field-input h-11 py-0 text-xs" placeholder="Name, email, phone or reference..." />
        </div>
        <div className="sm:col-span-4">
          <button type="submit" className="rounded-full bg-forest-800 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-forest-900">
            Apply filters
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-3xl border border-forest-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-forest-50 text-xs uppercase tracking-wide text-forest-700">
              <tr>
                <th className="px-5 py-3 font-semibold">Reference</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Assigned</th>
                <th className="px-5 py-3 font-semibold">Devices</th>
                <th className="px-5 py-3 font-semibold">Received</th>
                <th className="px-5 py-3 font-semibold"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {submissions.map((submission) => (
                <tr key={submission.id} className="transition hover:bg-forest-50/50">
                  <td className="px-5 py-4 font-mono text-xs text-forest-800">TG-{submission.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-forest-950">{submission.name}</p>
                    <p className="text-xs text-forest-900/70">{submission.email || submission.phone || "No contact detail"}</p>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-forest-800">{submissionTypeLabels[submission.type]}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusTone(submission.status)}`}>
                      {submissionStatusLabels[submission.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-forest-900/80">{submission.assignedTo?.name ?? "Unassigned"}</td>
                  <td className="px-5 py-4 text-xs text-forest-900/80">{submission._count.devices}</td>
                  <td className="px-5 py-4 text-xs text-forest-900/80">{formatDate(submission.createdAt)}</td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/submissions/${submission.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 hover:text-forest-900">
                      Open <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {submissions.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-semibold text-forest-900">No submissions match those filters.</p>
            <p className="mt-1 text-xs text-forest-900/70">Try clearing a filter, or wait for a new public form submission.</p>
          </div>
        )}
      </div>
    </div>
  );
}
