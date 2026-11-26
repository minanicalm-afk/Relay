import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roleLabels } from "@/lib/admin";
import { ProfileForm } from "@/components/account/ProfileForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile" };

export default async function AdminProfilePage() {
  const session = await requireAdmin();
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { name: true, email: true, phone: true, role: true, active: true },
  });

  return (
    <div className="space-y-7">
      <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to overview
      </Link>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-500">Account</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-950 sm:text-4xl">Your profile</h1>
        <p className="mt-2 max-w-2xl text-sm text-forest-900/75">
          These details are stored on your staff account. Customers have a separate profile on the public site.
        </p>
      </div>

      <div className="flex max-w-2xl items-center gap-3 rounded-2xl border border-forest-100 bg-white px-4 py-3 text-sm text-forest-900">
        <ShieldCheck className="h-4 w-4 text-forest-600" />
        {roleLabels[user?.role ?? session.role]} · {user?.active === false ? "Inactive" : "Active"}
      </div>

      <div className="max-w-2xl">
        <ProfileForm
          name={user?.name ?? session.name}
          email={user?.email ?? session.email}
          phone={user?.phone ?? ""}
        />
      </div>
    </div>
  );
}
