import crypto from "crypto";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "./prisma";

const ACCESS_TOKEN_COOKIE = "ielts_session";
const REFRESH_TOKEN_COOKIE = "ielts_refresh";
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// ── Access token (short-lived JWT, never persisted) ──────────────────────────

export async function createAccessToken(userId) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(secret);
}

export async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

// ── Refresh token (long-lived opaque token, stored hashed in DB) ────────────

function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function issueRefreshToken(userId) {
  const rawToken = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await prisma.refreshToken.create({
    data: { userId, tokenHash: hashToken(rawToken), expiresAt },
  });
  return { rawToken, expiresAt };
}

export async function verifyRefreshToken(rawToken) {
  if (!rawToken) return null;
  const record = await prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(rawToken) } });
  if (!record || record.revokedAt || record.expiresAt < new Date()) return null;
  return record;
}

export async function revokeRefreshToken(rawToken) {
  if (!rawToken) return;
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(rawToken) },
    data: { revokedAt: new Date() },
  });
}

// ── Cookie helpers ────────────────────────────────────────────────────────

export async function setSessionCookies(cookieStore, userId, { previousRefreshToken } = {}) {
  if (previousRefreshToken) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(previousRefreshToken) },
      data: { revokedAt: new Date() },
    });
  }

  const accessToken = await createAccessToken(userId);
  const { rawToken: refreshToken, expiresAt } = await issueRefreshToken(userId);

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookies(cookieStore) {
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

// Legacy aliases kept for the one route that reads the cookie directly.
export const createSessionToken = createAccessToken;
export const verifySessionToken = verifyAccessToken;
export const SESSION_COOKIE = ACCESS_TOKEN_COOKIE;

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE };
