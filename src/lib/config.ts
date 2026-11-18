/**
 * Central site configuration.
 * TODO: Replace the placeholder phone number, WhatsApp number and email
 * with Relay's real contact details before launch.
 */

export const siteConfig = {
  name: "Relay",
  legalName: "Relay Environmental Solutions",
  tagline: "Technology with a purpose. Waste with a future.",
  description:
    "Relay collects, repairs and recycles electronic waste across Juja and Nairobi, donates refurbished devices to schools and needy communities, upgrades organisations' IT equipment, buys your old electronics for instant offers, and partners for community impact.",
  url: "https://techgive.co.ke",
  email: "hello@techgive.co.ke",
  phoneDisplay: "+254 700 000 000",
  phoneDial: "+254700000000",
  whatsapp: "254700000000",
  whatsappDefaultMessage:
    "Hello Relay! I'd like to learn more about your services.",
  hours: "Monday – Saturday, 8:00 AM – 6:00 PM",
  locations: [
    {
      city: "Juja",
      region: "Kiambu County",
      address:
        "Josachi Computers, Alma Matta Building, along Gachororo Road, JKUAT Gate B, Juja",
      details: "Our Juja shop and main collection hub.",
    },
    {
      city: "Nairobi",
      region: "Nairobi County",
      address: "Nairobi CBD, Nairobi County, Kenya",
      details: "Pickup & drop-off point for the metro area.",
    },
  ],
  socials: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    x: "https://x.com",
  },
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Community", href: "/community" },
  { label: "Partnerships", href: "/partnerships" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function whatsappUrl(message?: string): string {
  const text = encodeURIComponent(message || siteConfig.whatsappDefaultMessage);
  return `https://wa.me/${siteConfig.whatsapp}?text=${text}`;
}

export function mailtoUrl(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${siteConfig.email}${query ? `?${query}` : ""}`;
}
