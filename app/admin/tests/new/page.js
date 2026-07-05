import { AdminTestEditorPage } from "@/src/views";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  return <AdminTestEditorPage initialSkill={params?.skill?.toUpperCase()} />;
}
