"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { adminRoles, type AdminRoleValue } from "@/lib/options";
import { formatDay, roleLabels } from "@/lib/admin";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: AdminRoleValue;
  active: boolean;
  createdAt: string;
};

type Props = {
  users: AdminUserRow[];
  currentUserId: string;
  canWrite: boolean;
};

export function UsersManager({ users, currentUserId, canWrite }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRoleValue>("STAFF");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function createUser() {
    setBusy(true);
    setError("");
    setMessage("");
    const response = await fetch("/admin/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Could not create user.");
      setBusy(false);
      return;
    }
    setName("");
    setEmail("");
    setPassword("");
    setRole("STAFF");
    setMessage("User created. They can sign in with the password you set.");
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="space-y-7">
      {canWrite && (
      <div className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-forest-600" />
          <h2 className="text-base font-semibold text-forest-950">Add a team member</h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="new-user-name">Name</label>
            <input id="new-user-name" className="field-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="new-user-email">Email</label>
            <input id="new-user-email" type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="new-user-password">Temporary password (8+ characters)</label>
            <input id="new-user-password" type="password" className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="new-user-role">Role</label>
            <select id="new-user-role" className="field-input" value={role} onChange={(e) => setRole(e.target.value as AdminRoleValue)}>
              {adminRoles.map((value) => (
                <option key={value} value={value}>{roleLabels[value]}</option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="field-error mt-4" role="alert">{error}</p>}
        {message && (
          <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-forest-700" role="status">
            <Check className="h-3.5 w-3.5" /> {message}
          </p>
        )}
        <Button className="mt-5" onClick={createUser} disabled={busy}>
          {busy ? "Creating..." : "Create user"}
        </Button>
      </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-forest-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-forest-50 text-xs uppercase tracking-wide text-forest-700">
              <tr>
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {users.map((user) => (
                <UserRow key={user.id} user={user} isSelf={user.id === currentUserId} canWrite={canWrite} onRefresh={router.refresh} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UserRow({ user, isSelf, canWrite, onRefresh }: { user: AdminUserRow; isSelf: boolean; canWrite: boolean; onRefresh: () => void }) {
  const [role, setRole] = useState<AdminRoleValue>(user.role);
  const [active, setActive] = useState(user.active);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setSaved(false);
    await fetch(`/admin/api/users/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, active }),
    });
    setBusy(false);
    setSaved(true);
    onRefresh();
  }

  return (
    <tr className={isSelf ? "bg-lime-50/40" : undefined}>
      <td className="px-5 py-4">
        <p className="font-semibold text-forest-950">
          {user.name}
          {isSelf && <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-forest-500">you</span>}
        </p>
        <p className="text-xs text-forest-900/70">{user.email}</p>
      </td>
      <td className="px-5 py-4">
        <select className="field-input h-10 py-0 text-xs" value={role} disabled={isSelf || !canWrite} onChange={(e) => { setRole(e.target.value as AdminRoleValue); setSaved(false); }}>
          {adminRoles.map((value) => (
            <option key={value} value={value}>{roleLabels[value]}</option>
          ))}
        </select>
      </td>
      <td className="px-5 py-4">
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-forest-800">
          <input type="checkbox" className="h-4 w-4 accent-forest-700" checked={active} disabled={isSelf || !canWrite} onChange={(e) => { setActive(e.target.checked); setSaved(false); }} />
          {active ? "Active" : "Disabled"}
        </label>
      </td>
      <td className="px-5 py-4 text-xs text-forest-900/75">{formatDay(user.createdAt)}</td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={save}
            disabled={busy || isSelf || !canWrite}
            className="rounded-full border border-forest-200 px-3 py-1.5 text-xs font-semibold text-forest-800 transition hover:border-forest-400 disabled:opacity-50"
          >
            {busy ? "Saving..." : "Save"}
          </button>
          {saved && <Check className="h-3.5 w-3.5 text-forest-600" />}
        </div>
      </td>
    </tr>
  );
}
