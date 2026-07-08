import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function POST(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const { id } = await params;
    const { feedback, band, inlineComments } = await request.json();

    const trimmedFeedback = feedback?.trim() || null;
    const newComments = Array.isArray(inlineComments)
      ? inlineComments.filter((c) => c?.quote?.trim() && c?.comment?.trim())
      : [];
    const bandProvided = band !== undefined && band !== null && band !== "";

    if (!trimmedFeedback && newComments.length === 0 && !bandProvided) {
      return Response.json({ error: "Add feedback, a band, or at least one comment." }, { status: 400 });
    }

    const existing = await prisma.writingReview.findUnique({ where: { id } });
    if (!existing || existing.teacherId !== user.id) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    const mergedComments = [
      ...(existing.inlineComments ?? []),
      ...newComments.map((c) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        quote: c.quote.trim(),
        comment: c.comment.trim(),
        start: typeof c.start === "number" ? c.start : undefined,
        end: typeof c.end === "number" ? c.end : undefined,
        createdAt: new Date().toISOString(),
      })),
    ];

    const teacherBand = band ? Number(band) : existing.teacherBand ?? null;

    const updated = await prisma.writingReview.update({
      where: { id },
      data: {
        teacherFeedback: trimmedFeedback ?? existing.teacherFeedback,
        teacherBand,
        inlineComments: mergedComments,
        status: "REVIEWED",
      },
      include: {
        student: { select: { id: true, name: true, username: true } },
      },
    });

    const bandChanged = teacherBand != null && teacherBand !== existing.teacherBand;
    const firstReview = existing.status !== "REVIEWED";
    if (teacherBand != null && (firstReview || bandChanged)) {
      const test = existing.testId
        ? await prisma.test.findUnique({ where: { slug: existing.testId }, select: { id: true } })
        : null;

      await prisma.attempt.create({
        data: {
          userId: existing.studentId,
          testId: test?.id ?? null,
          skill: "WRITING",
          band: teacherBand,
        },
      });
    }

    return Response.json({ review: updated });
  } catch (err) {
    console.error("[/api/teacher/writing/[id]/feedback POST]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
