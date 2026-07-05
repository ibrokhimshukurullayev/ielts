"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/src/shared/lib/adminClient";
import { Button, Card, Container } from "@/src/shared/ui";
import { AdminGate } from "./AdminGate";

const SKILL_LABELS = { READING: "Reading", LISTENING: "Listening" };

function TestsTable({ skill, tests, onDelete }) {
  const filtered = tests.filter((t) => t.skill === skill);
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-navy">{SKILL_LABELS[skill]} tests</h2>
        <Link href={`/admin/tests/new?skill=${skill}`}>
          <Button variant="outline">+ New {SKILL_LABELS[skill].toLowerCase()} test</Button>
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold text-slate-500">
            <th className="py-2">Slug</th>
            <th className="py-2">Title</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 text-center text-slate-400">No tests yet.</td>
            </tr>
          )}
          {filtered.map((test) => (
            <tr key={test.id} className="border-t border-slate-100">
              <td className="py-2">{test.slug}</td>
              <td className="py-2">{test.title}</td>
              <td className="py-2 text-right">
                <Link href={`/admin/tests/${test.id}`} className="mr-3 font-semibold text-accent">Edit</Link>
                <button type="button" onClick={() => onDelete(test.id)} className="font-semibold text-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function AdminTestsList() {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState(null);

  const load = () => {
    adminFetch("/api/admin/tests").then((data) => setTests(data.tests)).catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this test?")) return;
    await adminFetch(`/api/admin/tests/${id}`, { method: "DELETE" });
    load();
  };

  if (error) return <p className="text-sm text-danger">{error}</p>;

  return (
    <Container className="flex flex-col gap-6 py-8">
      <h1 className="text-xl font-bold text-navy">Test management</h1>
      <TestsTable skill="READING" tests={tests} onDelete={handleDelete} />
      <TestsTable skill="LISTENING" tests={tests} onDelete={handleDelete} />
    </Container>
  );
}

export function AdminTestsListPage() {
  return (
    <AdminGate>
      <AdminTestsList />
    </AdminGate>
  );
}
