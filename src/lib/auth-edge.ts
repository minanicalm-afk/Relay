import { jwtVerify } from "jose/jwt/verify";
import { getAuthSecret } from "./auth-secret";
import { can } from "./rbac";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF" | "VIEWER" | "CUSTOMER";
};

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      (payload.role !== "SUPER_ADMIN" &&
        payload.role !== "ADMIN" &&
        payload.role !== "STAFF" &&
        payload.role !== "VIEWER" &&
        payload.role !== "CUSTOMER")
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function canAccessAdmin(role: SessionPayload["role"] | undefined): boolean {
  return can(role, "admin:access");
}
