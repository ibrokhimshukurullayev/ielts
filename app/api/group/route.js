import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

function resolveTeacherId(user) {
  if (user.role === "TEACHER") return user.id;
  return user.teacherId ?? null;
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return Response.json({ error: "Not authenticated." }, { status: 401 });

    const teacherId = resolveTeacherId(user);
    if (!teacherId) return Response.json({ posts: [], members: [] });

    const posts = await prisma.post.findMany({
      where: { teacherId },
      orderBy: { createdAt: "desc" },
      include: {
        teacher: { select: { id: true, name: true, role: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: { select: { id: true, name: true, role: true } },
          },
        },
      },
    });

    const members = await prisma.user.findMany({
      where: { teacherId, role: "STUDENT" },
      select: { id: true, name: true, username: true },
      orderBy: { name: "asc" },
    });

    return Response.json({ posts, members });
  } catch (err) {
    console.error("[/api/group GET]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
