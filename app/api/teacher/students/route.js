import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "TEACHER") {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }

  const students = await prisma.user.findMany({
    where: { teacherId: user.id },
    include: {
      attempts: { orderBy: { createdAt: "desc" } },
      groupMemberships: { include: { group: { select: { id: true, name: true } } } },
    },
  });

  const todayStart = startOfToday();

  const result = students.map((student) => {
    const bySkill = {};
    for (const attempt of student.attempts) {
      const key = attempt.skill.toLowerCase();
      if (!bySkill[key]) bySkill[key] = [];
      bySkill[key].push(attempt);
    }

    const skills = Object.entries(bySkill).map(([skill, attempts]) => {
      const latest = attempts[0].band;
      const previous = attempts[1]?.band ?? null;
      const trend = previous == null ? "new" : latest > previous ? "up" : latest < previous ? "down" : "same";
      const doneToday = attempts.some((a) => a.createdAt >= todayStart);
      return { skill, latestBand: latest, previousBand: previous, trend, doneToday };
    });

    const practicedToday = student.attempts.filter((a) => a.createdAt >= todayStart);
    const overallBand = skills.length
      ? Math.round((skills.reduce((sum, s) => sum + s.latestBand, 0) / skills.length) * 2) / 2
      : null;

    return {
      id: student.id,
      name: student.name,
      username: student.username,
      email: student.email,
      targetBand: student.targetBand,
      attemptCount: student.attempts.length,
      overallBand,
      skills,
      lastAttemptAt: student.attempts[0]?.createdAt ?? null,
      activeToday: practicedToday.length > 0,
      attemptsToday: practicedToday.length,
      groups: student.groupMemberships.map((m) => ({ id: m.group.id, name: m.group.name })),
    };
  });

  result.sort((a, b) => (b.overallBand ?? -1) - (a.overallBand ?? -1));

  return Response.json({ students: result });
}

export async function POST(request) {
  const user = await getSessionUser();
  if (!user || user.role !== "TEACHER") {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }

  const { studentId } = await request.json();
  if (!studentId) {
    return Response.json({ error: "studentId is required." }, { status: 400 });
  }

  const student = await prisma.user.findUnique({ where: { id: studentId } });
  if (!student || student.role !== "STUDENT") {
    return Response.json({ error: "Student not found." }, { status: 404 });
  }
  if (student.teacherId) {
    return Response.json({ error: "This student already has a teacher." }, { status: 409 });
  }

  const updated = await prisma.user.update({
    where: { id: student.id },
    data: { teacherId: user.id },
  });

  return Response.json({ student: { id: updated.id, name: updated.name, email: updated.email } });
}
