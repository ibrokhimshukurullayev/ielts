"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  appendExamResult, getExamLabel, getExamLength, getExamStepUrl,
  saveResult, scoreListeningAnswers,
} from "@/src/features";
import { rawScoreToBand, QuestionField } from "@/src/entities";
import { Button, ExamModeBadge, normalizeTestContent, useElapsedTimer } from "@/src/shared";

function fmt(s) {
  if (!s || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

function AudioPlayer({ src }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(1);
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (playing) a.pause(); else a.play();
    setPlaying((p) => !p);
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const v = ((e.clientX - rect.left) / rect.width) * dur;
    if (ref.current) ref.current.currentTime = v;
    setTime(v);
  };

  const changeVol = (v) => {
    if (ref.current) { ref.current.volume = v; ref.current.muted = false; }
    setVol(v);
    setMuted(false);
  };

  const toggleMute = () => {
    if (!ref.current) return;
    ref.current.muted = !muted;
    setMuted((m) => !m);
  };

  const pct = dur > 0 ? (time / dur) * 100 : 0;

  if (!src) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
        </svg>
        No audio — add <code className="mx-1 rounded bg-slate-200 px-1 text-xs">audioUrl</code> to the test JSON.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3">
      <audio
        ref={ref}
        src={src}
        onTimeUpdate={() => setTime(ref.current?.currentTime ?? 0)}
        onDurationChange={() => setDur(ref.current?.duration ?? 0)}
        onEnded={() => setPlaying(false)}
      />

      <button type="button" onClick={toggle}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-md transition-colors hover:bg-indigo-500">
        {playing ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <span className="w-10 shrink-0 font-mono text-xs text-slate-300">{fmt(time)}</span>

      <div className="group relative flex-1 cursor-pointer py-2" onClick={seek}>
        <div className="h-1 overflow-hidden rounded-full bg-slate-600">
          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
          style={{ left: `${pct}%`, transform: `translateX(-50%) translateY(-50%)` }}
        />
      </div>

      <span className="w-10 shrink-0 font-mono text-xs text-slate-500">{fmt(dur)}</span>

      <button type="button" onClick={toggleMute} className="text-slate-400 transition-colors hover:text-white">
        {muted || vol === 0 ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5Z" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" />
            <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" />
          </svg>
        ) : vol < 0.5 ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeLinecap="round" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : vol}
        onChange={(e) => changeVol(Number(e.target.value))}
        className="w-16 accent-accent" />
    </div>
  );
}

export function ListeningExamPage() {
  const router = useRouter();
  const { testId } = useParams();
  const searchParams = useSearchParams();
  const examId = searchParams.get("exam");
  const stepIndex = Number(searchParams.get("step") ?? 0);
  const [content, setContent] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activePartIdx, setActivePartIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetch(`/api/tests/${testId}`)
      .then((r) => r.json())
      .then((data) => {
        const test = data.test;
        if (!test) return;
        const raw = test.content ?? {};
        const normalized = normalizeTestContent(raw);
        setContent({ title: test.title, dbId: test.id, audioUrl: raw.audioUrl ?? null, ...normalized });
      });
  }, [testId]);

  const elapsed = useElapsedTimer(examId);

  const setAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = useCallback(async () => {
    const { correctCount, total, results } = scoreListeningAnswers(answers, content?.answers ?? {});
    const scaledScore = total > 0 ? Math.round((correctCount / total) * 40) : 0;
    const band = rawScoreToBand(scaledScore);
    await saveResult("listening", { band, correctCount, total, results, testId: content?.dbId });
    if (examId) {
      appendExamResult(examId, { skill: "listening", slug: testId, band, correctCount, total });
      const nextUrl = getExamStepUrl(examId, stepIndex + 1);
      router.push(nextUrl ?? `/exam/${examId}/results`);
      return;
    }
    window.sessionStorage.setItem(
      "ielts_last_attempt",
      JSON.stringify({ section: "listening", band, correctCount, total, results }),
    );
    router.push("/results");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, content, router, examId, stepIndex, testId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen?.(); setIsFullscreen(true); }
    else { document.exitFullscreen?.(); setIsFullscreen(false); }
  };

  if (!content) {
    return (
      <main className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <p className="text-sm text-slate-500">Loading test...</p>
      </main>
    );
  }

  const parts = Array.isArray(content.passages) && content.passages.length > 0
    ? content.passages
    : [{ number: 1, title: "Listening", from: 1, to: Infinity }];

  const activePart = parts[activePartIdx];
  const questionEntries = Object.entries(content.questions ?? {}).sort((a, b) => Number(a[0]) - Number(b[0]));
  const totalQuestions = questionEntries.length;
  const answeredCount = Object.values(answers).filter(Boolean).length;

  const activeQuestions = questionEntries.filter(([id]) => {
    const n = Number(id);
    return n >= (activePart?.from ?? 1) && n <= (activePart?.to ?? Infinity);
  });

  const jumpToQuestion = (id) => {
    const n = Number(id);
    const idx = parts.findIndex((p) => n >= (p.from ?? 1) && n <= (p.to ?? Infinity));
    if (idx >= 0) setActivePartIdx(idx);
    setTimeout(() => document.getElementById(`q-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };


  return (
    <main className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-2.5">
        <div className="flex items-center gap-3">
          {examId ? (
            <ExamModeBadge label={getExamLabel(examId)} stepIndex={stepIndex} total={getExamLength(examId)} />
          ) : (
            <button type="button" onClick={() => router.push("/listening")}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          )}
          <span className="rounded-md bg-accent px-3 py-1.5 text-sm font-extrabold text-white">IELTS</span>
          <span className="hidden text-sm font-semibold text-slate-600 sm:block">{content.title ?? "Listening Test"}</span>
        </div>

        <div className="flex items-center gap-3">
          {elapsed && (
            <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-500" title="Umumiy vaqt">
              ⏱ {elapsed}
            </span>
          )}
          <button type="button" onClick={toggleFullscreen} className="rounded-md p-2 text-slate-400 hover:bg-slate-100">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isFullscreen
                ? <path d="M9 4v4a1 1 0 0 1-1 1H4M20 9h-4a1 1 0 0 1-1-1V4M15 20v-4a1 1 0 0 1 1-1h4M4 15h4a1 1 0 0 0 1 1v4" strokeLinecap="round" strokeLinejoin="round" />
                : <path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
          </button>
        </div>
      </header>

      {/* Audio player */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3">
        <AudioPlayer src={content.audioUrl} />
      </div>

      {/* Part tabs */}
      {parts.length > 1 && (
        <div className="flex shrink-0 gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2">
          {parts.map((p, i) => (
            <button key={i} type="button" onClick={() => setActivePartIdx(i)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                i === activePartIdx ? "bg-navy text-white" : "text-slate-500 hover:bg-slate-200"
              }`}>
              {p.title?.startsWith("Part") ? p.title : `Part ${p.number ?? i + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Questions */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-2xl">
          {activePart?.title && activePart.title !== "Listening" && (
            <div className="mb-5">
              <h2 className="text-base font-bold text-navy">{activePart.title}</h2>
              {activePart.subtitle && <p className="mt-0.5 text-sm text-slate-500">{activePart.subtitle}</p>}
            </div>
          )}
          {activeQuestions.length > 0 && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Questions {activeQuestions[0]?.[0]}–{activeQuestions[activeQuestions.length - 1]?.[0]}
            </p>
          )}
          <div className="space-y-3">
            {activeQuestions.map(([id, raw]) => (
              <div key={id} id={`q-${id}`}
                className={`rounded-xl border-l-4 bg-white p-4 shadow-sm transition-colors ${
                  answers[id] ? "border-l-success" : "border-l-accent"
                }`}>
                <QuestionField id={id} raw={raw} value={answers[id] ?? ""} onChange={(v) => setAnswer(id, v)}
                  correctAnswer={(content.answers ?? {})[id]} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {questionEntries.map(([id]) => (
              <button key={id} type="button" onClick={() => jumpToQuestion(id)}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                  answers[id] ? "bg-success text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}>
                {id}
              </button>
            ))}
          </div>
          <Button variant="primary" onClick={handleSubmit}>
            Submit ({answeredCount}/{totalQuestions})
          </Button>
        </div>
      </div>
    </main>
  );
}
