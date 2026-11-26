import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PricesManager } from "@/components/admin/PricesManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Price catalog" };

export default async function PricesPage() {
  await requirePermission("devices:read");
  const prices = await prisma.devicePrice.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-500">Pricing</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-forest-950 sm:text-4xl">Price catalog</h1>
        <p className="mt-2 text-sm text-forest-900/75">
          Add computer and electronics prices here. The sell-your-tech flow checks these rules before showing an instant offer.
        </p>
      </div>

      <PricesManager prices={prices.map((price) => ({ ...price, createdAt: price.createdAt.toISOString() }))} />
    </div>
  );
}
