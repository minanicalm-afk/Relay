import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { faqs } from "@/lib/data";
import { whatsappUrl } from "@/lib/config";
import { PageHero } from "@/components/shared/PageHero";
import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about e-waste collection, donations, IT upgrades, selling your electronics and partnering with Novacycle.",
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Help centre"
        title="Questions? We have answers."
        description="Here is what people most often ask us. If your question is not here, just send us a message — we are happy to help."
        breadcrumb={[{ label: "FAQ" }]}
        image="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=2000&q=80"
        imageAlt="People looking at a laptop together"
      />

      <section className="bg-cream py-16 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-semibold text-forest-950">Good to know</h2>
            <p className="mt-3 text-sm leading-relaxed text-forest-900/80">
              Everything from pickup logistics to how we calculate offers. Tap
              a question to expand the answer.
            </p>
            <a
              href={whatsappUrl("Hello Novacycle! I have a question not covered by your FAQ.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-forest-100 bg-white p-4 shadow-card transition hover:border-forest-300"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-100 text-green-700">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-forest-950">Still curious?</span>
                <span className="block text-xs text-forest-900/70">Chat with our team on WhatsApp</span>
              </span>
            </a>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900">
              <MessageCircle className="h-4 w-4" /> Or use our contact form
            </Link>
          </div>
          <FAQAccordion items={faqs} />
        </Container>
      </section>
    </>
  );
}
