import { NextResponse } from "next/server";
import { Role, SubmissionStatus } from "@prisma/client";
import { z } from "zod";
import { authorizeAdmin } from "@/lib/authorize-admin";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  status: z.nativeEnum(SubmissionStatus),
  assignedToId: z.string().optional(),
  scheduledAt: z.string().optional(),
  notes: z.string().optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Props) {
  const session = await authorizeAdmin("submissions:write");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid update." }, { status: 400 });

  const assignedToId = parsed.data.assignedToId?.trim() || null;
  if (assignedToId) {
    const assignee = await prisma.user.findUnique({
      where: { id: assignedToId },
      select: { active: true, role: true },
    });
    if (!assignee?.active || assignee.role === Role.VIEWER) {
      return NextResponse.json({ error: "Choose an active staff member or admin." }, { status: 400 });
    }
  }

  const scheduledAt = parsed.data.scheduledAt?.trim()
    ? new Date(parsed.data.scheduledAt)
    : null;
  if (scheduledAt && Number.isNaN(scheduledAt.getTime())) {
    return NextResponse.json({ error: "Invalid schedule date." }, { status: 400 });
  }

  try {
    await prisma.submission.update({
      where: { id },
      data: {
        status: parsed.data.status,
        assignedToId,
        scheduledAt,
        notes: parsed.data.notes?.trim() || null,
        completedAt: parsed.data.status === "COMPLETED" ? new Date() : null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
