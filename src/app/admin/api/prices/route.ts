import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizeAdmin } from "@/lib/authorize-admin";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  deviceType: z.string().min(1),
  brand: z.string().optional(),
  modelName: z.string().optional(),
  age: z.string().optional(),
  condition: z.string().optional(),
  price: z.number().int().positive(),
  active: z.boolean().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await authorizeAdmin("devices:write");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a device type and a positive price." }, { status: 400 });
  }

  const data = parsed.data;
  const price = await prisma.devicePrice.create({
    data: {
      deviceType: data.deviceType,
      brand: data.brand?.trim() || null,
      modelName: data.modelName?.trim() || null,
      age: data.age || null,
      condition: data.condition || null,
      price: data.price,
      active: data.active ?? true,
      notes: data.notes?.trim() || null,
    },
  });

  return NextResponse.json({ ok: true, id: price.id }, { status: 201 });
}
