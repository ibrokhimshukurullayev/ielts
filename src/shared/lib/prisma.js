import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Works with a local file (dev: DATABASE_URL="file:./dev.db") and with a remote
// Turso database (prod: DATABASE_URL="libsql://...", DATABASE_AUTH_TOKEN set) —
// unlike better-sqlite3, this has no native binary to bundle for serverless.
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
