async function api(path, options) {
  const response = await fetch(`/api/auth/${path}`, {
    method: options?.method ?? "GET",
    headers: { "Content-Type": "application/json" },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "Something went wrong.");
  }
  return data;
}

export async function hasAnyUser() {
  const { hasAny } = await api("has-any");
  return hasAny;
}

export async function register(form) {
  const { user } = await api("register", { method: "POST", body: form });
  return user;
}

export async function login({ username, password }) {
  const { user } = await api("login", { method: "POST", body: { username, password } });
  return user;
}

export async function logout() {
  await api("logout", { method: "POST" });
}

export async function getCurrentUser() {
  const { user } = await api("me");
  return user;
}

export async function updateProfile(updates) {
  const { user } = await api("me", { method: "PATCH", body: updates });
  return user;
}

export async function uploadTeacherPhoto(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/teacher/avatar", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "Could not upload photo.");
  }
  return data.user;
}
