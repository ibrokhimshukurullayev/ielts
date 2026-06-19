import Link from "next/link";
import { TEST_SECTIONS } from "@/src/entities";
import { Card, ICON_PATHS } from "@/src/shared";

export function TodayRoute() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-accent">Today Route</p>
          <p className="mt-2 text-lg font-bold text-navy">Start your first practice</p>
        </div>
      </div>

      <ol className="mt-5 space-y-3">
        {TEST_SECTIONS.map((section, i) => (
          <li key={section.id}>
            <Link
              href={section.href}
              className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3 transition-colors hover:bg-indigo-50"
            >
              <span className="w-6 text-sm font-bold text-slate-400">{String(i + 1).padStart(2, "0")}</span>
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${section.color}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={ICON_PATHS[section.icon]} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold text-navy">{section.title} practice</span>
                <span className="block text-xs text-slate-500">{section.description}</span>
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ol>
    </Card>
  );
}
