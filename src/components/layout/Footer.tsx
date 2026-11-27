import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { mailtoUrl, siteConfig, whatsappUrl } from "@/lib/config";
import { services } from "@/lib/data";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Logo } from "./Logo";

const explore = [
  { label: "Home", href: "/" },
  { label: "All services", href: "/services" },
  { label: "Sell your electronics", href: "/sell" },
  { label: "Community impact", href: "/community" },
  { label: "Partnerships", href: "/partnerships" },
  { label: "About us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest-950 text-forest-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(163,230,53,0.10),transparent_45%)]" />
      <div className="pointer-events-none absolute -right-32 top-32 h-96 w-96 rounded-full bg-forest-700/20 blur-3xl" />

      <div className="container-wide relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-forest-100/70">
              {siteConfig.name} — {siteConfig.statement}
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { label: "Instagram", href: siteConfig.socials.instagram, Icon: Instagram },
                { label: "LinkedIn", href: siteConfig.socials.linkedin, Icon: Linkedin },
                { label: "Facebook", href: siteConfig.socials.facebook, Icon: Facebook },
                { label: "X", href: siteConfig.socials.x, Icon: Twitter },
              ].map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-forest-100/70 transition hover:border-lime-400/40 hover:text-lime-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-forest-100/70 transition hover:text-lime-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Services</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1 text-forest-100/70 transition hover:text-lime-300"
                  >
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Get in touch</h3>
            <ul className="mt-5 space-y-4 text-sm text-forest-100/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
                <span>
                  {siteConfig.locations.map((l) => l.city).join(" & ")}, Kenya
                  <br />
                  <span className="text-forest-100/70">Pickups across both regions</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
                <a href={`tel:${siteConfig.phoneDial}`} className="hover:text-lime-300">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
                <a href={mailtoUrl()} className="hover:text-lime-300">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
                <span>{siteConfig.hours}</span>
              </li>
            </ul>
            <a
              href={whatsappUrl("Hello Novacycle! I found your details in the site footer and would like to get in touch.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime-500 px-5 py-2.5 text-sm font-bold text-forest-950 transition hover:bg-lime-400"
            >
              <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-forest-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/faq" className="transition hover:text-lime-300">FAQ</Link>
            <Link href="/privacy" className="transition hover:text-lime-300">Privacy Policy</Link>
            <span>Built for a cleaner, more inclusive future. 🌱</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
