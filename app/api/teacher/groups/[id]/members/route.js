import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function POST(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const { id } = await params;
    const { studentId } = await request.json();
    if (!studentId) {
      return Response.json({ error: "studentId is required." }, { status: 400 });
    }

    const group = await prisma.group.findUnique({ where: { id } });
    if (!group || group.teacherId !== user.id) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.teacherId !== user.id) {
      return Response.json({ error: "That student is not in your roster." }, { status: 422 });
    }

    const existing = await prisma.groupMember.findUnique({
      where: { groupId_studentId: { groupId: id, studentId } },
    });
    if (existing) {
      return Response.json({ error: "Already a member of this group." }, { status: 409 });
    }

    await prisma.groupMember.create({ data: { groupId: id, studentId } });

    return Response.json({ member: { id: student.id, name: student.name, username: student.username } });
  } catch (err) {
    console.error("[/api/teacher/groups/[id]/members POST]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
