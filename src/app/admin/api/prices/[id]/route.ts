import { NextResponse } from "next/server";
import { z } from "zod";
import { authorizeAdmin } from "@/lib/authorize-admin";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  deviceType: z.string().min(1).optional(),
  brand: z.string().optional(),
  modelName: z.string().optional(),
  age: z.string().optional(),
  condition: z.string().optional(),
  price: z.number().int().positive().optional(),
  active: z.boolean().optional(),
  notes: z.string().optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Props) {
  const session = await authorizeAdmin("devices:write");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid price update." }, { status: 400 });

  const data = parsed.data;
  try {
    await prisma.devicePrice.update({
      where: { id },
      data: {
        deviceType: data.deviceType,
        brand: data.brand?.trim() || null,
        modelName: data.modelName?.trim() || null,
        age: data.age || null,
        condition: data.condition || null,
        price: data.price,
        active: data.active,
        notes: data.notes?.trim() || null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Price not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Props) {
  const session = await authorizeAdmin("devices:write");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.devicePrice.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Price not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
