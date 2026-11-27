import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Compass, Eye, Leaf, MapPin } from "lucide-react";
import { values } from "@/lib/data";
import { siteConfig } from "@/lib/config";
import { PageHero } from "@/components/shared/PageHero";
import { CTASection } from "@/components/shared/CTASection";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Novacycle Technologies Ltd turns electronic waste into opportunity through collection, recycling, refurbishment and reuse, and expands access to technology for underserved communities.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Novacycle"
        title="Turning E-Waste into Opportunity."
        description="Giving technology a second life and communities a new opportunity. We work across Juja and Nairobi on e-waste management, digital inclusion and environmental sustainability."
        breadcrumb={[{ label: "About" }]}
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"
        imageAlt="A team working together on laptops"
      >
        <Button href="/services" icon={<ArrowRight className="h-4 w-4" />}>
          See what we do
        </Button>
      </PageHero>

      <section className="bg-cream py-20 lg:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/3.5] overflow-hidden rounded-4xl bg-forest-100 shadow-lift">
              <Image
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80"
                alt="Community volunteers working together"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Our story" title="We saw a problem — and an opportunity." />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-forest-900/70 sm:text-base">
              <p>
                Across Kenya, old phones, laptops and computers pile up in homes
                and offices. Too often they end up in dumpsites, where their
                batteries and chemicals harm people and the environment. At the
                same time, countless schools and families cannot afford the
                very devices those piles contain.
              </p>
              <p>
                Novacycle was born to close that gap. We collect e-waste
                responsibly, repair what can be repaired, donate working devices
                to those who need them, and help organisations upgrade without
                wasting. Every step is guided by one question: who does this
                help?
              </p>
              <p>
                Today we work across Juja and Nairobi with households, schools,
                businesses and partner organisations — building a circular
                economy that creates real, local impact.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-forest-950 py-20 text-white lg:py-28">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-10">
            <Compass className="h-8 w-8 text-lime-400" />
            <h2 className="mt-6 text-2xl font-semibold">Our mission</h2>
            <p className="mt-4 text-sm leading-relaxed text-forest-100/70 sm:text-base">
              To promote responsible electronic waste management through collection, recycling, refurbishment and reuse of electronic devices, while expanding access to technology and empowering underserved communities through digital inclusion.
            </p>
          </div>
          <div className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-10">
            <Eye className="h-8 w-8 text-lime-400" />
            <h2 className="mt-6 text-2xl font-semibold">Our vision</h2>
            <p className="mt-4 text-sm leading-relaxed text-forest-100/70 sm:text-base">
              To create a sustainable, digitally inclusive Africa where electronic waste is transformed into valuable resources, environmental pollution is minimized, and every community has access to the technology needed to thrive.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="What drives us"
            title="Our core values."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.06}>
                <div className="h-full rounded-3xl border border-forest-100 bg-white p-7 shadow-card">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-100 text-forest-700">
                    <Icon name={value.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-forest-950">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest-900/75">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-sand py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Where we are"
              title="Rooted in Juja. Growing across Nairobi."
              description="Our local presence means faster pickups, real relationships and accountability to the communities we serve."
            />
            <div className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-forest-100 px-4 py-3 text-sm font-semibold text-forest-800">
              <Leaf className="h-4 w-4" /> Proudly Kenyan, proudly environmental
            </div>
          </div>
          <div className="grid gap-4">
            {siteConfig.locations.map((location) => (
              <div key={location.city} className="flex gap-4 rounded-3xl border border-forest-100 bg-white p-6 shadow-card">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-forest-900 text-lime-400">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-forest-950">
                    {location.city} <span className="text-sm font-normal text-forest-900/80">· {location.region}</span>
                  </h3>
                  <p className="mt-1 text-sm text-forest-900/70">{location.address}</p>
                  <p className="mt-1 text-xs text-forest-900/80">{location.details}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection whatsappMessage="Hello Novacycle! I was reading about the team and would like to get in touch." />
    </>
  );
}
