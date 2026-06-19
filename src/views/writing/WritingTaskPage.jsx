"use client";

import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TASK1, TASK2, getWritingFeedback, saveResult } from "@/src/features";
import { Button, Container, TimerBadge, useAutosizeTextarea, useCountdown } from "@/src/shared";
import { WritingChart } from "@/src/widgets";

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const TASKS = {
  "task-1": { ...TASK1, number: 1, durationSeconds: 20 * 60 },
  "task-2": { ...TASK2, number: 2, durationSeconds: 40 * 60 },
};

export function WritingTaskPage() {
  const router = useRouter();
  const { taskId } = useParams();
  const task = TASKS[taskId] ?? TASKS["task-1"];

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const textareaRef = useAutosizeTextarea(text);
  const { formatted, secondsLeft } = useCountdown(`ielts_writing_timer_${taskId}`, task.durationSeconds);

  const words = wordCount(text);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await getWritingFeedback({
        taskTitle: task.title,
        prompt: task.prompt,
        essay: text,
        wordCount: words,
      });
      setFeedback(result);
      saveResult("writing", { band: result.band });
    } catch {
      setError("Couldn't reach the feedback service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [task, text, words]);

  return (
    <main className="fade-page">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 py-3 backdrop-blur">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            <h1 className="text-lg font-bold text-navy">{task.title}</h1>
          </div>
          <TimerBadge formatted={formatted} secondsLeft={secondsLeft} />
        </Container>
      </div>

      <Container className="py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">{task.prompt}</p>

          {task.number === 1 && (
            <div className="mt-4">
              <WritingChart title={task.chartTitle} unit={task.chartUnit} data={task.chartData} />
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="autosize mt-4 w-full resize-none rounded-xl border border-slate-300 p-4 text-sm leading-relaxed focus:border-accent focus:outline-none"
            rows={task.number === 1 ? 6 : 10}
            placeholder={`Write your ${task.title} response here...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className={`mt-2 text-sm font-semibold ${words >= task.minWords ? "text-success" : "text-slate-400"}`}>
            {words} / {task.minWords} words
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Analysing..." : "Submit"}
          </Button>
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        {feedback && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy">AI Feedback</h2>
            <p className="mt-1 text-3xl font-extrabold text-success">Band {feedback.band}</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(feedback.criteria ?? {}).map(([key, value]) => (
                <div key={key} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">{value.label ?? key}</p>
                  <p className="mt-1 text-xl font-bold text-navy">{value.score}</p>
                  <p className="mt-1 text-sm text-slate-600">{value.comment}</p>
                </div>
              ))}
            </div>
            {feedback.summary && <p className="mt-4 text-sm text-slate-600">{feedback.summary}</p>}
          </div>
        )}
      </Container>
    </main>
  );
}
