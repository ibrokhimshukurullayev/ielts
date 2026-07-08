"use client";

import { useRef, useState } from "react";
import { useAddComment, useEditPost } from "@/src/features/chat";

const PALETTE = ["#6366f1","#0d9488","#b45309","#be185d","#0369a1","#65a30d","#7c3aed","#c2410c"];

export function nameColor(name = "") {
  return PALETTE[(name.charCodeAt(0) ?? 0) % PALETTE.length];
}

export function Avatar({ name, size = 36 }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, backgroundColor: nameColor(name), fontSize: Math.round(size * 0.38) }}
    >
      {name?.[0]?.toUpperCase() ?? "?"}
    </span>
  );
}

function fmt(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { day: "numeric", month: "short" }) + " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ─── Single comment row ─── */
function CommentRow({ comment, currentUserId }) {
  const mine = comment.sender?.id === currentUserId;
  return (
    <div className={`flex gap-2 ${mine ? "flex-row-reverse" : ""}`}>
      <Avatar name={comment.sender?.name} size={26} />
      <div className={`flex max-w-[78%] flex-col gap-0.5 ${mine ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500">{comment.sender?.name}</span>
          {comment.sender?.role === "TEACHER" && (
            <span className="rounded bg-accent/15 px-1 text-[9px] font-extrabold uppercase tracking-wider text-accent">
              teacher
            </span>
          )}
        </div>
        <div className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          mine
            ? "rounded-tr-sm bg-accent text-white"
            : "rounded-tl-sm bg-white text-slate-700 shadow-sm"
        }`}>
          {comment.text}
        </div>
        <span className="text-[10px] text-slate-400">{fmt(comment.createdAt)}</span>
      </div>
    </div>
  );
}

/* ─── Comment input ─── */
function CommentInput({ groupId, postId }) {
  const [text, setText] = useState("");
  const ref = useRef(null);
  const mutation = useAddComment(groupId, postId);

  const send = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || mutation.isPending) return;
    mutation.mutate(t, { onSuccess: () => { setText(""); ref.current?.focus(); } });
  };

  return (
    <form onSubmit={send} className="flex items-center gap-2">
      <input
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment…"
        className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/15"
      />
      <button
        type="submit"
        disabled={mutation.isPending || !text.trim()}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow transition-opacity disabled:opacity-40"
        aria-label="Send"
      >
        <svg className="h-3.5 w-3.5 translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
}

/* ─── Inline post editor ─── */
function PostEditor({ groupId, post, onDone }) {
  const [text, setText] = useState(post.text);
  const mutation = useEditPost(groupId);

  const save = () => {
    const t = text.trim();
    if (!t || mutation.isPending) return;
    mutation.mutate({ postId: post.id, text: t }, { onSuccess: onDone });
  };

  return (
    <div>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-xl border border-accent/40 bg-white px-3.5 py-2.5 text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/15"
      />
      {mutation.isError && <p className="mt-1 text-xs text-red-500">{mutation.error?.message}</p>}
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" onClick={onDone} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100">
          Cancel
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!text.trim() || mutation.isPending}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-40"
        >
          {mutation.isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

/* ─── Telegram-style post card ─── */
export function PostCard({ groupId, post, currentUserId, canComment = true }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const count = post.comments?.length ?? 0;
  const canEdit = post.teacher?.id === currentUserId;
  const edited = post.updatedAt && post.updatedAt !== post.createdAt;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,32,68,0.09)]">
      {/* Post body */}
      <div className="px-5 pt-5 pb-4">
        {/* Teacher row */}
        <div className="mb-3 flex items-center gap-2.5">
          <Avatar name={post.teacher?.name} size={38} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-navy">{post.teacher?.name}</span>
              {/* Telegram-style verified badge */}
              <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <span className="text-[11px] text-slate-400">
              {fmt(post.createdAt)}{edited && " · edited"}
            </span>
          </div>
          {canEdit && !editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-accent"
              aria-label="Edit post"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
            </button>
          )}
        </div>

        {/* Post text — Telegram channel style */}
        {editing ? (
          <PostEditor groupId={groupId} post={post} onDone={() => setEditing(false)} />
        ) : (
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">{post.text}</p>
        )}
      </div>

      {/* Footer: comment count toggle */}
      <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-accent"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {count > 0 ? `${count} comment${count !== 1 ? "s" : ""}` : "No comments"}
          <span className="text-slate-300">{open ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* Comments + input — always visible when open */}
      {(open || canComment) && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
          {open && count > 0 && (
            <div className="mb-4 space-y-3">
              {post.comments.map((c) => (
                <CommentRow key={c.id} comment={c} currentUserId={currentUserId} />
              ))}
            </div>
          )}
          {canComment && <CommentInput groupId={groupId} postId={post.id} />}
        </div>
      )}
    </div>
  );
}
