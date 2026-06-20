/**
 * app/api/login/route.ts
 * POST /api/login
 * Authenticates a user and issues a signed httpOnly session cookie.
 */

import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, buildSessionCookie } from "@/lib/auth";
import type { LoginBody, PublicUser } from "@/types/auth";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export async function POST(request: NextRequest) {
  try {
    const body: LoginBody = await request.json();
    const { email, password } = body;

    // ── Validate inputs ───────────────────────────────────────────────────────

    if (!email?.trim()) {
      return Response.json(
        { success: false, message: "Email address is required.", field: "email" },
        { status: 400 }
      );
    }

    if (!password?.trim()) {
      return Response.json(
        { success: false, message: "Password is required.", field: "password" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return Response.json(
        { success: false, message: "Please enter a valid email address.", field: "email" },
        { status: 400 }
      );
    }

    // ── Look up user ──────────────────────────────────────────────────────────

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Generic message for not-found / wrong-password to prevent user enumeration
    if (!user) {
      return Response.json(
        { success: false, message: "No account found with that email address. Double-check your email or sign up.", field: "email" },
        { status: 401 }
      );
    }

    // ── Check password ────────────────────────────────────────────────────────

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return Response.json(
        { success: false, message: "Incorrect password. Please try again or use 'Forgot password'.", field: "password" },
        { status: 401 }
      );
    }

    // ── Reject unverified accounts ────────────────────────────────────────────

    if (!user.verified) {
      return Response.json(
        {
          success: false,
          message:
            "Your email isn't verified yet. Please check your inbox for the verification link, or request a new one.",
          unverified: true,
        },
        { status: 403 }
      );
    }

    // ── Issue JWT in httpOnly cookie ──────────────────────────────────────────

    const token = signToken({
      userId: String(user._id),
      email: user.email,
      username: user.username,
    });

    // Build safe public user object — no password or token fields
    const publicUser: PublicUser = {
      id: String(user._id),
      email: user.email,
      username: user.username,
      favoriteGames: user.favoriteGames,
      platforms: user.platforms ?? [],
      verified: user.verified,
      createdAt: user.createdAt.toISOString(),
    };

    return Response.json(
      { success: true, message: "Logged in successfully.", data: publicUser },
      {
        status: 200,
        headers: { "Set-Cookie": buildSessionCookie(token) },
      }
    );
  } catch (error) {
    console.error("[POST /api/login] Error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
