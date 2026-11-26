import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { authorizeAdmin } from "@/lib/authorize-admin";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role),
});

export async function POST(request: Request) {
  const session = await authorizeAdmin("users:write");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Name, email, an 8+ character password and role are required." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "A user with that email already exists." }, { status: 400 });

  await prisma.user.create({
    data: {
      name: parsed.data.name.trim(),
      email,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role,
      active: true,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
