# Relay

A production-ready marketing and lead-generation website for **Relay**, an environmental and social enterprise based in Juja and Nairobi, Kenya. The site's primary focus is responsible e-waste collection, with supporting services for repair, donations, IT upgrades, electronics buyback and community partnerships.

Built with Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS.

## Features

- **Landing page** — clear hero message, service overview, flagship collection spotlight, impact stats, process, buyback teaser, community work, testimonials and FAQ
- **Services** — listing page plus six detailed service pages
- **Instant-offer buyback flow** (`/sell`) — multi-step form with device details, photo and receipt uploads, automatic offer calculation, and accept / bargain / cancel actions that hand off to WhatsApp
- **Community & Partnerships** — impact activities and a partner enquiry form
- **About, FAQ, Contact & Privacy** — full informational pages with a pickup/enquiry form
- **WhatsApp everywhere** — floating chat button, header/footer links and prefilled messages on every form
- **SEO ready** — metadata, Open Graph, sitemap and robots.txt
- Fully responsive, accessible semantics, and static generation for fast delivery

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # lint
npm run typecheck  # type check
```

## ⚠️ Before you launch — replace these placeholders

All business details live in **`src/lib/config.ts`**. Update:

1. `whatsapp` — your WhatsApp number in international format **without** the `+` (e.g. `254712345678`). This powers the floating button and every prefilled message.
2. `phoneDisplay` / `phoneDial` — your public phone number.
3. `email` — your contact email.
4. `url` — your real production domain (used for canonical URLs, Open Graph, sitemap and robots).
5. `socials` — your real social profile URLs.
6. `locations` — exact pickup addresses if you want to publish them.

Also review:

- **`src/lib/data.ts`** — all marketing copy, impact statistics, testimonials and partner types. The impact numbers and testimonials are illustrative; replace them with verified figures and real quotes before publishing.
- **`src/app/globals.css`** / **`tailwind.config.ts`** — brand colours if you want a different palette.

### About the forms

The site has no backend by design. Every form validates input and then opens WhatsApp with a neatly prefilled message, so leads arrive directly in your chat and nothing is silently lost. If you later want email or database submissions, replace the `openWhatsApp(...)` calls in:

- `src/components/forms/ContactForm.tsx`
- `src/components/forms/PartnerForm.tsx`
- `src/components/sell/SellForm.tsx`

### About the instant offer

The offer is calculated in `src/lib/pricing.ts` from device type, brand tier, age, condition and accessories. It is intentionally an **indicative** estimate that is confirmed after physical inspection. To use live pricing, swap `calculateOffer` for an API call — the sell flow does not otherwise change.

Uploaded photos and receipts are previewed locally in the browser only; no files are transmitted anywhere. Wire file uploads to your storage provider when you add a backend.

## Deployment

Deploy to Vercel or any platform that supports Next.js:

```bash
npm run build
npm run start
```

Set the environment to Node 20 or newer. No environment variables are required.
# Relay
