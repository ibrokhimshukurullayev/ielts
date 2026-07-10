import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/src/shared/lib/prisma";
import { getSessionUser, sanitizeUser } from "@/src/shared/lib/getSessionUser";

export const runtime = "nodejs";

export async function POST(request) {
  const user = await getSessionUser();
  if (!user || user.role !== "TEACHER") {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file uploaded." }, { status: 400 });
  }

  const ext = file.name.split(".").pop().toLowerCase();
  if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
    return Response.json({ error: "Only jpg, png or webp images are accepted." }, { status: 400 });
  }

  const filename = `${user.id}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "teachers");

  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const avatarUrl = `/uploads/teachers/${filename}`;
  const updated = await prisma.user.update({ where: { id: user.id }, data: { avatarUrl } });

  return Response.json({ user: sanitizeUser(updated) });
}
