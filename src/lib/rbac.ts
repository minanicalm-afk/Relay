import type { Role } from "@prisma/client";

export type Permission =
  | "admin:access"
  | "submissions:read"
  | "submissions:write"
  | "devices:read"
  | "devices:write"
  | "users:read"
  | "users:write";

export const rolePermissions: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "admin:access",
    "submissions:read",
    "submissions:write",
    "devices:read",
    "devices:write",
    "users:read",
    "users:write",
  ],
  ADMIN: [
    "admin:access",
    "submissions:read",
    "submissions:write",
    "devices:read",
    "devices:write",
    "users:read",
  ],
  STAFF: ["admin:access", "submissions:read", "submissions:write", "devices:read", "devices:write"],
  VIEWER: ["admin:access", "submissions:read", "devices:read", "users:read"],
};

export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
}
