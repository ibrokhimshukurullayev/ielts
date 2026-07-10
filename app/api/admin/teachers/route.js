import bcrypt from "bcryptjs";
import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function GET(request) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      _count: { select: { students: true, groups: true } },
    },
  });

  const result = teachers.map((teacher) => ({
    id: teacher.id,
    name: teacher.name,
    username: teacher.username,
    email: teacher.email,
    avatarUrl: teacher.avatarUrl,
    createdAt: teacher.createdAt,
    studentCount: teacher._count.students,
    groupCount: teacher._count.groups,
  }));

  return adminJson({ teachers: result }, undefined, request);
}

export async function POST(request) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { name, username, email, password } = await request.json();
  if (!name || !username || !password) {
    return adminJson({ error: "Name, username, and password are required." }, { status: 400 }, request);
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    return adminJson({ error: "This username is already taken." }, { status: 409 }, request);
  }
  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return adminJson({ error: "A user with this email already exists." }, { status: 409 }, request);
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const teacher = await prisma.user.create({
    data: { name, username, email: email || null, passwordHash, role: "TEACHER" },
  });

  return adminJson(
    { teacher: { id: teacher.id, name: teacher.name, username: teacher.username, email: teacher.email } },
    { status: 201 },
    request,
  );
}
