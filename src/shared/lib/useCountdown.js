"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCountdown(storageKey, durationSeconds, { onExpire, autoStart = true } = {}) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [running, setRunning] = useState(autoStart);
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!autoStart) {
      setSecondsLeft(durationSeconds);
      setRunning(false);
      return;
    }
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      const { deadline } = JSON.parse(saved);
      const remaining = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
    } else {
      const deadline = Date.now() + durationSeconds * 1000;
      window.localStorage.setItem(storageKey, JSON.stringify({ deadline }));
      setSecondsLeft(durationSeconds);
    }
    setRunning(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, durationSeconds, autoStart]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const reset = useCallback(() => {
    if (typeof window !== "undefined") window.localStorage.removeItem(storageKey);
    setSecondsLeft(durationSeconds);
  }, [storageKey, durationSeconds]);

  const start = useCallback(() => {
    if (typeof window !== "undefined") {
      const deadline = Date.now() + durationSeconds * 1000;
      window.localStorage.setItem(storageKey, JSON.stringify({ deadline }));
    }
    setSecondsLeft(durationSeconds);
    setRunning(true);
  }, [storageKey, durationSeconds]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return { secondsLeft, formatted, reset, running, start };
}
