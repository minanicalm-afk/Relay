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

export function SignInForm({ nextPath }: { nextPath?: string }) {
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
