"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, ChevronDown, MapPin, Menu, ShieldCheck, X } from "lucide-react";
import { navLinks, siteConfig, whatsappUrl } from "@/lib/config";
import { services } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Logo } from "./Logo";

const serviceMenu = [
  { label: "All services", href: "/services" },
  ...services.map((service) => ({
    label: service.shortTitle,
    href: `/services/${service.slug}`,
  })),
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-forest-950 text-forest-100">
        <div className="container-wide flex h-9 items-center justify-between gap-4 text-[11px] font-medium sm:text-xs">
          <p className="truncate">
            <span className="text-lime-400">✦</span> Environmental champions
            turning e-waste into community impact
          </p>
          <div className="hidden items-center gap-5 md:flex">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-lime-400" />
              Juja &amp; Nairobi, Kenya
            </span>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-lime-300"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-lime-400" />
              Chat with us
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-forest-100 bg-cream/85 shadow-soft backdrop-blur-xl"
            : "border-transparent bg-cream",
        )}
      >
        <div className="container-wide flex h-[72px] items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
            {navLinks.map((link) =>
              link.label === "Services" ? (
                <div key={link.href} className="group/services relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition",
                      isActive(link.href)
                        ? "text-forest-700"
                        : "text-forest-900/70 hover:text-forest-900",
                    )}
                    aria-haspopup="true"
                  >
                    Services
                    <ChevronDown className="h-3.5 w-3.5 transition group-hover/services:rotate-180 group-focus-within/services:rotate-180" />
                  </Link>
                  {isActive(link.href) && (
                    <span className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-lime-500" />
                  )}
                  <div className="invisible absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-3 opacity-0 transition duration-150 group-hover/services:visible group-hover/services:opacity-100 group-focus-within/services:visible group-focus-within/services:opacity-100">
                    <div className="grid grid-cols-2 gap-1 rounded-3xl border border-forest-100 bg-white p-3 shadow-lift">
                      {serviceMenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-2xl px-4 py-3 text-sm font-semibold text-forest-800 transition hover:bg-forest-50"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-sm font-semibold transition",
                      isActive(link.href)
                        ? "text-forest-700"
                        : "text-forest-900/70 hover:text-forest-900",
                    )}
                  >
                    {link.label}
                  </Link>
                  {isActive(link.href) && (
                    <span className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-lime-500" />
                  )}
                </div>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <Button
              href="/admin"
              size="sm"
              variant="outline"
              className="whitespace-nowrap"
              aria-label="Open admin dashboard"
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
            >
              Admin
            </Button>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-11 w-11 place-items-center rounded-full bg-forest-100 text-forest-700 transition hover:bg-forest-200"
              aria-label="Chat with Relay on WhatsApp"
            >
              <WhatsAppIcon />
            </a>
            <Button href="/contact" size="md" icon={<CalendarCheck className="h-4 w-4" />}>
              Book a pickup
            </Button>
          </div>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-forest-100 bg-white text-forest-900 xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-b border-forest-100 bg-cream xl:hidden">
          <nav className="container-wide flex flex-col gap-1 py-5" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-base font-semibold",
                    isActive(link.href)
                      ? "bg-forest-100 text-forest-800"
                      : "text-forest-900/80",
                  )}
                >
                  {link.label}
                </Link>
                {link.label === "Services" && (
                  <div className="ml-4 mt-1 flex flex-col border-l border-forest-100 pl-3">
                    {serviceMenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="rounded-xl px-3 py-2 text-sm text-forest-700/80"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/admin"
              className="mt-2 flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-semibold text-forest-900/80"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
              <span className="ml-auto rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forest-700">
                Demo
              </span>
            </Link>
            <div className="mt-4 flex gap-3">
              <Button href="/contact" className="flex-1">
                Book a pickup
              </Button>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-12 w-12 place-items-center rounded-full bg-forest-800 text-white"
                aria-label="Chat on WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
            <p className="mt-4 px-4 text-xs text-forest-700/60">
              {siteConfig.hours} · Juja &amp; Nairobi
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}
