import type { SessionPayload } from "./auth-edge";

/** Fallback identity used only by scripts that still import this constant. */
export const DEMO_ADMIN_SESSION: SessionPayload = {
  sub: "demo-admin",
  email: "novacycletechnologies@gmail.com",
  name: "Novacycle Admin",
  role: "SUPER_ADMIN",
};
