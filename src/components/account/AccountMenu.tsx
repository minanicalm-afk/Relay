"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";

type SessionState = {
  name: string;
  admin: boolean;
};

export function AccountMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false;
    setOpen(false);
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((data: { authenticated?: boolean; name?: string; admin?: boolean }) => {
        if (ignore) return;
        setSession(data.authenticated && data.name ? { name: data.name, admin: Boolean(data.admin) } : null);
        setReady(true);
      })
      .catch(() => {
        if (!ignore) setReady(true);
      });
    return () => {
      ignore = true;
    };
  }, [pathname]);

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
    setSession(null);
    setOpen(false);
    setBusy(false);
    router.push("/");
    router.refresh();
  }

  if (!ready) {
    return <span className="h-11 w-24 animate-pulse rounded-full bg-forest-100" aria-hidden="true" />;
  }

  if (!session) {
    return (
      <Button href="/sign-in" size="sm" variant="outline" className="whitespace-nowrap">
        Sign in
      </Button>
    );
  }

  const initials = session.name.slice(0, 2).toUpperCase();

  return (
    <div
      className="relative"
      ref={container}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${session.name} account menu`}
        className="grid h-11 w-11 place-items-center rounded-full bg-forest-800 text-sm font-bold text-lime-300 transition hover:bg-forest-900"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 w-56 pt-2" role="menu">
          <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white p-1.5 shadow-lift">
            <p className="truncate px-3 py-2 text-xs font-semibold text-forest-900/70">{session.name}</p>
            <Link
              href="/account"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-forest-900 transition hover:bg-forest-50"
            >
              <UserRound className="h-4 w-4 text-forest-600" /> Profile
            </Link>
            {session.admin && (
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-forest-900 transition hover:bg-forest-50"
              >
                <ShieldCheck className="h-4 w-4 text-forest-600" /> Admin
              </Link>
            )}
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
