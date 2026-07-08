"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDynamicExam, getExamStepUrl } from "@/src/features";

export function TestsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tests/random", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      const { reading, listening, writing } = data;
      const examId = createDynamicExam(reading, listening, writing);
      const firstUrl = getExamStepUrl(examId, 0);
      router.push(firstUrl);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="fade-page flex min-h-[70vh] flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 12h6M9 16h6" />
        </svg>
      </div>
      <h1 className="mt-4 text-2xl font-bold text-navy">Full Mock Exam</h1>
      <p className="mt-1.5 max-w-md text-sm text-slate-500">
        A randomly assembled Reading + Listening + Writing exam, timed like the real test.
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

      <button
        type="button"
        onClick={handleStart}
        disabled={loading}
        className="mt-6 flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {loading ? "Selecting tests…" : "Start Exam"}
      </button>
    </main>
  );
}
