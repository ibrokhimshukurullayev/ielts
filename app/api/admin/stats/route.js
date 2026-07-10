import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

const SKILLS = ["READING", "LISTENING", "WRITING", "SPEAKING"];

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function GET(request) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const [studentCount, teacherCount, totalTests, totalAttempts, unassignedCount, ...skillResults] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.test.count(),
      prisma.attempt.count(),
      prisma.user.count({ where: { role: "STUDENT", teacherId: null } }),
      // All 4 skills in parallel (8 DB calls at once)
      ...SKILLS.flatMap((skill) => [
        prisma.attempt.aggregate({ where: { skill }, _avg: { band: true }, _count: true }),
        prisma.test.count({ where: { skill } }),
      ]),
    ]);

  const avgBandBySkill = {};
  const testsBySkill = {};

  SKILLS.forEach((skill, i) => {
    const agg = skillResults[i * 2];
    const testCount = skillResults[i * 2 + 1];
    const key = skill.toLowerCase();
    avgBandBySkill[key] = {
      avgBand: agg._avg.band ? Math.round(agg._avg.band * 10) / 10 : null,
      count: agg._count,
    };
    testsBySkill[key] = testCount;
  });

  return adminJson(
    { studentCount, teacherCount, totalTests, totalAttempts, unassignedCount, avgBandBySkill, testsBySkill },
    undefined,
    request
  );
}
