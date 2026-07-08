import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function GET(_request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return Response.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { id } = await params;
    const group = await prisma.group.findUnique({
      where: { id },
      include: { members: { include: { student: { select: { id: true, name: true, username: true } } } } },
    });

    if (!group) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    const isOwner = group.teacherId === user.id;
    const isMember = group.members.some((m) => m.studentId === user.id);
    if (!isOwner && !isMember) {
      return Response.json({ error: "Not authorized." }, { status: 403 });
    }

    return Response.json({
      group: {
        id: group.id,
        name: group.name,
        isOwner,
        members: group.members.map((m) => ({ id: m.student.id, name: m.student.name, username: m.student.username })),
      },
    });
  } catch (err) {
    console.error("[/api/groups/[id] GET]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
