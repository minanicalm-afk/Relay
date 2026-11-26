import Link from "next/link";
import { ArrowLeft, CircleHelp, ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, roleLabels } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile" };

export default async function AdminProfilePage() {
  const session = await requireAdmin();
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });

  return (
    <div className="space-y-7">
      <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to overview
      </Link>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-500">Account</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-950 sm:text-4xl">Your profile</h1>
        <p className="mt-2 text-sm text-forest-900/75">
          Details shown to the admin console for this session.
        </p>
      </div>

      <section className="max-w-2xl rounded-3xl border border-forest-100 bg-white p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest-800 text-lg font-bold text-lime-300">
            {(user?.name ?? session.name).slice(0, 2).toUpperCase()}
          </span>
          <div>
            <p className="text-lg font-semibold text-forest-950">{user?.name ?? session.name}</p>
            <p className="text-sm text-forest-900/70">{user?.email ?? session.email}</p>
          </div>
        </div>

        <dl className="mt-7 grid gap-x-6 gap-y-5 border-t border-forest-100 pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-forest-600">Role</dt>
            <dd className="mt-1 inline-flex items-center gap-2 text-sm text-forest-900">
              <ShieldCheck className="h-4 w-4 text-forest-600" />
              {roleLabels[user?.role ?? session.role]}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-forest-600">Status</dt>
            <dd className="mt-1 text-sm text-forest-900">{user?.active ? "Active" : "Inactive"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-forest-600">Joined</dt>
            <dd className="mt-1 text-sm text-forest-900">{formatDate(user?.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-forest-600">Session</dt>
            <dd className="mt-1 text-sm text-forest-900">Open admin demo</dd>
          </div>
        </dl>

        <div className="mt-7 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
          <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />
          Authentication is temporarily disabled. Use the profile menu to return to the customer site or exit the admin area.
        </div>
      </section>
    </div>
  );
}
