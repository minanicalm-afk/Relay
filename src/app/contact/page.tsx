import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { mailtoUrl, siteConfig, whatsappUrl } from "@/lib/config";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Relay in Juja or Nairobi for free e-waste pickups, donations, IT upgrades, buyback and partnerships. Chat with us on WhatsApp.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Let's talk about your old tech."
        description="Booking a pickup, donating, selling or exploring a partnership — we would love to hear from you. Reach us on WhatsApp or send a message below."
        breadcrumb={[{ label: "Contact" }]}
        image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Electronic circuit board representing responsible recycling"
      />

      <section className="bg-cream py-16 lg:py-24">
        <Container className="grid items-stretch gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="flex h-full flex-col">
            <h2 className="text-2xl font-semibold text-forest-950">Reach us directly</h2>
            <p className="mt-3 text-sm leading-relaxed text-forest-900/80">
              We are a local team, and we respond fast. Choose whatever is easiest
              for you.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {siteConfig.locations.map((location) => (
                <div key={location.city} className="flex gap-4 rounded-3xl border border-forest-100 bg-white p-6 shadow-card">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-forest-100 text-forest-700">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-forest-950">{location.city} — {location.region}</h3>
                    <p className="mt-1 text-sm text-forest-900/70">{location.address}</p>
                    <p className="mt-1 text-xs text-forest-900/80">{location.details}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a href={`tel:${siteConfig.phoneDial}`} className="flex items-center gap-3 rounded-2xl border border-forest-100 bg-white p-4 shadow-card transition hover:border-forest-300">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-50 text-forest-700"><Phone className="h-4 w-4" /></span>
                <span>
                  <span className="block text-[11px] text-forest-900/80">Call us</span>
                  <span className="block text-sm font-semibold text-forest-900">{siteConfig.phoneDisplay}</span>
                </span>
              </a>
              <a href={mailtoUrl()} className="flex items-center gap-3 rounded-2xl border border-forest-100 bg-white p-4 shadow-card transition hover:border-forest-300">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-50 text-forest-700"><Mail className="h-4 w-4" /></span>
                <span>
                  <span className="block text-[11px] text-forest-900/80">Email us</span>
                  <span className="block truncate text-sm font-semibold text-forest-900">{siteConfig.email}</span>
                </span>
              </a>
            </div>

            <a
              href={whatsappUrl("Hello Relay! I'd like to chat.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-4 rounded-3xl bg-[#25D366] p-5 text-white shadow-lift transition hover:brightness-105"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20">
                <WhatsAppIcon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-bold">Chat with us on WhatsApp</span>
                <span className="block text-xs text-white/80">Fastest way to get a reply</span>
              </span>
              <MessageCircle className="ml-auto h-5 w-5" />
            </a>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-forest-100 bg-white p-4 text-sm text-forest-900/70 shadow-card">
              <Clock className="h-4 w-4 text-forest-500" />
              {siteConfig.hours}
            </div>
          </div>

          <ContactForm />
        </Container>
      </section>

      <section className="bg-sand pb-16 lg:pb-24">
        <Container>
          <div className="overflow-hidden rounded-[2rem] border border-forest-100 bg-white shadow-card">
            <div className="flex flex-col gap-2 border-b border-forest-100 px-6 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-500">
                  Juja shop
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-forest-950">Find us on the map</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-forest-900/75">
                  Josachi Computers, Alma Matta Building, along Gachororo Road, JKUAT Gate B, Juja.
                </p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=-1.0949261,37.0190503"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900"
              >
                <MapPin className="h-4 w-4" />
                Open in Google Maps
              </a>
            </div>
            <iframe
              title="Map of the Relay Juja shop at Josachi Computers, Alma Matta Building, Gachororo Road"
              src="https://maps.google.com/maps?q=-1.0949261,37.0190503&z=17&output=embed"
              className="h-[24rem] w-full border-0 sm:h-[28rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
