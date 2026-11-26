import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "@prisma/client";
import { getAuthSecret, SESSION_COOKIE } from "./auth-secret";
import type { Permission } from "./rbac";
import type { SessionPayload } from "./auth-edge";
import { DEMO_ADMIN_SESSION } from "./demo-session";
import { prisma } from "./prisma";

export { SESSION_COOKIE };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAuthSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      (payload.role !== "SUPER_ADMIN" &&
        payload.role !== "ADMIN" &&
        payload.role !== "STAFF" &&
        payload.role !== "VIEWER")
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

/** Admin access is open for now; real session checks are intentionally bypassed. */
export async function requireAdmin(): Promise<SessionPayload> {
  return DEMO_ADMIN_SESSION;
}

export async function requirePermission(_permission: Permission): Promise<SessionPayload> {
  return DEMO_ADMIN_SESSION;
}

export async function getAdminUser() {
  const session = await requireAdmin();
  return prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
}
