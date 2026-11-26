import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ authenticated: false });

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { name: true, role: true, active: true },
  });

  if (!user?.active) return NextResponse.json({ authenticated: false });

  return NextResponse.json({
    authenticated: true,
    name: user.name,
    role: user.role,
  });
}
