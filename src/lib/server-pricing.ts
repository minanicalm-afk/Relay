import { prisma } from "./prisma";
import {
  AGES,
  CONDITIONS,
  DEVICE_CATEGORIES,
  calculateOffer,
  type OfferInput,
  type OfferResult,
} from "./pricing";

export type CatalogOfferResult = OfferResult & {
  catalogUsed: boolean;
  matchedPriceId?: string;
  matchedPriceLabel?: string;
};

type Rule = {
  id: string;
  deviceType: string;
  brand: string | null;
  modelName: string | null;
  age: string | null;
  condition: string | null;
  price: number;
};

function normalise(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function scoreRule(rule: Rule, input: OfferInput): number {
  if (normalise(rule.deviceType) !== normalise(input.category)) return -1;

  let score = 1;
  const brand = normalise(input.brand);
  const ruleBrand = normalise(rule.brand);
  if (ruleBrand && ruleBrand !== brand && !brand.includes(ruleBrand) && !ruleBrand.includes(brand)) {
    return -1;
  }
  if (ruleBrand) score += 2;

  const model = normalise(input.model);
  const ruleModel = normalise(rule.modelName);
  if (ruleModel && ruleModel !== model && !model.includes(ruleModel) && !ruleModel.includes(model)) {
    return -1;
  }
  if (ruleModel) score += 4;

  if (rule.age && rule.age !== input.age) return -1;
  if (rule.age) score += 2;

  if (rule.condition && rule.condition !== input.condition) return -1;
  if (rule.condition) score += 3;

  return score;
}

function ruleLabel(rule: Rule): string {
  const category =
    DEVICE_CATEGORIES.find((item) => item.value === rule.deviceType)?.label ?? rule.deviceType;
  const parts = [category, rule.brand, rule.modelName].filter(Boolean);
  const qualifiers = [
    rule.age ? AGES.find((item) => item.value === rule.age)?.label ?? rule.age : null,
    rule.condition
      ? CONDITIONS.find((item) => item.value === rule.condition)?.label ?? rule.condition
      : null,
  ].filter(Boolean);

  return `${parts.join(" ")}${qualifiers.length ? ` · ${qualifiers.join(" · ")}` : ""}`;
}

export async function calculateCatalogOffer(input: OfferInput): Promise<CatalogOfferResult> {
  const rules = await prisma.devicePrice.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  }) as Rule[];

  const ranked = rules
    .map((rule) => ({ rule, score: scoreRule(rule, input) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || b.rule.price - a.rule.price);

  const match = ranked[0];
  if (!match) {
    return { ...calculateOffer(input), catalogUsed: false };
  }

  const result = calculateOffer(input, {
    basePrice: match.rule.price,
    catalogLabel: ruleLabel(match.rule),
  });

  return {
    ...result,
    catalogUsed: true,
    matchedPriceId: match.rule.id,
    matchedPriceLabel: ruleLabel(match.rule),
  };
}
