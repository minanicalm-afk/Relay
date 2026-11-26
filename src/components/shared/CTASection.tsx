import { ArrowRight, Recycle } from "lucide-react";
import { whatsappUrl } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function CTASection({
  title = "Ready to give your old tech a better future?",
  description = "Book a free pickup, donate a device, or simply chat with us. Every action moves us toward a cleaner, more inclusive Kenya.",
  primaryLabel = "Book a free pickup",
  primaryHref = "/contact",
  whatsappMessage = "Hello Relay! I'd like to arrange a pickup.",
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  whatsappMessage?: string;
}) {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 px-6 py-14 text-center shadow-lift sm:px-12 lg:px-20 lg:py-20">
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-lime-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-forest-500/30 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-lime-500 text-forest-950 shadow-[0_10px_30px_-10px_rgba(163,230,53,0.8)]">
              <Recycle className="h-7 w-7" />
            </div>
            <h2 className="mt-7 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-forest-100/75 lg:text-lg">
              {description}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button href={primaryHref} size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                {primaryLabel}
              </Button>
              <Button
                href={whatsappUrl(whatsappMessage)}
                external
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:border-lime-400/50 hover:bg-white/15"
                icon={<WhatsAppIcon className="h-4 w-4" />}
              >
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
