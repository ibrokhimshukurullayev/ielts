"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllResults } from "@/src/features";
import { averageBand } from "@/src/entities";
import { Button, Card, ProgressBar, ScoreCircle } from "@/src/shared";

const SECTION_META = {
  reading: { label: "Reading", color: "bg-accent" },
  listening: { label: "Listening", color: "bg-success" },
  writing: { label: "Writing", color: "bg-violet-500" },
  speaking: { label: "Speaking", color: "bg-amber-500" },
};

export function ResultsPage() {
  const router = useRouter();
  const [lastAttempt, setLastAttempt] = useState(null);
  const [allResults, setAllResults] = useState({});
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("ielts_last_attempt");
    if (raw) setLastAttempt(JSON.parse(raw));
    setAllResults(getAllResults());
  }, []);

  const overallBand = averageBand(Object.values(allResults).map((r) => r.band));

  const handleShare = async () => {
    const text = lastAttempt
      ? `I scored Band ${lastAttempt.band} on the IELTStation ${SECTION_META[lastAttempt.section]?.label ?? ""} test!`
      : `My overall IELTStation band score is ${overallBand}.`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // user cancelled share — no action needed
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Score copied to clipboard!");
    }
  };

  if (!lastAttempt && Object.keys(allResults).length === 0) {
    return (
      <main className="fade-page mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy">No results yet</h1>
        <p className="mt-2 text-slate-500">Complete a practice test to see your score here.</p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Go to Home</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="fade-page mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-center text-2xl font-bold text-navy">Your Results</h1>

      <div className="mt-8 flex flex-col items-center">
        <ScoreCircle band={lastAttempt?.band ?? overallBand} />
        <p className="mt-3 text-sm font-medium text-slate-500">
          {lastAttempt ? `${SECTION_META[lastAttempt.section]?.label} band score` : "Overall band score"}
        </p>
        {lastAttempt && (
          <p className="mt-1 text-sm text-slate-400">
            {lastAttempt.correctCount} / {lastAttempt.total} correct
          </p>
        )}
      </div>

      <Card className="mt-10">
        <h2 className="text-lg font-bold text-navy">Section breakdown</h2>
        <div className="mt-5 space-y-5">
          {Object.entries(SECTION_META).map(([key, meta]) => (
            <ProgressBar
              key={key}
              label={`${meta.label} — Band ${allResults[key]?.band ?? "—"}`}
              value={allResults[key]?.band ?? 0}
              max={9}
              color={meta.color}
            />
          ))}
        </div>
      </Card>

      {lastAttempt?.results && (
        <Card className="mt-6">
          <button
            type="button"
            onClick={() => setShowReview((v) => !v)}
            className="flex w-full items-center justify-between text-left text-lg font-bold text-navy"
          >
            Review Answers
            <span className="text-sm text-accent">{showReview ? "Hide" : "Show"}</span>
          </button>
          {showReview && (
            <ol className="mt-4 space-y-2">
              {Object.entries(lastAttempt.results).map(([id, r]) => (
                <li
                  key={id}
                  className={`flex flex-wrap items-baseline gap-2 rounded-lg px-3 py-2 text-sm ${
                    r.isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                  }`}
                >
                  <span className="font-bold">Q{id}.</span>
                  <span>Your answer: {r.userAnswer || "—"}</span>
                  {!r.isCorrect && <span className="font-semibold">Correct: {r.correctAnswer}</span>}
                </li>
              ))}
            </ol>
          )}
        </Card>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button variant="outline" onClick={() => router.push("/")}>
          Try Again
        </Button>
        <Button variant="success" onClick={handleShare}>
          Share Score
        </Button>
      </div>
    </main>
  );
}
