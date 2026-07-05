"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDynamicExam, getExamStepUrl } from "@/src/features";
import { TestGrid } from "@/src/widgets";

const TABS = [
  { key: "READING", label: "Reading", icon: "book", iconBg: "bg-indigo-50 text-accent", hrefBase: "/reading" },
  { key: "LISTENING", label: "Listening", icon: "headphones", iconBg: "bg-emerald-50 text-success", hrefBase: "/listening" },
];

export function TestsPage() {
  const router = useRouter();
  const [tab, setTab] = useState("READING");
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

  const active = TABS.find((t) => t.key === tab);

  return (
    <main className="fade-page px-4 py-10 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Tests</h1>
          <p className="mt-1 text-sm text-slate-500">Choose a Reading or Listening test to practice.</p>
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60"
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
          Full Mock Exam
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

      {/* Skill tabs */}
      <div className="mt-6 inline-flex rounded-xl bg-slate-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-navy"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <TestGrid
          skill={active.key}
          icon={active.icon}
          iconBg={active.iconBg}
          searchPlaceholder={`Search ${active.label.toLowerCase()} tests...`}
          emptyLabel="No tests match your search."
          hrefBase={active.hrefBase}
        />
      </div>
    </main>
  );
}
