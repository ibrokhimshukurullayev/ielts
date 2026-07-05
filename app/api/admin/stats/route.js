import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

const SKILLS = ["READING", "LISTENING", "WRITING", "SPEAKING"];

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function GET(request) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const [totalUsers, totalAttempts, totalTests] = await Promise.all([
    prisma.user.count(),
    prisma.attempt.count(),
    prisma.test.count(),
  ]);

  const avgBandBySkill = {};
  for (const skill of SKILLS) {
    const result = await prisma.attempt.aggregate({
      where: { skill },
      _avg: { band: true },
      _count: true,
    });
    avgBandBySkill[skill.toLowerCase()] = {
      avgBand: result._avg.band ? Math.round(result._avg.band * 10) / 10 : null,
      count: result._count,
    };
  }

  return adminJson({ totalUsers, totalAttempts, totalTests, avgBandBySkill }, undefined, request);
}
