import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { ImpactReach } from "@/components/home/ImpactReach";
import { WhyUs } from "@/components/home/WhyUs";
import { SellTeaser } from "@/components/home/SellTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/shared/CTASection";
import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <ImpactReach />
      <WhyUs />
      <SellTeaser />
      <Testimonials />

      <section className="bg-cream py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="Good to know"
            title={
              <>
                Frequently asked <span className="text-forest-500">questions.</span>
              </>
            }
            description="Everything you need to know before you book a pickup, donate, or sell your device."
          />
          <FAQAccordion items={faqs.slice(0, 5)} />
        </Container>
      </section>

      <CTASection whatsappMessage="Hello Relay! I'm on the homepage and I'm ready to book a free pickup." />
    </>
  );
}
