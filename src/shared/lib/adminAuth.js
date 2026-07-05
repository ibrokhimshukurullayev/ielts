function corsHeaders(request) {
  const origin = request?.headers?.get?.("origin") ?? "";
  const allowed = /^http:\/\/localhost:\d+$/.test(origin)
    ? origin
    : (process.env.ADMIN_APP_ORIGIN ?? "");
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-key",
  };
}

export function adminJson(data, init, request) {
  return Response.json(data, {
    ...init,
    headers: { ...corsHeaders(request), ...(init?.headers ?? {}) },
  });
}

export function adminPreflight(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export function isAdminRequest(request) {
  const key = request.headers.get("x-admin-key");
  return Boolean(key) && key === process.env.ADMIN_API_KEY;
}

export function unauthorizedAdminResponse(request) {
  return adminJson({ error: "Invalid admin key." }, { status: 401 }, request);
}
