import Link from "next/link";
import { READING_PARTS } from "@/src/features";
import { Card } from "@/src/shared";

const READING_TESTS = [
  {
    id: "urban-transport",
    title: "The Evolution of Urban Transport",
    meta: `${READING_PARTS.length} Passages · 39 Questions · 20 min per passage`,
  },
];

export function ReadingTestsListPage() {
  return (
    <main className="fade-page mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-navy">Reading Tests</h1>
      <p className="mt-1 text-sm text-slate-500">Choose a reading test to start.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {READING_TESTS.map((test) => (
          <Link key={test.id} href={`/reading/${test.id}`}>
            <Card className="flex h-full flex-col transition-colors hover:bg-indigo-50">
              <span className="text-base font-bold text-navy">{test.title}</span>
              <span className="mt-1 text-sm text-slate-500">{test.meta}</span>
              <span className="mt-4 text-sm font-semibold text-accent">Start →</span>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
