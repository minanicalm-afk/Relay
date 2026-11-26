export const submissionTypes = ["CONTACT", "PICKUP", "DONATION", "PARTNERSHIP", "SELL"] as const;
export const submissionStatuses = ["NEW", "IN_PROGRESS", "SCHEDULED", "COMPLETED", "CANCELLED", "ARCHIVED"] as const;
export const deviceStatuses = ["RECEIVED", "DIAGNOSING", "REPAIRING", "REFURBISHED", "DONATED", "RECYCLED", "SOLD", "DISPOSED"] as const;
export const adminRoles = ["SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"] as const;

export type SubmissionTypeValue = (typeof submissionTypes)[number];
export type SubmissionStatusValue = (typeof submissionStatuses)[number];
export type DeviceStatusValue = (typeof deviceStatuses)[number];
export type AdminRoleValue = (typeof adminRoles)[number];
