import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return Response.json({ error: "Not authenticated." }, { status: 401 });
    }

    const memberships = await prisma.groupMember.findMany({
      where: { studentId: user.id },
      include: { group: { include: { teacher: { select: { name: true } }, members: { select: { id: true } } } } },
      orderBy: { createdAt: "asc" },
    });

    return Response.json({
      groups: memberships.map((m) => ({
        id: m.group.id,
        name: m.group.name,
        teacherName: m.group.teacher.name,
        memberCount: m.group.members.length,
      })),
    });
  } catch (err) {
    console.error("[/api/student/groups GET]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
