"use client";

import Link from "next/link";
import { useState } from "react";
import { LISTENING_SECTIONS, READING_PARTS, TASK1, TASK2 } from "@/src/features";
import { Badge, Card } from "@/src/shared";

const FILTER_TABS = [
  { key: "real-exam", label: "Real Exam", enabled: true },
  { key: "cambridge", label: "Cambridge", enabled: false },
  { key: "gold", label: "Gold", enabled: false },
  { key: "mock", label: "Mock", enabled: false },
];

const SKILL_TABS = [
  { key: "reading", label: "Reading" },
  { key: "listening", label: "Listening" },
  { key: "writing", label: "Writing" },
];

function getTests(skill) {
  if (skill === "reading") {
    return [
      {
        id: "reading-1",
        title: "The Evolution of Urban Transport",
        meta: `${READING_PARTS.length} Passages · 39 Questions`,
        href: "/reading/urban-transport",
      },
    ];
  }
  if (skill === "listening") {
    return [
      {
        id: "listening-1",
        title: `Listening Practice — ${LISTENING_SECTIONS.length} Sections`,
        meta: LISTENING_SECTIONS[0]?.title ?? "Full Test",
        href: "/listening/campus-and-community",
      },
    ];
  }
  return [
    { id: "writing-1", title: TASK1.title, meta: `Chart description · min ${TASK1.minWords} words`, href: "/writing/task-1" },
    { id: "writing-2", title: TASK2.title, meta: `Essay · min ${TASK2.minWords} words`, href: "/writing/task-2" },
  ];
}

export function TestsPage() {
  const [skill, setSkill] = useState("reading");
  const [search, setSearch] = useState("");

  const tests = getTests(skill).filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="fade-page mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <span
            key={tab.key}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold ${
              tab.enabled
                ? "border-accent bg-indigo-50 text-accent"
                : "border-slate-200 text-slate-400"
            }`}
          >
            {tab.label}
            {!tab.enabled && <Badge tone="neutral">Soon</Badge>}
          </span>
        ))}
      </div>

      <Card className="mt-6">
        <div className="flex border-b border-slate-100">
          {SKILL_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSkill(tab.key)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                skill === tab.key ? "border-accent text-accent" : "border-transparent text-slate-500 hover:text-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tests by title..."
          className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
        />

        <h2 className="mt-6 text-xs font-bold uppercase tracking-wide text-slate-400">
          {SKILL_TABS.find((t) => t.key === skill)?.label} Question Sets
        </h2>

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tests.length === 0 && <p className="text-sm text-slate-500">No tests match your search.</p>}
          {tests.map((test) => (
            <Link
              key={test.id}
              href={test.href}
              className="flex flex-col rounded-xl border border-slate-200 px-4 py-4 transition-colors hover:border-accent hover:bg-indigo-50"
            >
              <span className="text-sm font-bold text-navy">{test.title}</span>
              <span className="mt-1 text-xs text-slate-500">{test.meta}</span>
              <span className="mt-3 text-sm font-semibold text-accent">Start →</span>
            </Link>
          ))}
        </div>
      </Card>
    </main>
  );
}
