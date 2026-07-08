import { TestListPage } from "@/src/widgets";

export function ReadingTestsListPage() {
  return (
    <TestListPage
      skill="READING"
      title="Reading Tests"
      subtitle="Choose a reading test to start."
      searchPlaceholder="Search tests by title..."
      emptyLabel="No tests match your search."
      hrefBase="/reading"
    />
  );
}
