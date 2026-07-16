import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";
import { CRITERIA_KEYS, computeOverallBand } from "@/src/shared/lib/bandScore";

export async function POST(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { feedback, inlineComments } = body;

    const trimmedFeedback = feedback?.trim() || null;
    const newComments = Array.isArray(inlineComments)
      ? inlineComments.filter((c) => c?.quote?.trim() && c?.comment?.trim())
      : [];
    const scoresProvided = CRITERIA_KEYS.some((k) => body[k] !== undefined && body[k] !== null && body[k] !== "");

    if (!trimmedFeedback && newComments.length === 0 && !scoresProvided) {
      return Response.json({ error: "Add feedback, a score, or at least one comment." }, { status: 400 });
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

    const mergedScores = {};
    for (const key of CRITERIA_KEYS) {
      const val = body[key];
      mergedScores[key] = val !== undefined && val !== null && val !== "" ? Number(val) : (existing[key] ?? null);
    }
    const computedBand = computeOverallBand(mergedScores);
    const teacherBand = computedBand ?? existing.teacherBand ?? null;

    const updated = await prisma.writingReview.update({
      where: { id },
      data: {
        teacherFeedback: trimmedFeedback ?? existing.teacherFeedback,
        teacherBand,
        ...mergedScores,
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
