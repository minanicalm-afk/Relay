"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deviceStatuses, type DeviceStatusValue } from "@/lib/options";
import { deviceStatusLabels } from "@/lib/admin";

type Props = {
  id: string;
  status: DeviceStatusValue;
  outcomeNote: string;
  canWrite: boolean;
};

export function DeviceUpdateForm({ id, status, outcomeNote, canWrite }: Props) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState<DeviceStatusValue>(status);
  const [note, setNote] = useState(outcomeNote);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!canWrite) {
    return (
      <div className="rounded-3xl border border-forest-100 bg-forest-50/60 p-5 text-sm text-forest-900/75">
        You have read-only access to device records.
      </div>
    );
  }

  async function save() {
    setBusy(true);
    setError("");
    setMessage("");
    const response = await fetch(`/admin/api/devices/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, outcomeNote: note }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Could not save changes.");
      setBusy(false);
      return;
    }
    setMessage("Device updated.");
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
      <h3 className="text-base font-semibold text-forest-950">Update device</h3>
      <div className="mt-5 space-y-4">
        <div>
          <label className="field-label" htmlFor="device-status">Status</label>
          <select id="device-status" className="field-input" value={nextStatus} onChange={(e) => setNextStatus(e.target.value as DeviceStatusValue)}>
            {deviceStatuses.map((value) => (
              <option key={value} value={value}>{deviceStatusLabels[value]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="device-note">Outcome notes</label>
          <textarea
            id="device-note"
            className="field-input min-h-24 resize-y"
            placeholder="Diagnosis result, repair notes, donation/recycling destination..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="field-error mt-3" role="alert">{error}</p>}
      {message && (
        <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-forest-700" role="status">
          <Check className="h-3.5 w-3.5" /> {message}
        </p>
      )}
      <Button className="mt-5" onClick={save} disabled={busy}>
        {busy ? "Saving..." : "Save device"}
      </Button>
    </div>
  );
}
