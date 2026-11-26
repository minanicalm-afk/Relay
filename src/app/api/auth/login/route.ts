import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });

  if (!user || !user.active) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (user.hasPassword === false) {
    return NextResponse.json(
      { error: "This email uses Google sign-in. Continue with Google, then add a password from your profile if you want both." },
      { status: 401 },
    );
  }

  if (!(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (user.email) {
    await prisma.submission.updateMany({
      where: { email: user.email, customerId: null },
      data: { customerId: user.id },
    });
  }

  await createSession(user);
  return NextResponse.json({
    ok: true,
    role: user.role,
    admin: user.role !== "CUSTOMER",
  });
}
