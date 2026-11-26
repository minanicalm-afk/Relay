/**
 * Offer calculation engine.
 *
 * The sell flow first asks the server to match device details against the
 * admin-managed price catalog. This function is the shared calculation used
 * by that server check and as a client-side fallback.
 */

export const DEVICE_CATEGORIES = [
  { value: "laptop", label: "Laptop" },
  { value: "desktop", label: "Desktop computer" },
  { value: "smartphone", label: "Smartphone" },
  { value: "tablet", label: "Tablet" },
  { value: "monitor", label: "Monitor / Screen" },
  { value: "printer", label: "Printer / Scanner" },
  { value: "camera", label: "Camera" },
  { value: "console", label: "Gaming console" },
  { value: "audio", label: "Audio equipment" },
  { value: "other", label: "Other electronics" },
] as const;

export const CONDITIONS = [
  { value: "excellent", label: "Excellent", hint: "Looks new, fully working, no faults" },
  { value: "good", label: "Good", hint: "Fully working with minor cosmetic wear" },
  { value: "fair", label: "Fair", hint: "Working but with visible wear or small issues" },
  { value: "poor", label: "Poor / not working", hint: "Faulty, damaged or for parts" },
] as const;

export const AGES = [
  { value: "under1", label: "Under 1 year" },
  { value: "1to2", label: "1 – 2 years" },
  { value: "3to4", label: "3 – 4 years" },
  { value: "5plus", label: "5+ years" },
] as const;

export const ACCESSORIES = [
  { value: "charger", label: "Charger / power cable" },
  { value: "box", label: "Original box" },
  { value: "receipt", label: "Original purchase receipt" },
  { value: "extras", label: "Extra accessories or upgrades" },
] as const;

export type DeviceCategory = (typeof DEVICE_CATEGORIES)[number]["value"];
export type Condition = (typeof CONDITIONS)[number]["value"];
export type Age = (typeof AGES)[number]["value"];
export type Accessory = (typeof ACCESSORIES)[number]["value"];
export type BrandTier = "premium" | "mid" | "other";

export type OfferInput = {
  category: DeviceCategory;
  brand: string;
  model?: string;
  condition: Condition;
  age: Age;
  accessories: Accessory[];
};

export type OfferResult = {
  estimate: number;
  min: number;
  max: number;
  breakdown: { label: string; value: string }[];
};

const BASE_VALUE: Record<DeviceCategory, number> = {
  laptop: 18000,
  desktop: 15000,
  smartphone: 12000,
  tablet: 9000,
  monitor: 7000,
  printer: 5000,
  camera: 14000,
  console: 16000,
  audio: 4000,
  other: 3000,
};

const CONDITION_FACTOR: Record<Condition, number> = {
  excellent: 1,
  good: 0.78,
  fair: 0.5,
  poor: 0.22,
};

const AGE_FACTOR: Record<Age, number> = {
  under1: 1,
  "1to2": 0.82,
  "3to4": 0.6,
  "5plus": 0.38,
};

const PREMIUM_BRANDS = [
  "apple",
  "samsung",
  "dell",
  "hp",
  "lenovo",
  "sony",
  "canon",
  "nintendo",
  "ibm",
  "huawei",
];
const MID_BRANDS = [
  "asus",
  "acer",
  "xiaomi",
  "lg",
  "microsoft",
  "fujifilm",
  "nikon",
  "msi",
  "motorola",
  "oneplus",
];

function brandTier(brand: string): BrandTier {
  const b = brand.trim().toLowerCase();
  if (PREMIUM_BRANDS.some((name) => b.includes(name))) return "premium";
  if (MID_BRANDS.some((name) => b.includes(name))) return "mid";
  return "other";
}

const BRAND_FACTOR: Record<BrandTier, number> = {
  premium: 1.15,
  mid: 1,
  other: 0.85,
};

const ACCESSORY_BONUS: Record<Accessory, number> = {
  charger: 0.03,
  box: 0.03,
  receipt: 0.04,
  extras: 0.05,
};

function roundTo(value: number, step = 100): number {
  return Math.round(value / step) * step;
}

export type CalculateOfferOptions = {
  basePrice?: number;
  catalogLabel?: string;
};

export function calculateOffer(input: OfferInput, options: CalculateOfferOptions = {}): OfferResult {
  const base = options.basePrice ?? BASE_VALUE[input.category];
  const conditionLabel =
    CONDITIONS.find((c) => c.value === input.condition)?.label ?? "-";
  const ageLabel = AGES.find((a) => a.value === input.age)?.label ?? "-";
  // A catalog price already reflects the model's brand, so don't apply a second brand uplift.
  const tier = options.basePrice ? null : brandTier(input.brand);
  const brandFactor = tier ? BRAND_FACTOR[tier] : 1;
  const accessoryFactor = input.accessories.reduce(
    (sum, item) => sum + ACCESSORY_BONUS[item],
    0,
  );

  const estimate = roundTo(
    base * CONDITION_FACTOR[input.condition] * AGE_FACTOR[input.age] *
      brandFactor * (1 + accessoryFactor),
  );

  return {
    estimate,
    min: roundTo(estimate * 0.85),
    max: roundTo(estimate * 1.15),
    breakdown: [
      ...(options.basePrice
        ? [{
            label: "Catalog price",
            value: `${options.catalogLabel ? `${options.catalogLabel} · ` : ""}KSh ${Math.round(options.basePrice).toLocaleString("en-KE")}`,
          }]
        : []),
      { label: "Device category", value: DEVICE_CATEGORIES.find((c) => c.value === input.category)?.label ?? "-" },
      tier
        ? { label: "Brand tier", value: tier.charAt(0).toUpperCase() + tier.slice(1) }
        : { label: "Brand", value: input.brand.trim() || "Catalog price" },
      { label: "Condition", value: conditionLabel },
      { label: "Age", value: ageLabel },
      { label: "Accessories", value: input.accessories.length ? `+${input.accessories.length} included` : "None listed" },
    ],
  };
}
