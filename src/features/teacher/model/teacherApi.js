async function api(path, options) {
  const response = await fetch(path, {
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

export async function getMyStudents() {
  const { students } = await api("/api/teacher/students");
  return students;
}

export async function searchAvailableStudents(query) {
  const { students } = await api(`/api/teacher/students/search?q=${encodeURIComponent(query)}`);
  return students;
}

export async function addStudent(studentId) {
  const { student } = await api("/api/teacher/students", { method: "POST", body: { studentId } });
  return student;
}

export async function getStudentDetail(studentId) {
  return api(`/api/teacher/students/${studentId}`);
}

export async function removeStudent(studentId) {
  await api(`/api/teacher/students/${studentId}`, { method: "DELETE" });
}
