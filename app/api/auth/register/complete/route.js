import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/src/shared/lib/prisma";
import { sanitizeUser } from "@/src/shared/lib/getSessionUser";
import { setSessionCookies } from "@/src/shared/lib/session";

export async function POST(request) {
  const body = await request.json();
  const { email, code, name, password, targetBand, examDate, currentBand, weeklyHours, focusSkill } = body;

  if (!name || !email || !password || !code) {
    return Response.json({ error: "Missing required fields." }, { status: 400 });
  }

  const record = await prisma.verificationCode.findUnique({ where: { email } });
  if (!record || record.code !== code || record.expiresAt < new Date()) {
    return Response.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      targetBand: targetBand ? Number(targetBand) : null,
      examDate: examDate ? new Date(examDate) : null,
      currentBand: currentBand ? Number(currentBand) : null,
      weeklyHours: weeklyHours ? Number(weeklyHours) : null,
      focusSkill: focusSkill || null,
    },
  });

  await prisma.verificationCode.delete({ where: { email } });

  const cookieStore = await cookies();
  await setSessionCookies(cookieStore, user.id);

  return Response.json({ user: sanitizeUser(user) });
}
