import type { Metadata } from "next";
import { Lock, MessageCircle, UploadCloud } from "lucide-react";
import { mailtoUrl } from "@/lib/config";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Relay handles the information you share when booking a pickup, donating, selling electronics or partnering with us.",
};

const sections = [
  {
    title: "Information you share with us",
    body: "When you use our forms, we ask for details such as your name, phone number, email address, location, device information and a short message. We only ask for what we need to respond to your enquiry and arrange the service you requested.",
  },
  {
    title: "How we use it",
    body: "We use your information to reply to your enquiry, schedule pickups, calculate and confirm offers, coordinate donations and upgrades, and keep records of the services we provide. We do not sell your personal information to third parties.",
  },
  {
    title: "WhatsApp handoff",
    body: "Our website does not send your form directly to a server. Instead, it opens WhatsApp with your details prefilled so you can review and send the message yourself. Once sent, the message is handled by WhatsApp and our team according to WhatsApp's own terms and privacy policy.",
  },
  {
    title: "Photos and proof of ownership",
    body: "Images and documents you select in the sell-your-electronics form are previewed locally in your browser only. They are not uploaded to our servers by the website. If you choose to send them to us during the WhatsApp conversation, they become part of that conversation and should only be shared with our official number.",
  },
  {
    title: "Partner and donation records",
    body: "We keep basic records of donations, collections and partnerships so we can give you an impact summary and meet our reporting obligations. These records are stored carefully and shared only where required by law or with your consent.",
  },
  {
    title: "Your choices",
    body: "You can choose not to provide information, but some details are needed for us to help you. You may ask us what information we hold about you, request corrections, or ask us to delete it where we are able to do so. Contact us using the details below.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="A plain-language explanation of what we do — and do not do — with the information you share with Relay."
        breadcrumb={[{ label: "Privacy Policy" }]}
        image="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=2000&q=80"
        imageAlt="A padlock resting on a laptop keyboard"
      />

      <section className="bg-cream py-16 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-100 text-forest-700">
              <Lock className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold text-forest-950">
              Your trust matters to us.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-forest-900/75">
              We are a local team and we treat your details the way we would want
              ours treated. If anything here is unclear,{" "}
              <a href={mailtoUrl("Question about privacy")} className="font-semibold text-forest-700 underline underline-offset-4">
                send us a message
              </a>
              .
            </p>
            <div className="mt-7 space-y-3 rounded-3xl border border-forest-100 bg-white p-6 shadow-card text-sm">
              <p className="flex items-start gap-3 text-forest-900/75">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" />
                Forms hand off to WhatsApp — you review before sending.
              </p>
              <p className="flex items-start gap-3 text-forest-900/75">
                <UploadCloud className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" />
                Uploads stay in your browser until you send them yourself.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {sections.map((section, index) => (
              <article key={section.title} className="rounded-3xl border border-forest-100 bg-white p-7 shadow-card">
                <h3 className="text-lg font-semibold text-forest-950">
                  <span className="mr-2 text-forest-400">{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-forest-900/75">{section.body}</p>
              </article>
            ))}
            <p className="px-2 pt-2 text-xs text-forest-900/65">
              Last updated: {new Date().getFullYear()}. This policy should be
              reviewed with your legal adviser before launch.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
