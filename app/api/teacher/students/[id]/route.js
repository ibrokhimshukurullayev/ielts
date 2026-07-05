import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

async function requireOwnedStudent(request, id) {
  const user = await getSessionUser();
  if (!user || user.role !== "TEACHER") return { error: Response.json({ error: "Not authorized." }, { status: 401 }) };

  const student = await prisma.user.findUnique({ where: { id } });
  if (!student || student.teacherId !== user.id) {
    return { error: Response.json({ error: "Student not found." }, { status: 404 }) };
  }
  return { user, student };
}

export async function GET(request, { params }) {
  const { id } = await params;
  const { error, student } = await requireOwnedStudent(request, id);
  if (error) return error;

  const attempts = await prisma.attempt.findMany({
    where: { userId: id },
    orderBy: { createdAt: "asc" },
    select: { skill: true, band: true, createdAt: true, correctCount: true, total: true },
  });

  return Response.json({
    student: {
      id: student.id,
      name: student.name,
      username: student.username,
      email: student.email,
      targetBand: student.targetBand,
      examDate: student.examDate,
      weeklyHours: student.weeklyHours,
      focusSkill: student.focusSkill,
    },
    attempts,
  });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const { error } = await requireOwnedStudent(request, id);
  if (error) return error;

  await prisma.user.update({ where: { id }, data: { teacherId: null } });
  return Response.json({ ok: true });
}
