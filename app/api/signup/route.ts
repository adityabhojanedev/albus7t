/**
 * app/api/signup/route.ts
 * POST /api/signup
 * Creates a new unverified user and sends a verification email.
 *
 * Flow:
 *  1. Validate inputs
 *  2. Check duplicates FIRST (before any expensive work)
 *  3. Hash password + generate token
 *  4. Persist user (create or update-unverified)
 *  5. Send verification email
 *     → If email send fails after a fresh create: delete the document (compensating transaction)
 *     → If email send fails after an update: surface the error clearly (data was already theirs)
 */

import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/brevo";
import type { SignupBody } from "@/types/auth";

const BCRYPT_ROUNDS = 12;
const TOKEN_EXPIRY_HOURS = 24;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// MongoDB duplicate-key error code
const MONGO_DUPLICATE_KEY = 11000;

export async function POST(request: NextRequest) {
  try {
    const body: SignupBody = await request.json();
    const { email, username, password, confirmPassword, favoriteGames, platforms } = body;

    // ── 1. Field presence & format validation ─────────────────────────────────

    if (!email?.trim()) {
      return Response.json(
        { success: false, message: "Email address is required.", field: "email" },
        { status: 400 }
      );
    }
    if (!username?.trim()) {
      return Response.json(
        { success: false, message: "Username is required.", field: "username" },
        { status: 400 }
      );
    }
    if (!password) {
      return Response.json(
        { success: false, message: "Password is required.", field: "password" },
        { status: 400 }
      );
    }
    if (!confirmPassword) {
      return Response.json(
        { success: false, message: "Please confirm your password.", field: "confirmPassword" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return Response.json(
        { success: false, message: "Please enter a valid email address (e.g. you@gmail.com).", field: "email" },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();
    const normalizedEmail = email.toLowerCase().trim();

    if (trimmedUsername.length < 3 || trimmedUsername.length > 32) {
      return Response.json(
        { success: false, message: "Username must be between 3 and 32 characters.", field: "username" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(trimmedUsername)) {
      return Response.json(
        { success: false, message: "Username can only contain letters, numbers, underscores, hyphens, and dots.", field: "username" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { success: false, message: "Password must be at least 8 characters long.", field: "password" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return Response.json(
        { success: false, message: "Passwords do not match. Please re-enter them.", field: "confirmPassword" },
        { status: 400 }
      );
    }

    // ── 2. Duplicate checks — BEFORE any expensive work ──────────────────────
    // Run both queries in parallel for efficiency.

    await connectDB();

    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      User.findOne({ username: trimmedUsername }),
    ]);

    // Username is taken by a DIFFERENT verified user → reject immediately
    if (existingUsername && existingUsername.email !== normalizedEmail) {
      return Response.json(
        { success: false, message: "That username is already taken. Please choose a different one.", field: "username" },
        { status: 409 }
      );
    }

    // Email exists and account is verified → tell them to log in
    if (existingEmail?.verified) {
      return Response.json(
        { success: false, message: "An account with this email already exists and is verified. Please log in instead.", field: "email" },
        { status: 409 }
      );
    }

    // ── 3. Expensive work only happens for requests that will proceed ─────────

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(
      Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    );

    // ── 4a. Update existing unverified account ────────────────────────────────

    if (existingEmail) {
      existingEmail.username = trimmedUsername;
      existingEmail.password = hashedPassword;
      existingEmail.favoriteGames = favoriteGames ?? [];
      existingEmail.platforms = platforms ?? [];
      existingEmail.verificationToken = verificationToken;
      existingEmail.verificationTokenExpiry = verificationTokenExpiry;

      try {
        await existingEmail.save();
      } catch (saveErr: unknown) {
        // Another user grabbed this username between our check and save (race condition)
        if (isMongoDuplicateKeyError(saveErr, "username")) {
          return Response.json(
            { success: false, message: "That username is already taken. Please choose a different one.", field: "username" },
            { status: 409 }
          );
        }
        throw saveErr; // re-throw unexpected errors
      }

      // Send email — if it fails, the account data is still updated (it was already theirs)
      try {
        await sendVerificationEmail(existingEmail.email, verificationToken);
      } catch (emailErr) {
        console.error("[POST /api/signup] Email send failed (update path):", emailErr);
        return Response.json(
          {
            success: false,
            message: "Your account was updated but we couldn't send the verification email. Please use 'Resend verification' to try again.",
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "Account updated! We've sent a new verification link to your email. Please check your inbox.",
        },
        { status: 200 }
      );
    }

    // ── 4b. Create brand-new user ─────────────────────────────────────────────

    let newUser;
    try {
      newUser = await User.create({
        email: normalizedEmail,
        username: trimmedUsername,
        password: hashedPassword,
        favoriteGames: favoriteGames ?? [],
        platforms: platforms ?? [],
        verified: false,
        verificationToken,
        verificationTokenExpiry,
      });
    } catch (createErr: unknown) {
      // Handle race-condition duplicate key errors from MongoDB
      if (isMongoDuplicateKeyError(createErr, "email")) {
        return Response.json(
          { success: false, message: "An account with this email already exists. Please log in instead.", field: "email" },
          { status: 409 }
        );
      }
      if (isMongoDuplicateKeyError(createErr, "username")) {
        return Response.json(
          { success: false, message: "That username is already taken. Please choose a different one.", field: "username" },
          { status: 409 }
        );
      }
      throw createErr;
    }

    // ── 5. Send verification email — compensating delete on failure ───────────
    try {
      await sendVerificationEmail(normalizedEmail, verificationToken);
    } catch (emailErr) {
      console.error("[POST /api/signup] Email send failed (create path) — rolling back user:", emailErr);
      // Remove the just-created user so they're not stuck as an unverifiable ghost
      await User.deleteOne({ _id: newUser._id });
      return Response.json(
        {
          success: false,
          message: "We couldn't send the verification email. Please try signing up again in a moment.",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Account created! We've sent a verification link to your email. Please check your inbox (and spam folder) to activate your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    // Never leak DB or internal error details to the client
    console.error("[POST /api/signup] Error:", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong on our end. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Detects a MongoDB duplicate-key error (code 11000) on a specific field.
 * Works for both single-field and compound index violations.
 */
function isMongoDuplicateKeyError(err: unknown, field: string): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { code?: number; keyPattern?: Record<string, unknown> };
  return e.code === MONGO_DUPLICATE_KEY && field in (e.keyPattern ?? {});
}
