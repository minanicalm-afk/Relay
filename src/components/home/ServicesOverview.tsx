import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { services } from "@/lib/data";

export function ServicesOverview() {
  return (
    <section id="services" className="scroll-mt-28 bg-cream py-20 lg:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                One partner for your <span className="text-forest-500">entire tech lifecycle.</span>
              </>
            }
            description="From the moment you no longer need a device to the moment it serves someone else — we handle it responsibly, transparently and with real local impact."
          />
          <Link
            href="/services"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900"
          >
            View all services
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.06}>
              <ServiceCard service={service} featured={index === 0} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
