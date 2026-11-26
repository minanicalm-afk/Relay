"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Tags,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { can, type Permission } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import type { Role } from "@prisma/client";

const links: { href: string; label: string; icon: typeof Boxes; permission: Permission }[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, permission: "admin:access" },
  { href: "/admin/submissions", label: "Submissions", icon: ClipboardList, permission: "submissions:read" },
  { href: "/admin/devices", label: "Device inventory", icon: Boxes, permission: "devices:read" },
  { href: "/admin/prices", label: "Price catalog", icon: Tags, permission: "devices:read" },
  { href: "/admin/users", label: "Users & roles", icon: Users, permission: "users:read" },
  { href: "/admin/profile", label: "Profile", icon: UserRound, permission: "admin:access" },
];

export function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const visible = links.filter((link) => can(role, link.permission));

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <Logo light compact href="/admin" />
        <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-lime-300">
          Admin
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-auto grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/10 lg:hidden"
          aria-label="Close admin menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6" aria-label="Admin navigation">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Workspace</p>
        {visible.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-lime-400 text-forest-950 shadow-[0_10px_24px_-12px_rgba(163,230,53,0.9)]"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to customer site
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 text-white lg:hidden"
        aria-label="Open admin menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-forest-950 lg:block">
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            className="absolute inset-0 bg-forest-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-white/10 bg-forest-950 shadow-lift">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
