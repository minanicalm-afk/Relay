import Image from "next/image";
import { ArrowRight, Camera, Check, ReceiptText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SellTeaser() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-lime-100 via-cream to-forest-50 py-20 lg:py-28">
      <div className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-lime-300/40 blur-3xl" />
      <Container className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Sell to us"
            title={
              <>
                Get an instant offer for your <span className="text-forest-500">old device.</span>
              </>
            }
            description="Describe it, upload a few photos and your receipt, and our system gives you a fair estimate in seconds. Accept it, bargain with us on WhatsApp, or simply cancel — the choice is yours."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Camera, title: "Upload photos", text: "Show us the real condition of your device." },
              { icon: ReceiptText, title: "Prove ownership", text: "A receipt keeps every sale safe and legitimate." },
              { icon: Sparkles, title: "Instant estimate", text: "Transparent pricing based on real factors." },
              { icon: Check, title: "You decide", text: "Accept, negotiate or walk away — no pressure." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 rounded-2xl border border-forest-100 bg-white/70 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-forest-950">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-forest-900/75">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <Button href="/sell" size="lg" className="mt-9" icon={<ArrowRight className="h-4 w-4" />}>
            Get my instant offer
          </Button>
        </div>

        <Reveal>
          <div className="relative mx-auto max-w-md">
            <div className="overflow-hidden rounded-4xl border-8 border-white bg-forest-800 shadow-lift">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80"
                  alt="Laptop on a desk ready to be sold"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-forest-500">
                      Your instant offer
                    </p>
                    <p className="font-display text-3xl font-bold text-forest-950">KSh 15,800</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Ready
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-forest-50 p-2 text-center">
                    <p className="text-[10px] text-forest-900/80">Condition</p>
                    <p className="text-xs font-bold text-forest-800">Good</p>
                  </div>
                  <div className="rounded-xl bg-forest-50 p-2 text-center">
                    <p className="text-[10px] text-forest-900/80">Age</p>
                    <p className="text-xs font-bold text-forest-800">1–2 yrs</p>
                  </div>
                  <div className="rounded-xl bg-forest-50 p-2 text-center">
                    <p className="text-[10px] text-forest-900/80">Proof</p>
                    <p className="text-xs font-bold text-forest-800">Uploaded</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <span className="flex-1 rounded-full bg-forest-900 py-2.5 text-center text-xs font-bold text-white">
                    Accept offer
                  </span>
                  <span className="flex-1 rounded-full border border-forest-200 py-2.5 text-center text-xs font-bold text-forest-800">
                    Bargain
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
