import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, HeartHandshake, Recycle, Sprout } from "lucide-react";
import { communityActivities, impactStats } from "@/lib/data";
import { PageHero } from "@/components/shared/PageHero";
import { CTASection } from "@/components/shared/CTASection";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Community Impact",
  description:
    "Tree planting, recycling drives, charity marathons and support for orphanages and needy families — the community impact work of Novacycle and its partners.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Community impact"
        title="We exist to make life better, not just to move electronics."
        description="Our work reaches far beyond e-waste. Through partnerships and hands-on activities, we plant trees, clean up communities, fund digital inclusion and stand with the most vulnerable among us."
        breadcrumb={[{ label: "Community" }]}
        image="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Hands holding a seedling ready for planting"
      >
        <Button href="/partnerships" icon={<ArrowRight className="h-4 w-4" />}>
          Partner with us
        </Button>
      </PageHero>

      <section className="bg-cream py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="What we do together"
            title="Activities that change lives and landscapes."
            description="Every activity is designed to leave a lasting, measurable mark on the people and places we serve."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {communityActivities.map((activity, index) => (
              <Reveal key={activity.title} delay={index * 0.06}>
                <article className="group grid h-full overflow-hidden rounded-4xl border border-forest-100 bg-white shadow-card transition hover:shadow-lift sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-56 overflow-hidden bg-forest-100">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-7 sm:p-8">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-100 text-forest-700">
                      <Icon name={activity.icon} className="h-5 w-5" />
                    </span>
                    <h2 className="mt-5 text-xl font-semibold text-forest-950">{activity.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-forest-900/80">{activity.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-forest-950 py-20 text-white lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="By the numbers"
            title="Small actions. Real, growing impact."
            description="Every device collected and every tree planted adds up to something bigger than us."
            align="center"
            tone="dark"
          />
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {impactStats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.06}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-7 text-center backdrop-blur">
                  <p className="font-display text-3xl font-bold text-lime-400 sm:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-xs text-forest-100/80 sm:text-sm">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cream py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-3">
          {[
            {
              icon: Sprout,
              title: "Environmental restoration",
              text: "We restore degraded spaces through tree planting and community clean-ups, working with local schools and volunteers.",
            },
            {
              icon: Recycle,
              title: "Circular behaviour change",
              text: "Our drives teach communities that old electronics are resources, not rubbish — and make responsible disposal easy.",
            },
            {
              icon: HeartHandshake,
              title: "Social inclusion",
              text: "Refurbished devices, supplies and mentorship reach orphanages, schools and families who need a helping hand.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.07}>
              <div className="h-full rounded-3xl border border-forest-100 bg-white p-8 shadow-card">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-100 text-forest-700">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-forest-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-forest-900/80">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      <CTASection
        title="Let's create impact together."
        description="We are always looking for organisations that share our belief in a cleaner, fairer future. Tell us what you care about."
        primaryLabel="Become a partner"
        primaryHref="/partnerships"
        whatsappMessage="Hello Novacycle! I'd like to talk about joining a community programme."
      />
    </>
  );
}
