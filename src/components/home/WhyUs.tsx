import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whyUs } from "@/lib/data";

export function WhyUs() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Why us"
          title={
            <>
              Why we are the desk for the{" "}
              <span className="text-forest-500">machines you have.</span>
            </>
          }
          description="Donors, partners who need disposal or an upgrade, the team, and the community each get a different reason to work with us."
          align="center"
        />

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06} className="h-full">
              <article className="group flex h-full flex-col rounded-3xl bg-cream p-7 transition duration-300 hover:-translate-y-1 hover:bg-forest-50 hover:shadow-card">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-forest-700 shadow-card">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-8 text-lg font-semibold text-forest-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-forest-900/75">{item.description}</p>
                <Link
                  href={item.href}
                  className="mt-auto inline-flex items-center gap-1.5 pt-6 text-xs font-bold text-forest-700 transition hover:text-forest-900"
                >
                  {item.linkLabel}
                  <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
