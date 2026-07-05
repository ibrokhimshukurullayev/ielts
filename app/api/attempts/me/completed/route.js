import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ testIds: [] });
  }

  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id, testId: { not: null } },
    select: { testId: true },
    distinct: ["testId"],
  });

  return Response.json({ testIds: attempts.map((a) => a.testId) });
}
