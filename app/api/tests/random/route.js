import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)] ?? null;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const [readings, listenings, writings] = await Promise.all([
    prisma.test.findMany({ where: { skill: "READING" }, select: { slug: true, title: true } }),
    prisma.test.findMany({ where: { skill: "LISTENING" }, select: { slug: true, title: true } }),
    prisma.test.findMany({ where: { skill: "WRITING" }, select: { slug: true, title: true } }),
  ]);

  const reading = pickRandom(readings);
  const listening = pickRandom(listenings);
  const writing = pickRandom(writings);

  if (!reading || !listening || !writing) {
    return Response.json(
      { error: "Not enough tests in the database. Please add at least 1 Reading, 1 Listening, and 1 Writing test." },
      { status: 422 }
    );
  }

  return Response.json({ reading, listening, writing });
}
