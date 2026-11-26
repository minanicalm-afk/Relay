"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppFloat } from "./WhatsAppFloat";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConsole = pathname.startsWith("/admin");

  if (isConsole) return <>{children}</>;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
