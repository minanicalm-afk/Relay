import type { SessionPayload } from "./auth-edge";

/** Temporary open-admin session. Remove this when real authentication is enabled. */
export const DEMO_ADMIN_SESSION: SessionPayload = {
  sub: "demo-admin",
  email: "admin@techgive.co.ke",
  name: "Relay Admin",
  role: "SUPER_ADMIN",
};
