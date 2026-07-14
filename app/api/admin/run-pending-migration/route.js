import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export const runtime = "nodejs";

const REQUIRED_COLUMNS = {
  photoUrl: "TEXT",
  avatarUrl: "TEXT",
};

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function POST(request) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const existing = await prisma.$queryRawUnsafe(`PRAGMA table_info("User")`);
  const existingNames = new Set(existing.map((c) => c.name));

  const added = [];
  for (const [column, type] of Object.entries(REQUIRED_COLUMNS)) {
    if (!existingNames.has(column)) {
      await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "${column}" ${type}`);
      added.push(column);
    }
  }

  return adminJson({ added, alreadyPresent: Object.keys(REQUIRED_COLUMNS).filter((c) => !added.includes(c)) }, undefined, request);
}
