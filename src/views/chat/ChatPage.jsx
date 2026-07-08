"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { chatApi } from "@/src/features/chat";

function GroupCard({ group }) {
  return (
    <Link href={`/chat/${group.id}`}>
      <div className="flex h-full flex-col gap-2 rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(15,32,68,0.07)] transition-colors hover:border-accent hover:bg-indigo-50/40">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <p className="text-base font-bold text-navy">{group.name}</p>
        <p className="mt-auto text-sm font-semibold text-slate-500">
          {group.teacherName} · {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}

export function ChatPage() {
  const router = useRouter();
  const [groups, setGroups] = useState(null);

  useEffect(() => {
    chatApi.getMyGroups().then(({ groups }) => {
      if (groups.length === 1) {
        router.replace(`/chat/${groups[0].id}`);
        return;
      }
      setGroups(groups);
    });
  }, [router]);

  if (groups === null) {
    return (
      <main className="fade-page flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </main>
    );
  }

  if (groups.length === 0) {
    return (
      <main className="fade-page mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-bold text-navy">Not in a group yet</h1>
        <p className="mt-2 text-sm text-slate-500">
          Once your teacher adds you to one of their groups, messages will appear here.
        </p>
      </main>
    );
  }

  return (
    <main className="fade-page max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
      <div>
        <h1 className="text-2xl font-bold text-navy">Chat</h1>
        <p className="mt-1 text-sm text-slate-500">Choose a group to see messages.</p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => <GroupCard key={g.id} group={g} />)}
      </div>
    </main>
  );
}
