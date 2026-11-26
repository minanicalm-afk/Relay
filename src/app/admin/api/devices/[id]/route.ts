import { NextResponse } from "next/server";
import { DeviceStatus } from "@prisma/client";
import { z } from "zod";
import { authorizeAdmin } from "@/lib/authorize-admin";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  status: z.nativeEnum(DeviceStatus),
  outcomeNote: z.string().optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Props) {
  const session = await authorizeAdmin("devices:write");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid update." }, { status: 400 });

  try {
    await prisma.device.update({
      where: { id },
      data: {
        status: parsed.data.status,
        outcomeNote: parsed.data.outcomeNote?.trim() || null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Device not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
