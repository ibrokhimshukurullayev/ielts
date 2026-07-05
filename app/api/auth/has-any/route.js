import { prisma } from "@/src/shared/lib/prisma";

export async function GET() {
  const count = await prisma.user.count();
  return Response.json({ hasAny: count > 0 });
}
