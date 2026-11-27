/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { submissionTypes } from "./options";

/**
 * When DATABASE_URL is absent, the app runs in a safe demo mode.
 * Admin access is open and records live in memory until the server restarts.
 */
export const isDemoMode = !process.env.DATABASE_URL;

const now = () => new Date();
const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

type Row = Record<string, any>;

const globalForDemo = globalThis as unknown as {
  techgiveDemoStore?: {
    submissions: Row[];
    devices: Row[];
    devicePrices: Row[];
    users: Row[];
  };
};

/** Stored on globalThis so Next.js route bundles share the same demo data. */
const demoStore = globalForDemo.techgiveDemoStore ?? {
  submissions: [],
  devices: [],
  devicePrices: [],
  users: [
    {
      id: "demo-admin",
      name: "Novacycle Admin",
      email: "novacycletechnologies@gmail.com",
      phone: null,
      passwordHash: "$2b$12$wS3HaWEn30naubDvGacw2.rHRWrMUiqodXBGQNFDQPU48IMog0FWu",
      googleId: null,
      hasPassword: true,
      role: "SUPER_ADMIN",
      active: true,
      createdAt: now(),
      updatedAt: now(),
    },
  ],
};

const keptAdmin = demoStore.users.find((user) => user.id === "demo-admin");
if (keptAdmin) {
  keptAdmin.email = "novacycletechnologies@gmail.com";
  keptAdmin.name = keptAdmin.name === "Relay Admin" || keptAdmin.name === "Josachi Admin" ? "Novacycle Admin" : keptAdmin.name;
  if (!keptAdmin.passwordHash) {
    keptAdmin.passwordHash = "$2b$12$wS3HaWEn30naubDvGacw2.rHRWrMUiqodXBGQNFDQPU48IMog0FWu";
  }
}

// Older in-memory stores created before the price catalog existed need this field.
demoStore.devicePrices ??= [];

/** Starter catalog so the sell flow has computer prices before anything is added by hand. */
if (demoStore.devicePrices.length === 0) {
  const starterPrices = [
    { deviceType: "laptop", brand: null, modelName: null, age: null, condition: null, price: 40000 },
    { deviceType: "laptop", brand: "Apple", modelName: "MacBook Air", age: null, condition: null, price: 58000 },
    { deviceType: "laptop", brand: "Apple", modelName: "MacBook Pro", age: null, condition: null, price: 75000 },
    { deviceType: "laptop", brand: "Dell", modelName: "Latitude", age: null, condition: null, price: 48000 },
    { deviceType: "laptop", brand: "HP", modelName: "EliteBook", age: null, condition: null, price: 45000 },
    { deviceType: "desktop", brand: null, modelName: null, age: null, condition: null, price: 30000 },
  ];

  starterPrices.forEach((price, index) => {
    const createdAt = new Date(Date.now() - (starterPrices.length - index) * 1000);
    demoStore.devicePrices.push({
      id: `price_demo_${index + 1}`,
      ...price,
      active: true,
      notes: "Starter catalog price — edit or replace in admin.",
      createdAt,
      updatedAt: createdAt,
    });
  });
}

globalForDemo.techgiveDemoStore = demoStore;

function clone<T extends Row>(row: T): T {
  return {
    ...row,
    createdAt: row.createdAt instanceof Date ? new Date(row.createdAt) : row.createdAt,
    updatedAt: row.updatedAt instanceof Date ? new Date(row.updatedAt) : row.updatedAt,
    scheduledAt: row.scheduledAt instanceof Date ? new Date(row.scheduledAt) : row.scheduledAt,
    completedAt: row.completedAt instanceof Date ? new Date(row.completedAt) : row.completedAt,
  } as T;
}

function matches(where: Row | undefined, row: Row): boolean {
  if (!where) return true;

  for (const [key, value] of Object.entries(where)) {
    if (value === undefined) continue;
    if (value === null) {
      if (row[key] != null) return false;
      continue;
    }

    if (key === "OR" && Array.isArray(value)) {
      const found = value.some((condition: Row) =>
        Object.entries(condition).some(([field, expected]: [string, any]) => {
          const needle = String(expected?.contains ?? "").toLowerCase();
          return needle ? String(row[field] ?? "").toLowerCase().includes(needle) : false;
        }),
      );
      if (!found) return false;
      continue;
    }

    if (key === "role" && typeof value === "object") {
      if ((value as Row).not && row.role === (value as Row).not) return false;
      continue;
    }

    if (typeof value === "object" && "equals" in (value as Row)) {
      if (row[key] !== (value as Row).equals) return false;
      continue;
    }

    if (typeof value === "object" && "contains" in (value as Row)) {
      const needle = String((value as Row).contains ?? "").toLowerCase();
      if (needle && !String(row[key] ?? "").toLowerCase().includes(needle)) return false;
      continue;
    }

    if (row[key] !== value) return false;
  }

  return true;
}

function shapeFields(row: Row, shape: Row | undefined, isSelect = true): Row {
  if (!shape || typeof shape !== "object") return clone(row);
  const result: Row = isSelect ? {} : clone(row);

  for (const [key, spec] of Object.entries(shape)) {
    if (!spec) continue;

    if (key === "assignedTo" || key === "submission") {
      const specRow = spec as Row;
      const nested = (specRow.select ?? specRow) as Row | undefined;
      const nestedIsSelect = Boolean(specRow.select) || isSelect;
      const related =
        key === "assignedTo"
          ? demoStore.users.find((item) => item.id === row.assignedToId)
          : demoStore.submissions.find((item) => item.id === row.submissionId);
      result[key] = related ? shapeFields(related, nested, nestedIsSelect) : null;
      continue;
    }

    if (key === "_count") {
      const specRow = spec as Row;
      const counts = (specRow.select ?? specRow) as Row;
      result._count = {
        devices: counts.devices
          ? demoStore.devices.filter((item) => item.submissionId === row.id).length
          : undefined,
      };
      continue;
    }

    if (key === "devices") {
      result.devices = demoStore.devices
        .filter((item) => item.submissionId === row.id)
        .map((item) => clone(item));
      continue;
    }

    if (isSelect) result[key] = row[key];
  }

  return result;
}

function relationParts(spec: unknown): [Row | undefined, boolean] {
  if (!spec || typeof spec !== "object") return [undefined, false];
  const row = spec as Row;
  return [(row.select ?? row) as Row, Boolean(row.select)];
}

function sortByCreated(rows: Row[], orderBy?: Row): Row[] {
  const direction = orderBy?.createdAt === "asc" ? 1 : -1;
  return [...rows].sort(
    (a, b) => (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction,
  );
}

function applyArgs(rows: Row[], args: Row = {}): Row[] {
  let result = rows.filter((row) => matches(args.where, row));
  result = sortByCreated(result, args.orderBy);
  if (args.take) result = result.slice(0, args.take);
  return result.map((row) =>
    shapeFields(row, (args.select ?? args.include) as Row | undefined, Boolean(args.select)),
  );
}

function demoUpdate(row: Row, data: Row): Row {
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) row[key] = value;
  }
  row.updatedAt = now();
  return clone(row);
}

function createDevice(data: Row, submissionId: string | null): Row {
  const record: Row = {
    id: id("dev"),
    submissionId,
    deviceType: data.deviceType ?? "Device",
    brand: data.brand ?? null,
    model: data.model ?? null,
    age: data.age ?? null,
    condition: data.condition ?? null,
    accessories: data.accessories ?? null,
    description: data.description ?? null,
    offerAmount: data.offerAmount ?? null,
    pricingSource: data.pricingSource ?? null,
    matchedPrice: data.matchedPrice ?? null,
    reference: data.reference ?? null,
    photoNames: data.photoNames ?? null,
    receiptName: data.receiptName ?? null,
    status: data.status ?? "RECEIVED",
    outcomeNote: data.outcomeNote ?? null,
    createdAt: now(),
    updatedAt: now(),
  };
  demoStore.devices.unshift(record);
  return clone(record);
}

const demoPrisma = {
  submission: {
    count: async (args: Row = {}) => demoStore.submissions.filter((row) => matches(args.where, row)).length,
    findMany: async (args: Row = {}) => applyArgs(demoStore.submissions, args),
    findUnique: async (args: Row) => {
      const row = demoStore.submissions.find((item) => matches({ id: args.where?.id }, item));
      if (!row) return null;
      const result = shapeFields(row, args.select);
      const include = args.include as Row | undefined;
      if (include?.assignedTo) {
        const user = demoStore.users.find((item) => item.id === row.assignedToId);
        const [shape, isSelect] = relationParts(include.assignedTo);
        result.assignedTo = user ? shapeFields(user, shape, isSelect) : null;
      }
      if (include?.devices) {
        result.devices = demoStore.devices
          .filter((item) => item.submissionId === row.id)
          .map((item) => clone(item));
      }
      return result;
    },
    groupBy: async (args: Row) => {
      const grouped = submissionTypes.map((type) => ({
        type,
        _count: {
          _all: demoStore.submissions.filter((row) => row.type === type).length,
        },
      }));
      return args.by?.includes("type") ? grouped : [];
    },
    create: async (args: Row) => {
      const data = { ...(args.data as Row) };
      const deviceData = data.devices?.create as Row | undefined;
      delete data.devices;
      const record: Row = {
        ...data,
        id: id("sub"),
        publicToken: data.publicToken ?? id("tok"),
        status: data.status ?? "NEW",
        createdAt: now(),
        updatedAt: now(),
      };
      demoStore.submissions.unshift(record);
      if (deviceData) createDevice(deviceData, record.id);
      return shapeFields(record, args.select);
    },
    update: async (args: Row) => {
      const row = demoStore.submissions.find((item) => item.id === args.where?.id);
      if (!row) throw new Error("Submission not found");
      return demoUpdate(row, args.data as Row);
    },
    updateMany: async (args: Row) => {
      const matched = demoStore.submissions.filter((row) => matches(args.where, row));
      matched.forEach((row) => demoUpdate(row, args.data as Row));
      return { count: matched.length };
    },
  },

  device: {
    count: async (args: Row = {}) => demoStore.devices.filter((row) => matches(args.where, row)).length,
    findMany: async (args: Row = {}) => {
      const rows = applyArgs(demoStore.devices, args);
      const include = args.include as Row | undefined;
      if (include?.submission) {
        rows.forEach((row) => {
          const submission = demoStore.submissions.find((item) => item.id === row.submissionId);
          const [shape, isSelect] = relationParts(include.submission);
          row.submission = submission ? shapeFields(submission, shape, isSelect) : null;
        });
      }
      return rows;
    },
    findUnique: async (args: Row) => {
      const row = demoStore.devices.find((item) => item.id === args.where?.id);
      if (!row) return null;
      const result = shapeFields(row, args.select);
      const include = args.include as Row | undefined;
      if (include?.submission) {
        const submission = demoStore.submissions.find((item) => item.id === row.submissionId);
        const [shape, isSelect] = relationParts(include.submission);
        result.submission = submission ? shapeFields(submission, shape, isSelect) : null;
      }
      return result;
    },
    update: async (args: Row) => {
      const row = demoStore.devices.find((item) => item.id === args.where?.id);
      if (!row) throw new Error("Device not found");
      return demoUpdate(row, args.data as Row);
    },
  },

  devicePrice: {
    count: async (args: Row = {}) => demoStore.devicePrices.filter((row) => matches(args.where, row)).length,
    findMany: async (args: Row = {}) => applyArgs(demoStore.devicePrices, args),
    findUnique: async (args: Row) => {
      const row = demoStore.devicePrices.find((item) => item.id === args.where?.id);
      return row ? shapeFields(row, args.select) : null;
    },
    create: async (args: Row) => {
      const record: Row = {
        ...(args.data as Row),
        id: id("price"),
        active: (args.data as Row).active ?? true,
        createdAt: now(),
        updatedAt: now(),
      };
      demoStore.devicePrices.unshift(record);
      return shapeFields(record, args.select);
    },
    update: async (args: Row) => {
      const row = demoStore.devicePrices.find((item) => item.id === args.where?.id);
      if (!row) throw new Error("Price not found");
      return demoUpdate(row, args.data as Row);
    },
    delete: async (args: Row) => {
      const index = demoStore.devicePrices.findIndex((item) => item.id === args.where?.id);
      if (index < 0) throw new Error("Price not found");
      const [removed] = demoStore.devicePrices.splice(index, 1);
      return shapeFields(removed, args.select);
    },
  },

  user: {
    count: async (args: Row = {}) => demoStore.users.filter((row) => matches(args.where, row)).length,
    findMany: async (args: Row = {}) => {
      let rows = demoStore.users.filter((row) => matches(args.where, row));
      const order = args.orderBy as Row | undefined;
      const roleDirection = order?.role === "desc" ? -1 : 1;
      const nameDirection = order?.name === "desc" ? -1 : 1;
      rows = rows.sort((a, b) => {
        if (a.role !== b.role) return String(a.role).localeCompare(String(b.role)) * roleDirection;
        return String(a.name).localeCompare(String(b.name)) * nameDirection;
      });
      return rows.map((row) => shapeFields(row, args.select));
    },
    findUnique: async (args: Row) => {
      const row = demoStore.users.find((item) => matches(args.where, item));
      return row ? shapeFields(row, args.select) : null;
    },
    create: async (args: Row) => {
      const record: Row = {
        ...(args.data as Row),
        id: id("usr"),
        createdAt: now(),
        updatedAt: now(),
      };
      demoStore.users.push(record);
      return shapeFields(record, args.select);
    },
    update: async (args: Row) => {
      const row = demoStore.users.find((item) => item.id === args.where?.id);
      if (!row) throw new Error("User not found");
      return demoUpdate(row, args.data as Row);
    },
  },
};

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  (isDemoMode
    ? (demoPrisma as unknown as PrismaClient)
    : new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
