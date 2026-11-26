import { DEMO_ADMIN_SESSION } from "./demo-session";
import type { SessionPayload } from "./auth-edge";
import type { Permission } from "./rbac";

/** Admin API access is open for now; real RBAC is intentionally bypassed. */
export async function authorizeAdmin(_permission: Permission): Promise<SessionPayload> {
  return DEMO_ADMIN_SESSION;
}
