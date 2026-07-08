"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  addGroupMember,
  deleteGroup,
  getGroupDetail,
  getMyStudents,
  removeGroupMember,
  renameGroup,
} from "@/src/features";

function Avatar({ name, size = "md" }) {
  const letter = name?.[0]?.toUpperCase() ?? "?";
  const sizeClass = size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-sm";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-navy font-bold text-white ${sizeClass}`}>
      {letter}
    </span>
  );
}

function AddMemberBox({ candidates, onAdd }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const boxRef = useRef(null);

  useEffect(() => {
    function onDown(e) { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((s) => s.name.toLowerCase().includes(q) || s.username.toLowerCase().includes(q));
  }, [candidates, query]);

  const handleSelect = async (student) => {
    setError(null);
    setAdding(true);
    try {
      await onAdd(student.id);
      setQuery("");
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div ref={boxRef} className="relative w-full sm:w-80">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Add a student to this group..."
        disabled={adding}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
      />
      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">
              {candidates.length === 0 ? "All your students are already in this group." : "No matches."}
            </p>
          ) : results.map((s) => (
            <button key={s.id} type="button" onClick={() => handleSelect(s)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-indigo-50">
              <Avatar name={s.name} size="sm" />
              <div>
                <p className="text-sm font-semibold text-navy">{s.name}</p>
                <p className="text-xs text-slate-400">@{s.username}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function GroupNameEditor({ name, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const handleSave = async () => {
    if (!value.trim() || value.trim() === name) { setEditing(false); setValue(name); return; }
    setSaving(true);
    try {
      await onSave(value.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") { setEditing(false); setValue(name); }
          }}
          disabled={saving}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-2xl font-bold text-navy focus:border-accent focus:outline-none"
        />
        <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50">
          Save
        </button>
        <button type="button" onClick={() => { setEditing(false); setValue(name); }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setEditing(true)} className="group flex items-center gap-2">
      <h1 className="text-2xl font-bold text-navy">{name}</h1>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 group-hover:text-accent">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
      </svg>
    </button>
  );
}

export function TeacherGroupDetailPage() {
  const { groupId } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getGroupDetail(groupId), getMyStudents()])
      .then(([g, students]) => {
        setGroup(g);
        setAllStudents(students);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [groupId]); // eslint-disable-line

  const handleRename = async (name) => {
    await renameGroup(groupId, name);
    setGroup((g) => ({ ...g, name }));
  };

  const handleAddMember = async (studentId) => {
    const member = await addGroupMember(groupId, studentId);
    setGroup((g) => ({ ...g, members: [...g.members, member] }));
  };

  const handleRemoveMember = async (studentId) => {
    await removeGroupMember(groupId, studentId);
    setGroup((g) => ({ ...g, members: g.members.filter((m) => m.id !== studentId) }));
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteGroup(groupId);
      router.push("/teacher/groups");
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !group) {
    return (
      <main className="fade-page max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="h-24 animate-pulse rounded-2xl bg-white shadow-sm" />
      </main>
    );
  }

  const candidates = allStudents.filter((s) => !group.members.some((m) => m.id === s.id));

  return (
    <main className="fade-page max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
      <Link href="/teacher/groups" className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-accent">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All groups
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <GroupNameEditor name={group.name} onSave={handleRename} />
          <p className="mt-1 text-sm text-slate-500">
            {group.members.length} member{group.members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <AddMemberBox candidates={candidates} onAdd={handleAddMember} />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,32,68,0.07)]">
        {group.members.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-slate-400">No members yet</p>
            <p className="mt-1 text-xs text-slate-300">Add students to this group using the search box above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {group.members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={m.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy">{m.name}</p>
                  <p className="text-xs text-slate-400">@{m.username}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(m.id)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Delete this group?</span>
            <button type="button" onClick={handleDelete} disabled={deleting}
              className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-50">
              {deleting ? "Deleting…" : "Confirm"}
            </button>
            <button type="button" onClick={() => setConfirmDelete(false)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9.5 4h5l1 3H8.5l1-3z" />
            </svg>
            Delete group
          </button>
        )}
      </div>
    </main>
  );
}
