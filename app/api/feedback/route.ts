/**
 * app/api/feedback/route.ts
 *
 * POST /api/feedback  — Submit feedback (signed-in users only, once per day)
 * GET  /api/feedback  — Fetch all feedbacks (newest first), for /user-feedback admin page
 */

import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Feedback from "@/models/Feedback";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

// ── POST — Submit feedback ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, message } = body;

    // Validate
    if (!subject?.trim()) {
      return Response.json(
        { success: false, message: "Subject is required.", field: "subject" },
        { status: 400 }
      );
    }
    if (!message?.trim()) {
      return Response.json(
        { success: false, message: "Message is required.", field: "message" },
        { status: 400 }
      );
    }
    if (subject.trim().length > 200) {
      return Response.json(
        { success: false, message: "Subject must be at most 200 characters.", field: "subject" },
        { status: 400 }
      );
    }
    if (message.trim().length > 2000) {
      return Response.json(
        { success: false, message: "Message must be at most 2000 characters.", field: "message" },
        { status: 400 }
      );
    }

    // ── Auth guard: signed-in users only ─────────────────────────────────────
    const cookie = request.cookies.get(COOKIE_NAME);
    if (!cookie?.value) {
      return Response.json(
        { success: false, message: "You must be signed in to submit feedback.", requiresAuth: true },
        { status: 401 }
      );
    }

    const payload = verifyToken(cookie.value);
    if (!payload) {
      return Response.json(
        { success: false, message: "Your session has expired. Please sign in again.", requiresAuth: true },
        { status: 401 }
      );
    }

    const user = { id: payload.userId, username: payload.username, email: payload.email };

    await connectDB();

    // ── Daily limit: one feedback per user per calendar day ───────────────────
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const alreadySubmittedToday = await Feedback.findOne({
      "user.id": user.id,
      createdAt: { $gte: startOfToday },
    });

    if (alreadySubmittedToday) {
      return Response.json(
        {
          success: false,
          message: "You've already submitted feedback today. Come back tomorrow — we'd love to hear from you again!",
          limitReached: true,
        },
        { status: 429 }
      );
    }

    await Feedback.create({
      subject: subject.trim(),
      message: message.trim(),
      user,
    });

    return Response.json(
      { success: true, message: "Thank you for your feedback! We appreciate it." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/feedback] Error:", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// ── GET — List all feedbacks ──────────────────────────────────────────────────

export async function GET() {
  try {
    await connectDB();

    const feedbacks = await Feedback.find({})
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return Response.json({ success: true, data: feedbacks });
  } catch (error) {
    console.error("[GET /api/feedback] Error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch feedbacks." },
      { status: 500 }
    );
  }
}
