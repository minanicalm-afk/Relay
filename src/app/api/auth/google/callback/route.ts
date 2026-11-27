import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hashPassword, issueSessionToken, sessionCookieOptions } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/auth-secret";
import {
  GOOGLE_STATE_COOKIE,
  googleConfigured,
  googleRedirectUri,
  readGoogleState,
} from "@/lib/google-auth";
import { prisma } from "@/lib/prisma";

function fail(origin: string, code: string) {
  const response = NextResponse.redirect(new URL(`/sign-in?error=${code}`, origin));
  response.cookies.set(GOOGLE_STATE_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  if (!googleConfigured()) return fail(origin, "google_config");
  if (url.searchParams.get("error")) return fail(origin, "google_denied");

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const stored = readGoogleState((await cookies()).get(GOOGLE_STATE_COOKIE)?.value);
  if (!code || !returnedState || !stored || stored.state !== returnedState) {
    return fail(origin, "google_state");
  }

  const redirectUri = googleRedirectUri(origin);
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenBody = (await tokenResponse.json().catch(() => null)) as { access_token?: string } | null;
  if (!tokenResponse.ok || !tokenBody?.access_token) return fail(origin, "google_failed");

  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokenBody.access_token}` },
  });
  const profile = (await profileResponse.json().catch(() => null)) as {
    sub?: string;
    email?: string;
    email_verified?: boolean | string;
    name?: string;
  } | null;

  const verified = profile?.email_verified === true || profile?.email_verified === "true";
  const email = profile?.email?.toLowerCase().trim();
  if (!profileResponse.ok || !profile?.sub || !email || !verified) return fail(origin, "google_email");

  const googleId = profile.sub;
  let user = await prisma.user.findUnique({ where: { googleId } });

  if (!user) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing?.googleId && existing.googleId !== googleId) return fail(origin, "google_mismatch");
    user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: { googleId },
        })
      : await prisma.user.create({
          data: {
            name: profile.name?.trim() || email.split("@")[0] || "Novacycle customer",
            email,
            googleId,
            passwordHash: await hashPassword(randomBytes(32).toString("hex")),
            hasPassword: false,
            role: "CUSTOMER",
            active: true,
          },
        });
  }

  if (!user.active) return fail(origin, "google_inactive");

  await prisma.submission.updateMany({
    where: { email: user.email, customerId: null },
    data: { customerId: user.id },
  });

  const destination = stored.nextPath ?? (user.role === "CUSTOMER" ? "/account" : "/admin");
  const response = NextResponse.redirect(new URL(destination, origin));
  response.cookies.set(SESSION_COOKIE, await issueSessionToken(user), sessionCookieOptions());
  response.cookies.set(GOOGLE_STATE_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
