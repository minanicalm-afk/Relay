import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { authorizeAdmin } from "@/lib/authorize-admin";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.nativeEnum(Role).optional(),
  active: z.boolean().optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Props) {
  const session = await authorizeAdmin("users:write");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (id === session.sub) {
    return NextResponse.json({ error: "You cannot change your own account here." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid update." }, { status: 400 });

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: parsed.data.name?.trim(),
        role: parsed.data.role,
        active: parsed.data.active,
      },
    });
  } catch {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
