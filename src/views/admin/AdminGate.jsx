"use client";

import { useState } from "react";
import { useLocalStorage } from "@/src/shared/lib";
import { getAdminKey, setAdminKey, verifyAdminKey } from "@/src/shared/lib/adminClient";
import { Button, Card } from "@/src/shared/ui";

export function AdminGate({ children }) {
  const [authed, setAuthed] = useLocalStorage("admin_authed", false);
  const [key, setKey] = useState("");
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  if (authed && getAdminKey()) {
    return children;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setChecking(true);
    try {
      const valid = await verifyAdminKey(key);
      if (!valid) {
        setError("Invalid admin key.");
        return;
      }
      setAdminKey(key);
      setAuthed(true);
    } catch {
      setError("Couldn't reach the API.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <Card className="flex w-80 flex-col gap-3">
        <h1 className="text-lg font-bold text-navy">Admin access</h1>
        <p className="text-sm text-slate-500">Enter the admin key to continue.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={checking}>{checking ? "Checking..." : "Enter"}</Button>
        </form>
      </Card>
    </div>
  );
}
