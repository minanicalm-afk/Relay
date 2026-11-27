/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  CircleCheck,
  FileCheck2,
  Info,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  ACCESSORIES,
  AGES,
  CONDITIONS,
  DEVICE_CATEGORIES,
  type Accessory,
  type Age,
  type Condition,
  type DeviceCategory,
  type OfferResult,
} from "@/lib/pricing";
import { requestOffer } from "@/lib/offers-client";
import { cn, formatKES, formatRange, generateReference } from "@/lib/utils";
import { saveSubmission, updateSubmissionStatus, type SaveSubmissionPayload } from "@/lib/submissions-client";
import { openWhatsApp } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const stepLabels = ["Your device", "Photos & proof", "Your offer"];

export function SellForm() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<DeviceCategory | "">("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [age, setAge] = useState<Age | "">("");
  const [condition, setCondition] = useState<Condition | "">("");
  const [description, setDescription] = useState("");
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [offer, setOffer] = useState<OfferResult | null>(null);
  const [offerSource, setOfferSource] = useState<{ catalogUsed: boolean; label?: string }>({
    catalogUsed: false,
  });
  const [reference, setReference] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submissionToken, setSubmissionToken] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [demoSaved, setDemoSaved] = useState(false);
  const [actionState, setActionState] = useState<"idle" | "saving">("idle");

  useEffect(() => {
    return () => {
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photoPreviews]);

  const categoryLabel = useMemo(
    () => DEVICE_CATEGORIES.find((c) => c.value === category)?.label ?? "Device",
    [category],
  );
  const conditionLabel = CONDITIONS.find((c) => c.value === condition)?.label ?? "-";
  const ageLabel = AGES.find((a) => a.value === age)?.label ?? "-";
  const accessoryLabels = accessories.map(
    (a) => ACCESSORIES.find((item) => item.value === a)?.label ?? a,
  );

  function validateStepOne() {
    const next: Record<string, string> = {};
    if (!category) next.category = "Select a device type.";
    if (brand.trim().length < 2) next.brand = "Tell us the brand.";
    if (!age) next.age = "Select the age of the device.";
    if (!condition) next.condition = "Select the condition.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateStepTwo() {
    const next: Record<string, string> = {};
    if (photos.length === 0) next.photos = "Upload at least one photo of your device.";
    if (!receipt) next.receipt = "Upload a receipt or proof of ownership.";
    if (!confirmed) next.confirmed = "Please confirm that you own this device.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handlePhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, 5);
    setPhotos(files);
    setPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
    setErrors((prev) => ({ ...prev, photos: "" }));
  }

  function handleReceipt(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setReceipt(file);
    if (file) setErrors((prev) => ({ ...prev, receipt: "" }));
  }

  function toggleAccessory(value: Accessory) {
    setAccessories((prev) =>
      prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value],
    );
  }

  async function nextStep() {
    if (step === 1 && validateStepOne()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 2 && validateStepTwo()) {
      const result = await requestOffer({
        category: category as DeviceCategory,
        brand,
        model: model.trim(),
        condition: condition as Condition,
        age: age as Age,
        accessories,
      });
      const nextReference = generateReference();
      setOffer(result);
      setOfferSource({ catalogUsed: result.catalogUsed, label: result.matchedPriceLabel });
      setReference(nextReference);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });

      setSaveState("saving");
      const saved = await saveSubmission({
        type: "SELL",
        name: name.trim() || "Seller via website",
        message: description.trim(),
        details: {
          reference: nextReference,
          category,
          brand: brand.trim(),
          model: model.trim(),
          age,
          condition,
          accessories,
          estimatedOffer: result.estimate,
          offerRange: { min: result.min, max: result.max },
          pricingSource: result.catalogUsed ? `catalog:${result.matchedPriceId ?? "matched"}` : "built-in estimate",
          matchedPrice: result.matchedPriceLabel ?? null,
        } satisfies SaveSubmissionPayload["details"],
        device: {
          deviceType: categoryLabel,
          brand: brand.trim(),
          model: model.trim(),
          age: ageLabel,
          condition: conditionLabel,
          accessories: accessoryLabels,
          description: description.trim(),
          offerAmount: result.estimate,
          pricingSource: result.catalogUsed ? `catalog:${result.matchedPriceId ?? "matched"}` : "built-in estimate",
          matchedPrice: result.matchedPriceLabel ?? null,
          reference: nextReference,
          photoNames: photos.map((file) => file.name),
          receiptName: receipt?.name,
        },
      });
      setSubmissionId(saved.id ?? null);
      setSubmissionToken(saved.token ?? null);
      setDemoSaved(Boolean(saved.demo));
      setSaveState(saved.ok ? "saved" : "failed");
    }
  }

  function buildDetails() {
    return [
      `*Reference:* ${reference}`,
      `Device: ${categoryLabel}`,
      `Brand: ${brand.trim()}${model.trim() ? ` ${model.trim()}` : ""}`,
      `Age: ${ageLabel}`,
      `Condition: ${conditionLabel}`,
      `Included: ${accessoryLabels.length ? accessoryLabels.join(", ") : "None listed"}`,
      description.trim() ? `Notes: ${description.trim()}` : "",
      `Photos uploaded: ${photos.length}`,
      `Proof of ownership uploaded: ${receipt ? receipt.name : "No"}`,
      name.trim() ? `Name: ${name.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function recordAction(status: "IN_PROGRESS" | "CANCELLED") {
    if (!submissionId || !submissionToken) return;
    setActionState("saving");
    await updateSubmissionStatus(submissionId, status, submissionToken);
    setActionState("idle");
  }

  async function acceptOffer() {
    openWhatsApp(
      `Hello Novacycle! I would like to ACCEPT my instant offer.\n\n${buildDetails()}\n\nIndicative offer: ${formatKES(offer?.estimate ?? 0)} (range ${formatRange(offer?.min ?? 0, offer?.max ?? 0)}).\n\nPhotos and proof of ownership are uploaded on your website. Please let me know the next step for handover.`,
    );
    void recordAction("IN_PROGRESS");
  }

  async function bargain() {
    openWhatsApp(
      `Hello Novacycle! I receive your offer of ${formatKES(offer?.estimate ?? 0)}, but I would like to discuss the price.\n\n${buildDetails()}\n\nI believe my device is worth a little more — can we talk?`,
    );
    void recordAction("IN_PROGRESS");
  }

  function reset() {
    photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    setStep(1);
    setCategory("");
    setBrand("");
    setModel("");
    setAge("");
    setCondition("");
    setDescription("");
    setAccessories([]);
    setPhotos([]);
    setPhotoPreviews([]);
    setReceipt(null);
    setName("");
    setConfirmed(false);
    setErrors({});
    setOffer(null);
    setOfferSource({ catalogUsed: false });
    setReference("");
    setCancelled(false);
    setSubmissionId(null);
    setSubmissionToken(null);
    setDemoSaved(false);
    setSaveState("idle");
    setActionState("idle");
  }

  if (cancelled) {
    return (
      <div className="rounded-4xl border border-forest-100 bg-white p-10 text-center shadow-card sm:p-14">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-forest-100 text-forest-700">
          <Check className="h-8 w-8" />
        </span>
        <h2 className="mt-6 text-2xl font-semibold text-forest-950">No problem at all.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-forest-900/80">
          No WhatsApp message was sent. We marked your saved enquiry as
          cancelled so our team will not follow up. Come back whenever you are
          ready — we are always here.
        </p>
        <Button className="mt-7" onClick={reset} icon={<RotateCcw className="h-4 w-4" />}>
          Start a new enquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-4xl border border-forest-100 bg-white shadow-lift">
      {/* Progress */}
      <div className="border-b border-forest-100 bg-forest-50/60 px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center">
          {stepLabels.map((label, index) => {
            const value = index + 1;
            const done = step > value;
            const active = step === value;
            return (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-full text-sm font-bold transition",
                      done
                        ? "bg-forest-800 text-lime-400"
                        : active
                          ? "bg-lime-500 text-forest-950 shadow-[0_8px_20px_-8px_rgba(163,230,53,0.9)]"
                          : "bg-white text-forest-400 ring-1 ring-forest-100",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : value}
                  </span>
                  <span
                    className={cn(
                      "hidden text-xs font-semibold sm:block",
                      active || done ? "text-forest-900" : "text-forest-900/75",
                    )}
                  >
                    {label}
                  </span>
                </div>
                {index < stepLabels.length - 1 && (
                  <div
                    className={cn(
                      "mx-3 h-1 flex-1 rounded-full sm:mx-5",
                      done ? "bg-forest-700" : "bg-forest-100",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-5 sm:p-8 lg:p-10">
        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-500">
                Step 1 of 3
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-forest-950 sm:text-3xl">
                Tell us about your device
              </h2>
              <p className="mt-2 text-sm text-forest-900/75">
                A few details help us calculate a fair, accurate offer.
              </p>
            </div>

            <div className="mt-8">
              <label className="field-label">What type of device is it? *</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {DEVICE_CATEGORIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setCategory(item.value);
                      setErrors((prev) => ({ ...prev, category: "" }));
                    }}
                    className={cn(
                      "rounded-2xl border px-3 py-3 text-center text-xs font-semibold transition sm:text-sm",
                      category === item.value
                        ? "border-forest-700 bg-forest-800 text-white shadow-card"
                        : "border-forest-100 bg-white text-forest-800 hover:border-forest-300",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {errors.category && <p className="field-error">{errors.category}</p>}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="brand">Brand *</label>
                <input
                  id="brand"
                  className="field-input"
                  placeholder="e.g. Apple, Dell, Samsung"
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setErrors((prev) => ({ ...prev, brand: "" }));
                  }}
                />
                {errors.brand && <p className="field-error">{errors.brand}</p>}
              </div>
              <div>
                <label className="field-label" htmlFor="model">Model (optional)</label>
                <input
                  id="model"
                  className="field-input"
                  placeholder="e.g. MacBook Air M1"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="field-label" htmlFor="age">How old is it? *</label>
              <select
                id="age"
                className="field-input"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value as Age);
                  setErrors((prev) => ({ ...prev, age: "" }));
                }}
              >
                <option value="">Select age</option>
                {AGES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              {errors.age && <p className="field-error">{errors.age}</p>}
            </div>

            <div className="mt-6">
              <label className="field-label">What condition is it in? *</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {CONDITIONS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setCondition(item.value);
                      setErrors((prev) => ({ ...prev, condition: "" }));
                    }}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4 text-left transition",
                      condition === item.value
                        ? "border-forest-600 bg-forest-50 ring-2 ring-forest-100"
                        : "border-forest-100 bg-white hover:border-forest-300",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                        condition === item.value
                          ? "border-forest-700 bg-forest-700 text-white"
                          : "border-forest-200",
                      )}
                    >
                      {condition === item.value && <Check className="h-3 w-3" />}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-forest-950">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-forest-900/70">{item.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
              {errors.condition && <p className="field-error">{errors.condition}</p>}
            </div>

            <div className="mt-8 flex justify-end">
              <Button size="lg" onClick={nextStep} icon={<ArrowRight className="h-4 w-4" />}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-500">
                Step 2 of 3
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-forest-950 sm:text-3xl">
                Show us the details
              </h2>
              <p className="mt-2 text-sm text-forest-900/75">
                Clear photos and proof of ownership help us give you a better,
                safer offer.
              </p>
            </div>

            <div className="mt-8">
              <label className="field-label" htmlFor="description">Anything else we should know? (optional)</label>
              <textarea
                id="description"
                className="field-input min-h-24 resize-y"
                placeholder="Faults, upgrades, what is included, why you are selling..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mt-6">
              <p className="field-label">Included with the device (optional)</p>
              <div className="flex flex-wrap gap-2">
                {ACCESSORIES.map((item) => {
                  const selected = accessories.includes(item.value);
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => toggleAccessory(item.value)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition",
                        selected
                          ? "border-forest-700 bg-forest-800 text-white"
                          : "border-forest-100 bg-white text-forest-700 hover:border-forest-300",
                      )}
                    >
                      {selected && <Check className="h-3.5 w-3.5" />}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7 grid gap-6 lg:grid-cols-2">
              {/* Photos */}
              <div>
                <p className="field-label">Photos of your device *</p>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-forest-200 bg-forest-50/50 px-4 py-8 text-center transition hover:border-forest-400 hover:bg-forest-50">
                  <UploadCloud className="h-7 w-7 text-forest-500" />
                  <span className="mt-3 text-sm font-semibold text-forest-800">
                    Click to upload photos
                  </span>
                  <span className="mt-1 text-xs text-forest-900/80">
                    JPG, PNG or WEBP · up to 5 images
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotos}
                  />
                </label>
                {errors.photos && <p className="field-error">{errors.photos}</p>}
                {photoPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {photoPreviews.map((url, index) => (
                      <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-forest-100 bg-forest-50">
                        <img src={url} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setPhotos((prev) => prev.filter((_, i) => i !== index));
                            setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
                          }}
                          className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-forest-950/80 text-white opacity-0 transition group-hover:opacity-100"
                          aria-label="Remove photo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Receipt */}
              <div>
                <p className="field-label">Receipt / proof of ownership *</p>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-forest-200 bg-forest-50/50 px-4 py-8 text-center transition hover:border-forest-400 hover:bg-forest-50">
                  <FileCheck2 className="h-7 w-7 text-forest-500" />
                  <span className="mt-3 text-sm font-semibold text-forest-800">
                    Click to upload receipt
                  </span>
                  <span className="mt-1 text-xs text-forest-900/80">
                    Image or PDF · purchase receipt or proof
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleReceipt}
                  />
                </label>
                {errors.receipt && <p className="field-error">{errors.receipt}</p>}
                {receipt && (
                  <div className="mt-3 flex items-center gap-3 rounded-2xl border border-forest-100 bg-white p-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                      <FileCheck2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-forest-900">{receipt.name}</p>
                      <p className="text-[11px] text-forest-900/80">
                        {(receipt.size / 1024).toFixed(0)} KB · ready
                      </p>
                    </div>
                    <button type="button" onClick={() => setReceipt(null)} aria-label="Remove receipt" className="text-forest-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="field-label" htmlFor="seller-name">Your name (optional)</label>
              <input
                id="seller-name"
                className="field-input"
                placeholder="So we know who to greet on WhatsApp"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-forest-100 bg-forest-50/50 p-4">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => {
                  setConfirmed(e.target.checked);
                  setErrors((prev) => ({ ...prev, confirmed: "" }));
                }}
                className="mt-0.5 h-4 w-4 accent-forest-700"
              />
              <span className="text-sm leading-relaxed text-forest-900/75">
                I confirm that I own this device and that the proof of ownership
                I uploaded is genuine.
              </span>
            </label>
            {errors.confirmed && <p className="field-error">{errors.confirmed}</p>}

            <p className="mt-4 flex items-center gap-2 text-xs text-forest-900/80">
              <ShieldCheck className="h-4 w-4 text-forest-500" />
              Your uploads are used only to assess this enquiry.
            </p>

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <Button variant="ghost" onClick={() => setStep(1)} icon={<ArrowLeft className="h-4 w-4" />} iconRight={false}>
                Back
              </Button>
              <Button size="lg" onClick={nextStep} icon={<ArrowRight className="h-4 w-4" />}>
                Get my instant offer
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && offer && (
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-lime-100 text-forest-700">
              <BadgeCheck className="h-8 w-8" />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-forest-500">
              Your instant offer · {reference}
            </p>
            <p className="mt-2 text-xs font-semibold text-forest-800">
              {offerSource.catalogUsed
                ? `Matched against our price catalog${offerSource.label ? `: ${offerSource.label}` : ""}.`
                : "Indicative estimate — no exact catalog match yet."}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-forest-950 sm:text-3xl">
              Here is what we can offer
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-forest-900/75">
              This is an indicative estimate based on what you told us. We will
              confirm the final price after a quick physical inspection — no
              obligation until then.
            </p>

            <div className="mx-auto mt-8 max-w-xl rounded-4xl bg-gradient-to-br from-forest-800 to-forest-950 p-8 text-white shadow-lift">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-lime-300">
                Estimated value
              </p>
              <p className="mt-2 font-display text-5xl font-bold text-white sm:text-6xl">
                {formatKES(offer.estimate)}
              </p>
              <p className="mt-2 text-sm text-forest-100/75">
                Indicative range: {formatRange(offer.min, offer.max)}
              </p>
              <div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 text-left sm:grid-cols-3">
                {offer.breakdown.map((item) => (
                  <div key={item.label}>
                    <p className="text-[11px] text-forest-100/70">{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-9 max-w-xl space-y-3 text-left">
              <button
                type="button"
                onClick={acceptOffer}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-lime-500 px-6 py-4 text-sm font-bold text-forest-950 shadow-[0_12px_30px_-12px_rgba(163,230,53,0.9)] transition hover:bg-lime-400"
              >
                <Check className="h-4 w-4" /> Accept offer on WhatsApp
              </button>
              <button
                type="button"
                onClick={bargain}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-forest-200 bg-white px-6 py-4 text-sm font-bold text-forest-800 transition hover:border-forest-400 hover:bg-forest-50"
              >
                <MessageCircle className="h-4 w-4" /> Bargain on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => { setCancelled(true); void recordAction("CANCELLED"); }}
                className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-forest-900/80 transition hover:text-red-600"
              >
                <X className="h-4 w-4" /> Cancel — I&apos;m not interested
              </button>
            </div>

            <p className="mx-auto mt-6 flex max-w-lg items-center justify-center gap-2 text-xs text-forest-900/80">
              <WhatsAppIcon className="h-3.5 w-3.5 text-green-600" />
              Accepting or bargaining opens WhatsApp with your details ready to send.
            </p>
            {saveState === "saving" && (
              <p className="mx-auto mt-3 flex max-w-lg items-center justify-center gap-2 text-xs text-forest-700">
                <Info className="h-3.5 w-3.5" /> Saving your offer to our admin inbox…
              </p>
            )}
            {saveState === "saved" && (
              <p className="mx-auto mt-3 flex max-w-lg items-center justify-center gap-2 text-xs text-forest-700">
                <Check className="h-3.5 w-3.5" />
                {demoSaved
                  ? "Saved in demo mode — visible in the admin inventory until the server restarts."
                  : "Saved — our team can see this offer in the admin dashboard."}
              </p>
            )}
            {saveState === "failed" && (
              <p className="mx-auto mt-3 flex max-w-lg items-center justify-center gap-2 text-xs text-red-600">
                <Info className="h-3.5 w-3.5" /> We could not save a copy, but you can still continue on WhatsApp.
              </p>
            )}
            {actionState === "saving" && (
              <p className="mx-auto mt-2 flex max-w-lg items-center justify-center gap-2 text-xs text-forest-700">
                <Info className="h-3.5 w-3.5" /> Updating your enquiry status…
              </p>
            )}

            <div className="mt-8 flex justify-center">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)} icon={<ArrowLeft className="h-4 w-4" />} iconRight={false}>
                Edit details
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer trust bar */}
      <div className="grid gap-3 border-t border-forest-100 bg-forest-50/50 px-5 py-5 sm:grid-cols-3 sm:px-8">
        {[
          { icon: Camera, text: "Real photos = fairer offers" },
          { icon: ShieldCheck, text: "Ownership checks protect you" },
          { icon: CircleCheck, text: "Accept, bargain or cancel freely" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-xs font-medium text-forest-900/75">
            <item.icon className="h-4 w-4 text-forest-500" />
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
