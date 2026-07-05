import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

// POST — teacher creates a new post
export async function POST(request) {
  const user = await getSessionUser();
  if (!user || user.role !== "TEACHER") {
    return Response.json({ error: "Only teachers can create posts." }, { status: 403 });
  }

  const { text } = await request.json();
  if (!text?.trim()) return Response.json({ error: "Text is required." }, { status: 400 });

  const post = await prisma.post.create({
    data: { teacherId: user.id, text: text.trim() },
    include: {
      teacher: { select: { id: true, name: true, role: true } },
      comments: true,
    },
  });

  return Response.json({ post });
}
