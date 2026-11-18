export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: string;
  image: string;
  highlights: string[];
  process: { title: string; description: string }[];
  benefits: { title: string; description: string }[];
};

export const services: Service[] = [
  {
    slug: "e-waste-collection",
    title: "E-Waste Collection & Recycling",
    shortTitle: "Collection & Recycling",
    tagline: "Our flagship service — responsible disposal, done right.",
    description:
      "We collect unwanted electronics from homes, schools and businesses across Juja and Nairobi, then sort them for repair, reuse or safe recycling. Nothing good goes to landfill, and nothing hazardous is dumped carelessly. It is the simplest, most responsible way to clear out old tech.",
    icon: "Recycle",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Free pickups within our service areas",
      "Safe handling of batteries and hazardous parts",
      "Full inventory and disposal documentation",
      "Repair-first — reuse before recycling",
    ],
    process: [
      { title: "Book a pickup", description: "Tell us what you have and where you are through the site or WhatsApp." },
      { title: "We collect", description: "Our team arrives at your doorstep, logs every item and gives you a record." },
      { title: "Sort & triage", description: "Items are assessed: repairable tech is restored, the rest is responsibly recycled." },
      { title: "Impact report", description: "You receive confirmation of what was reused, recycled and diverted from landfill." },
    ],
    benefits: [
      { title: "Protect your community", description: "Keep toxic materials like lead and mercury out of soils and water." },
      { title: "Zero hassle", description: "We handle lifting, transport and paperwork so you do not have to." },
      { title: "Traceable and transparent", description: "Every collected item is documented for your records or ESG reporting." },
    ],
  },
  {
    slug: "repair-refurbish",
    title: "Repair & Refurbishment",
    shortTitle: "Repair & Refurbish",
    tagline: "Fix it first. Replace only when we must.",
    description:
      "Many devices are thrown away when a small repair would give them years of life. Our technicians diagnose, repair and thoroughly refurbish computers, laptops, phones and monitors — extending their useful life and keeping them in circulation.",
    icon: "Wrench",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Skilled local technicians",
      "Genuine parts wherever available",
      "Data-safe repairs and diagnostics",
      "Warranty on refurbished devices",
    ],
    process: [
      { title: "Drop off or collect", description: "Bring your device in or let us pick it up from your location." },
      { title: "Diagnosis", description: "We run a full assessment and share a clear repair quote before any work." },
      { title: "Repair & test", description: "Components are repaired or replaced, then stress-tested for reliability." },
      { title: "Return or donate", description: "Get your device back, or donate it to a learner who needs it." },
    ],
    benefits: [
      { title: "Save money", description: "Repairing is almost always cheaper than replacing." },
      { title: "Keep data secure", description: "We handle your information carefully and wipe devices when requested." },
      { title: "Circular by design", description: "Every repaired device is one less product manufactured." },
    ],
  },
  {
    slug: "donations",
    title: "Electronics Donations",
    shortTitle: "Donations",
    tagline: "Your old device can be someone's new opportunity.",
    description:
      "We collect donated electronics and redistribute refurbished, working devices to schools, students, needy families and community organisations across Kenya. A laptop that is idle in a drawer can become a child's first step into digital learning.",
    icon: "HeartHandshake",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Donate devices, funds or both",
      "We refurbish and verify every device",
      "Transparent beneficiary storytelling",
      "Tax-friendly giving guidance",
    ],
    process: [
      { title: "Offer your donation", description: "Tell us what you would like to donate and its condition." },
      { title: "Collect & refurbish", description: "We pick it up, repair it and prepare it for its next owner." },
      { title: "Match to need", description: "We work with schools and community partners to find the right recipient." },
      { title: "Share the impact", description: "We show you where your device went and the difference it made." },
    ],
    benefits: [
      { title: "Bridge the digital divide", description: "Give learners access to the tools they need to thrive." },
      { title: "Social proof that matters", description: "Real stories from real communities, not just numbers." },
      { title: "Guilt-free clearing out", description: "Your unused tech becomes a powerful act of generosity." },
    ],
  },
  {
    slug: "it-upgrades",
    title: "IT Upgrades for Organisations",
    shortTitle: "IT Upgrades",
    tagline: "Modernise your workplace without the waste.",
    description:
      "We help organisations, companies and institutions upgrade their ageing computer fleets. We advise on what to replace, supply refurbished or new equipment, and responsibly handle everything you retire — all in one coordinated upgrade.",
    icon: "MonitorSmartphone",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Fleet assessment and upgrade planning",
      "Bulk refurbished and new equipment",
      "Secure data wiping on retired devices",
      "Asset disposal with documentation",
    ],
    process: [
      { title: "Audit", description: "We assess your current equipment and identify what is holding you back." },
      { title: "Proposal", description: "You get a costed upgrade plan with new and refurbished options." },
      { title: "Rollout", description: "We supply, set up and migrate data with minimal downtime." },
      { title: "Retire responsibly", description: "Old equipment is wiped, repaired, donated or recycled transparently." },
    ],
    benefits: [
      { title: "Lower capital cost", description: "Quality refurbished hardware stretches your IT budget further." },
      { title: "Productivity gains", description: "Modern, reliable machines keep your team moving." },
      { title: "Meet your ESG goals", description: "Documented, responsible disposal supports sustainability reporting." },
    ],
  },
  {
    slug: "buyback",
    title: "Electronics Buyback",
    shortTitle: "Buyback",
    tagline: "Get an instant offer for the tech you no longer use.",
    description:
      "Tell us about your device, upload clear photos and proof of ownership, and our system gives you an immediate indicative offer. Accept it, arrange a handover, or chat with us on WhatsApp to bargain — you are always in control.",
    icon: "BadgeDollarSign",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Instant indicative offer online",
      "Accept, decline or negotiate on WhatsApp",
      "Proof of ownership keeps everyone safe",
      "Fast, friendly handover in Juja & Nairobi",
    ],
    process: [
      { title: "Describe it", description: "Select the device, brand, age and condition in a few clicks." },
      { title: "Show proof", description: "Upload photos and a receipt or proof of ownership." },
      { title: "Get your offer", description: "Our system calculates an instant, transparent estimate." },
      { title: "You decide", description: "Accept, bargain on WhatsApp, or simply walk away." },
    ],
    benefits: [
      { title: "Quick and transparent", description: "No waiting days for a vague quote." },
      { title: "Safe and legitimate", description: "Ownership checks protect buyers and honest sellers." },
      { title: "Fair value", description: "Offers reflect real condition, age and demand." },
    ],
  },
  {
    slug: "community-partnerships",
    title: "Community Partnerships",
    shortTitle: "Partnerships",
    tagline: "Big change happens when organisations work together.",
    description:
      "We partner with like-minded organisations on high-impact community activities: tree planting, recycling drives, charity marathons, donations to orphanages and support for vulnerable groups. If your organisation cares about people and the planet, we should talk.",
    icon: "UsersRound",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Tree planting & environmental restoration",
      "Community recycling campaigns",
      "Charity runs and marathons",
      "Orphanage and needy-family support",
    ],
    process: [
      { title: "Start a conversation", description: "Tell us about your organisation and the impact you want to make." },
      { title: "Co-design", description: "We shape an activity that fits your goals, audience and resources." },
      { title: "Activate", description: "We mobilise our network and deliver the activity together." },
      { title: "Measure & share", description: "We report outcomes and celebrate the story publicly." },
    ],
    benefits: [
      { title: "Amplified impact", description: "Combine strengths to reach more people and places." },
      { title: "Brand purpose", description: "Show your stakeholders you care through action, not words." },
      { title: "Local roots", description: "Programmes grounded in the realities of Juja and Nairobi." },
    ],
  },
];

export const impactStats = [
  { value: "12,000+", label: "Devices collected" },
  { value: "6,500+", label: "Devices repaired" },
  { value: "48+", label: "Schools supported" },
  { value: "9,000+", label: "Trees planted" },
];

export const processSteps = [
  {
    step: "01",
    title: "Tell us what you have",
    description:
      "Share a few details on the site or WhatsApp — the devices, their condition and your location.",
  },
  {
    step: "02",
    title: "We pick it up",
    description:
      "Our team collects from your doorstep in Juja or Nairobi, logs everything and gives you a record.",
  },
  {
    step: "03",
    title: "We sort & restore",
    description:
      "Repairable tech is refurbished, usable devices are donated, and the rest is recycled safely.",
  },
  {
    step: "04",
    title: "You see the impact",
    description:
      "We share where your electronics went and the difference they made in a real community.",
  },
];

export const whyUs = [
  {
    title: "To our donors",
    description:
      "A clear, responsible home for the devices you no longer need. Free collection, documented handover, and the confidence that reusable tech will reach someone who can use it.",
    linkLabel: "Donate with confidence",
    href: "/services/donations",
    icon: "HeartHandshake",
  },
  {
    title: "To our partners",
    description:
      "One local team for disposal, upgrades, repairs and community programmes — with practical reporting and a sustainability story your stakeholders can stand behind.",
    linkLabel: "Explore partnerships",
    href: "/partnerships",
    icon: "UsersRound",
  },
  {
    title: "To our team",
    description:
      "Work that builds real skill and purpose. Every collection, repair and placement connects the people at Relay to a tangible change in nearby schools and homes.",
    linkLabel: "Meet the team",
    href: "/about",
    icon: "Wrench",
  },
  {
    title: "To the community",
    description:
      "Refurbished machines, digital skills sessions, tree planting and recycling drives — designed around the needs of Juja and Nairobi, not imported from elsewhere.",
    linkLabel: "See community work",
    href: "/community",
    icon: "Trees",
  },
];

export const communityActivities = [
  {
    title: "Tree Planting",
    description:
      "We mobilise volunteers and partners to restore green spaces and shade our communities, one seedling at a time.",
    icon: "Trees",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Recycling Drives",
    description:
      "Community collection points and events that make responsible e-waste disposal easy and normal for everyone.",
    icon: "Recycle",
    image:
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Charity Marathons",
    description:
      "We run and partner in races that raise funds and awareness for digital inclusion and environmental action.",
    icon: "Footprints",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Orphanage & Needy Support",
    description:
      "Refurbished devices, supplies and mentorship for children and families who need a helping hand.",
    icon: "HandHeart",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
  },
];

export const testimonials = [
  {
    quote:
      "We replaced twenty old desktops with refurbished ones through Relay. The upgrade was smooth, and they handled every old machine responsibly. Our board loved the sustainability story.",
    name: "Wanjiku M.",
    role: "Operations Manager, Nairobi",
  },
  {
    quote:
      "I had three dead laptops sitting in a store for years. Relay collected them for free and even gave me a record for my records. That kind of professionalism is rare.",
    name: "Peter K.",
    role: "Resident, Juja",
  },
  {
    quote:
      "The students were thrilled to receive working laptops. Our digital literacy programme finally had the tools it needed, thanks to Relay and their partners.",
    name: "Sr. Mary W.",
    role: "School Administrator, Kiambu",
  },
];

export const partnerTypes = [
  "Schools & universities",
  "Corporates & SMEs",
  "Environmental organisations",
  "Community-based groups",
  "Churches & faith communities",
  "Government & county agencies",
  "CSR & foundation partners",
];

export const faqs = [
  {
    q: "Which areas do you collect from?",
    a: "We currently operate in Juja and Nairobi, with pickups available across both areas. For larger bulk collections or out-of-town requests, talk to us and we will arrange something workable.",
  },
  {
    q: "Is disposal really free?",
    a: "Standard household and small-office collections within Juja and Nairobi are free. Very large, hazardous or specialist loads may attract a modest transport fee, which we will always tell you upfront.",
  },
  {
    q: "What happens to my data?",
    a: "Your privacy matters. We can wipe devices securely, and you are welcome to remove or destroy storage media yourself before handover. Just let us know your preference.",
  },
  {
    q: "How is the instant offer calculated?",
    a: "We look at the device type, brand, age, condition and included accessories. It is an indicative figure — the final price is confirmed after a quick physical inspection.",
  },
  {
    q: "Why do you need proof of ownership?",
    a: "It protects everyone. It confirms the device is yours to sell, helps us meet our legal obligations and keeps stolen goods out of our supply chain.",
  },
  {
    q: "Can I donate instead of selling?",
    a: "Absolutely. If you would rather give your device to a school or a needy family, we will refurbish it and make sure it reaches someone who can use it.",
  },
  {
    q: "How do I become a partner?",
    a: "Visit our Partnerships page or send us a WhatsApp message. We will schedule a short conversation to understand your goals and design an activity together.",
  },
];

export const values = [
  {
    title: "Environment first",
    description:
      "Every decision starts with the question: how does this affect our planet? We reuse before we recycle, and we never cut corners on disposal.",
    icon: "Leaf",
  },
  {
    title: "People over profit",
    description:
      "Technology should open doors. We measure our success in learners empowered and families supported, not just revenue.",
    icon: "HeartHandshake",
  },
  {
    title: "Transparency always",
    description:
      "Clear pricing, honest advice and documented outcomes. You will always know what happened to your devices.",
    icon: "Eye",
  },
  {
    title: "Local roots, real impact",
    description:
      "We are based here, we work here, and we are accountable to the communities of Juja and Nairobi.",
    icon: "MapPin",
  },
];
