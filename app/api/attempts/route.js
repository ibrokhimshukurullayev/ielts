import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { skill, band, correctCount, total, details, testId } = await request.json();
  if (!skill || typeof band !== "number") {
    return Response.json({ error: "skill and band are required." }, { status: 400 });
  }

  const attempt = await prisma.attempt.create({
    data: {
      userId: user.id,
      skill: skill.toUpperCase(),
      band,
      correctCount: correctCount ?? null,
      total: total ?? null,
      details: details ?? undefined,
      testId: testId ?? null,
    },
  });

  return Response.json({ attempt });
}
