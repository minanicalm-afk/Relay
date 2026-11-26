import { calculateOffer, type OfferInput, type OfferResult } from "./pricing";

export type CatalogOfferResult = OfferResult & {
  catalogUsed: boolean;
  matchedPriceId?: string;
  matchedPriceLabel?: string;
};

/** Ask the server to match the device against the admin-managed price catalog. */
export async function requestOffer(input: OfferInput): Promise<CatalogOfferResult> {
  try {
    const response = await fetch("/api/offers/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (response.ok) {
      return (await response.json()) as CatalogOfferResult;
    }
  } catch {
    // Fall through to the built-in estimate.
  }

  return { ...calculateOffer(input), catalogUsed: false };
}
