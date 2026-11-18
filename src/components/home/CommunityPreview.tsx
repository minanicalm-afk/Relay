import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { communityActivities } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CommunityPreview() {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Beyond electronics"
            title={
              <>
                Technology is our tool. <span className="text-forest-500">People are our purpose.</span>
              </>
            }
            description="We partner with organisations to plant trees, run recycling drives and marathons, and support orphanages and needy families across our communities."
          />
          <Link
            href="/community"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900"
          >
            See our impact
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {communityActivities.map((activity, index) => (
            <Reveal key={activity.title} delay={index * 0.07}>
              <article className="group h-full overflow-hidden rounded-3xl border border-forest-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden bg-forest-100">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-white/95 text-forest-700 shadow-card">
                    <Icon name={activity.icon} className="h-5 w-5" />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-forest-950">{activity.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest-900/75">
                    {activity.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 rounded-3xl border border-forest-100 bg-white p-6 text-center shadow-card sm:p-8">
          <p className="max-w-xl text-sm text-forest-900/70 sm:text-base">
            <span className="font-bold text-forest-900">Are you an organisation that cares?</span>{" "}
            Let&apos;s design a community activity together.
          </p>
          <Button href="/partnerships" icon={<ArrowRight className="h-4 w-4" />}>
            Become a partner
          </Button>
        </div>
      </Container>
    </section>
  );
}
