import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return Response.json({ error: "Not authenticated." }, { status: 401 });

    const reviews = await prisma.writingReview.findMany({
      where: { studentId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        taskTitle: true,
        prompt: true,
        essay: true,
        wordCount: true,
        taskNumber: true,
        aiBand: true,
        teacherFeedback: true,
        teacherBand: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        teacher: { select: { id: true, name: true } },
      },
    });

    return Response.json({ reviews });
  } catch (err) {
    console.error("[/api/writing/my-reviews GET]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
