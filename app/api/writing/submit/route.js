import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "STUDENT") {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }
    if (!user.teacherId) {
      return Response.json({ error: "No teacher assigned." }, { status: 422 });
    }

    const { testId, taskTitle, prompt, essay, wordCount, taskNumber, aiBand } =
      await request.json();

    if (!essay?.trim()) {
      return Response.json({ error: "Essay is required." }, { status: 400 });
    }

    const review = await prisma.writingReview.create({
      data: {
        studentId: user.id,
        teacherId: user.teacherId,
        testId: testId ?? null,
        taskTitle: taskTitle ?? "Writing Task",
        prompt: prompt ?? "",
        essay: essay.trim(),
        wordCount: wordCount ?? 0,
        taskNumber: taskNumber ?? 1,
        aiBand: aiBand ?? null,
        status: "PENDING",
      },
    });

    return Response.json({ review });
  } catch (err) {
    console.error("[/api/writing/submit POST]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
