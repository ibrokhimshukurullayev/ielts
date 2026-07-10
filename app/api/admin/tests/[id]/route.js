import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function GET(request, { params }) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { id } = await params;
  const test = await prisma.test.findUnique({ where: { id } });
  if (!test) {
    return adminJson({ error: "Test not found." }, { status: 404 }, request);
  }
  return adminJson({ test }, undefined, request);
}

export async function PATCH(request, { params }) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { id } = await params;
  const { skill, slug, title, content } = await request.json();

  const test = await prisma.test.update({
    where: { id },
    data: {
      ...(skill && { skill: skill.toUpperCase() }),
      ...(slug && { slug }),
      ...(title && { title }),
      ...(content !== undefined && { content }),
    },
  });
  return adminJson({ test }, undefined, request);
}

export async function DELETE(request, { params }) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { id } = await params;
  await prisma.test.delete({ where: { id } });
  return adminJson({ ok: true }, undefined, request);
}
