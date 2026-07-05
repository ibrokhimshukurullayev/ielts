import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ history: {} });
  }

  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    select: { skill: true, band: true, createdAt: true },
  });

  const history = {};
  for (const attempt of attempts) {
    const key = attempt.skill.toLowerCase();
    if (!history[key]) history[key] = [];
    history[key].push({ band: attempt.band, date: attempt.createdAt });
  }

  return Response.json({ history });
}
