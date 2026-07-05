import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const reviews = await prisma.writingReview.findMany({
      where: { teacherId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { id: true, name: true, username: true } },
      },
    });

    return Response.json({ reviews });
  } catch (err) {
    console.error("[/api/teacher/writing GET]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
