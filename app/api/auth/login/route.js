import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/src/shared/lib/prisma";
import { sanitizeUser } from "@/src/shared/lib/getSessionUser";
import { setSessionCookies } from "@/src/shared/lib/session";

export async function POST(request) {
  const body = await request.json();
  const username = (body.username ?? "").toLowerCase().replace(/\s/g, "").trim();
  const { password } = body;

  const user = username
    ? await prisma.user.findUnique({ where: { username } })
    : null;
  const valid = user ? await bcrypt.compare(password ?? "", user.passwordHash) : false;

  if (!user || !valid) {
    return Response.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const cookieStore = await cookies();
  await setSessionCookies(cookieStore, user.id);

  return Response.json({ user: sanitizeUser(user) });
}
