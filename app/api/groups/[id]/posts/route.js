import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

async function checkAccess(groupId, user) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { members: { select: { studentId: true } } },
  });
  if (!group) return { group: null, allowed: false, isOwner: false };
  const isOwner = group.teacherId === user.id;
  const isMember = group.members.some((m) => m.studentId === user.id);
  return { group, allowed: isOwner || isMember, isOwner };
}

export async function GET(_request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return Response.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { id } = await params;
    const { allowed } = await checkAccess(id, user);
    if (!allowed) {
      return Response.json({ error: "Not authorized." }, { status: 403 });
    }

    const posts = await prisma.post.findMany({
      where: { groupId: id },
      orderBy: { createdAt: "desc" },
      include: {
        teacher: { select: { id: true, name: true, role: true, avatarUrl: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { id: true, name: true, role: true, avatarUrl: true } } },
        },
      },
    });

    return Response.json({ posts });
  } catch (err) {
    console.error("[/api/groups/[id]/posts GET]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return Response.json({ error: "Only teachers can create posts." }, { status: 403 });
    }

    const { id } = await params;
    const { text } = await request.json();
    if (!text?.trim()) {
      return Response.json({ error: "Text is required." }, { status: 400 });
    }

    const { group, isOwner } = await checkAccess(id, user);
    if (!group || !isOwner) {
      return Response.json({ error: "Not authorized." }, { status: 403 });
    }

    const post = await prisma.post.create({
      data: { groupId: id, teacherId: user.id, text: text.trim() },
      include: {
        teacher: { select: { id: true, name: true, role: true, avatarUrl: true } },
        comments: true,
      },
    });

    return Response.json({ post });
  } catch (err) {
    console.error("[/api/groups/[id]/posts POST]", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
