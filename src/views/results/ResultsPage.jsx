"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SECTION_META = {
  reading:   { label: "Reading",   emoji: "📖" },
  listening: { label: "Listening", emoji: "🎧" },
  writing:   { label: "Writing",   emoji: "✍️" },
  speaking:  { label: "Speaking",  emoji: "🎤" },
};

function bandDescription(band) {
  if (band >= 8.5) return "Expert user";
  if (band >= 7.5) return "Very good user";
  if (band >= 6.5) return "Good user";
  if (band >= 5.5) return "Competent user";
  if (band >= 4.5) return "Modest user";
  if (band >= 3.5) return "Limited user";
  if (band >= 1)   return "Extremely limited";
  return "Did not attempt";
}

function bandTheme(band) {
  if (band >= 7)   return { color: "#10b981", light: "#ecfdf5", text: "text-emerald-600", bar: "bg-emerald-500", badge: "bg-emerald-500" };
  if (band >= 5.5) return { color: "#6366f1", light: "#eef2ff", text: "text-indigo-600",  bar: "bg-indigo-500",  badge: "bg-indigo-500" };
  if (band >= 3.5) return { color: "#f59e0b", light: "#fffbeb", text: "text-amber-600",   bar: "bg-amber-500",   badge: "bg-amber-500" };
  return             { color: "#ef4444", light: "#fff1f2", text: "text-rose-600",    bar: "bg-rose-500",    badge: "bg-rose-500" };
}

function Arc({ band, color }) {
  const r = 78;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(band / 9, 1);
  const dash = pct * circumference;

  return (
    <svg width="200" height="200">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="13" strokeLinecap="round" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="13" strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        strokeDashoffset={circumference * 0.25}
        style={{ transition: "stroke-dasharray 1s cubic-bezier(.22,.68,0,1.1)" }}
      />
      <text x={cx} y={cy - 10} textAnchor="middle"
        fill="#0f2044" style={{ fontSize: 42, fontWeight: 900, fontFamily: "inherit" }}>
        {band}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle"
        fill="#94a3b8" style={{ fontSize: 13, fontFamily: "inherit" }}>
        Band Score
      </text>
    </svg>
  );
}

export function ResultsPage() {
  const router = useRouter();
  const [attempt, setAttempt] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("ielts_last_attempt");
    if (raw) setAttempt(JSON.parse(raw));
  }, []);

  if (!attempt) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-bold text-navy">No results yet</p>
          <p className="mt-1 text-sm text-slate-500">Complete a test to see your score.</p>
          <Link href="/" className="mt-5 inline-block rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white">Go Home</Link>
        </div>
      </main>
    );
  }

  const { band, correctCount, total, section, results } = attempt;
  const meta = SECTION_META[section] ?? { label: section, emoji: "📝" };
  const theme = bandTheme(band);
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const wrong = total - correctCount;

  return (
    <main className="fade-page min-h-screen bg-slate-50 pb-16">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="px-4 pt-10 pb-24 text-center" style={{ background: `linear-gradient(160deg, ${theme.light} 0%, #f8fafc 100%)` }}>
        <div className="slide-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-500 shadow-sm">
            {meta.emoji} {meta.label} · Result
          </span>
        </div>

        <div className="slide-up-1 mt-5 flex justify-center">
          <Arc band={band} color={theme.color} />
        </div>

        <p className={`slide-up-2 mt-1 text-sm font-bold ${theme.text}`}>{bandDescription(band)}</p>
      </div>

      {/* ── Floating card ───────────────────────────────── */}
      <div className="mx-auto max-w-md px-4 -mt-14 space-y-4">

        {/* Stats row */}
        <div className="slide-up-2 overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(15,32,68,0.11)]">
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {[
              { label: "Correct",  value: correctCount ?? "—", sub: `of ${total}` },
              { label: "Wrong",    value: wrong ?? "—",        sub: "answers" },
              { label: "Accuracy", value: `${accuracy}%`,     sub: "rate" },
            ].map((s) => (
              <div key={s.label} className="py-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                <p className={`mt-1.5 text-2xl font-black ${theme.text}`}>{s.value}</p>
                <p className="text-[11px] text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Accuracy bar */}
          <div className="border-t border-slate-100 px-5 py-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Progress</span>
              <span className={`text-[11px] font-bold ${theme.text}`}>{accuracy}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${theme.bar} transition-all duration-700`}
                style={{ width: `${accuracy}%` }} />
            </div>
          </div>
        </div>

        {/* ── Answer Sheet ─────────────────────────────── */}
        {results && Object.keys(results).length > 0 && (
          <div className="slide-up-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-base font-bold text-navy">Answer Sheet</p>
              <label className="flex cursor-pointer select-none items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Show Correct Answers</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showAnswers}
                  onClick={() => setShowAnswers((v) => !v)}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${showAnswers ? "bg-emerald-500" : "bg-slate-200"}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${showAnswers ? "translate-x-4.5" : "translate-x-0.5"}`}
                  />
                </button>
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Object.entries(results)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([id, r], i) => (
                  <div
                    key={id}
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 ${i % 2 === 0 ? "bg-slate-50" : "bg-white"}`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-400 text-xs font-bold text-white">
                      {id}
                    </span>
                    <span className="flex-1 truncate text-sm text-slate-600">
                      {(showAnswers ? r.correctAnswer : r.userAnswer) || "N/A"}
                    </span>
                    {r.isCorrect ? (
                      <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Actions ──────────────────────────────────── */}
        <div className="slide-up-4 flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 rounded-xl py-3.5 text-center text-sm font-bold text-white shadow-sm transition active:scale-[0.98]"
            style={{ background: theme.color }}
          >
            Home
          </Link>
        </div>
      </div>

    </main>
  );
}
