import type { Metadata } from "next";
import { BadgeCheck, Clock3, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SellForm } from "@/components/sell/SellForm";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Sell Your Electronics — Instant Offer",
  description:
    "Describe your device, upload photos and proof of ownership, and get an instant offer from Novacycle. Accept, bargain on WhatsApp or cancel — you decide.",
};

const perks = [
  { icon: Sparkles, title: "Instant estimate", text: "See a fair indicative price in seconds — no waiting for a callback." },
  { icon: ShieldCheck, title: "Safe & legitimate", text: "Proof of ownership protects honest sellers and keeps stolen goods out." },
  { icon: MessageCircle, title: "You stay in control", text: "Accept, negotiate on WhatsApp, or cancel with a single click." },
  { icon: Clock3, title: "Quick handover", text: "Arrange a fast, friendly drop-off or pickup in Juja or Nairobi." },
];

export default function SellPage() {
  return (
    <>
      <PageHero
        eyebrow="Electronics buyback"
        title="Turn your old device into instant value."
        description="Tell us what you have, show us a few photos and your receipt, and our system gives you an offer right away. No pressure, no obligation — you decide what happens next."
        breadcrumb={[{ label: "Sell your electronics" }]}
        image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=2000&q=80"
        imageAlt="A laptop ready to be sold"
      />

      <section className="bg-cream py-14 lg:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start lg:gap-10">
            <SellForm />

            <aside className="space-y-4 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-forest-100 bg-white p-6 shadow-card">
                <h2 className="text-base font-semibold text-forest-950">Why sell to Novacycle?</h2>
                <div className="mt-5 space-y-5">
                  {perks.map((perk) => (
                    <div key={perk.title} className="flex gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                        <perk.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-forest-950">{perk.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-forest-900/75">{perk.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-forest-900 p-6 text-white shadow-card">
                <BadgeCheck className="h-6 w-6 text-lime-400" />
                <h3 className="mt-4 text-base font-semibold">What you will need</h3>
                <ul className="mt-4 space-y-2.5 text-xs text-forest-100/70">
                  <li className="flex gap-2"><span className="text-lime-400">•</span> The device and its accessories</li>
                  <li className="flex gap-2"><span className="text-lime-400">•</span> Clear front and back photos</li>
                  <li className="flex gap-2"><span className="text-lime-400">•</span> A receipt or proof of ownership</li>
                  <li className="flex gap-2"><span className="text-lime-400">•</span> A WhatsApp line for the final chat</li>
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
