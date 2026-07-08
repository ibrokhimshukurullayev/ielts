"use client";

import { useEffect, useRef, useState } from "react";
import { buildHighlightedSegments } from "@/src/shared";
import { TaskChartPreview } from "@/src/widgets";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function bandColor(band) {
  if (!band) return "bg-slate-100 text-slate-500";
  if (band >= 7) return "bg-emerald-100 text-emerald-700";
  if (band >= 5.5) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function StatusBadge({ status }) {
  return status === "REVIEWED" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Reviewed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
      Pending
    </span>
  );
}

// ── Read-only essay viewer with the teacher's inline comments ────────────────
function EssayWithComments({ essay, comments, flashId, onFlash }) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (containerRef.current?.contains(e.target)) return;
      setActive(null);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const segments = buildHighlightedSegments(essay, comments ?? []);

  return (
    <div ref={containerRef} className="relative whitespace-pre-wrap">
      {segments.map((seg, i) =>
        seg.comment ? (
          <mark
            key={i}
            id={`comment-mark-${seg.comment.id}`}
            className={`cursor-pointer rounded-sm ${
              seg.comment.id === flashId ? "bg-amber-400" : "bg-transparent transition-colors duration-1000"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const containerRect = containerRef.current.getBoundingClientRect();
              setActive((cur) =>
                cur?.comment.id === seg.comment.id
                  ? null
                  : { comment: seg.comment, top: rect.top - containerRect.top - 8, left: rect.left - containerRect.left + rect.width / 2 }
              );
              onFlash(seg.comment.id);
            }}
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}

      {active && (
        <div
          className="absolute z-20 w-64 -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900 p-3 text-xs text-white shadow-xl"
          style={{ top: active.top, left: active.left }}
        >
          <p className="mb-1 font-semibold text-amber-300">Teacher's comment</p>
          <p className="whitespace-pre-wrap leading-relaxed">{active.comment.comment}</p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const [flashId, setFlashId] = useState(null);
  const essayPreview = review.essay.slice(0, 200) + (review.essay.length > 200 ? "…" : "");
  const commentCount = review.inlineComments?.length ?? 0;

  const triggerFlash = (id) => {
    setFlashId(id);
    setTimeout(() => setFlashId((cur) => (cur === id ? null : cur)), 2000);
  };

  const handleJumpToComment = (id) => {
    setExpanded(true);
    triggerFlash(id);
    setTimeout(() => {
      document.getElementById(`comment-mark-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  return (
    <div className={`overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(15,32,68,0.08)] ${review.status === "REVIEWED" ? "" : "ring-1 ring-amber-200/70"}`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Task {review.taskNumber}</span>
            <StatusBadge status={review.status} />
          </div>
          {review.prompt && (
            <p className="mt-1 line-clamp-2 text-sm font-bold text-navy">{review.prompt}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {review.wordCount} words · {timeAgo(review.createdAt)}
            {review.teacher && ` · Teacher: ${review.teacher.name}`}
          </p>
          <TaskChartPreview testId={review.testId} taskNumber={review.taskNumber} />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {review.teacherBand && (
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${bandColor(review.teacherBand)}`}>
              Teacher {review.teacherBand}
            </span>
          )}
        </div>
      </div>

      {/* Essay */}
      <div className="px-5 pb-3">
        <div className="relative rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
          {expanded ? (
            <EssayWithComments essay={review.essay} comments={review.inlineComments} flashId={flashId} onFlash={triggerFlash} />
          ) : (
            essayPreview
          )}
          {!expanded && review.essay.length > 200 && (
            <div className="absolute bottom-0 left-0 right-0 h-8 rounded-b-xl bg-linear-to-t from-slate-50 to-transparent pointer-events-none" />
          )}
        </div>
        {review.essay.length > 200 && (
          <div className="mt-1.5 flex items-center justify-between">
            <button type="button" onClick={() => setExpanded((v) => !v)}
              className="text-xs font-semibold text-accent hover:underline">
              {expanded ? "Collapse ↑" : "Show full essay ↓"}
            </button>
            {expanded && commentCount > 0 && (
              <span className="text-xs text-slate-400">
                {commentCount} teacher comment{commentCount > 1 ? "s" : ""} highlighted
              </span>
            )}
          </div>
        )}
      </div>

      {/* Inline quote-replies from teacher (Telegram-style) */}
      {commentCount > 0 && (
        <div className="mx-5 mb-3 space-y-2">
          {review.inlineComments.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleJumpToComment(c.id)}
              className="flex w-full items-start gap-2 rounded-xl bg-amber-50 p-3 text-left transition-colors hover:bg-amber-100"
            >
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="truncate border-l-2 border-amber-300 pl-2 text-[11px] italic text-slate-500">
                  &ldquo;{c.quote}&rdquo;
                </p>
                <p className="mt-0.5 text-sm text-slate-700">{c.comment}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Teacher feedback bubble */}
      {review.teacherFeedback ? (
        <div className="mx-5 mb-5 rounded-2xl bg-indigo-50 p-4">
          <div className="mb-3 flex items-center gap-2 border-l-2 border-accent pl-3">
            <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="text-xs font-bold text-accent">
              {review.teacher?.name ?? "Teacher"}'s feedback
            </span>
            {review.teacherBand && (
              <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold ${bandColor(review.teacherBand)}`}>
                Band {review.teacherBand}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{review.teacherFeedback}</p>
          <p className="mt-2 text-right text-[10px] text-slate-400">{timeAgo(review.updatedAt)}</p>
        </div>
      ) : commentCount === 0 ? (
        <div className="mx-5 mb-5 flex items-center gap-2 rounded-xl border border-dashed border-slate-200 px-4 py-3 text-xs text-slate-400">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Waiting for teacher feedback…
        </div>
      ) : null}
    </div>
  );
}

export function MyWritingPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/writing/my-reviews", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
      .finally(() => setLoading(false));
  }, []);

  const reviewed = reviews.filter((r) => r.status === "REVIEWED").length;

  return (
    <main className="fade-page max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
      <div className="slide-up mb-6">
        <h1 className="text-2xl font-bold text-navy">My Essays</h1>
        <p className="mt-1 text-sm text-slate-500">Essays submitted to your teacher and their feedback</p>
      </div>

      {reviews.length > 0 && (
        <div className="slide-up-1 mb-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            {reviews.length} submitted
          </span>
          {reviewed > 0 && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {reviewed} reviewed
            </span>
          )}
          {reviews.length - reviewed > 0 && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {reviews.length - reviewed} pending
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-white shadow-sm" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
          <svg className="mx-auto h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className="mt-3 text-sm font-semibold text-slate-400">No essays submitted yet</p>
          <p className="mt-1 text-xs text-slate-300">Submit a writing task to see it here</p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}
    </main>
  );
}
