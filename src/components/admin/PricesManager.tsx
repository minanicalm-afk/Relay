"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatAmount, formatDay } from "@/lib/admin";
import {
  AGES,
  CONDITIONS,
  DEVICE_CATEGORIES,
  type Age,
  type Condition,
  type DeviceCategory,
} from "@/lib/pricing";

export type PriceRow = {
  id: string;
  deviceType: string;
  brand: string | null;
  modelName: string | null;
  age: string | null;
  condition: string | null;
  price: number;
  active: boolean;
  notes: string | null;
  createdAt: string;
};

const emptyForm = {
  deviceType: "laptop",
  brand: "",
  modelName: "",
  age: "",
  condition: "",
  price: "",
  active: true,
  notes: "",
};

export function PricesManager({ prices }: { prices: PriceRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(price: PriceRow) {
    setEditingId(price.id);
    setForm({
      deviceType: price.deviceType,
      brand: price.brand ?? "",
      modelName: price.modelName ?? "",
      age: price.age ?? "",
      condition: price.condition ?? "",
      price: String(price.price),
      active: price.active,
      notes: price.notes ?? "",
    });
    setMessage("");
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  async function save() {
    const numericPrice = Number(form.price);
    if (!form.deviceType || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Choose a device type and enter a positive price.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    const payload = {
      deviceType: form.deviceType,
      brand: form.brand,
      modelName: form.modelName,
      age: form.age,
      condition: form.condition,
      price: Math.round(numericPrice),
      active: form.active,
      notes: form.notes,
    };

    const response = await fetch(editingId ? `/admin/api/prices/${editingId}` : "/admin/api/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setError(data.error ?? "Could not save price.");
      setBusy(false);
      return;
    }

    setMessage(editingId ? "Price updated." : "Price added to the catalog.");
    resetForm();
    setBusy(false);
    router.refresh();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this price rule?")) return;
    const response = await fetch(`/admin/api/prices/${id}`, { method: "DELETE" });
    if (response.ok) {
      setMessage("Price deleted.");
      if (editingId === id) resetForm();
      router.refresh();
    } else {
      setError("Could not delete price.");
    }
  }

  return (
    <div className="space-y-7">
      <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          {editingId ? <Pencil className="h-4 w-4 text-forest-600" /> : <Plus className="h-4 w-4 text-forest-600" />}
          <h2 className="text-base font-semibold text-forest-950">
            {editingId ? "Edit price rule" : "Add a price rule"}
          </h2>
        </div>
        <p className="mt-2 text-xs text-forest-900/70">
          Leave brand, model, age or condition blank to make the rule apply more broadly. More specific rules win when offers are matched.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="field-label" htmlFor="price-device-type">Device type *</label>
            <select
              id="price-device-type"
              className="field-input"
              value={form.deviceType}
              onChange={(e) => setField("deviceType", e.target.value as DeviceCategory)}
            >
              {DEVICE_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="price-brand">Brand</label>
            <input id="price-brand" className="field-input" placeholder="e.g. Dell, HP, Apple" value={form.brand} onChange={(e) => setField("brand", e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="price-model">Model</label>
            <input id="price-model" className="field-input" placeholder="e.g. Latitude 7440" value={form.modelName} onChange={(e) => setField("modelName", e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="price-age">Age</label>
            <select id="price-age" className="field-input" value={form.age} onChange={(e) => setField("age", e.target.value as Age | "")}>
              <option value="">Any age</option>
              {AGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="price-condition">Condition</label>
            <select id="price-condition" className="field-input" value={form.condition} onChange={(e) => setField("condition", e.target.value as Condition | "")}>
              <option value="">Any condition</option>
              {CONDITIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="price-amount">Base price (KSh) *</label>
            <input id="price-amount" type="number" min="1" step="100" className="field-input" placeholder="45000" value={form.price} onChange={(e) => setField("price", e.target.value)} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="field-label" htmlFor="price-notes">Internal notes</label>
            <input id="price-notes" className="field-input" placeholder="Optional sourcing or review notes" value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
          </div>
          <label className="flex items-end gap-2 pb-3 text-xs font-semibold text-forest-800">
            <input type="checkbox" className="h-4 w-4 accent-forest-700" checked={form.active} onChange={(e) => setField("active", e.target.checked)} />
            Active — use in offers
          </label>
        </div>

        {error && <p className="field-error mt-4" role="alert">{error}</p>}
        {message && (
          <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-forest-700" role="status">
            <Check className="h-3.5 w-3.5" /> {message}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={save} disabled={busy}>
            {busy ? "Saving..." : editingId ? "Update price" : "Add price"}
          </Button>
          {editingId && (
            <Button variant="ghost" onClick={resetForm}>
              Cancel edit
            </Button>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-forest-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-forest-50 text-xs uppercase tracking-wide text-forest-700">
              <tr>
                <th className="px-5 py-3 font-semibold">Device</th>
                <th className="px-5 py-3 font-semibold">Rules</th>
                <th className="px-5 py-3 font-semibold">Base price</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Added</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {prices.map((price) => (
                <tr key={price.id} className={editingId === price.id ? "bg-lime-50/50" : undefined}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-forest-950">
                      {DEVICE_CATEGORIES.find((item) => item.value === price.deviceType)?.label ?? price.deviceType}
                    </p>
                    <p className="text-xs text-forest-900/70">{[price.brand, price.modelName].filter(Boolean).join(" ") || "Any brand/model"}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-forest-900/80">
                    {price.age ? AGES.find((item) => item.value === price.age)?.label ?? price.age : "Any age"}
                    {" · "}
                    {price.condition ? CONDITIONS.find((item) => item.value === price.condition)?.label ?? price.condition : "Any condition"}
                  </td>
                  <td className="px-5 py-4 font-semibold text-forest-900">{formatAmount(price.price)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${price.active ? "bg-emerald-100 text-emerald-900" : "bg-slate-200 text-slate-700"}`}>
                      {price.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-forest-900/80">{formatDay(price.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(price)} className="rounded-full border border-forest-200 px-3 py-1.5 text-xs font-semibold text-forest-800 transition hover:border-forest-400">
                        Edit
                      </button>
                      <button type="button" onClick={() => remove(price.id)} className="rounded-full border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {prices.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-semibold text-forest-900">No price rules yet.</p>
            <p className="mt-1 text-xs text-forest-900/70">Add computer prices above and the sell flow will use them immediately.</p>
          </div>
        )}
      </section>
    </div>
  );
}
