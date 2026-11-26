export const SESSION_COOKIE = "techgive_admin_session";

export function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be set in production.");
  }

  return new TextEncoder().encode(secret ?? "techgive-development-secret-change-me");
}
