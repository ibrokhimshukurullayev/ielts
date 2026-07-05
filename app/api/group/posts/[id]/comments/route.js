import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

// POST — add a comment to a post
export async function POST(request, { params }) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const { id: postId } = await params;
  const { text } = await request.json();
  if (!text?.trim()) return Response.json({ error: "Text is required." }, { status: 400 });

  // Verify the post belongs to the user's teacher group
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return Response.json({ error: "Post not found." }, { status: 404 });

  const teacherId = user.role === "TEACHER" ? user.id : user.teacherId;
  if (post.teacherId !== teacherId) {
    return Response.json({ error: "Not authorized." }, { status: 403 });
  }

  const comment = await prisma.comment.create({
    data: { postId, senderId: user.id, text: text.trim() },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });

  return Response.json({ comment });
}
