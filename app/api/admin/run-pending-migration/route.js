import { prisma } from "@/src/shared/lib/prisma";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export const runtime = "nodejs";

const REQUIRED_COLUMNS_BY_TABLE = {
  User: {
    photoUrl: "TEXT",
    avatarUrl: "TEXT",
  },
  WritingReview: {
    taskScore: "REAL",
    coherenceScore: "REAL",
    lexicalScore: "REAL",
    grammarScore: "REAL",
  },
};

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function POST(request) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const added = [];
  const alreadyPresent = [];

  for (const [table, columns] of Object.entries(REQUIRED_COLUMNS_BY_TABLE)) {
    const existing = await prisma.$queryRawUnsafe(`PRAGMA table_info("${table}")`);
    const existingNames = new Set(existing.map((c) => c.name));

    for (const [column, type] of Object.entries(columns)) {
      if (!existingNames.has(column)) {
        await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${type}`);
        added.push(`${table}.${column}`);
      } else {
        alreadyPresent.push(`${table}.${column}`);
      }
    }
  }

  return adminJson({ added, alreadyPresent }, undefined, request);
}
