/**
 * app/api/me/route.ts
 * GET /api/me
 * Returns the currently authenticated user from the JWT session cookie.
 * Returns 401 if not authenticated or token is invalid/expired.
 */

import { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME);

  if (!cookie?.value) {
    return Response.json(
      { success: false, message: "Not authenticated." },
      { status: 401 }
    );
  }

  const payload = verifyToken(cookie.value);

  if (!payload) {
    return Response.json(
      { success: false, message: "Session expired or invalid. Please sign in again." },
      { status: 401 }
    );
  }

  return Response.json({
    success: true,
    data: {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
    },
  });
}
