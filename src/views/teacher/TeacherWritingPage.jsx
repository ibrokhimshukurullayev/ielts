"use client";

import { useEffect, useRef, useState } from "react";
import { buildHighlightedSegments } from "@/src/shared";
import { TaskChartPreview } from "@/src/widgets";

// ── helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function initials(name) {
  return (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function bandColor(band) {
  if (!band) return "bg-slate-100 text-slate-500";
  if (band >= 7) return "bg-emerald-100 text-emerald-700";
  if (band >= 5.5) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function getTextOffset(root, node, offset) {
  let total = 0;
  let found = false;
  function walk(n) {
    if (found) return;
    if (n === node) { total += offset; found = true; return; }
    if (n.nodeType === Node.TEXT_NODE) { total += n.textContent.length; }
    else { for (const child of n.childNodes) walk(child); }
  }
  walk(root);
  return total;
}

function getSelectionInfo(container) {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null;
  const text = selection.toString().trim();
  if (!text) return null;
  const range = selection.getRangeAt(0);
  if (!container.contains(range.commonAncestorContainer)) return null;
  const rangeRect = range.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const rawStart = getTextOffset(container, range.startContainer, range.startOffset);
  const rawEnd = getTextOffset(container, range.endContainer, range.endOffset);
  const start = Math.min(rawStart, rawEnd);
  const end = Math.max(rawStart, rawEnd);
  return {
    text,
    start,
    end,
    top: rangeRect.top - containerRect.top - 10,
    left: rangeRect.left - containerRect.left + rangeRect.width / 2,
  };
}

// ── ReplyPopup (select-to-quote, Telegram style) ──────────────────────────────
function ReplyButton({ top, left, onReply }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={onReply}
      className="absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg hover:bg-slate-800"
      style={{ top, left }}
    >
      ↩ Reply
    </button>
  );
}

function QuoteComposer({ quote, top, left, onAdd, onCancel }) {
  const [text, setText] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && text.trim()) onAdd(text.trim());
  };

  return (
    <div
      className="absolute z-20 w-72 -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900 p-3 shadow-xl"
      style={{ top, left }}
      onMouseUp={(e) => e.stopPropagation()}
    >
      <div className="mb-2 border-l-2 border-accent pl-2 text-xs italic text-slate-300 line-clamp-2">
        &ldquo;{quote}&rdquo;
      </div>
      <textarea
        ref={ref}
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Point out the issue here… (Ctrl+Enter)"
        className="w-full resize-none rounded-md border border-slate-600 bg-slate-800 p-2 text-xs text-white placeholder:text-slate-400 focus:outline-none"
      />
      <div className="mt-2 flex justify-end gap-1.5">
        <button type="button" onClick={onCancel} className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-slate-700">
          Cancel
        </button>
        <button
          type="button"
          disabled={!text.trim()}
          onClick={() => onAdd(text.trim())}
          className="rounded-md bg-accent px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40"
        >
          Add
        </button>
      </div>
      <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-slate-900" />
    </div>
  );
}

// ── EssayViewer (highlightable essay with inline quote-replies) ──────────────
function EssayViewer({ review, expanded, draftComments, onDraftAdd, flashId, onFlash }) {
  const containerRef = useRef(null);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [composing, setComposing] = useState(null);
  const [activeComment, setActiveComment] = useState(null);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (containerRef.current?.contains(e.target)) return;
      setPendingSelection(null);
      setActiveComment(null);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const handleMouseUp = () => {
    if (!expanded || !containerRef.current) return;
    const info = getSelectionInfo(containerRef.current);
    setActiveComment(null);
    setComposing(null);
    setPendingSelection(info);
  };

  const handleAdd = (text) => {
    if (!composing) return;
    onDraftAdd({ quote: composing.text, comment: text, start: composing.start, end: composing.end });
    window.getSelection()?.removeAllRanges();
    setComposing(null);
  };

  const combinedComments = [
    ...(review.inlineComments ?? []).map((c) => ({ ...c, pending: false })),
    ...draftComments.map((c, i) => ({ ...c, id: `draft-${i}`, pending: true })),
    ...(composing ? [{ id: "composing", quote: composing.text, start: composing.start, end: composing.end, composing: true }] : []),
  ];
  const segments = buildHighlightedSegments(review.essay, combinedComments);

  return (
    <div ref={containerRef} onMouseUp={handleMouseUp} className="relative whitespace-pre-wrap">
      {segments.map((seg, i) =>
        seg.comment ? (
          <mark
            key={i}
            id={`comment-mark-${seg.comment.id}`}
            className={`rounded-sm ${
              seg.comment.composing
                ? "bg-sky-300"
                : seg.comment.id === flashId
                  ? `cursor-pointer ${seg.comment.pending ? "bg-sky-400" : "bg-amber-400"}`
                  : "cursor-pointer bg-transparent transition-colors duration-1000"
            }`}
            onClick={(e) => {
              if (seg.comment.composing) return;
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const containerRect = containerRef.current.getBoundingClientRect();
              setPendingSelection(null);
              setComposing(null);
              setActiveComment((cur) =>
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

      {pendingSelection && !composing && (
        <ReplyButton
          top={pendingSelection.top}
          left={pendingSelection.left}
          onReply={() => {
            setComposing(pendingSelection);
            setPendingSelection(null);
          }}
        />
      )}

      {composing && (
        <QuoteComposer
          quote={composing.text}
          top={composing.top}
          left={composing.left}
          onAdd={handleAdd}
          onCancel={() => setComposing(null)}
        />
      )}

      {activeComment && (
        <div
          className="absolute z-20 w-64 -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900 p-3 text-xs text-white shadow-xl"
          style={{ top: activeComment.top, left: activeComment.left }}
          onMouseUp={(e) => e.stopPropagation()}
        >
          <p className={`mb-1 font-semibold ${activeComment.comment.pending ? "text-sky-300" : "text-amber-300"}`}>
            {activeComment.comment.pending ? "Draft comment (not sent yet)" : "Comment"}
          </p>
          <p className="whitespace-pre-wrap leading-relaxed">{activeComment.comment.comment}</p>
        </div>
      )}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, size = 36 }) {
  const colors = ["bg-indigo-500", "bg-violet-500", "bg-sky-500", "bg-teal-500", "bg-pink-500"];
  const idx = (name?.charCodeAt(0) ?? 0) % colors.length;
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${colors[idx]}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials(name)}
    </span>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
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
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Pending
    </span>
  );
}

// ── FeedbackForm (Telegram-style inline reply) ────────────────────────────────
function FeedbackForm({ reviewId, draftComments, onRemoveDraft, onJumpToDraft, onSent, initialFeedback, initialBand }) {
  const [text, setText] = useState(initialFeedback ?? "");
  const [band, setBand] = useState(initialBand != null ? String(initialBand) : "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const canSend = text.trim().length > 0 || draftComments.length > 0 || band !== "";

  const handleSend = async () => {
    if (!canSend || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/teacher/writing/${reviewId}/feedback`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: text.trim(), band: band ? Number(band) : null, inlineComments: draftComments }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      onSent(data.review);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSend();
  };

  return (
    <div className="mt-3 rounded-2xl border border-accent/30 bg-indigo-50/50 p-4">
      {/* Reply indicator (Telegram style) */}
      <div className="mb-3 flex items-center gap-2 border-l-2 border-accent pl-3">
        <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        <span className="text-xs font-semibold text-accent">Writing feedback</span>
      </div>

      {/* Queued quote-replies (Telegram-style, not sent yet) */}
      {draftComments.length > 0 && (
        <div className="mb-3 space-y-2">
          {draftComments.map((d, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => onJumpToDraft(i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onJumpToDraft(i)}
              className="flex w-full cursor-pointer items-start gap-2 rounded-xl bg-white p-2.5 text-left shadow-sm transition-colors hover:bg-sky-50"
            >
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="truncate border-l-2 border-sky-300 pl-2 text-[11px] italic text-slate-400">
                  &ldquo;{d.quote}&rdquo;
                </p>
                <p className="mt-0.5 text-xs text-slate-700">{d.comment}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveDraft(i);
                }}
                className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-500"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        placeholder={draftComments.length > 0 ? "Add overall feedback (optional)…" : "Write your comments, suggestions or score… (Ctrl+Enter to send)"}
        rows={4}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {/* Band selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Band:</label>
          <select
            value={band}
            onChange={(e) => setBand(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-navy focus:border-accent focus:outline-none"
          >
            <option value="">—</option>
            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend || sending}
            className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 disabled:opacity-40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ReviewCard ────────────────────────────────────────────────────────────────
function ReviewCard({ review: initialReview }) {
  const [review, setReview] = useState(initialReview);
  const [expanded, setExpanded] = useState(false);
  const [replying, setReplying] = useState(false);
  const [draftComments, setDraftComments] = useState([]);
  const [flashId, setFlashId] = useState(null);

  const triggerFlash = (id) => {
    setFlashId(id);
    setTimeout(() => setFlashId((cur) => (cur === id ? null : cur)), 2000);
  };

  const handleJumpToDraft = (idx) => {
    const id = `draft-${idx}`;
    setExpanded(true);
    triggerFlash(id);
    setTimeout(() => {
      document.getElementById(`comment-mark-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const handleDraftAdd = (draft) => {
    setDraftComments((prev) => [...prev, draft]);
    setReplying(true);
  };

  const handleRemoveDraft = (idx) => {
    setDraftComments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSent = (updated) => {
    setReview(updated);
    setDraftComments([]);
    setReplying(false);
    setExpanded(true);
  };

  const essayPreview = review.essay.slice(0, 180) + (review.essay.length > 180 ? "…" : "");
  const commentCount = (review.inlineComments?.length ?? 0) + draftComments.length;

  return (
    <div className={`overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(15,32,68,0.08)] transition-all ${review.status === "PENDING" ? "ring-1 ring-amber-200" : ""}`}>

      {/* ── Card header ── */}
      <div className="flex items-start gap-3 px-5 pt-4 pb-3">
        <Avatar name={review.student?.name} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-navy text-sm">{review.student?.name}</span>
            <span className="text-xs text-slate-400">@{review.student?.username}</span>
            <StatusBadge status={review.status} />
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Task {review.taskNumber} · {review.wordCount} words · {timeAgo(review.createdAt)}
          </p>
          {review.prompt && (
            <p className="mt-1.5 line-clamp-2 text-sm font-medium text-slate-700">{review.prompt}</p>
          )}
          <TaskChartPreview testId={review.testId} taskNumber={review.taskNumber} />
        </div>
      </div>

      {/* ── Essay preview / full ── */}
      <div className="px-5 pb-3">
        <div
          className={`relative rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 ${!expanded ? "cursor-pointer hover:bg-slate-100/80" : ""}`}
          onClick={() => !expanded && setExpanded(true)}
        >
          {expanded ? (
            <EssayViewer
              review={review}
              expanded={expanded}
              draftComments={draftComments}
              onDraftAdd={handleDraftAdd}
              flashId={flashId}
              onFlash={triggerFlash}
            />
          ) : (
            essayPreview
          )}
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-10 rounded-b-xl bg-linear-to-t from-slate-50 to-transparent pointer-events-none" />
          )}
        </div>
        {!expanded && (
          <button type="button" onClick={() => setExpanded(true)} className="mt-1.5 text-xs font-semibold text-accent hover:underline">
            Show full essay ↓
          </button>
        )}
        {expanded && (
          <div className="mt-1.5 flex items-center justify-between">
            <button type="button" onClick={() => setExpanded(false)} className="text-xs font-semibold text-slate-400 hover:underline">
              Collapse ↑
            </button>
            <span className="text-xs text-slate-400">
              Select any text to point out an issue{commentCount > 0 ? ` · ${commentCount} comment${commentCount > 1 ? "s" : ""}` : ""}
            </span>
          </div>
        )}
      </div>

      {/* ── Teacher feedback (if already reviewed) ── */}
      {review.teacherFeedback && (
        <div className="mx-5 mb-3 rounded-2xl bg-indigo-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="text-xs font-bold text-accent">Your feedback</span>
            {review.teacherBand && (
              <span className={`ml-auto rounded-full px-3 py-0.5 text-xs font-bold ${bandColor(review.teacherBand)}`}>
                Band {review.teacherBand}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{review.teacherFeedback}</p>
        </div>
      )}

      {/* ── Action bar ── */}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          {review.wordCount} words
        </div>

        <button
          type="button"
          onClick={() => setReplying((r) => !r)}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
            replying
              ? "bg-accent/10 text-accent"
              : "bg-slate-100 text-slate-600 hover:bg-accent/10 hover:text-accent"
          }`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          {draftComments.length > 0 ? `Review (${draftComments.length} queued)` : review.teacherFeedback ? "Edit feedback" : "Write feedback"}
        </button>
      </div>

      {/* ── Inline reply form ── */}
      {replying && (
        <div className="px-5 pb-5">
          <FeedbackForm
            reviewId={review.id}
            draftComments={draftComments}
            onRemoveDraft={handleRemoveDraft}
            onJumpToDraft={handleJumpToDraft}
            onSent={handleSent}
            initialFeedback={review.teacherFeedback}
            initialBand={review.teacherBand}
          />
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function TeacherWritingPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING"); // "ALL" | "PENDING" | "REVIEWED"

  useEffect(() => {
    fetch("/api/teacher/writing", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
      .finally(() => setLoading(false));
  }, []);

  const visible = reviews.filter((r) => filter === "ALL" || r.status === filter);
  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;

  return (
    <main className="fade-page max-w-5xl px-4 py-8 sm:px-6 lg:px-10">

      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Writing Reviews</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review and give feedback on your students&apos; essays
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div className="mb-5 flex gap-2">
        {[
          { key: "ALL", label: "All" },
          { key: "PENDING", label: "Pending" },
          { key: "REVIEWED", label: "Reviewed" },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-all ${
              filter === key
                ? "bg-accent text-white shadow-sm"
                : "bg-white text-slate-500 shadow-sm hover:bg-slate-50"
            }`}
          >
            {label}
            {key === "PENDING" && pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
          <svg className="mx-auto h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className="mt-3 text-sm font-semibold text-slate-400">
            {filter === "PENDING" ? "No pending essays" : "No essays submitted yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </main>
  );
}
