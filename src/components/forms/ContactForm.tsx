"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { saveSubmission, type PublicSubmissionType } from "@/lib/submissions-client";
import { openWhatsApp } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const purposes = [
  "Book a free pickup",
  "General enquiry",
  "Donate electronics",
  "Organisation IT upgrade",
  "Sell my electronics",
  "Something else",
];

const areas = ["Juja", "Nairobi", "Other / not sure yet"];

const purposeTypes: Record<string, PublicSubmissionType> = {
  "Book a free pickup": "PICKUP",
  "General enquiry": "CONTACT",
  "Donate electronics": "DONATION",
  "Organisation IT upgrade": "CONTACT",
  "Sell my electronics": "SELL",
  "Something else": "CONTACT",
};

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please tell us your name.";
    if (!phone.trim()) next.phone = "Please share a phone number.";
    if (!purpose) next.purpose = "Choose what you need help with.";
    setErrors(next);
    if (Object.keys(next).length) return;

    await saveSubmission({
      type: purposeTypes[purpose] ?? "CONTACT",
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim(),
      location: area || undefined,
      message: message.trim() || undefined,
      details: {
        purpose,
        preferredDate: date || undefined,
      },
    });

    openWhatsApp(
      `Hello Relay! I would like to get in touch.\n\n` +
        `Name: ${name.trim()}\n` +
        `Phone: ${phone.trim()}\n` +
        `Email: ${email.trim() || "Not provided"}\n` +
        `I need help with: ${purpose}\n` +
        `Area: ${area || "Not specified"}\n` +
        `Preferred date: ${date || "Flexible"}\n` +
        `Message: ${message.trim() || "Not provided"}`,
    );
  }

  return (
    <div className="flex h-full flex-col rounded-4xl border border-forest-100 bg-white p-6 shadow-card sm:p-9">
      <h2 className="text-2xl font-semibold text-forest-950">Send us a message</h2>
      <p className="mt-2 text-sm text-forest-900/75">
        Fill this in and we will open WhatsApp with your details ready to send —
        no form goes unanswered.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">Your name *</label>
          <input id="name" className="field-input" placeholder="Full name" value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="phone">Phone number *</label>
          <input id="phone" className="field-input" placeholder="+254 7..." value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }} />
          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="email">Email (optional)</label>
          <input id="email" type="email" className="field-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="purpose">What do you need? *</label>
          <select id="purpose" className="field-input" value={purpose} onChange={(e) => { setPurpose(e.target.value); setErrors((p) => ({ ...p, purpose: "" })); }}>
            <option value="">Select an option</option>
            {purposes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          {errors.purpose && <p className="field-error">{errors.purpose}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="area">Your area</label>
          <select id="area" className="field-input" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Select an area</option>
            {areas.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="date">Preferred pickup date (optional)</label>
          <input id="date" type="date" className="field-input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div className="mt-5">
        <label className="field-label" htmlFor="message">Tell us more (optional)</label>
        <textarea id="message" className="field-input min-h-28 resize-y" placeholder="What devices do you have? Any notes for our team..." value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={submit} icon={<ArrowRight className="h-4 w-4" />}>
        Send via WhatsApp
      </Button>
      <p className="mt-4 flex items-center gap-2 text-xs text-forest-900/80">
        <WhatsAppIcon className="h-3.5 w-3.5 text-green-600" />
        You will review the message in WhatsApp before sending. Nothing is sent automatically.
      </p>
      <div className="mt-auto flex items-start gap-2 rounded-2xl bg-forest-50 p-4 pt-6 text-xs text-forest-900/75">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
        Prefer to call? Reach us on the number listed beside this form — we are here Monday to Saturday.
      </div>
    </div>
  );
}
