"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { partnerTypes } from "@/lib/data";
import { openWhatsApp } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const interests = [
  "Tree planting",
  "Recycling drives",
  "Charity marathons",
  "Donations to needy / orphanages",
  "IT upgrades for our organisation",
  "Something else",
];

export function PartnerForm() {
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit() {
    const next: Record<string, string> = {};
    if (!org.trim()) next.org = "Tell us your organisation's name.";
    if (!name.trim()) next.name = "Please share your name.";
    if (!type) next.type = "Select an organisation type.";
    if (selected.length === 0) next.interests = "Pick at least one area of interest.";
    setErrors(next);
    if (Object.keys(next).length) return;

    openWhatsApp(
      `Hello Relay! I'd like to explore a partnership.\n\n` +
        `Organisation: ${org.trim()}\n` +
        `Contact: ${name.trim()}\n` +
        `Email: ${email.trim() || "Not provided"}\n` +
        `Phone: ${phone.trim() || "Not provided"}\n` +
        `Type: ${type}\n` +
        `Interested in: ${selected.join(", ")}\n` +
        `Message: ${message.trim() || "Not provided"}\n\n` +
        `I'd love to schedule a short conversation.`,
    );
  }

  function toggle(value: string) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
    setErrors((prev) => ({ ...prev, interests: "" }));
  }

  return (
    <div className="rounded-4xl border border-forest-100 bg-white p-6 shadow-card sm:p-9">
      <h2 className="text-2xl font-semibold text-forest-950">Start a partnership</h2>
      <p className="mt-2 text-sm text-forest-900/75">
        Tell us a little about your organisation. This opens WhatsApp with your
        details ready to send.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="org">Organisation name *</label>
          <input id="org" className="field-input" placeholder="e.g. Green Future Initiative" value={org} onChange={(e) => { setOrg(e.target.value); setErrors((p) => ({ ...p, org: "" })); }} />
          {errors.org && <p className="field-error">{errors.org}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="p-name">Your name *</label>
          <input id="p-name" className="field-input" placeholder="Full name" value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="p-email">Email</label>
          <input id="p-email" type="email" className="field-input" placeholder="you@organisation.org" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="p-phone">Phone</label>
          <input id="p-phone" className="field-input" placeholder="+254 ..." value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div className="mt-5">
        <label className="field-label" htmlFor="p-type">Type of organisation *</label>
        <select id="p-type" className="field-input" value={type} onChange={(e) => { setType(e.target.value); setErrors((p) => ({ ...p, type: "" })); }}>
          <option value="">Select a category</option>
          {partnerTypes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        {errors.type && <p className="field-error">{errors.type}</p>}
      </div>

      <div className="mt-6">
        <p className="field-label">What would you like to work on? *</p>
        <div className="flex flex-wrap gap-2">
          {interests.map((item) => {
            const active = selected.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggle(item)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${active ? "border-forest-700 bg-forest-800 text-white" : "border-forest-100 bg-white text-forest-700 hover:border-forest-300"}`}
              >
                {active && <Check className="h-3.5 w-3.5" />}
                {item}
              </button>
            );
          })}
        </div>
        {errors.interests && <p className="field-error">{errors.interests}</p>}
      </div>

      <div className="mt-6">
        <label className="field-label" htmlFor="p-message">Anything else? (optional)</label>
        <textarea id="p-message" className="field-input min-h-24 resize-y" placeholder="Tell us about your goals, audience or timeline..." value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={submit} icon={<ArrowRight className="h-4 w-4" />}>
        Send partnership enquiry
      </Button>
      <p className="mt-4 flex items-center gap-2 text-xs text-forest-900/80">
        <WhatsAppIcon className="h-3.5 w-3.5 text-green-600" />
        Opens WhatsApp so your message is delivered straight to our team.
      </p>
    </div>
  );
}
