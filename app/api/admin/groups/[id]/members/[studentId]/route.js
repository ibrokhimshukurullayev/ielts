import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function DELETE(request, { params }) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { id, studentId } = await params;
  await prisma.groupMember.deleteMany({
    where: { groupId: id, studentId },
  });

  return adminJson({ ok: true }, undefined, request);
}
