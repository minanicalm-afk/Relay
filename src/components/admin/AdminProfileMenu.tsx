"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Store, UserRound } from "lucide-react";

type Props = {
  name: string;
  email: string;
  roleLabel: string;
};

export function AdminProfileMenu({ name, email, roleLabel }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (container.current && !container.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div
      className="relative"
      ref={container}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-3 text-left text-white transition hover:bg-white/10"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-lime-400 text-xs font-bold text-forest-950">
          {initials}
        </span>
        <span className="hidden sm:block">
          <span className="block text-xs font-semibold leading-tight">{name}</span>
          <span className="block text-[10px] leading-tight text-white/60">{roleLabel}</span>
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-white/60 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 pt-2" role="menu">
        <div className="w-64 overflow-hidden rounded-2xl border border-forest-100 bg-white p-1.5 shadow-lift">
          <div className="border-b border-forest-100 px-3 py-3">
            <p className="text-sm font-semibold text-forest-950">{name}</p>
            <p className="truncate text-xs text-forest-900/70">{email}</p>
          </div>
          <Link
            href="/admin/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-forest-900 transition hover:bg-forest-50"
          >
            <UserRound className="h-4 w-4 text-forest-600" /> Profile
          </Link>
          <Link
            href="/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-forest-900 transition hover:bg-forest-50"
          >
            <Store className="h-4 w-4 text-forest-600" /> Customer site
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            disabled={busy}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" /> {busy ? "Logging out..." : "Log out"}
          </button>
        </div>
        </div>
      )}
    </div>
  );
}
