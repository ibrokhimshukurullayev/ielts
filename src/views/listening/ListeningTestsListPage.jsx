import { TestListPage } from "@/src/widgets";

export function ListeningTestsListPage() {
  return (
    <TestListPage
      skill="LISTENING"
      title="Listening Tests"
      subtitle="Choose a listening test to start."
      searchPlaceholder="Search tests by title..."
      emptyLabel="No tests match your search."
      hrefBase="/listening"
    />
  );
}
