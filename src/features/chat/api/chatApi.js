import { apiFetch } from "@/src/shared";

export const chatApi = {
  getMyGroups: () => apiFetch("/api/student/groups"),

  getGroup: (groupId) => apiFetch(`/api/groups/${groupId}`),

  getPosts: (groupId) => apiFetch(`/api/groups/${groupId}/posts`),

  createPost: (groupId, text) =>
    apiFetch(`/api/groups/${groupId}/posts`, { method: "POST", body: { text } }),

  editPost: (groupId, postId, text) =>
    apiFetch(`/api/groups/${groupId}/posts/${postId}`, { method: "PATCH", body: { text } }),

  addComment: (groupId, postId, text) =>
    apiFetch(`/api/groups/${groupId}/posts/${postId}/comments`, { method: "POST", body: { text } }),
};
