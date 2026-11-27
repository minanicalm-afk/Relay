"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppFloat } from "./WhatsAppFloat";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConsole = pathname.startsWith("/admin");
  const isAuth = pathname === "/sign-in" || pathname === "/sign-up";

  if (isConsole) return <>{children}</>;
  if (isAuth) return <main className="min-h-screen">{children}</main>;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
