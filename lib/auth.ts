/**
 * lib/auth.ts
 * JWT sign / verify helpers.
 * Tokens are stored in httpOnly cookies — never in localStorage.
 */

import jwt from "jsonwebtoken";
import type { JWTPayload } from "@/types/auth";

const JWT_SECRET = process.env.JWT_SECRET as string;
const COOKIE_NAME = "albus_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables.");
}

// ── Token operations ──────────────────────────────────────────────────────────

/** Sign a JWT containing the user's public identifiers. */
export function signToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/** Verify a JWT and return its decoded payload, or null if invalid/expired. */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// ── Cookie helpers ────────────────────────────────────────────────────────────

/** Build the Set-Cookie header value for the session cookie. */
export function buildSessionCookie(token: string): string {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  // Add Secure flag in production
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

/** Build a cookie header that clears the session (for logout). */
export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`;
}

export { COOKIE_NAME };
