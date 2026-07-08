import { apiFetch } from "@/src/shared";

export async function getMyGroups() {
  const { groups } = await apiFetch("/api/teacher/groups");
  return groups;
}

export async function createGroup(name) {
  const { group } = await apiFetch("/api/teacher/groups", { method: "POST", body: { name } });
  return group;
}

export async function getGroupDetail(groupId) {
  const { group } = await apiFetch(`/api/teacher/groups/${groupId}`);
  return group;
}

export async function renameGroup(groupId, name) {
  const { group } = await apiFetch(`/api/teacher/groups/${groupId}`, { method: "PATCH", body: { name } });
  return group;
}

export async function deleteGroup(groupId) {
  await apiFetch(`/api/teacher/groups/${groupId}`, { method: "DELETE" });
}

export async function addGroupMember(groupId, studentId) {
  const { member } = await apiFetch(`/api/teacher/groups/${groupId}/members`, { method: "POST", body: { studentId } });
  return member;
}

export async function removeGroupMember(groupId, studentId) {
  await apiFetch(`/api/teacher/groups/${groupId}/members/${studentId}`, { method: "DELETE" });
}
