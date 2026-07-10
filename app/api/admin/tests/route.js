import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function GET(request) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { searchParams } = new URL(request.url);
  const skill = searchParams.get("skill");

  const tests = await prisma.test.findMany({
    where: skill ? { skill: skill.toUpperCase() } : undefined,
    orderBy: { createdAt: "asc" },
    select: { id: true, skill: true, slug: true, title: true, createdAt: true },
  });
  return adminJson({ tests }, undefined, request);
}

export async function POST(request) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const { skill, slug, title, content } = await request.json();
  if (!skill || !slug || !title) {
    return adminJson({ error: "skill, slug and title are required." }, { status: 400 }, request);
  }

  const test = await prisma.test.create({
    data: { skill: skill.toUpperCase(), slug, title, content: content ?? {} },
  });
  return adminJson({ test }, undefined, request);
}
