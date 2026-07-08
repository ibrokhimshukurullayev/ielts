"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  addStudent,
  getMyStudents,
  getStudentDetail,
  removeStudent,
  searchAvailableStudents,
} from "@/src/features";

const SKILL_LABELS = { reading: "Reading", listening: "Listening", writing: "Writing", speaking: "Speaking" };
const SKILL_COLORS = {
  reading: "#4f46e5",
  listening: "#059669",
  writing: "#d97706",
  speaking: "#db2777",
};

const CHART_WIDTH = 560;
const CHART_HEIGHT = 180;
const PAD_X = 20;
const PAD_Y = 16;
const MAX_BAND = 9;

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function Avatar({ name, active, size = "md" }) {
  const letter = name?.[0]?.toUpperCase() ?? "?";
  const sizeClass = size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-sm";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${sizeClass} ${active ? "bg-success" : "bg-navy"}`}>
      {letter}
    </span>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-navy">{value ?? "—"}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function ProgressChart({ attempts }) {
  const bySkill = {};
  for (const a of attempts) {
    const key = a.skill.toLowerCase();
    if (!bySkill[key]) bySkill[key] = [];
    bySkill[key].push(a);
  }
  const skills = Object.keys(bySkill);
  const innerW = CHART_WIDTH - PAD_X * 2;
  const innerH = CHART_HEIGHT - PAD_Y * 2;

  if (skills.length === 0) {
    return (
      <p className="rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-400">
        No attempts yet — chart appears after the first test.
      </p>
    );
  }

  return (
    <div>
      <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} width="100%" height={CHART_HEIGHT}>
        {[0, 3, 5, 7, 9].map((band) => {
          const y = PAD_Y + innerH - (band / MAX_BAND) * innerH;
          return (
            <g key={band}>
              <line x1={PAD_X} y1={y} x2={CHART_WIDTH - PAD_X} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x={PAD_X - 4} y={y + 4} fontSize="9" fill="#cbd5e1" textAnchor="end">{band}</text>
            </g>
          );
        })}
        {skills.map((skill) => {
          const series = bySkill[skill];
          const pts = series.map((entry, i) => {
            const x = PAD_X + (series.length === 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
            const y = PAD_Y + innerH - (entry.band / MAX_BAND) * innerH;
            return [x, y];
          });
          const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
          const color = SKILL_COLORS[skill] ?? "#94a3b8";
          return (
            <g key={skill}>
              <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4" fill={color} stroke="white" strokeWidth="1.5" />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div key={skill} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-5 rounded-full" style={{ backgroundColor: SKILL_COLORS[skill] ?? "#94a3b8" }} />
            {SKILL_LABELS[skill] ?? skill}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddStudentBox({ onAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(() => {
      searchAvailableStudents(query.trim())
        .then((data) => { setResults(data); setOpen(true); })
        .catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function onDown(e) { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleSelect = async (student) => {
    setError(null);
    setAdding(true);
    try {
      await onAdded(student.id);
      setQuery(""); setResults([]); setOpen(false);
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
      <input type="text" value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Add student by name or username..."
        disabled={adding}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
      />
      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">No unassigned students found.</p>
          ) : results.map((s) => (
            <button key={s.id} type="button" onClick={() => handleSelect(s)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-indigo-50">
              <Avatar name={s.name} active={false} size="sm" />
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

function RankBadge({ rank }) {
  const medal = rank === 1 ? "bg-amber-400 text-white" : rank === 2 ? "bg-slate-300 text-white" : rank === 3 ? "bg-amber-700 text-white" : "bg-slate-100 text-slate-500";
  return (
    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${medal}`}>
      {rank}
    </span>
  );
}

function StudentRow({ student, rank, active, onSelect }) {
  return (
    <tr onClick={() => onSelect(student.id)}
      className={`cursor-pointer border-b border-slate-50 transition-colors last:border-0 ${active ? "bg-indigo-50" : "hover:bg-slate-50/60"}`}>
      <td className="w-10 px-3 py-3.5">
        <RankBadge rank={rank} />
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar name={student.name} active={student.activeToday} />
          <div>
            <p className="text-sm font-semibold text-navy">{student.name}</p>
            <p className="text-xs text-slate-400">@{student.username}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        {student.overallBand != null ? (
          <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-accent">
            Band {student.overallBand}
          </span>
        ) : <span className="text-xs text-slate-300">—</span>}
      </td>
      <td className="px-5 py-3.5 text-xs text-slate-500">{student.attemptCount} attempts</td>
      <td className="px-5 py-3.5">
        {student.activeToday ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Active today
          </span>
        ) : (
          <span className="text-xs text-slate-300">No activity</span>
        )}
      </td>
      <td className="px-4 py-3.5 text-slate-300">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </td>
    </tr>
  );
}

function StudentTable({ students, selectedId, onSelect }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,32,68,0.07)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
            <th className="w-10 px-3 py-3">#</th>
            <th className="px-5 py-3">Student</th>
            <th className="px-5 py-3">Band</th>
            <th className="px-5 py-3">Activity</th>
            <th className="px-5 py-3">Status</th>
            <th className="w-8 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <StudentRow key={s.id} student={s} rank={i + 1} active={s.id === selectedId} onSelect={onSelect} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StudentDetailPanel({ studentId, onRemoved }) {
  const [detail, setDetail] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    setDetail(null);
    setConfirmRemove(false);
    getStudentDetail(studentId).then(setDetail);
  }, [studentId]);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeStudent(studentId);
      onRemoved(studentId);
    } finally {
      setRemoving(false);
    }
  };

  if (!detail) {
    return (
      <div className="mt-4 rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(15,32,68,0.07)]">
        <div className="flex animate-pulse flex-col gap-3">
          <div className="h-5 w-40 rounded-lg bg-slate-100" />
          <div className="h-4 w-24 rounded-lg bg-slate-100" />
          <div className="mt-2 grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 rounded-xl bg-slate-100" />)}
          </div>
        </div>
      </div>
    );
  }

  const { student, attempts } = detail;
  const days = daysUntil(student.examDate);

  const latestBySkill = {};
  for (const a of attempts) {
    const key = a.skill.toLowerCase();
    if (!latestBySkill[key]) latestBySkill[key] = a.band;
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,32,68,0.07)]">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-lg font-extrabold text-white">
            {student.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-lg font-bold text-navy">{student.name}</p>
            <p className="text-sm text-slate-400">@{student.username}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/teacher/chat"
            className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Guruh Chat
          </Link>
          {confirmRemove ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Remove from group?</span>
              <button type="button" onClick={handleRemove} disabled={removing}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-50">
                {removing ? "Removing..." : "Confirm"}
              </button>
              <button type="button" onClick={() => setConfirmRemove(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmRemove(true)}
              className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 7 7 17M7 7l10 10" strokeLinecap="round" />
              </svg>
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 px-6 py-4 sm:grid-cols-4">
        <StatCard label="Target band" value={student.targetBand} />
        <StatCard label="Current band"
          value={Object.keys(latestBySkill).length ? Math.round((Object.values(latestBySkill).reduce((a, b) => a + b, 0) / Object.keys(latestBySkill).length) * 2) / 2 : null} />
        <StatCard label="Weekly hours" value={student.weeklyHours ? `${student.weeklyHours}h` : null} />
        <StatCard label="Exam in"
          value={days != null ? (days > 0 ? `${days}d` : days === 0 ? "Today" : "Past") : null}
          sub={student.examDate ? new Date(student.examDate).toLocaleDateString() : null} />
      </div>

      {/* Skill bands */}
      {Object.keys(latestBySkill).length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-slate-50 px-6 py-3">
          {Object.entries(latestBySkill).map(([skill, band]) => (
            <span key={skill} className="rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: SKILL_COLORS[skill] ?? "#64748b" }}>
              {SKILL_LABELS[skill] ?? skill}: {band}
            </span>
          ))}
          {student.focusSkill && (
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
              Focus: {student.focusSkill}
            </span>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="border-t border-slate-100 px-6 py-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
          Band progress · {attempts.length} attempt{attempts.length !== 1 ? "s" : ""}
        </p>
        <ProgressChart attempts={attempts} />
      </div>
    </div>
  );
}

export function TeacherDashboardPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  const loadStudents = (preferredId) => {
    setLoading(true);
    getMyStudents()
      .then((data) => {
        setStudents(data);
        if (preferredId) setSelectedId(preferredId);
        else setSelectedId((prev) => (data.some((s) => s.id === prev) ? prev : null));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStudents(); }, []); // eslint-disable-line

  const handleAdded = async (studentId) => { await addStudent(studentId); loadStudents(studentId); };
  const handleRemoved = () => { setSelectedId(null); loadStudents(); };

  const activeToday = students.filter((s) => s.activeToday).length;

  const groupSections = [];
  const ungrouped = [];
  for (const s of students) {
    if (!s.groups || s.groups.length === 0) {
      ungrouped.push(s);
      continue;
    }
    for (const g of s.groups) {
      let section = groupSections.find((sec) => sec.id === g.id);
      if (!section) {
        section = { id: g.id, name: g.name, students: [] };
        groupSections.push(section);
      }
      section.students.push(s);
    }
  }

  return (
    <main className="fade-page max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
      {/* Title row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">My Students</h1>
          <p className="mt-1 text-sm text-slate-500">Ranked by band within each group — top performers first.</p>
        </div>
        <AddStudentBox onAdded={handleAdded} />
      </div>

      {/* Summary chips */}
      {!loading && students.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            {students.length} student{students.length !== 1 ? "s" : ""}
          </span>
          {activeToday > 0 && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-success">
              {activeToday} active today
            </span>
          )}
        </div>
      )}

      {/* Student tables, ranked per group */}
      <div className="mt-4 space-y-6">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-white shadow-sm" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="mx-auto text-slate-300">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-3 text-sm font-semibold text-slate-400">No students yet</p>
            <p className="mt-1 text-xs text-slate-300">Search by name or username above to add your first student.</p>
          </div>
        ) : (
          <>
            {groupSections.map((section) => (
              <div key={section.id}>
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-sm font-bold text-navy">{section.name}</h2>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    {section.students.length}
                  </span>
                </div>
                <StudentTable students={section.students} selectedId={selectedId} onSelect={setSelectedId} />
              </div>
            ))}

            {ungrouped.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-sm font-bold text-navy">Ungrouped</h2>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                    {ungrouped.length}
                  </span>
                </div>
                <StudentTable students={ungrouped} selectedId={selectedId} onSelect={setSelectedId} />
              </div>
            )}
          </>
        )}
      </div>

      {selectedId && <StudentDetailPanel studentId={selectedId} onRemoved={handleRemoved} />}
    </main>
  );
}
