import { Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  return (
    <section id="stories" className="scroll-mt-24 bg-sand py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Kind words"
          title={
            <>
              Trusted by people who <span className="text-forest-500">care.</span>
            </>
          }
          description="Real experiences from the communities and organisations we serve."
          align="center"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="flex h-full flex-col rounded-3xl border border-forest-100 bg-white p-7 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5 text-lime-600">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-forest-100" />
              </div>
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-forest-900/75">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-forest-100 pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-100 font-display text-sm font-bold text-forest-700">
                  {item.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-forest-950">{item.name}</p>
                  <p className="text-xs text-forest-900/70">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
