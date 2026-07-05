import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function PATCH(request, { params }) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { id } = await params;
  const { teacherId } = await request.json();

  const user = await prisma.user.update({
    where: { id },
    data: { teacherId: teacherId || null },
  });

  return adminJson({ user: { id: user.id, teacherId: user.teacherId } }, undefined, request);
}
