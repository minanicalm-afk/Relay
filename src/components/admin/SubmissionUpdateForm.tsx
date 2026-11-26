"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { submissionStatuses, type SubmissionStatusValue } from "@/lib/options";
import { submissionStatusLabels } from "@/lib/admin";

type Props = {
  id: string;
  status: SubmissionStatusValue;
  assignedToId: string | null;
  scheduledAt: string;
  notes: string;
  users: { id: string; name: string; email: string }[];
  canWrite: boolean;
};

export function SubmissionUpdateForm({ id, status, assignedToId, scheduledAt, notes, users, canWrite }: Props) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState<SubmissionStatusValue>(status);
  const [assignee, setAssignee] = useState(assignedToId ?? "");
  const [schedule, setSchedule] = useState(scheduledAt);
  const [nextNotes, setNextNotes] = useState(notes);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!canWrite) {
    return (
      <div className="rounded-3xl border border-forest-100 bg-forest-50/60 p-5 text-sm text-forest-900/75">
        You have read-only access. Contact a super admin or operations staff member to update this submission.
      </div>
    );
  }

  async function save() {
    setBusy(true);
    setError("");
    setMessage("");
    const response = await fetch(`/admin/api/submissions/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        assignedToId: assignee,
        scheduledAt: schedule ? new Date(schedule).toISOString() : "",
        notes: nextNotes,
      }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Could not save changes.");
      setBusy(false);
      return;
    }
    setMessage("Changes saved.");
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
      <h3 className="text-base font-semibold text-forest-950">Update workflow</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="submission-status">Status</label>
          <select id="submission-status" className="field-input" value={nextStatus} onChange={(e) => setNextStatus(e.target.value as SubmissionStatusValue)}>
            {submissionStatuses.map((value) => (
              <option key={value} value={value}>{submissionStatusLabels[value]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="submission-assignee">Assigned to</label>
          <select id="submission-assignee" className="field-input" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name} · {user.email}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="submission-schedule">Scheduled for</label>
          <input
            id="submission-schedule"
            type="datetime-local"
            className="field-input"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="submission-notes">Internal notes</label>
          <textarea
            id="submission-notes"
            className="field-input min-h-28 resize-y"
            placeholder="Pickup details, follow-up notes, handover information..."
            value={nextNotes}
            onChange={(e) => setNextNotes(e.target.value)}
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
        {busy ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
}
