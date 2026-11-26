import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { roleLabels } from "@/lib/admin";
import { adminRoles, type AdminRoleValue } from "@/lib/options";
import { UsersManager } from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users & roles" };

export default async function UsersPage() {
  const session = await requirePermission("users:read");
  const users = await prisma.user.findMany({
    where: { role: { not: "CUSTOMER" } },
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-500">Access control</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-950 sm:text-4xl">Users & roles</h1>
        <p className="mt-2 text-sm text-forest-900/75">
          Invite team members, assign roles and disable accounts that should no longer have access.
        </p>
      </div>

      <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold text-forest-950">What each role can do</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {adminRoles.map((role) => (
            <div key={role} className="rounded-2xl bg-forest-50/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-forest-600">{roleLabels[role]}</p>
              <p className="mt-2 text-xs leading-relaxed text-forest-900/75">{roleDescriptions[role]}</p>
            </div>
          ))}
        </div>
      </section>

      <UsersManager
        users={users.flatMap((user) =>
          isStaffRole(user.role)
            ? [{ ...user, role: user.role, createdAt: user.createdAt.toISOString() }]
            : [],
        )}
        currentUserId={session.sub}
        canWrite={can(session.role, "users:write")}
      />
    </div>
  );
}

function isStaffRole(role: string): role is AdminRoleValue {
  return (adminRoles as readonly string[]).includes(role);
}

const roleDescriptions = {
  SUPER_ADMIN: "Full access, including creating users and changing roles.",
  ADMIN: "Manage submissions, devices and view users. Cannot change roles.",
  STAFF: "Manage daily submissions and device workflow. No user management.",
  VIEWER: "Read-only access to dashboards, submissions and devices.",
} as const;
