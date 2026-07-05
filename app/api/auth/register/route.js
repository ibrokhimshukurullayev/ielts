import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/src/shared/lib/prisma";
import { sanitizeUser } from "@/src/shared/lib/getSessionUser";
import { createSessionToken, SESSION_COOKIE } from "@/src/shared/lib/session";

export async function POST(request) {
  const body = await request.json();
  const { name, password, targetBand, examDate, currentBand, weeklyHours, focusSkill } = body;
  const username = (body.username ?? "").toLowerCase().replace(/\s/g, "").trim();

  if (!username || !password) {
    return Response.json({ error: "Username and password are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return Response.json({ error: "This username is already taken. Please choose another." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      name: name?.trim() || username,
      passwordHash,
      targetBand: targetBand ? Number(targetBand) : null,
      examDate: examDate ? new Date(examDate) : null,
      currentBand: currentBand ? Number(currentBand) : null,
      weeklyHours: weeklyHours ? Number(weeklyHours) : null,
      focusSkill: focusSkill || null,
    },
  });

  const token = await createSessionToken(user.id);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return Response.json({ user: sanitizeUser(user) });
}
