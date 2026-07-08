import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function PATCH(request, { params }) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { id } = await params;
  const { name } = await request.json();
  if (!name?.trim()) {
    return adminJson({ error: "Group name is required." }, { status: 400 }, request);
  }

  const group = await prisma.group.update({
    where: { id },
    data: { name: name.trim() },
  });

  return adminJson({ group }, undefined, request);
}

export async function DELETE(request, { params }) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { id } = await params;
  await prisma.group.delete({ where: { id } });
  return adminJson({ ok: true }, undefined, request);
}
