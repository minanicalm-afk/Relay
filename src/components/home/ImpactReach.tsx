import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

const impacts = [
  {
    id: "donations",
    index: "01",
    title: "Donations",
    copy: "Working or repairable machines are repaired and given to schools. Cash and listed items go through our donations service.",
    cta: "Donate",
    href: "/services/donations",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80",
    alt: "A student using a donated laptop in class",
    position: "center 30%",
  },
  {
    id: "sponsor-testimonials",
    index: "02",
    title: "Sponsor testimonials",
    copy: "People and organisations who have handed machines over say what happened after the visit.",
    cta: "Read testimonials",
    href: "/#stories",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80",
    alt: "Partners talking through a donation at a table",
    position: "center 40%",
  },
  {
    id: "community-engagement",
    index: "03",
    title: "Community engagement",
    copy: "Race days, tree planting, and school slots sit with our community work. Join the group that plans the day.",
    cta: "See programs",
    href: "/community",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1400&q=80",
    alt: "A community planting seedlings together",
    position: "center 45%",
  },
  {
    id: "environmental-engagement",
    index: "04",
    title: "Environmental engagement",
    copy: "Dead electronics are collected, recycled, or disposed of. Working parts stay in service. Neighbourhoods keep dumps clear of e-waste.",
    cta: "E-waste path",
    href: "/services/e-waste-collection",
    image: "/images/hero-recycling.jpeg",
    alt: "Electronics sorted for recycling",
    position: "center center",
  },
  {
    id: "digital-divide",
    index: "05",
    title: "Digital divide and sensitization",
    copy: "Placed computers go into class. Schools and students learn what the machines can do, not only that they arrived.",
    cta: "How placement works",
    href: "/services/donations",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80",
    alt: "Students in a computer class with a teacher",
    position: "center 40%",
  },
] as const;

export function ImpactReach() {
  const lead = impacts.slice(0, 3);
  const rest = impacts.slice(3);

  return (
    <section id="impact" className="scroll-mt-24 bg-cream py-16 lg:py-24">
      <Container>
        <div className="text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-forest-500">
            <span className="h-px w-10 bg-forest-500 sm:w-14" aria-hidden="true" />
            Community impact
            <span className="h-px w-10 bg-forest-500 sm:w-14" aria-hidden="true" />
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-forest-950 sm:text-5xl">
            How the work <span className="text-forest-500">reaches people</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-forest-900/70 sm:text-base">
            Donations, sponsor voices, community days, e-waste, and digital access. Each card is a different way the desk shows up.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {lead.map((card) => (
            <ImpactPanel key={card.id} card={card} />
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {rest.map((card) => (
            <ImpactPanel key={card.id} card={card} wide />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ImpactPanel({
  card,
  wide = false,
}: {
  card: (typeof impacts)[number];
  wide?: boolean;
}) {
  return (
    <Link
      id={card.id}
      href={card.href}
      className={`group relative flex overflow-hidden rounded-[1.75rem] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-500 ${
        wide ? "min-h-80 lg:min-h-[22rem]" : "min-h-80 lg:min-h-[28rem]"
      }`}
    >
      <Image
        src={card.image}
        alt={card.alt}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        style={{ objectPosition: card.position }}
        sizes={wide ? "(min-width: 1024px) 48vw, 100vw" : "(min-width: 1024px) 32vw, 100vw"}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/15" />
      <span className="absolute right-6 top-5 font-display text-5xl font-bold tracking-tight text-white/25">
        {card.index}
      </span>
      <span className="relative mt-auto flex flex-col p-6 sm:p-7">
        <span className="text-2xl font-semibold tracking-tight">{card.title}</span>
        <span className="mt-2 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
          {card.copy}
        </span>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-lime-300">
          {card.cta}
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}
