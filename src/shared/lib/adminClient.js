"use client";

const KEY_STORAGE = "ielts_admin_key";

export function getAdminKey() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(KEY_STORAGE) ?? "";
}

export function setAdminKey(key) {
  window.sessionStorage.setItem(KEY_STORAGE, key);
}

export function clearAdminKey() {
  window.sessionStorage.removeItem(KEY_STORAGE);
}

export async function adminFetch(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": getAdminKey(),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    clearAdminKey();
    throw new Error("Invalid admin key.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed.");
  }
  return data;
}

export async function verifyAdminKey(key) {
  const response = await fetch("/api/admin/stats", {
    headers: { "x-admin-key": key },
  });
  return response.ok;
}
