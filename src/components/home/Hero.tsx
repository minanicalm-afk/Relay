import Image from "next/image";
import { ArrowDown, ArrowRight, MapPin, Recycle, Settings, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig, whatsappUrl } from "@/lib/config";
import { impactStats } from "@/lib/data";
import { CountUp } from "./CountUp";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-cream to-sand">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[40rem] -translate-x-1/2 rounded-full bg-lime-300/20 blur-3xl" />

      <Container className="relative grid items-center gap-14 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-20">
        {/* Copy */}
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-forest-200 bg-white/80 px-4 py-2 text-xs font-bold text-forest-800 shadow-sm backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-forest-600" />
              Files cleared before handover
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-forest-200 bg-white/80 px-4 py-2 text-xs font-bold text-forest-800 shadow-sm backdrop-blur">
              <Settings className="h-3.5 w-3.5 text-lime-600" />
              Repair, reuse, and upgrade
            </span>
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.16em] text-forest-600">
            {siteConfig.tagline}
          </p>
          <h1 className="mt-3 text-[2.75rem] font-semibold leading-[1.04] text-forest-950 sm:text-6xl lg:text-[4.25rem]">
            Give technology a{" "}
            <span className="relative inline-block">
              <span className="gradient-text">second life.</span>
              <svg
                className="absolute -bottom-2 left-0 w-full text-lime-400"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9C70 3 150 2 298 6"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-forest-900/70 sm:text-lg">
            {siteConfig.statement} We collect, recycle, refurbish and reuse
            electronics across Juja &amp; Nairobi, and open access to technology
            for underserved communities.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              href="/contact"
              size="lg"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Schedule a free pickup
            </Button>
            <Button
              href="#services"
              size="lg"
              variant="outline"
              icon={<ArrowDown className="h-4 w-4" />}
            >
              Explore Our Services
            </Button>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-forest-900/80">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-forest-500" /> Juja &amp; Nairobi
            </span>
            <span className="inline-flex items-center gap-2">
              <Recycle className="h-4 w-4 text-forest-500" /> Free collection
            </span>
            <a
              href={whatsappUrl("Hello Novacycle! Please tell me about your pickup service.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-forest-700 hover:text-forest-900"
            >
              <WhatsAppIcon className="h-4 w-4 text-green-600" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-square">
            <Image
              src="/images/hero-recycling.jpeg"
              alt="Electronics and materials sorted for recycling"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain mix-blend-darken"
            />
          </div>
        </div>
      </Container>

      {/* Stats strip */}
      <div className="relative border-y border-forest-100 bg-white/60 backdrop-blur">
        <Container className="grid grid-cols-2 gap-y-6 py-7 sm:grid-cols-4">
          {impactStats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center sm:border-r sm:border-forest-100 sm:last:border-0"
            >
              <p className="font-display text-2xl font-bold text-forest-800 sm:text-3xl">
                <CountUp value={stat.value} delay={index * 140} />
              </p>
              <p className="mt-1 text-xs font-medium text-forest-900/70 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </Container>
      </div>
    </section>
  );
}
