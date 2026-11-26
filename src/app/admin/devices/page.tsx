import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deviceStatusLabels, formatAmount, formatDate, statusTone, submissionTypeLabels } from "@/lib/admin";
import { deviceStatuses, type DeviceStatusValue } from "@/lib/options";

export const dynamic = "force-dynamic";
export const metadata = { title: "Device inventory" };

type Props = { searchParams: Promise<{ status?: string; q?: string }> };

export default async function DevicesPage({ searchParams }: Props) {
  await requirePermission("devices:read");
  const params = await searchParams;
  const status = deviceStatuses.includes(params.status as DeviceStatusValue)
    ? (params.status as DeviceStatusValue)
    : undefined;
  const query = params.q?.trim() ?? "";

  const where: Prisma.DeviceWhereInput = {
    ...(status ? { status } : {}),
    ...(query
      ? {
          OR: [
            { brand: { contains: query, mode: "insensitive" } },
            { model: { contains: query, mode: "insensitive" } },
            { deviceType: { contains: query, mode: "insensitive" } },
            { reference: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const devices = await prisma.device.findMany({
    where,
    take: 200,
    orderBy: { createdAt: "desc" },
    include: { submission: { select: { id: true, name: true, type: true } } },
  });

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-500">Operations</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-forest-950 sm:text-4xl">Device inventory</h1>
          <p className="mt-2 text-sm text-forest-900/75">
            Track each device from intake through diagnosis, repair, donation, recycling or sale.
          </p>
        </div>
        <p className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-forest-800 shadow-card">
          {devices.length} device{devices.length === 1 ? "" : "s"} shown
        </p>
      </div>

      <form method="get" className="grid gap-3 rounded-3xl border border-forest-100 bg-white p-4 sm:grid-cols-3 sm:p-5">
        <div>
          <label className="field-label" htmlFor="device-filter-status">Status</label>
          <select id="device-filter-status" name="status" defaultValue={status ?? ""} className="field-input h-11 py-0 text-xs">
            <option value="">All statuses</option>
            {deviceStatuses.map((value) => <option key={value} value={value}>{deviceStatusLabels[value]}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="device-filter-query">Search</label>
          <input id="device-filter-query" name="q" defaultValue={query} className="field-input h-11 py-0 text-xs" placeholder="Brand, model, device type or reference..." />
        </div>
        <div className="sm:col-span-3">
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
                <th className="px-5 py-3 font-semibold">Device</th>
                <th className="px-5 py-3 font-semibold">Condition</th>
                <th className="px-5 py-3 font-semibold">Offer</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Linked submission</th>
                <th className="px-5 py-3 font-semibold">Added</th>
                <th className="px-5 py-3 font-semibold"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {devices.map((device) => (
                <tr key={device.id} className="transition hover:bg-forest-50/50">
                  <td className="px-5 py-4 font-mono text-xs text-forest-800">
                    {device.reference ?? `DEV-${device.id.slice(0, 8).toUpperCase()}`}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-forest-950">{device.deviceType}</p>
                    <p className="text-xs text-forest-900/70">{[device.brand, device.model].filter(Boolean).join(" ") || "Brand not recorded"}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-forest-900/80">{device.condition ?? "—"}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-forest-900">{formatAmount(device.offerAmount)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusTone(device.status)}`}>
                      {deviceStatusLabels[device.status as DeviceStatusValue]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-forest-900/80">
                    {device.submission ? (
                      <Link href={`/admin/submissions/${device.submission.id}`} className="font-semibold text-forest-700 hover:text-forest-900">
                        {device.submission.name} · {submissionTypeLabels[device.submission.type]}
                      </Link>
                    ) : "Manually added"}
                  </td>
                  <td className="px-5 py-4 text-xs text-forest-900/80">{formatDate(device.createdAt)}</td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/devices/${device.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 hover:text-forest-900">
                      Open <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {devices.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-semibold text-forest-900">No devices match those filters.</p>
            <p className="mt-1 text-xs text-forest-900/70">Buyback offers from the public form appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
