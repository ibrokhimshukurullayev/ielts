"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/src/shared/lib/adminClient";
import { Container } from "@/src/shared/ui";
import { TestForm } from "@/src/features/admin-test-editor";
import { AdminGate } from "./AdminGate";

function EditorBody({ testId, initialSkill }) {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(Boolean(testId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!testId) return;
    adminFetch(`/api/admin/tests/${testId}`)
      .then((data) => setTest(data.test))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [testId]);

  if (loading) return <p className="text-sm text-slate-500">Loading...</p>;
  if (error) return <p className="text-sm text-danger">{error}</p>;

  return (
    <Container className="flex flex-col gap-4 py-8">
      <Link href="/admin/tests" className="text-sm font-semibold text-accent">&larr; Back to tests</Link>
      <h1 className="text-xl font-bold text-navy">{test ? `Edit: ${test.title}` : "New test"}</h1>
      <TestForm test={test ?? (initialSkill ? { skill: initialSkill } : null)} />
    </Container>
  );
}

export function AdminTestEditorPage({ testId, initialSkill }) {
  return (
    <AdminGate>
      <EditorBody testId={testId} initialSkill={initialSkill} />
    </AdminGate>
  );
}
