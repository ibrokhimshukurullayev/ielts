"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createGroup, getMyGroups } from "@/src/features";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d < 1) return "today";
  if (d === 1) return "yesterday";
  return `${d}d ago`;
}

function CreateGroupBox({ onCreated }) {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!name.trim() || creating) return;
    setCreating(true);
    setError(null);
    try {
      const group = await createGroup(name.trim());
      setName("");
      onCreated(group);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full sm:w-80">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="New group name..."
          disabled={creating}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={!name.trim() || creating}
          className="shrink-0 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-40"
        >
          {creating ? "Creating…" : "Create"}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function GroupCard({ group }) {
  return (
    <Link href={`/teacher/groups/${group.id}`}>
      <div className="flex h-full flex-col gap-2 rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(15,32,68,0.07)] transition-colors hover:border-accent hover:bg-indigo-50/40">
        <div className="flex items-start justify-between gap-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
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

export function TeacherGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyGroups()
      .then(setGroups)
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (group) => setGroups((prev) => [group, ...prev]);

  return (
    <main className="fade-page max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Groups</h1>
          <p className="mt-1 text-sm text-slate-500">Create as many groups as you like and organize your students.</p>
        </div>
        <CreateGroupBox onCreated={handleCreated} />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white shadow-sm" />)}
          </div>
        ) : groups.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-slate-300">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-3 text-sm font-semibold text-slate-400">No groups yet</p>
            <p className="mt-1 text-xs text-slate-300">Create your first group above to start organizing students.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => <GroupCard key={g.id} group={g} />)}
          </div>
        )}
      </div>
    </main>
  );
}
