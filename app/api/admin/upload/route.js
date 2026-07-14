import { put } from "@vercel/blob";
import { adminJson, adminPreflight, isAdminRequest, unauthorizedAdminResponse } from "@/src/shared/lib/adminAuth";

export const runtime = "nodejs";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

export async function POST(request) {
  if (!isAdminRequest(request)) return unauthorizedAdminResponse(request);

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return adminJson({ error: "Fayl yuklanmadi." }, { status: 400 }, request);
  }

  const ext = file.name.split(".").pop().toLowerCase();
  if (!["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
    return adminJson({ error: "Faqat rasm fayllar qabul qilinadi (jpg, png, webp, gif)." }, { status: 400 }, request);
  }

  const filename = `writing/task1-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const blob = await put(filename, file, { access: "public", addRandomSuffix: false });

  return adminJson({ url: blob.url }, undefined, request);
}
