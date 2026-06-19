"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { READING_ANSWERS, READING_PARTS, TFNG_OPTIONS, scoreReadingAnswers, saveResult } from "@/src/features";
import { rawScoreToBand } from "@/src/entities";
import { Button, useCountdown } from "@/src/shared";

const TOTAL_QUESTIONS = Object.keys(READING_ANSWERS).length;

function QuestionGroup({ group, answers, setAnswer }) {
  return (
    <section id={`group-${group.title}`}>
      <h3 className="font-bold text-navy">{group.title}</h3>
      <p className="mt-1 text-sm text-slate-500">{group.instructions}</p>

      <div className="mt-4 space-y-4">
        {group.type === "tfng" &&
          group.items.map((q) => (
            <div key={q.id} id={`q-${q.id}`} className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-700">
                {q.id}. {q.text}
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                {TFNG_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswer(q.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

        {group.type === "matchingParagraph" &&
          group.items.map((q) => (
            <div key={q.id} id={`q-${q.id}`} className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-700">
                {q.id}. {q.text}
              </p>
              <select
                className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswer(q.id, e.target.value)}
              >
                <option value="">—</option>
                <option value="1">Paragraph 1</option>
                <option value="2">Paragraph 2</option>
                <option value="3">Paragraph 3</option>
              </select>
            </div>
          ))}

        {group.type === "multipleChoice" &&
          group.items.map((q) => (
            <div key={q.id} id={`q-${q.id}`} className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-700">
                {q.id}. {q.text}
              </p>
              <div className="mt-2 space-y-1.5">
                {q.options.map((opt) => {
                  const letter = opt[0];
                  return (
                    <label key={opt} className="flex items-center gap-1.5 text-sm">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={letter}
                        checked={answers[q.id] === letter}
                        onChange={() => setAnswer(q.id, letter)}
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

        {group.type === "shortAnswer" &&
          group.items.map((q) => (
            <div key={q.id} id={`q-${q.id}`} className="rounded-xl bg-white p-4 shadow-sm">
              <label className="text-sm font-medium text-slate-700" htmlFor={`input-${q.id}`}>
                {q.id}. {q.text}
              </label>
              <input
                id={`input-${q.id}`}
                type="text"
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswer(q.id, e.target.value)}
              />
            </div>
          ))}
      </div>
    </section>
  );
}

const PART_DURATION_SECONDS = 20 * 60;

export function ReadingExamPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [partIndex, setPartIndex] = useState(0);
  const [leftWidthPct, setLeftWidthPct] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const splitRef = useRef(null);
  const draggingRef = useRef(false);

  const part = READING_PARTS[partIndex];

  const { formatted, reset, running, start } = useCountdown(
    `ielts_reading_timer_part_${part.id}`,
    PART_DURATION_SECONDS,
    {
      onExpire: () => handleSubmit(),
      autoStart: false,
    }
  );
  const partQuestionIds = part.questionGroups.flatMap((g) => g.items.map((i) => i.id));
  const firstId = partQuestionIds[0];
  const lastId = partQuestionIds[partQuestionIds.length - 1];

  const setAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = useCallback(() => {
    const { correctCount, total, results } = scoreReadingAnswers(answers);
    const band = rawScoreToBand(correctCount);
    saveResult("reading", { band, correctCount, total, results });
    window.sessionStorage.setItem(
      "ielts_last_attempt",
      JSON.stringify({ section: "reading", band, correctCount, total, results })
    );
    reset();
    router.push("/results");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, reset, router]);

  useEffect(() => {
    function onMove(e) {
      if (!draggingRef.current || !splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidthPct(Math.min(75, Math.max(25, pct)));
    }
    function onUp() {
      draggingRef.current = false;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const isLastPart = partIndex === READING_PARTS.length - 1;

  return (
    <main className="fixed inset-0 z-50 flex flex-col bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/reading")}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <span className="rounded-md bg-accent px-3 py-1.5 text-sm font-extrabold text-white">IELTS</span>
          <span className="text-sm text-slate-400">Passage {part.id}/{READING_PARTS.length}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-base font-bold text-navy">{formatted}</span>
          {!running && (
            <Button variant="primary" className="px-4 py-1.5 text-sm" onClick={start}>
              Start
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <button type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen" className="rounded-md p-2 hover:bg-slate-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isFullscreen ? (
                <path d="M9 4v4a1 1 0 0 1-1 1H4M20 9h-4a1 1 0 0 1-1-1V4M15 20v-4a1 1 0 0 1 1-1h4M4 15h4a1 1 0 0 1 1 1v4" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
          <span className="rounded-md p-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="rounded-md p-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-sm font-bold text-navy">Passage {part.id}</p>
        <p className="text-sm text-slate-500">
          Read the text and answer questions {firstId}-{lastId}.
        </p>
      </div>

      <div ref={splitRef} className="flex min-h-0 flex-1 overflow-hidden">
        <div className="overflow-y-auto px-6 py-6" style={{ width: `${leftWidthPct}%` }}>
          <h2 className="text-xl font-bold text-navy">{part.passageTitle}</h2>
          {part.paragraphs.map((text, i) => (
            <p key={i} className="mt-4 text-sm leading-relaxed text-slate-600">
              {text}
            </p>
          ))}
        </div>

        <button
          type="button"
          aria-label="Resize panes"
          onMouseDown={() => {
            draggingRef.current = true;
          }}
          className="flex w-2 shrink-0 cursor-col-resize items-center justify-center border-x border-slate-200 bg-slate-50 hover:bg-indigo-50"
        >
          <span className="text-slate-400">⋮</span>
        </button>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            {part.questionGroups.map((group) => (
              <QuestionGroup key={group.title} group={group} answers={answers} setAnswer={setAnswer} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={partIndex === 0}
              onClick={() => setPartIndex((i) => Math.max(0, i - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 disabled:opacity-40"
              aria-label="Previous passage"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <span className="px-2 text-sm font-bold text-navy">Passage {part.id}</span>

            <div className="flex flex-wrap gap-1.5">
              {partQuestionIds.map((id) => (
                <a
                  key={id}
                  href={`#q-${id}`}
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${
                    answers[id] ? "bg-success text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {id}
                </a>
              ))}
            </div>

            <button
              type="button"
              disabled={isLastPart}
              onClick={() => setPartIndex((i) => Math.min(READING_PARTS.length - 1, i + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 disabled:opacity-40"
              aria-label="Next passage"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <Button variant="primary" onClick={handleSubmit}>
            Submit Test ({answeredCount}/{TOTAL_QUESTIONS})
          </Button>
        </div>
      </div>
    </main>
  );
}
