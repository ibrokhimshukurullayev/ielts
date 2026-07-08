import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const groups = await prisma.group.findMany({
      where: { teacherId: user.id },
      orderBy: { createdAt: "desc" },
      include: { members: { select: { id: true } } },
    });

    return Response.json({
      groups: groups.map((g) => ({ id: g.id, name: g.name, memberCount: g.members.length, createdAt: g.createdAt })),
    });
  } catch (err) {
    console.error("[/api/teacher/groups GET]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const { name } = await request.json();
    if (!name?.trim()) {
      return Response.json({ error: "Group name is required." }, { status: 400 });
    }

    const group = await prisma.group.create({
      data: { teacherId: user.id, name: name.trim() },
    });

    return Response.json({ group: { id: group.id, name: group.name, memberCount: 0, createdAt: group.createdAt } });
  } catch (err) {
    console.error("[/api/teacher/groups POST]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
