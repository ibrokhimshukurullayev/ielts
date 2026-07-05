"use client";

import { TestGrid } from "./TestGrid";

export function TestListPage({ skill, icon, iconBg, title, subtitle, searchPlaceholder, emptyLabel, hrefBase }) {
  return (
    <main className="fade-page px-4 py-10 sm:px-6 lg:px-10">
      <div>
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="mt-6">
        <TestGrid
          skill={skill}
          icon={icon}
          iconBg={iconBg}
          searchPlaceholder={searchPlaceholder}
          emptyLabel={emptyLabel}
          hrefBase={hrefBase}
        />
      </div>
    </main>
  );
}
