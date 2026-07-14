import { put } from "@vercel/blob";
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

  const filename = `teachers/${user.id}-${Date.now()}.${ext}`;
  const blob = await put(filename, file, { access: "public", addRandomSuffix: false });

  const updated = await prisma.user.update({ where: { id: user.id }, data: { avatarUrl: blob.url } });

  return Response.json({ user: sanitizeUser(updated) });
}
