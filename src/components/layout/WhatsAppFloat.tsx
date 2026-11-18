import { siteConfig, whatsappUrl } from "@/lib/config";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function WhatsAppFloat() {
  return (
    <div className="fixed bottom-6 right-5 z-40 flex items-center gap-3 sm:bottom-8 sm:right-8">
      <span className="hidden rounded-full bg-forest-900 px-4 py-2 text-sm font-semibold text-white shadow-lift sm:block">
        Need help? Chat with us
      </span>
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-green-400/50 animate-pulse-ring" />
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat with Relay on WhatsApp: ${siteConfig.phoneDisplay}`}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105 hover:bg-[#20bd5a]"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      </div>
    </div>
  );
}
