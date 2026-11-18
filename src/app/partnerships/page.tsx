import type { Metadata } from "next";
import { ArrowRight, CircleCheck, Handshake, Target, UsersRound } from "lucide-react";
import { partnerTypes } from "@/lib/data";
import { PageHero } from "@/components/shared/PageHero";
import { PartnerForm } from "@/components/forms/PartnerForm";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Partner with Relay for tree planting, recycling drives, charity marathons and community support. Environmental champions welcome.",
};

const steps = [
  { icon: Handshake, title: "We talk", text: "A short conversation to understand your organisation, goals and audience." },
  { icon: Target, title: "We co-design", text: "Together we shape an activity that is meaningful, realistic and measurable." },
  { icon: UsersRound, title: "We activate", text: "We mobilise our network, resources and community reach to make it happen." },
  { icon: CircleCheck, title: "We report", text: "You get a clear impact summary and a story worth sharing with your stakeholders." },
];

export default function PartnershipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Work with us"
        title="Real change is a team sport."
        description="We are environmental champions looking for like-minded organisations. If you care about people and the planet, let's build something meaningful together."
        breadcrumb={[{ label: "Partnerships" }]}
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Two people shaking hands on a partnership"
      >
        <a href="#partner-form" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-lime-500 px-6 text-sm font-semibold text-forest-950 transition hover:bg-lime-400">
          Become a partner <ArrowRight className="h-4 w-4" />
        </a>
      </PageHero>

      <section className="bg-cream py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Who we partner with"
            title="Many kinds of organisations. One shared purpose."
            description="If your work touches community, education, environment or wellbeing, there is a place for you here."
          />
          <div className="mt-10 flex flex-wrap gap-3">
            {partnerTypes.map((type) => (
              <span key={type} className="rounded-full border border-forest-100 bg-white px-5 py-2.5 text-sm font-medium text-forest-800 shadow-sm">
                {type}
              </span>
            ))}
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.07}>
                <div className="h-full rounded-3xl border border-forest-100 bg-white p-7 shadow-card">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-100 text-forest-700">
                    <step.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-forest-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest-900/75">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="partner-form" className="scroll-mt-28 bg-sand py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Get started"
              title="Tell us what you care about."
              description="We will take it from there. No lengthy paperwork to begin — just a real conversation about the impact you want to make."
            />
            <div className="mt-8 rounded-3xl bg-forest-900 p-7 text-white">
              <p className="text-sm font-semibold text-lime-300">Our promise to partners</p>
              <ul className="mt-4 space-y-3 text-sm text-forest-100/75">
                <li className="flex gap-2"><CircleCheck className="h-4 w-4 shrink-0 text-lime-400" /> Clear communication from day one</li>
                <li className="flex gap-2"><CircleCheck className="h-4 w-4 shrink-0 text-lime-400" /> Activities grounded in real community need</li>
                <li className="flex gap-2"><CircleCheck className="h-4 w-4 shrink-0 text-lime-400" /> Transparent reporting and storytelling</li>
                <li className="flex gap-2"><CircleCheck className="h-4 w-4 shrink-0 text-lime-400" /> Long-term relationships, not one-off events</li>
              </ul>
            </div>
          </div>
          <PartnerForm />
        </Container>
      </section>
    </>
  );
}
