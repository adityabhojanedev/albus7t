"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { ApiResponse } from "@/types/auth";

const COOLDOWN_SECONDS = 120; // 2 minutes, matches API

function VerifyPendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  // countdown: null = no cooldown active, number = seconds remaining
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-mask most of the email for display
  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => `${a}${"*".repeat(Math.min(b.length, 6))}${c}`)
    : "your inbox";

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Listen for verification status via SSE
  useEffect(() => {
    if (!email) return;

    const eventSource = new EventSource(`/api/verify-status?email=${encodeURIComponent(email)}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.verified) {
          eventSource.close();
          router.replace("/login?verified=1");
        }
      } catch (err) {
        console.error("Error parsing SSE data", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [email, router]);

  function startCountdown(seconds: number) {
    setCountdown(seconds);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (status === "sending" || countdown !== null) return;
    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data: ApiResponse = await res.json();

      if (res.status === 400 && data.message?.includes("already verified")) {
        // Account already verified — send them to login
        router.replace("/login?verified=1");
        return;
      }

      setMessage(data.message);

      if (data.success) {
        setStatus("sent");
        startCountdown(COOLDOWN_SECONDS);
      } else if (res.status === 429) {
        // API already enforcing cooldown — parse wait time from message if possible
        setStatus("error");
        // Still start the local countdown so UI is consistent
        startCountdown(COOLDOWN_SECONDS);
      } else {
        setStatus("error");
      }
    } catch {
      setMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  // Format mm:ss
  function formatCountdown(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const canResend = countdown === null && status !== "sending";

  return (
    <main className="min-h-screen bg-[#0A0705] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#7C4A1E] blur-[130px] rounded-full pointer-events-none"
        style={{ opacity: 0.12 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-[440px] text-center"
      >
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1A0F08] border border-[#2A1F15] flex items-center justify-center shadow-[0_0_30px_rgba(196,124,43,0.2)]">
          <span className="text-4xl">📬</span>
        </div>

        <h1 className="font-bebas text-4xl text-[#F5ECD7] tracking-wide mb-3">
          Check Your Inbox
        </h1>
        <p className="font-inter text-sm text-[#7A6A55] leading-loose max-w-[360px] mx-auto mb-8">
          We&apos;ve sent a verification link to{" "}
          <span className="text-[#E8A44A] font-semibold">{maskedEmail}</span>.
          Click the link to activate your account.
          <br />
          <span className="text-xs">The link expires in 24 hours. Check spam if you don&apos;t see it.</span>
        </p>

        {/* Feedback message */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              key={message}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`mb-5 px-4 py-3 rounded-[4px] font-sora text-sm border ${
                status === "sent"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resend button + countdown */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleResend}
            disabled={!canResend}
            className="inline-flex items-center gap-2 font-sora font-semibold text-sm text-[#C47C2B] bg-transparent border border-[#7C4A1E] hover:border-[#E8A44A] hover:text-[#E8A44A] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 rounded-[4px] px-6 py-3 min-w-[220px] justify-center"
          >
            {status === "sending" ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Sending…
              </>
            ) : countdown !== null ? (
              // Cooldown active — show live timer
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Resend in {formatCountdown(countdown)}
              </span>
            ) : (
              "Resend Verification Email"
            )}
          </button>

          {/* Progress bar during cooldown */}
          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-[220px] h-[2px] bg-[#2A1F15] rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-[#C47C2B] origin-left"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: COOLDOWN_SECONDS, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="font-sora text-xs text-[#5A4A3A]">
            Wrong email?{" "}
            <a href="/signup" className="text-[#C47C2B] hover:text-[#E8A44A] transition-colors">
              Sign up again
            </a>
          </p>
          <p className="font-sora text-xs text-[#5A4A3A]">
            Already verified?{" "}
            <a href="/login" className="text-[#C47C2B] hover:text-[#E8A44A] transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </main>
  );
}

export default function VerifyPendingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-[#0A0705] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#C47C2B] border-t-transparent animate-spin" />
        </div>
      }
    >
      <VerifyPendingContent />
    </Suspense>
  );
}
