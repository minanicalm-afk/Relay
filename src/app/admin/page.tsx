import Link from "next/link";
import { ArrowUpRight, Boxes, ClipboardList, Inbox, Tags, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  formatDate,
  statusTone,
  submissionStatusLabels,
  submissionTypeLabels,
} from "@/lib/admin";
import { submissionTypes, type SubmissionTypeValue } from "@/lib/options";

export const dynamic = "force-dynamic";

export const metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  const [totalSubmissions, newSubmissions, totalDevices, activeUsers, activePrices, recent, byType] = await Promise.all([
    prisma.submission.count(),
    prisma.submission.count({ where: { status: "NEW" } }),
    prisma.device.count(),
    prisma.user.count({ where: { active: true } }),
    prisma.devicePrice.count({ where: { active: true } }),
    prisma.submission.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        name: true,
        status: true,
        createdAt: true,
        assignedTo: { select: { name: true } },
      },
    }),
    prisma.submission.groupBy({ by: ["type"], _count: { _all: true } }),
  ]);

  const counts = new Map(byType.map((row) => [row.type, row._count._all]));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-500">Operations overview</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-950 sm:text-4xl">
          Good to see you. Here is what needs attention.
        </h1>
        <p className="mt-2 text-sm text-forest-900/75">
          Live data from the public site: contact, pickups, donations, partnerships and buyback offers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="New submissions" value={newSubmissions} hint="Need first response" icon={Inbox} href="/admin/submissions?status=NEW" />
        <StatCard label="Total submissions" value={totalSubmissions} hint="All time" icon={ClipboardList} href="/admin/submissions" />
        <StatCard label="Devices tracked" value={totalDevices} hint="Inventory records" icon={Boxes} href="/admin/devices" />
        <StatCard label="Active prices" value={activePrices} hint="Used in sell offers" icon={Tags} href="/admin/prices" />
        <StatCard label="Active team" value={activeUsers} hint="Admin accounts" icon={Users} href="/admin/users" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-forest-950">Recent submissions</h2>
            <Link href="/admin/submissions" className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 hover:text-forest-900">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {recent.length === 0 && <p className="text-sm text-forest-900/70">No submissions yet. Public forms will appear here as they are completed.</p>}
            {recent.map((item) => (
              <Link
                key={item.id}
                href={`/admin/submissions/${item.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest-100 px-4 py-3 transition hover:border-forest-300 hover:bg-forest-50/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-forest-950">{item.name}</p>
                  <p className="text-xs text-forest-900/70">
                    {submissionTypeLabels[item.type]} · {formatDate(item.createdAt)} · {item.assignedTo?.name ?? "Unassigned"}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusTone(item.status)}`}>
                  {submissionStatusLabels[item.status]}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-forest-950">Submissions by type</h2>
          <div className="mt-5 space-y-4">
            {submissionTypes.map((type: SubmissionTypeValue) => {
              const value = counts.get(type) ?? 0;
              const percent = totalSubmissions ? Math.round((value / totalSubmissions) * 100) : 0;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-forest-900">{submissionTypeLabels[type]}</span>
                    <span className="text-forest-900/70">{value}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-forest-100">
                    <div className="h-full rounded-full bg-forest-700" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
  hint: string;
  icon: typeof Inbox;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-3xl border border-forest-100 bg-white p-5 transition hover:border-forest-300 hover:shadow-card">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest-100 text-forest-700">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-4 text-3xl font-bold text-forest-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-forest-900">{label}</p>
      <p className="text-xs text-forest-900/65">{hint}</p>
    </Link>
  );
}
