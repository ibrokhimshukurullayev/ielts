import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function GET(request) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      targetBand: true,
      examDate: true,
      createdAt: true,
      teacherId: true,
      teacher: { select: { name: true } },
      attempts: { orderBy: { createdAt: "desc" }, select: { skill: true, band: true } },
      _count: { select: { attempts: true } },
    },
  });

  const result = users.map((user) => {
    const latestBySkill = {};
    for (const attempt of user.attempts) {
      const key = attempt.skill.toLowerCase();
      if (!latestBySkill[key]) latestBySkill[key] = attempt.band;
    }
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      targetBand: user.targetBand,
      examDate: user.examDate,
      createdAt: user.createdAt,
      attemptCount: user._count.attempts,
      latestBands: latestBySkill,
      teacherId: user.teacherId,
      teacherName: user.teacher?.name ?? null,
    };
  });

  return adminJson({ users: result }, undefined, request);
}
