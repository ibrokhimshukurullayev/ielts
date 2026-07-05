import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser, sanitizeUser } from "@/src/shared/lib/getSessionUser";

export async function GET() {
  const user = await getSessionUser();
  return Response.json({ user: sanitizeUser(user) });
}

export async function PATCH(request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { name, targetBand, examDate, currentBand, weeklyHours, focusSkill } = await request.json();

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(name !== undefined && { name }),
      targetBand: targetBand ? Number(targetBand) : null,
      examDate: examDate ? new Date(examDate) : null,
      currentBand: currentBand ? Number(currentBand) : null,
      weeklyHours: weeklyHours ? Number(weeklyHours) : null,
      focusSkill: focusSkill || null,
    },
  });

  return Response.json({ user: sanitizeUser(updated) });
}
