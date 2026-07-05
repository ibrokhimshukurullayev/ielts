import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser } from "@/src/shared/lib/getSessionUser";

async function getAuthorizedConversation(conversationId, userId) {
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
  if (!conv) return null;
  if (conv.teacherId !== userId && conv.studentId !== userId) return null;
  return conv;
}

// GET — fetch messages in a conversation
export async function GET(request, { params }) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const conv = await getAuthorizedConversation(id, user.id);
  if (!conv) return Response.json({ error: "Conversation not found." }, { status: 404 });

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
  });

  // Mark incoming messages as read
  await prisma.message.updateMany({
    where: { conversationId: id, senderId: { not: user.id }, isRead: false },
    data: { isRead: true },
  });

  return Response.json({ messages });
}

// POST — send a message
export async function POST(request, { params }) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const conv = await getAuthorizedConversation(id, user.id);
  if (!conv) return Response.json({ error: "Conversation not found." }, { status: 404 });

  const { text } = await request.json();
  if (!text?.trim()) return Response.json({ error: "Message text is required." }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      senderId: user.id,
      text: text.trim(),
    },
  });

  return Response.json({ message });
}
