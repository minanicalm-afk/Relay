import { NextResponse } from "next/server";
import { createGoogleState, googleAuthorizeUrl, googleConfigured, googleStateCookie, safeNextPath } from "@/lib/google-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL("/sign-in?error=google_config", url.origin));
  }

  const nextPath = safeNextPath(url.searchParams.get("next"));
  const state = createGoogleState();
  const cookie = googleStateCookie(state, nextPath);
  const response = NextResponse.redirect(googleAuthorizeUrl(url.origin, state));
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
