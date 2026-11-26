export type PublicSubmissionType = "CONTACT" | "PICKUP" | "DONATION" | "PARTNERSHIP" | "SELL";
export type PublicSubmissionStatus = "IN_PROGRESS" | "CANCELLED";

export type DevicePayload = {
  deviceType: string;
  brand?: string;
  model?: string;
  age?: string;
  condition?: string;
  accessories?: string[];
  description?: string;
  offerAmount?: number;
  pricingSource?: string;
  matchedPrice?: string | null;
  reference?: string;
  photoNames?: string[];
  receiptName?: string;
};

export type SaveSubmissionPayload = {
  type: PublicSubmissionType;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  message?: string;
  details?: Record<string, unknown>;
  device?: DevicePayload;
};

export type SaveSubmissionResult = { ok: boolean; id?: string; token?: string; demo?: boolean };

export async function saveSubmission(
  payload: SaveSubmissionPayload,
): Promise<SaveSubmissionResult> {
  try {
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return { ok: false };
    const data = (await response.json()) as { id?: string; token?: string; demo?: boolean };
    return { ok: true, id: data.id, token: data.token, demo: data.demo };
  } catch {
    return { ok: false };
  }
}

export async function updateSubmissionStatus(
  id: string,
  status: PublicSubmissionStatus,
  token: string,
): Promise<{ ok: boolean }> {
  try {
    const response = await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, token }),
    });
    return { ok: response.ok };
  } catch {
    return { ok: false };
  }
}
