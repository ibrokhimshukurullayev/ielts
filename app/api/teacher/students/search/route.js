import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function GET(request) {
  const user = await getSessionUser();
  if (!user || user.role !== "TEACHER") {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!q) return Response.json({ students: [] });

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      teacherId: null,
      OR: [{ name: { contains: q } }, { username: { contains: q } }, { email: { contains: q } }],
    },
    take: 8,
    orderBy: { name: "asc" },
    select: { id: true, name: true, username: true, email: true },
  });

  return Response.json({ students });
}
