import { whatsappUrl } from "./config";

/** Open a WhatsApp chat with a prefilled message. Safe to call from client code only. */
export function openWhatsApp(message?: string): void {
  if (typeof window === "undefined") return;
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
}
