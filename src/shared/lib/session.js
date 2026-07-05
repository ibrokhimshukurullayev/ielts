import { jwtVerify, SignJWT } from "jose";

const SESSION_COOKIE = "ielts_session";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createSessionToken(userId) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
