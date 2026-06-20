/**
 * app/api/verify-email/route.ts
 * GET /api/verify-email?token=xxx
 * Validates the token and marks the user as verified.
 */

import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  // Missing or malformed token → failed page (no DB query needed)
  if (!token || !/^[0-9a-f]{64}$/.test(token)) {
    redirect("/verify-failed");
  }

  try {
    await connectDB();

    // Find user with this token where expiry hasn't passed
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }, // token must not be expired
    });

    // Token not found or expired
    if (!user) {
      redirect("/verify-failed");
    }

    // Mark as verified and clear token fields
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    redirect("/verify-success");
  } catch (error) {
    // redirect() throws internally in Next.js — re-throw it so it works correctly
    if ((error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("[GET /api/verify-email] Error:", error);
    redirect("/verify-failed");
  }
}
