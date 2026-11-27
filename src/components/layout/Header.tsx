"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, ChevronDown, MapPin, Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/config";
import { services } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AccountMenu } from "@/components/account/AccountMenu";
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
            <span className="text-lime-400">✦</span>{" "}
            {siteConfig.pillars.join("  •  ")}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-lime-400" />
            <span>Nairobi, Kenya</span>
          </p>
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

          <div className="ml-auto flex items-center gap-3 xl:ml-0">
            <Button href="/contact" size="md" className="hidden xl:inline-flex" icon={<CalendarCheck className="h-4 w-4" />}>
              Book a pickup
            </Button>
            <AccountMenu />
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
            <div className="mt-4">
              <Button href="/contact" className="w-full">
                Book a pickup
              </Button>
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
