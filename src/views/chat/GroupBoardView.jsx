"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/src/features/auth";
import { useGroupInfo, useGroupPosts, useCreatePost } from "@/src/features/chat";
import { Avatar, PostCard } from "@/src/widgets";

function PostForm({ groupId, teacher }) {
  const [text, setText] = useState("");
  const mutation = useCreatePost(groupId);

  const submit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || mutation.isPending) return;
    mutation.mutate(t, { onSuccess: () => setText("") });
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,32,68,0.09)]">
      <div className="flex items-start gap-3 px-5 pt-4">
        <Avatar name={teacher?.name} avatarUrl={teacher?.avatarUrl} size={38} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message to your group…"
          rows={3}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm leading-relaxed focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/15"
        />
      </div>
      {mutation.isError && (
        <p className="px-5 pt-1 text-xs text-red-500">{mutation.error?.message}</p>
      )}
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-xs text-slate-400">{text.length > 0 ? `${text.length} chars` : "Students can leave comments"}</span>
        <button
          type="button"
          onClick={submit}
          disabled={mutation.isPending || !text.trim()}
          className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-40"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          {mutation.isPending ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}

export function GroupBoardView({ groupId, canPost, backHref, backLabel }) {
  const [currentUser, setCurrentUser] = useState(null);
  const { data: groupData } = useGroupInfo(groupId);
  const { data: postsData, isLoading, error } = useGroupPosts(groupId);

  useEffect(() => { getCurrentUser().then(setCurrentUser); }, []);

  const group = groupData?.group;
  const posts = postsData?.posts ?? [];
  const members = group?.members ?? [];

  return (
    <main className="fade-page max-w-6xl px-4 py-0 sm:px-6 lg:px-10">
      <div className="flex min-h-screen gap-0 lg:gap-6">

        {/* ── Feed (left / main) ── */}
        <div className="min-w-0 flex-1 py-6">
          {backHref && (
            <Link href={backHref} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {backLabel}
            </Link>
          )}

          {/* Channel header */}
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_2px_12px_rgba(15,32,68,0.08)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-navy">{group?.name ?? "Group Chat"}</p>
              <p className="text-xs text-slate-400">{members.length} members</p>
            </div>
          </div>

          {/* Post form (teacher only) */}
          {canPost && (
            <div className="mb-5">
              <PostForm groupId={groupId} teacher={currentUser} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              Error: {error.message}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-white shadow-sm" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && posts.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 py-14 text-center">
              <p className="text-sm font-semibold text-slate-400">No posts yet</p>
              <p className="mt-1 text-xs text-slate-300">
                {canPost ? "Write the first message — students can leave comments" : "New posts from your teacher will appear here"}
              </p>
            </div>
          )}

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} groupId={groupId} post={post} currentUserId={currentUser?.id} canComment />
            ))}
          </div>
        </div>

        {/* ── Members sidebar ── */}
        <div className="hidden w-52 shrink-0 py-6 lg:block">
          <div className="sticky top-24 overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,32,68,0.08)]">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Members ({members.length})
              </p>
            </div>
            {members.length === 0 ? (
              <p className="px-4 py-4 text-xs text-slate-400">No members yet</p>
            ) : (
              <ul className="divide-y divide-slate-50">
                {members.map((m) => {
                  const isMe = m.id === currentUser?.id;
                  return (
                    <li key={m.id} className="flex items-center gap-2.5 px-4 py-2.5">
                      <Avatar name={m.name} avatarUrl={m.avatarUrl} size={28} />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-navy">
                          {m.name}{isMe && <span className="ml-1 text-slate-400">(you)</span>}
                        </p>
                        <p className="truncate text-[10px] text-slate-400">@{m.username}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
