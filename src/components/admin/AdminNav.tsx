"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, ClipboardList, LayoutDashboard, Tags, UserRound, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Permission } from "@/lib/rbac";
import { can } from "@/lib/rbac";
import type { Role } from "@prisma/client";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, permission: "admin:access" as Permission },
  { href: "/admin/submissions", label: "Submissions", icon: ClipboardList, permission: "submissions:read" as Permission },
  { href: "/admin/devices", label: "Device inventory", icon: Boxes, permission: "devices:read" as Permission },
  { href: "/admin/prices", label: "Price catalog", icon: Tags, permission: "devices:read" as Permission },
  { href: "/admin/users", label: "Users & roles", icon: Users, permission: "users:read" as Permission },
  { href: "/admin/profile", label: "Profile", icon: UserRound, permission: "admin:access" as Permission },
];

export function AdminNav({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1" aria-label="Admin navigation">
      {links.filter((link) => can(role, link.permission)).map(({ href, label, icon: Icon, permission }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition",
              active ? "bg-lime-400 text-forest-950" : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {permission === "users:write" && <span className="sr-only"> (restricted)</span>}
          </Link>
        );
      })}
    </nav>
  );
}
