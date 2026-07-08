import { cookies } from "next/headers";
import { REFRESH_TOKEN_COOKIE, clearSessionCookies, revokeRefreshToken } from "@/src/shared/lib/session";

export async function POST() {
  const cookieStore = await cookies();
  await revokeRefreshToken(cookieStore.get(REFRESH_TOKEN_COOKIE)?.value);
  clearSessionCookies(cookieStore);
  return Response.json({ ok: true });
}
