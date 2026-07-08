import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

export async function POST(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return Response.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { id, postId } = await params;
    const { text } = await request.json();
    if (!text?.trim()) {
      return Response.json({ error: "Text is required." }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { group: { include: { members: { select: { studentId: true } } } } },
    });
    if (!post || post.groupId !== id) {
      return Response.json({ error: "Post not found." }, { status: 404 });
    }

    const isOwner = post.group.teacherId === user.id;
    const isMember = post.group.members.some((m) => m.studentId === user.id);
    if (!isOwner && !isMember) {
      return Response.json({ error: "Not authorized." }, { status: 403 });
    }

    const comment = await prisma.comment.create({
      data: { postId, senderId: user.id, text: text.trim() },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });

    return Response.json({ comment });
  } catch (err) {
    console.error("[/api/groups/[id]/posts/[postId]/comments POST]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
