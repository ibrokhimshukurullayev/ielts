async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export const chatApi = {
  // Group board
  getGroup: () => apiFetch("/api/group"),

  createPost: (text) =>
    apiFetch("/api/group/posts", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  addComment: (postId, text) =>
    apiFetch(`/api/group/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
};
