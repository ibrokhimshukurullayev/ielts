import Link from "next/link";
import { TASK1, TASK2 } from "@/src/features";
import { Card } from "@/src/shared";

const WRITING_TASKS = [
  { id: "task-1", title: TASK1.title, meta: `Chart description · min ${TASK1.minWords} words · 20 min` },
  { id: "task-2", title: TASK2.title, meta: `Essay · min ${TASK2.minWords} words · 40 min` },
];

export function WritingTasksListPage() {
  return (
    <main className="fade-page mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-navy">Writing Tasks</h1>
      <p className="mt-1 text-sm text-slate-500">Choose a task to write.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {WRITING_TASKS.map((task) => (
          <Link key={task.id} href={`/writing/${task.id}`}>
            <Card className="flex h-full flex-col transition-colors hover:bg-indigo-50">
              <span className="text-base font-bold text-navy">{task.title}</span>
              <span className="mt-1 text-sm text-slate-500">{task.meta}</span>
              <span className="mt-4 text-sm font-semibold text-accent">Start →</span>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
