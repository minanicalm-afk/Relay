import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CircleCheck, MapPin } from "lucide-react";
import { services } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { CTASection } from "@/components/shared/CTASection";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
    openGraph: { title: service.title, description: service.description },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  const isBuyback = service.slug === "buyback";
  const primaryHref = isBuyback ? "/sell" : "/contact";
  const primaryLabel = isBuyback ? "Get an instant offer" : "Request this service";

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Our services"
        title={service.title}
        lede={service.tagline}
        description={service.description}
        breadcrumb={[{ label: "Services", href: "/services" }, { label: service.shortTitle }]}
        image={service.image}
        imageAlt=""
      >
        <Button href={primaryHref} size="lg" icon={<ArrowRight className="h-4 w-4" />}>
          {primaryLabel}
        </Button>
        <Button href="/contact" size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
          Ask a question
        </Button>
      </PageHero>

      {/* Highlights */}
      <section className="border-b border-forest-100 bg-white">
        <Container className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {service.highlights.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest-100 text-forest-700">
                <CircleCheck className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium text-forest-900/80">{item}</span>
            </div>
          ))}
        </Container>
      </section>

      {/* Process */}
      <section className="bg-cream py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Simple from start to finish."
            description="Here is exactly what happens when you choose this service."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.07}>
                <div className="h-full rounded-3xl border border-forest-100 bg-white p-7 shadow-card">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900 font-display text-sm font-bold text-lime-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-forest-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest-900/75">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="bg-sand py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Why it matters"
              title="The value you get — and the impact you make."
            />
            <div className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-forest-100 bg-white px-5 py-4 text-sm text-forest-800 shadow-card">
              <MapPin className="h-4 w-4 text-forest-500" />
              Available across Juja &amp; Nairobi, Kenya
            </div>
          </div>
          <div className="grid gap-4">
            {service.benefits.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 0.07}>
                <div className="flex gap-4 rounded-3xl border border-forest-100 bg-white p-6 shadow-card">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime-100 text-forest-700">
                    <CircleCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-forest-950">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-forest-900/75">{benefit.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Related */}
      <section className="bg-cream py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <SectionHeading eyebrow="Keep exploring" title="Other ways we can help." />
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900">
              All services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ServiceCard key={item.slug} service={item} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection whatsappMessage={`Hello Novacycle! I'm looking at ${service.title} and would like to ask about it.`} />
    </>
  );
}
