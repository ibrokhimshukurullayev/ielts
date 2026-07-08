"use client";

import { useParams } from "next/navigation";
import { GroupBoardView } from "@/src/views/chat/GroupBoardView";

export function TeacherGroupChatPage() {
  const { groupId } = useParams();
  return <GroupBoardView groupId={groupId} canPost backHref="/teacher/chat" backLabel="All groups" />;
}
