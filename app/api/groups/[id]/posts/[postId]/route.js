import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function PATCH(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Only teachers can edit posts." }, { status: 403 });
    }

    const { id, postId } = await params;
    const { text } = await request.json();
    if (!text?.trim()) {
      return Response.json({ error: "Text is required." }, { status: 400 });
    }

    const existing = await prisma.post.findUnique({ where: { id: postId } });
    if (!existing || existing.groupId !== id || existing.teacherId !== user.id) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: { text: text.trim() },
      include: {
        teacher: { select: { id: true, name: true, role: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
      },
    });

    return Response.json({ post });
  } catch (err) {
    console.error("[/api/groups/[id]/posts/[postId] PATCH]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
