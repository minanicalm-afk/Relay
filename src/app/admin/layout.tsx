import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { requireAdmin } from "@/lib/auth";
import { roleLabels } from "@/lib/admin";
import { isDemoMode } from "@/lib/prisma";
import { AdminProfileMenu } from "@/components/admin/AdminProfileMenu";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Logo } from "@/components/layout/Logo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: `%s | ${siteConfig.name} Admin` },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-forest-50">
      <AdminSidebar role={session.role} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-forest-950 text-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 pl-[72px] sm:px-8 sm:pl-[76px] lg:pl-8">
            <div className="flex items-center gap-3">
              <Logo light compact href="/admin" />
              <span className="hidden text-xs font-medium text-white/50 sm:inline">Operations console</span>
            </div>
            <AdminProfileMenu
              name={session.name}
              email={session.email}
              roleLabel={roleLabels[session.role]}
            />
          </div>
        </header>

        {isDemoMode && (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-2.5 text-center text-xs font-semibold text-amber-900">
            Demo mode — admin access is open and records are kept in memory until the server restarts.
          </div>
        )}

        <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
          {children}
        </main>

        <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 pb-10 text-xs text-forest-900/60 sm:px-8">
          <p>Internal {siteConfig.name} operations console.</p>
          <Link href="/" className="inline-flex items-center gap-1 font-semibold text-forest-700 hover:text-forest-900">
            View customer site <ArrowUpRight className="h-3 w-3" />
          </Link>
        </footer>
      </div>
    </div>
  );
}
