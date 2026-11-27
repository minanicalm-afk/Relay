"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

function safeNext(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/account";
  return value;
}

const googleErrors: Record<string, string> = {
  google_config: "Google sign-in is not configured yet.",
  google_denied: "Google sign-in was cancelled.",
  google_state: "Google sign-in expired. Try again.",
  google_email: "Google did not share a verified email. Allow email access and try again.",
  google_inactive: "This account is inactive. Contact Novacycle to restore it.",
  google_mismatch: "This email is already linked to a different Google account.",
  google_failed: "Google sign-in failed. Try again.",
};

function googleHref(nextPath?: string) {
  return nextPath ? `/api/auth/google?next=${encodeURIComponent(nextPath)}` : "/api/auth/google";
}

function GoogleButton({ nextPath }: { nextPath?: string }) {
  return (
    <a href={googleHref(nextPath)} className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-forest-200 bg-white text-sm font-semibold text-forest-950 transition hover:border-forest-400 hover:bg-cream">
      <GoogleMark />
      Continue with Google
    </a>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="h-4 w-4">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.16.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

function OrDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-forest-100" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs font-semibold uppercase tracking-[0.14em] text-forest-900/45">or</span>
      </div>
    </div>
  );
}

export function SignInForm({ nextPath, errorCode }: { nextPath?: string; errorCode?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string; admin?: boolean };
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Could not sign in.");
      return;
    }
    const destination = nextPath ? safeNext(nextPath) : data.admin ? "/admin" : "/account";
    router.push(destination);
    router.refresh();
  }

  return (
    <AuthCard
      title="Sign in"
      description="Customers can follow their pickups and offers. Team members can open the admin console from the profile menu."
    >
      <GoogleButton nextPath={nextPath} />
      <OrDivider />
      {(errorCode && googleErrors[errorCode]) && (
        <p className="field-error mb-4" role="alert">{googleErrors[errorCode]}</p>
      )}
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div>
          <label className="field-label" htmlFor="sign-in-email">Email</label>
          <input id="sign-in-email" type="email" autoComplete="email" className="field-input" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="sign-in-password">Password</label>
          <input id="sign-in-password" type="password" autoComplete="current-password" className="field-input" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        {error && <p className="field-error" role="alert">{error}</p>}
        <Button className="w-full" type="submit" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-forest-900/70">
        New here?{" "}
        <Link href="/sign-up" className="font-semibold text-forest-800 hover:text-forest-950">
          Create a customer account
        </Link>
      </p>
    </AuthCard>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Could not create the account.");
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <AuthCard
      title="Create an account"
      description="Save your details and see the status of pickups, donations, partnerships and offers you send us."
    >
      <GoogleButton />
      <OrDivider />
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div>
          <label className="field-label" htmlFor="sign-up-name">Name</label>
          <input id="sign-up-name" className="field-input" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="sign-up-email">Email</label>
          <input id="sign-up-email" type="email" autoComplete="email" className="field-input" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="sign-up-phone">Phone</label>
          <input id="sign-up-phone" className="field-input" value={phone} placeholder="+254 7..." onChange={(event) => setPhone(event.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="sign-up-password">Password</label>
          <input id="sign-up-password" type="password" autoComplete="new-password" className="field-input" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        {error && <p className="field-error" role="alert">{error}</p>}
        <Button className="w-full" type="submit" disabled={busy}>
          {busy ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-forest-900/70">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-forest-800 hover:text-forest-950">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}

function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="mx-auto w-full max-w-md px-5">
        <Logo />
        <div className="mt-8 rounded-3xl border border-forest-100 bg-white p-6 shadow-card sm:p-8">
          <h1 className="text-3xl font-semibold text-forest-950">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-forest-900/70">{description}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}
