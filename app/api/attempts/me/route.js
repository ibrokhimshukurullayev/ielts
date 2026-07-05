import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({});
  }

  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const latestBySkill = {};
  for (const attempt of attempts) {
    const key = attempt.skill.toLowerCase();
    if (latestBySkill[key]) continue;
    latestBySkill[key] = {
      band: attempt.band,
      correctCount: attempt.correctCount,
      total: attempt.total,
      results: attempt.details,
      completedAt: attempt.createdAt,
    };
  }

  return Response.json(latestBySkill);
}
