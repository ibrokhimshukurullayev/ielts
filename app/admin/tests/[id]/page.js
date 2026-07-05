import { AdminTestEditorPage } from "@/src/views";

export default async function Page({ params }) {
  const { id } = await params;
  return <AdminTestEditorPage testId={id} />;
}
