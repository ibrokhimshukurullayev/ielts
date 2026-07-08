import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function GET(request, { params }) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { id } = await params;

  const [groups, students] = await Promise.all([
    prisma.group.findMany({
      where: { teacherId: id },
      orderBy: { createdAt: "asc" },
      include: {
        members: {
          include: { student: { select: { id: true, name: true, username: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT", teacherId: id },
      select: { id: true, name: true, username: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return adminJson({ groups, students }, undefined, request);
}

export async function POST(request, { params }) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { id } = await params;
  const { name } = await request.json();
  if (!name?.trim()) {
    return adminJson({ error: "Group name is required." }, { status: 400 }, request);
  }

  const group = await prisma.group.create({
    data: { teacherId: id, name: name.trim() },
    include: { members: true },
  });

  return adminJson({ group }, { status: 201 }, request);
}
