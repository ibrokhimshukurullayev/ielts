import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function POST(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const { id } = await params;
    const { feedback, band } = await request.json();

    if (!feedback?.trim()) {
      return Response.json({ error: "Feedback text is required." }, { status: 400 });
    }

    const existing = await prisma.writingReview.findUnique({ where: { id } });
    if (!existing || existing.teacherId !== user.id) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    const updated = await prisma.writingReview.update({
      where: { id },
      data: {
        teacherFeedback: feedback.trim(),
        teacherBand: band ? Number(band) : null,
        status: "REVIEWED",
      },
      include: {
        student: { select: { id: true, name: true, username: true } },
      },
    });

    return Response.json({ review: updated });
  } catch (err) {
    console.error("[/api/teacher/writing/[id]/feedback POST]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
