"use client";
import { useEffect, useState } from "react";
import { getExamStartTime } from "@/src/features/exam-flow";

function fmtElapsed(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function useElapsedTimer(examId) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    if (!examId) return;
    const startAt = getExamStartTime(examId);
    if (!startAt) return;

    const tick = () => setElapsed(fmtElapsed(Date.now() - startAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [examId]);

  return elapsed;
}
