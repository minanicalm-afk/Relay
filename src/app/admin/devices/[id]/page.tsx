import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileCheck2, Images } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { asStringArray, deviceStatusLabels, formatAmount, formatDate, statusTone } from "@/lib/admin";
import type { DeviceStatusValue } from "@/lib/options";
import { DeviceUpdateForm } from "@/components/admin/DeviceUpdateForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function DeviceDetailPage({ params }: Props) {
  const session = await requirePermission("devices:read");
  const { id } = await params;

  const device = await prisma.device.findUnique({
    where: { id },
    include: { submission: { select: { id: true, name: true, type: true, email: true, phone: true } } },
  });

  if (!device) notFound();

  const accessories = asStringArray(device.accessories);
  const photoNames = asStringArray(device.photoNames);

  return (
    <div className="space-y-7">
      <Link href="/admin/devices" className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to inventory
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-forest-600">{device.reference ?? `DEV-${device.id.slice(0, 8).toUpperCase()}`}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-forest-950 sm:text-4xl">
            {device.brand ? `${device.brand} ${device.model ?? ""}`.trim() : device.deviceType}
          </h1>
          <p className="mt-2 text-sm text-forest-900/75">{device.deviceType} · Added {formatDate(device.createdAt)}</p>
        </div>
        <span className={`rounded-full px-4 py-2 text-xs font-bold ${statusTone(device.status)}`}>
          {deviceStatusLabels[device.status as DeviceStatusValue]}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-forest-950">Device record</h2>
            <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Detail label="Device type" value={device.deviceType} />
              <Detail label="Brand" value={device.brand ?? "—"} />
              <Detail label="Model" value={device.model ?? "—"} />
              <Detail label="Age" value={device.age ?? "—"} />
              <Detail label="Condition" value={device.condition ?? "—"} />
              <Detail label="Estimated offer" value={formatAmount(device.offerAmount)} />
              <Detail label="Pricing source" value={device.pricingSource ?? "Built-in estimate"} />
              {device.matchedPrice && <Detail label="Catalog match" value={device.matchedPrice} />}
              <Detail label="Accessories" value={accessories.length ? accessories.join(", ") : "None listed"} />
              <Detail label="Last updated" value={formatDate(device.updatedAt)} />
            </dl>
            {device.description && (
              <div className="mt-6 rounded-2xl bg-forest-50/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-forest-600">Seller notes</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-forest-900">{device.description}</p>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-forest-950">Uploads</h2>
            <p className="mt-2 text-xs text-forest-900/70">
              File names from the public form are recorded here. Binary upload storage is not yet connected.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-forest-100 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-forest-600">
                  <Images className="h-3.5 w-3.5" /> Photos
                </p>
                {photoNames.length ? (
                  <ul className="mt-3 space-y-1 text-sm text-forest-900">
                    {photoNames.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-forest-900/70">No photo names recorded.</p>
                )}
              </div>
              <div className="rounded-2xl border border-forest-100 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-forest-600">
                  <FileCheck2 className="h-3.5 w-3.5" /> Proof of ownership
                </p>
                <p className="mt-3 text-sm text-forest-900">{device.receiptName ?? "No receipt name recorded."}</p>
              </div>
            </div>
          </section>

          {device.submission && (
            <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
              <h2 className="text-base font-semibold text-forest-950">Linked submission</h2>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-forest-50/70 p-4">
                <div>
                  <p className="text-sm font-semibold text-forest-950">{device.submission.name}</p>
                  <p className="text-xs text-forest-900/70">{device.submission.email || device.submission.phone || "No contact detail"}</p>
                </div>
                <Link href={`/admin/submissions/${device.submission.id}`} className="text-xs font-bold text-forest-700 hover:text-forest-900">
                  View submission →
                </Link>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <DeviceUpdateForm
            id={device.id}
            status={device.status as DeviceStatusValue}
            outcomeNote={device.outcomeNote ?? ""}
            canWrite={can(session.role, "devices:write")}
          />
          {device.outcomeNote && (
            <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
              <h2 className="text-base font-semibold text-forest-950">Outcome notes</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-forest-900/80">{device.outcomeNote}</p>
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
