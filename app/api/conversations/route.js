import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

// GET — list conversations for current user (role-aware)
export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Not authenticated." }, { status: 401 });

  if (user.role === "TEACHER") {
    const conversations = await prisma.conversation.findMany({
      where: { teacherId: user.id },
      include: {
        student: { select: { id: true, name: true, username: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      conversations: conversations.map((c) => ({
        id: c.id,
        partner: c.student,
        lastMessage: c.messages[0] ?? null,
        unreadCount: 0,
        createdAt: c.createdAt,
      })),
    });
  }

  if (user.role === "STUDENT") {
    if (!user.teacherId) {
      return Response.json({ conversations: [] });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { teacherId_studentId: { teacherId: user.teacherId, studentId: user.id } },
      include: {
        teacher: { select: { id: true, name: true, username: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!conversation) return Response.json({ conversations: [] });

    return Response.json({
      conversations: [
        {
          id: conversation.id,
          partner: conversation.teacher,
          lastMessage: conversation.messages[0] ?? null,
          unreadCount: 0,
          createdAt: conversation.createdAt,
        },
      ],
    });
  }

  return Response.json({ error: "Not authorized." }, { status: 403 });
}

// POST — find or create a conversation (teacher creates with studentId)
export async function POST(request) {
  const user = await getSessionUser();
  if (!user || user.role !== "TEACHER") {
    return Response.json({ error: "Only teachers can start conversations." }, { status: 403 });
  }

  const { studentId } = await request.json();
  if (!studentId) return Response.json({ error: "studentId is required." }, { status: 400 });

  const student = await prisma.user.findUnique({ where: { id: studentId } });
  if (!student || student.role !== "STUDENT") {
    return Response.json({ error: "Student not found." }, { status: 404 });
  }
  if (student.teacherId !== user.id) {
    return Response.json({ error: "This student is not assigned to you." }, { status: 403 });
  }

  const conversation = await prisma.conversation.upsert({
    where: { teacherId_studentId: { teacherId: user.id, studentId } },
    create: { teacherId: user.id, studentId },
    update: {},
    include: {
      student: { select: { id: true, name: true, username: true } },
    },
  });

  return Response.json({ conversation });
}
