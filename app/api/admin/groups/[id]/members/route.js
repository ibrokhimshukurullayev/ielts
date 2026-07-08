import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function POST(request, { params }) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { id } = await params;
  const { studentId } = await request.json();
  if (!studentId) {
    return adminJson({ error: "studentId is required." }, { status: 400 }, request);
  }

  const member = await prisma.groupMember.create({
    data: { groupId: id, studentId },
    include: { student: { select: { id: true, name: true, username: true } } },
  });

  return adminJson({ member }, { status: 201 }, request);
}
