import Link from "next/link";
import { LISTENING_SECTIONS } from "@/src/features";
import { Card } from "@/src/shared";

const LISTENING_TESTS = [
  {
    id: "campus-and-community",
    title: "Campus and Community",
    meta: `${LISTENING_SECTIONS.length} Sections · 40 Questions`,
  },
];

export function ListeningTestsListPage() {
  return (
    <main className="fade-page mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-navy">Listening Tests</h1>
      <p className="mt-1 text-sm text-slate-500">Choose a listening test to start.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {LISTENING_TESTS.map((test) => (
          <Link key={test.id} href={`/listening/${test.id}`}>
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
