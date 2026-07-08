"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyGroups } from "@/src/features";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d < 1) return "today";
  if (d === 1) return "yesterday";
  return `${d}d ago`;
}

function GroupChatCard({ group }) {
  return (
    <Link href={`/teacher/chat/group/${group.id}`}>
      <div className="flex h-full flex-col gap-2 rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(15,32,68,0.07)] transition-colors hover:border-accent hover:bg-indigo-50/40">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <span className="text-xs text-slate-400">{timeAgo(group.createdAt)}</span>
        </div>
        <p className="text-base font-bold text-navy">{group.name}</p>
        <p className="mt-auto text-sm font-semibold text-slate-500">
          {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}

export function TeacherChatPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyGroups()
      .then(setGroups)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="fade-page max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
      <div>
        <h1 className="text-2xl font-bold text-navy">Chat</h1>
        <p className="mt-1 text-sm text-slate-500">Pick a group to post a message and see comments.</p>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white shadow-sm" />)}
          </div>
        ) : groups.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <p className="mt-3 text-sm font-semibold text-slate-400">No groups yet</p>
            <p className="mt-1 text-xs text-slate-300">
              Create a group in the Groups tab first, then come back here to chat with it.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => <GroupChatCard key={g.id} group={g} />)}
          </div>
        )}
      </div>
    </main>
  );
}
