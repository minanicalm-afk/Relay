/**
 * Central site configuration.
 */

export const siteConfig = {
  name: "Novacycle",
  legalName: "Novacycle Technologies Ltd",
  tagline: "Turning E-Waste into Opportunity.",
  statement: "Giving technology a second life and communities a new opportunity.",
  pillars: ["E-Waste Management", "Digital Inclusion", "Environmental Sustainability"],
  description:
    "Novacycle Technologies Ltd promotes responsible electronic waste management through collection, recycling, refurbishment and reuse, while expanding access to technology for underserved communities.",
  url: "https://techgive.co.ke",
  email: "novacycletechnologies@gmail.com",
  phoneDisplay: "0729 843111",
  phoneDial: "+254729843111",
  whatsapp: "254729843111",
  whatsappDefaultMessage:
    "Hello Novacycle! I'd like to learn more about your services.",
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
