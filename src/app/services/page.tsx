import type { Metadata } from "next";
import { ArrowRight, CircleCheck } from "lucide-react";
import { services, processSteps } from "@/lib/data";
import { PageHero } from "@/components/shared/PageHero";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { CTASection } from "@/components/shared/CTASection";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "E-waste collection, repair and refurbishment, electronics donations, IT upgrades for organisations, buyback and community partnerships — all from Novacycle.",
};

const reasons = [
  "One partner across the full technology lifecycle",
  "Free pickups in Juja and Nairobi",
  "Transparent, documented and traceable process",
  "Repair-first, people-first, planet-first approach",
  "Local team that understands our communities",
  "Measurable social and environmental impact",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we offer"
        title="Practical solutions for your old technology."
        description="Whether you want to dispose of it responsibly, give it new purpose, upgrade your workplace, or get paid for it — we have a service built for you."
        breadcrumb={[{ label: "Services" }]}
        image="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=2000&q=80"
        imageAlt="A technician repairing an electronic device"
      >
        <Button href="#all-services" icon={<ArrowRight className="h-4 w-4" />}>
          Explore services
        </Button>
        <Button href="/contact" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
          Talk to us
        </Button>
      </PageHero>

      <section id="all-services" className="bg-cream py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="The full picture"
            title="Six ways we make technology work for good."
            description="Each service stands on its own — and they work even better together."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.06}>
                <ServiceCard service={service} featured={index === 0} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-sand py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Why Novacycle"
              title="More than a service provider. A partner in purpose."
              description="We are environmental champions who believe technology should uplift people and protect the planet. That belief shapes everything we do."
            />
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-start gap-2.5 rounded-2xl border border-forest-100 bg-white p-4">
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" />
                  <span className="text-sm text-forest-900/75">{reason}</span>
                </div>
              ))}
            </div>
          </div>
          <Reveal>
            <div className="rounded-4xl bg-forest-900 p-8 text-white shadow-lift sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-400">
                Our simple process
              </p>
              <div className="mt-7 space-y-7">
                {processSteps.map((step) => (
                  <div key={step.step} className="flex gap-5">
                    <span className="font-display text-2xl font-bold text-lime-500/80">{step.step}</span>
                    <div>
                      <h3 className="text-base font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-forest-100/80">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <CTASection whatsappMessage="Hello Novacycle! I'd like help choosing the right service for my electronics." />
    </>
  );
}
