"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { appendExamResult, getExamLabel, getExamLength, getExamStepUrl } from "@/src/features";
import { Button, Container, ExamModeBadge, TimerBadge, useAutosizeTextarea, useCountdown, useElapsedTimer } from "@/src/shared";
import { WritingChart } from "@/src/widgets";

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

async function submitToTeacher({ testId, taskTitle, prompt, essay, wordCount, taskNumber }) {
  const res = await fetch("/api/writing/submit", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testId, taskTitle, prompt, essay, wordCount, taskNumber }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Could not submit your essay.");
  }
}

// ── Submitted state shown after the essay is sent ─────────────────────────────
function SubmittedView({ hasTeacher, examMode, onNext, onWriteAgain }) {
  if (examMode) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <div className="flex justify-end">
          <Button variant="primary" onClick={onNext}>Continue →</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 py-10">

      {/* Sent banner */}
      <div className="flex items-start gap-4 rounded-2xl bg-emerald-50 px-6 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-emerald-800">
            {hasTeacher ? "Sent for review!" : "Submitted!"}
          </p>
          <p className="mt-0.5 text-sm text-emerald-700">
            {hasTeacher
              ? "Your teacher will review your essay and send feedback."
              : "Your essay has been saved."}
          </p>
        </div>
      </div>

      {/* Pending status */}
      {hasTeacher && (
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400" />
          </span>
          <div>
            <p className="text-sm font-bold text-navy">Pending review</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              Your teacher will read your essay and give you a band score with feedback.
            </p>
          </div>
          <Link href="/writing/my-reviews" className="ml-auto shrink-0 text-xs font-semibold text-accent hover:underline">
            Track it →
          </Link>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onWriteAgain}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
        >
          Write Again
        </button>
      </div>
    </div>
  );
}

export function WritingTaskPage() {
  const router = useRouter();
  const { taskId } = useParams();
  const searchParams = useSearchParams();
  const examId = searchParams.get("exam");
  const stepIndex = Number(searchParams.get("step") ?? 0);
  const [task, setTask] = useState(null);
  const [hasTeacher, setHasTeacher] = useState(false);

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/tests/${taskId}`)
      .then((res) => res.json())
      .then((data) => {
        const content = data.test?.content ?? {};
        setTask({ ...content, title: data.test?.title ?? content.title ?? "" });
      });

    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setHasTeacher(!!d?.user?.teacherId))
      .catch(() => {});
  }, [taskId]);

  const textareaRef = useAutosizeTextarea(text);
  const taskNumber = task?.taskNumber ?? ((task?.minWords ?? 150) <= 200 ? 1 : 2);
  const durationSeconds = taskNumber === 1 ? 20 * 60 : 40 * 60;
  const words = wordCount(text);

  const handleSubmit = useCallback(async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitToTeacher({
        testId: taskId,
        taskTitle: task.title,
        prompt: task.prompt,
        essay: text,
        wordCount: words,
        taskNumber,
      });

      setSubmitted(true);

      if (examId) {
        appendExamResult(examId, { skill: "writing", slug: taskId, band: null });
      }
    } catch (err) {
      setError(err.message || "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, text, words, taskNumber, examId, taskId, submitted, submitting]);

  const handleNext = () => {
    const nextUrl = getExamStepUrl(examId, stepIndex + 1);
    router.push(nextUrl ?? `/exam/${examId}/results`);
  };

  const elapsed = useElapsedTimer(examId);
  const { formatted, secondsLeft, start } = useCountdown(`ielts_writing_timer_${taskId}`, durationSeconds, {
    onExpire: () => handleSubmit(),
  });

  const handleWriteAgain = () => {
    setText("");
    setSubmitted(false);
    setError(null);
    start();
  };

  if (!task) {
    return (
      <main className="fade-page flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading task...</p>
      </main>
    );
  }

  return (
    <main className="fade-page">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 py-3 backdrop-blur">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {examId ? (
              <ExamModeBadge label={getExamLabel(examId)} stepIndex={stepIndex} total={getExamLength(examId)} />
            ) : (
              <button
                type="button"
                onClick={() => router.push("/writing")}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
            )}
            <h1 className="text-lg font-bold text-navy">{task.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {elapsed && (
              <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-500" title="Umumiy vaqt">
                ⏱ {elapsed}
              </span>
            )}
            {!submitted && <TimerBadge formatted={formatted} secondsLeft={secondsLeft} />}
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {submitted ? (
          <SubmittedView
            hasTeacher={hasTeacher}
            examMode={!!examId}
            onNext={examId ? handleNext : null}
            onWriteAgain={handleWriteAgain}
          />
        ) : (
          <>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              {taskNumber === 1 && (
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                  Task 1
                </div>
              )}
              {taskNumber === 2 && (
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-600">
                  Task 2
                </div>
              )}

              <p className="mt-2 text-sm text-slate-700">{task.prompt}</p>

              {task.imageUrl && taskNumber === 1 && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={task.imageUrl}
                    alt="Task 1 diagram"
                    className="mx-auto block max-h-80 w-full object-contain p-2"
                  />
                </div>
              )}

              {task.chartData && (
                <div className="mt-4">
                  <WritingChart title={task.chartTitle} unit={task.chartUnit} data={task.chartData} />
                </div>
              )}

              <textarea
                ref={textareaRef}
                className="autosize mt-4 w-full resize-none rounded-xl border border-slate-300 p-4 text-sm leading-relaxed focus:border-accent focus:outline-none"
                rows={task.chartData ? 6 : 10}
                placeholder={`Write your ${task.title} response here...`}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <p className={`mt-2 text-sm font-semibold ${words >= task.minWords ? "text-success" : "text-slate-400"}`}>
                {words} / {task.minWords} words
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              {hasTeacher && (
                <p className="flex items-center gap-1.5 text-xs text-slate-400">
                  <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                  Will be sent to your teacher
                </p>
              )}
              <Button variant="primary" onClick={handleSubmit} disabled={submitting} className="ml-auto">
                {submitting ? "Submitting…" : "Submit"}
              </Button>
            </div>

            {error && <p className="mt-4 text-sm text-danger">{error}</p>}
          </>
        )}
      </Container>
    </main>
  );
}
