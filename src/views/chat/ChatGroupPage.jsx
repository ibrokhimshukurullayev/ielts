"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { chatApi } from "@/src/features/chat";
import { GroupBoardView } from "./GroupBoardView";

export function ChatGroupPage() {
  const { groupId } = useParams();
  const [hasMultiple, setHasMultiple] = useState(false);

  useEffect(() => {
    chatApi.getMyGroups().then(({ groups }) => setHasMultiple(groups.length > 1));
  }, []);

  return <GroupBoardView groupId={groupId} canPost={false} backHref={hasMultiple ? "/chat" : null} backLabel="All groups" />;
}
