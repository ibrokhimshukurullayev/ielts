// This endpoint is deprecated. Use /api/conversations/[id]/messages instead.
export async function GET() {
  return Response.json({ error: "Use /api/conversations/:id/messages" }, { status: 410 });
}
export async function POST() {
  return Response.json({ error: "Use /api/conversations/:id/messages" }, { status: 410 });
}
