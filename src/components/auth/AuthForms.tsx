"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Mail, Phone, UserRound } from "lucide-react";
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
    <a href={googleHref(nextPath)} className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-forest-200 bg-white text-sm font-semibold text-forest-950 shadow-card transition hover:border-forest-400 hover:bg-cream">
      <GoogleMark />
      Continue with Google
    </a>
  );
}

function AuthField({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  placeholder,
  icon,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  placeholder?: string;
  icon: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="sr-only" htmlFor={id}>{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest-700/70">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder ?? label}
          className="field-input h-12 rounded-2xl border-forest-100 bg-forest-50/70 pl-11"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
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
      title="Welcome back"
      description="Sign in to follow your pickups, offers and account."
    >
      <GoogleButton nextPath={nextPath} />
      <OrDivider />
      {(errorCode && googleErrors[errorCode]) && (
        <p className="field-error mb-4" role="alert">{googleErrors[errorCode]}</p>
      )}
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <AuthField id="sign-in-email" label="Email address" type="email" autoComplete="email" icon={<Mail className="h-4 w-4" />} value={email} onChange={setEmail} />
        <AuthField id="sign-in-password" label="Password" type="password" autoComplete="current-password" icon={<Lock className="h-4 w-4" />} value={password} onChange={setPassword} />
        {error && <p className="field-error" role="alert">{error}</p>}
        <Button className="w-full" type="submit" disabled={busy} icon={<ArrowRight className="h-4 w-4" />}>
          {busy ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-forest-900/70">
        New to Novacycle?{" "}
        <Link href="/sign-up" className="font-semibold text-forest-800 hover:text-lime-700">
          Create an account
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
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <AuthField id="sign-up-name" label="Full name" autoComplete="name" icon={<UserRound className="h-4 w-4" />} value={name} onChange={setName} />
        <AuthField id="sign-up-email" label="Email address" type="email" autoComplete="email" icon={<Mail className="h-4 w-4" />} value={email} onChange={setEmail} />
        <AuthField id="sign-up-phone" label="Phone" type="tel" autoComplete="tel" placeholder="+254 7..." icon={<Phone className="h-4 w-4" />} value={phone} onChange={setPhone} />
        <AuthField id="sign-up-password" label="Password" type="password" autoComplete="new-password" icon={<Lock className="h-4 w-4" />} value={password} onChange={setPassword} />
        {error && <p className="field-error" role="alert">{error}</p>}
        <Button className="w-full" type="submit" disabled={busy} icon={<ArrowRight className="h-4 w-4" />}>
          {busy ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-forest-900/70">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-forest-800 hover:text-lime-700">
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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-cream via-cream to-sand">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[40rem] -translate-x-1/2 rounded-full bg-lime-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-forest-200/40 blur-3xl" />
      <Link
        href="/"
        className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 text-sm font-semibold text-forest-800/80 transition hover:text-forest-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-12">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-[1.75rem] border border-forest-100 bg-white/90 p-6 shadow-lift backdrop-blur-md sm:p-8">
          <h1 className="text-2xl font-semibold text-forest-950">{title}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-forest-900/70">{description}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}
