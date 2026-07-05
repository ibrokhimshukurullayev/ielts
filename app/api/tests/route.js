import { prisma } from "@/src/shared/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const skill = searchParams.get("skill");

  const tests = await prisma.test.findMany({
    where: skill ? { skill: skill.toUpperCase() } : undefined,
    orderBy: { createdAt: "asc" },
    select: { id: true, slug: true, skill: true, title: true },
  });

  return Response.json({ tests });
}
