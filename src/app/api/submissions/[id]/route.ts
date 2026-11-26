import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  status: z.enum(["IN_PROGRESS", "CANCELLED"]),
  token: z.string().min(1),
});

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const submission = await prisma.submission.updateMany({
    where: { id, publicToken: parsed.data.token },
    data: { status: parsed.data.status },
  });

  if (submission.count === 0) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
