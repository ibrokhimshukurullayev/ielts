import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/src/shared/lib/prisma";
import { verifySessionToken, SESSION_COOKIE } from "@/src/shared/lib/session";
import { TeacherConversationPage } from "@/src/views";

export default async function Page({ params }) {
  const { conversationId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  const userId = await verifySessionToken(token);
  if (!userId) redirect("/login");

  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { student: { select: { name: true } } },
  });

  if (!conv || conv.teacherId !== userId) redirect("/teacher/chat");

  return (
    <TeacherConversationPage
      conversationId={conversationId}
      partnerName={conv.student.name}
    />
  );
}
