import { prisma } from "@/src/shared/lib/prisma";

export async function POST(request) {
  const { email, code } = await request.json();

  const record = await prisma.verificationCode.findUnique({ where: { email } });
  if (!record || record.code !== code || record.expiresAt < new Date()) {
    return Response.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  return Response.json({ ok: true });
}
