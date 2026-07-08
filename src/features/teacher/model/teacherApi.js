import { apiFetch } from "@/src/shared";

export async function getMyStudents() {
  const { students } = await apiFetch("/api/teacher/students");
  return students;
}

export async function searchAvailableStudents(query) {
  const { students } = await apiFetch(`/api/teacher/students/search?q=${encodeURIComponent(query)}`);
  return students;
}

export async function addStudent(studentId) {
  const { student } = await apiFetch("/api/teacher/students", { method: "POST", body: { studentId } });
  return student;
}

export async function getStudentDetail(studentId) {
  return apiFetch(`/api/teacher/students/${studentId}`);
}

export async function removeStudent(studentId) {
  await apiFetch(`/api/teacher/students/${studentId}`, { method: "DELETE" });
}
