import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { isDemoMode, prisma } from "@/lib/prisma";

const deviceSchema = z.object({
  deviceType: z.string().min(1),
  brand: z.string().optional(),
  model: z.string().optional(),
  age: z.string().optional(),
  condition: z.string().optional(),
  accessories: z.array(z.string()).optional(),
  description: z.string().optional(),
  offerAmount: z.number().int().nonnegative().optional(),
  pricingSource: z.string().optional(),
  matchedPrice: z.string().nullable().optional(),
  reference: z.string().optional(),
  photoNames: z.array(z.string()).optional(),
  receiptName: z.string().optional(),
});

const submissionSchema = z.object({
  type: z.enum(["CONTACT", "PICKUP", "DONATION", "PARTNERSHIP", "SELL"]),
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
  details: z.record(z.unknown()).optional(),
  device: deviceSchema.optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = submissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const data = parsed.data;
  const email = data.email?.trim() ? data.email.trim().toLowerCase() : null;

  const submission = await prisma.submission.create({
    data: {
      type: data.type,
      name: data.name.trim(),
      email,
      phone: data.phone?.trim() || null,
      location: data.location?.trim() || null,
      message: data.message?.trim() || null,
      details: data.details ? (data.details as Prisma.InputJsonValue) : undefined,
      devices: data.device
        ? {
            create: {
              deviceType: data.device.deviceType,
              brand: data.device.brand?.trim() || null,
              model: data.device.model?.trim() || null,
              age: data.device.age || null,
              condition: data.device.condition || null,
              accessories: data.device.accessories
                ? (data.device.accessories as Prisma.InputJsonValue)
                : undefined,
              description: data.device.description?.trim() || null,
              offerAmount: data.device.offerAmount ?? null,
              pricingSource: data.device.pricingSource?.trim() || null,
              matchedPrice: data.device.matchedPrice?.trim() || null,
              reference: data.device.reference?.trim() || null,
              photoNames: data.device.photoNames
                ? (data.device.photoNames as Prisma.InputJsonValue)
                : undefined,
              receiptName: data.device.receiptName?.trim() || null,
            },
          }
        : undefined,
    },
    select: { id: true, publicToken: true },
  });

  return NextResponse.json(
    { ok: true, id: submission.id, token: submission.publicToken, demo: isDemoMode },
    { status: 201 },
  );
}
