import { prisma } from "@/src/shared/lib/prisma";

export async function GET(_request, { params }) {
  const { slug } = await params;

  const test = await prisma.test.findUnique({ where: { slug } });
  if (!test) {
    return Response.json({ error: "Test not found." }, { status: 404 });
  }

  const content = typeof test.content === "string" ? JSON.parse(test.content) : test.content;
  return Response.json({ test: { ...test, content } });
}
