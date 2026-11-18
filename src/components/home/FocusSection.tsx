import Image from "next/image";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const points = [
  "Free doorstep collection in Juja & Nairobi",
  "Certified, safe handling of hazardous components",
  "Every item logged — full documentation for you",
  "Repair-first approach: reuse before recycling",
];

export function FocusSection() {
  return (
    <section className="bg-forest-950 py-20 text-white lg:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/3.5] overflow-hidden rounded-4xl border border-white/10 bg-forest-800 shadow-lift">
            <Image
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
              alt="Electronic circuit board representing responsible recycling"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-forest-950/80 via-transparent to-lime-500/10" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/10 p-5 backdrop-blur-md ring-1 ring-white/15">
              <p className="font-display text-xl font-semibold text-white">
                ♻ Diverted from landfill, returned to purpose.
              </p>
              <p className="mt-1 text-sm text-forest-100/70">
                That is the Relay promise.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Eyebrow tone="dark">Our main focus</Eyebrow>
          <h2 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Disposal collection that actually makes a difference.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-forest-100/70 lg:text-lg">
            Electronic waste is one of the fastest-growing waste streams in
            Kenya. We make it easy for households and organisations to do the
            right thing — collecting old devices, restoring what we can and
            ensuring nothing harmful ends up in our soil or water.
          </p>

          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime-500/20 text-lime-400">
                  <CircleCheck className="h-4 w-4" />
                </span>
                <span className="text-sm text-forest-100/85 sm:text-base">{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/services/e-waste-collection" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
              Explore our collection service
            </Button>
            <Button href="/contact" size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              Request a pickup
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
