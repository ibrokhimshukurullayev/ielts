"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, ICON_PATHS } from "@/src/shared";
import { getCompletedTestIds } from "@/src/features";

export function TestGrid({ skill, icon, iconBg, searchPlaceholder, emptyLabel, hrefBase }) {
  const [tests, setTests] = useState([]);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/tests?skill=${skill}`).then((res) => res.json()),
      getCompletedTestIds(),
    ])
      .then(([testsData, completed]) => {
        setTests(testsData.tests ?? []);
        setCompletedIds(new Set(completed));
      })
      .finally(() => setLoading(false));
  }, [skill]);

  const filtered = tests.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="relative w-full sm:w-72">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3-3" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {loading && <p className="text-sm text-slate-500">Loading...</p>}
        {!loading && filtered.length === 0 && <p className="text-sm text-slate-500">{emptyLabel}</p>}
        {filtered.map((test) => {
          const isCompleted = completedIds.has(test.id);
          return (
            <Link key={test.id} href={`${hrefBase}/${test.slug}`}>
              <Card className="flex h-full flex-col transition-colors hover:border-accent hover:bg-indigo-50">
                <div className="flex items-start justify-between gap-2">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={ICON_PATHS[icon]} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {isCompleted && (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                      Retake
                    </span>
                  )}
                </div>
                <span className="mt-4 text-base font-bold text-navy">{test.title}</span>
                {isCompleted ? (
                  <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-success">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Completed
                  </span>
                ) : (
                  <span className="mt-auto pt-4 text-sm font-semibold text-accent">Start →</span>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
