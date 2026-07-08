import { TestListPage } from "@/src/widgets";

export function WritingTasksListPage() {
  return (
    <TestListPage
      skill="WRITING"
      title="Writing Tasks"
      subtitle="Choose a task to write."
      searchPlaceholder="Search tasks by title..."
      emptyLabel="No tasks match your search."
      hrefBase="/writing"
    />
  );
}
