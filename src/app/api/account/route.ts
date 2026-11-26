import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sign in to update your profile." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your name and a valid email." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user || !user.active) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  if (email !== user.email) {
    const taken = await prisma.user.findUnique({ where: { email } });
    if (taken) return NextResponse.json({ error: "That email is already in use." }, { status: 400 });
  }

  const nextPassword = parsed.data.newPassword?.trim();
  if (nextPassword) {
    if (nextPassword.length < 8) {
      return NextResponse.json({ error: "New passwords need at least 8 characters." }, { status: 400 });
    }
    if (user.hasPassword && (!parsed.data.currentPassword || !(await verifyPassword(parsed.data.currentPassword, user.passwordHash)))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name.trim(),
      email,
      phone: parsed.data.phone?.trim() || null,
      passwordHash: nextPassword ? await hashPassword(nextPassword) : undefined,
      hasPassword: nextPassword ? true : undefined,
    },
  });

  await createSession({
    id: updated.id,
    email: updated.email,
    name: updated.name,
    role: updated.role,
  });

  return NextResponse.json({ ok: true, name: updated.name, email: updated.email, phone: updated.phone });
}
