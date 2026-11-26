import { getSession } from "./auth";
import type { SessionPayload } from "./auth-edge";
import { can, type Permission } from "./rbac";

export async function authorizeAdmin(permission: Permission): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session || !session.sub || !can(session.role, permission)) return null;
  return session;
}
