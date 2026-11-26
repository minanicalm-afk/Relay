/** Prefilled WhatsApp text for the page the visitor is actually on. */
export function whatsappMessageForPath(pathname: string): string {
  if (pathname.startsWith("/services/")) {
    return "Hello Relay! I'm looking at one of your services and would like to ask about it.";
  }
  if (pathname.startsWith("/services")) {
    return "Hello Relay! I'd like help choosing the right service for my electronics.";
  }
  if (pathname.startsWith("/contact")) {
    return "Hello Relay! I'm on the contact page and would like to talk about a pickup, donation, sale, or partnership.";
  }
  if (pathname.startsWith("/sell")) {
    return "Hello Relay! I'm on the sell page and would like to talk about an offer for my electronics.";
  }
  if (pathname.startsWith("/partnerships")) {
    return "Hello Relay! I'd like to talk about a partnership with Relay.";
  }
  if (pathname.startsWith("/community")) {
    return "Hello Relay! I'd like to ask about your community programmes.";
  }
  if (pathname.startsWith("/about")) {
    return "Hello Relay! I was reading about Relay and would like to get in touch.";
  }
  if (pathname.startsWith("/faq")) {
    return "Hello Relay! I have a question that isn't answered in the FAQ.";
  }
  if (pathname.startsWith("/privacy")) {
    return "Hello Relay! I have a question about how you handle personal information.";
  }
  if (pathname.startsWith("/account")) {
    return "Hello Relay! I'm signed in and would like help with one of my requests.";
  }
  return "Hello Relay! I'm on the homepage and would like to know about free pickup, donations, or selling old electronics.";
}
