import { randomBytes } from "crypto";

export const GOOGLE_STATE_COOKIE = "relay_google_oauth";

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function googleRedirectUri(origin: string): string {
  return `${origin}/api/auth/google/callback`;
}

export function safeNextPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export function createGoogleState(): string {
  return randomBytes(24).toString("hex");
}

export function googleAuthorizeUrl(origin: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: googleRedirectUri(origin),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "online",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function googleStateCookie(state: string, nextPath: string | null) {
  return {
    name: GOOGLE_STATE_COOKIE,
    value: `${state}.${encodeURIComponent(nextPath ?? "")}`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    },
  };
}

export function readGoogleState(value: string | undefined): { state: string; nextPath: string | null } | null {
  if (!value) return null;
  const dot = value.indexOf(".");
  if (dot <= 0) return null;
  const state = value.slice(0, dot);
  const nextPath = safeNextPath(decodeURIComponent(value.slice(dot + 1)));
  return { state, nextPath };
}
