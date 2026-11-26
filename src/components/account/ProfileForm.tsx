"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Props = {
  name: string;
  email: string;
  phone: string;
  hasPassword?: boolean;
};

export function ProfileForm({ name, email, phone, hasPassword = true }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name,
    email,
    phone,
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  function setField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setBusy(true);
    setError("");
    setSaved(false);
    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Could not save your profile.");
      return;
    }
    setForm((current) => ({ ...current, currentPassword: "", newPassword: "" }));
    setSaved(true);
    router.refresh();
  }

  return (
    <form
      className="rounded-3xl border border-forest-100 bg-white p-5 shadow-card sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <h2 className="text-lg font-semibold text-forest-950">Your details</h2>
      <p className="mt-1 text-sm text-forest-900/70">
        {hasPassword
          ? "Update the name, email and phone we use when you get in touch. Leave the password fields blank to keep your current password."
          : "You signed in with Google. Add a password here if you also want to sign in with email."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="profile-name">Name</label>
          <input id="profile-name" className="field-input" value={form.name} onChange={(event) => setField("name", event.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="profile-email">Email</label>
          <input id="profile-email" type="email" className="field-input" value={form.email} onChange={(event) => setField("email", event.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="profile-phone">Phone</label>
          <input id="profile-phone" className="field-input" value={form.phone} placeholder="+254 7..." onChange={(event) => setField("phone", event.target.value)} />
        </div>
        {hasPassword && (
          <div>
            <label className="field-label" htmlFor="profile-current-password">Current password</label>
            <input id="profile-current-password" type="password" className="field-input" value={form.currentPassword} autoComplete="current-password" onChange={(event) => setField("currentPassword", event.target.value)} />
          </div>
        )}
        <div className={hasPassword ? undefined : "sm:col-span-2"}>
          <label className="field-label" htmlFor="profile-new-password">{hasPassword ? "New password" : "Password"}</label>
          <input id="profile-new-password" type="password" className="field-input" value={form.newPassword} autoComplete="new-password" onChange={(event) => setField("newPassword", event.target.value)} />
        </div>
      </div>

      {error && <p className="field-error mt-4" role="alert">{error}</p>}
      {saved && (
        <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-forest-700" role="status">
          <Check className="h-3.5 w-3.5" /> Profile saved.
        </p>
      )}

      <Button className="mt-6" type="submit" disabled={busy}>
        {busy ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
