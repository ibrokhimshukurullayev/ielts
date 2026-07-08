import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function DELETE(_request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const { id, studentId } = await params;
    const group = await prisma.group.findUnique({ where: { id } });
    if (!group || group.teacherId !== user.id) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    await prisma.groupMember.deleteMany({ where: { groupId: id, studentId } });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[/api/teacher/groups/[id]/members/[studentId] DELETE]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
