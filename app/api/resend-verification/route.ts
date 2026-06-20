/**
 * app/api/resend-verification/route.ts
 * POST /api/resend-verification
 * Generates a fresh verification token and resends the email.
 *
 * Structured for rate limiting: add a rateLimitGuard(request) call
 * at the very top of the handler when you're ready to add it.
 */

import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/brevo";
import type { ResendBody } from "@/types/auth";

const TOKEN_EXPIRY_HOURS = 24;
// Allow a resend after just 2 minutes — short enough to let users retry after
// a server-side failure, long enough to prevent accidental double-sends.
const RESEND_COOLDOWN_MINUTES = 2;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// ── Rate limit stub ───────────────────────────────────────────────────────────
// Replace with real logic (e.g. upstash/ratelimit) when needed.
// async function rateLimitGuard(request: NextRequest): Promise<boolean> {
//   const ip = request.headers.get("x-forwarded-for") ?? "unknown";
//   // Check Redis / in-memory store here
//   return false; // return true to block the request
// }

export async function POST(request: NextRequest) {
  try {
    // const isBlocked = await rateLimitGuard(request);
    // if (isBlocked) {
    //   return Response.json({ success: false, message: "Too many requests. Please wait." }, { status: 429 });
    // }

    const body: ResendBody = await request.json();
    const { email } = body;

    if (!email?.trim()) {
      return Response.json(
        { success: false, message: "Email is required.", field: "email" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return Response.json(
        { success: false, message: "Please enter a valid email address.", field: "email" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Don't reveal whether the email exists (security)
      return Response.json(
        {
          success: true,
          message: "If that email is registered, a verification link has been sent.",
        },
        { status: 200 }
      );
    }

    if (user.verified) {
      return Response.json(
        { success: false, message: "This account is already verified. Please log in." },
        { status: 400 }
      );
    }

    // ── Cooldown check: prevent rapid re-sends (2-minute window) ──
    const cooldownMs = RESEND_COOLDOWN_MINUTES * 60 * 1000;
    const tokenMaxAgeMs = TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;
    if (user.verificationTokenExpiry) {
      const issuedApprox = user.verificationTokenExpiry.getTime() - tokenMaxAgeMs;
      const elapsed = Date.now() - issuedApprox;
      if (elapsed < cooldownMs) {
        const waitSecs = Math.ceil((cooldownMs - elapsed) / 1000);
        const waitDisplay = waitSecs >= 60
          ? `${Math.ceil(waitSecs / 60)} minute${Math.ceil(waitSecs / 60) === 1 ? "" : "s"}`
          : `${waitSecs} second${waitSecs === 1 ? "" : "s"}`;
        return Response.json(
          {
            success: false,
            message: `A verification email was just sent. Please wait ${waitDisplay} before requesting another.`,
          },
          { status: 429 }
        );
      }
    }

    // Generate a fresh token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(
      Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    );

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    return Response.json(
      {
        success: true,
        message: "Verification email sent! Please check your inbox.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/resend-verification] Error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
