import { handleUpload } from "@vercel/blob/client";
import { adminJson, adminPreflight, isAdminRequest } from "@/src/shared/lib/adminAuth";

export const runtime = "nodejs";

export async function OPTIONS(request) {
  return adminPreflight(request);
}

// Audio files (full listening tests) routinely exceed Vercel's 4.5MB serverless
// request body limit, so this issues a short-lived token and lets the browser
// upload straight to Blob storage instead of proxying the bytes through here.
export async function POST(request) {
  const body = await request.json();

  // The token request comes from the admin's browser (carries x-admin-key);
  // the upload-completed callback comes server-to-server from Vercel Blob
  // and never carries that header, so only gate the token step.
  if (body.type !== "blob.upload-completed" && !isAdminRequest(request)) {
    return adminJson({ error: "Invalid admin key." }, { status: 401 }, request);
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["audio/mpeg", "audio/wav", "audio/mp4", "audio/ogg", "audio/x-m4a"],
        maximumSizeInBytes: 100 * 1024 * 1024,
        addRandomSuffix: true,
      }),
    });
    return adminJson(jsonResponse, undefined, request);
  } catch (error) {
    return adminJson({ error: error.message }, { status: 400 }, request);
  }
}
