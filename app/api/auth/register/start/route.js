import { prisma } from "@/src/shared/lib/prisma";
import { sendVerificationCodeEmail } from "@/src/shared/lib/resend";

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request) {
  const { email } = await request.json();
  if (!email) {
    return Response.json({ error: "Email is required." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.verificationCode.upsert({
    where: { email },
    update: { code, expiresAt },
    create: { email, code, expiresAt },
  });

  try {
    await sendVerificationCodeEmail(email, code);
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
    return Response.json({ error: "Couldn't send the verification email. Please try again." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
