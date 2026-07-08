import { cookies } from "next/headers";
import { prisma } from "./prisma";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  setSessionCookies,
  verifyAccessToken,
  verifyRefreshToken,
} from "./session";

export function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function getSessionUser() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  let userId = accessToken ? await verifyAccessToken(accessToken) : null;

  if (!userId) {
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
    const record = await verifyRefreshToken(refreshToken);
    if (!record) return null;

    userId = record.userId;
    // Access token expired but the refresh token is still valid — rotate both
    // transparently so the caller never has to think about token expiry.
    await setSessionCookies(cookieStore, userId, { previousRefreshToken: refreshToken });
  }

  return prisma.user.findUnique({ where: { id: userId } });
}
