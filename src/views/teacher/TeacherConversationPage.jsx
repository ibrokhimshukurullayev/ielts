"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 1-on-1 chat o'rniga group board ishlatilmoqda.
export function TeacherConversationPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/teacher/chat"); }, [router]);
  return null;
}
