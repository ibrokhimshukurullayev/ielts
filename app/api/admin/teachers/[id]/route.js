import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function PATCH(request, { params }) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { id } = await params;
  const body = await request.json();

  const allowed = ["avatarUrl", "name"];
  const data = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  if (Object.keys(data).length === 0) {
    return adminJson({ error: "No updatable fields provided." }, { status: 400 }, request);
  }

  const teacher = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, username: true, email: true, avatarUrl: true },
  });

  return adminJson({ teacher }, undefined, request);
}
