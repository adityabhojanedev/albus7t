"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import type { ApiResponse, PublicUser } from "@/types/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alreadyVerified = searchParams.get("verified") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: ApiResponse<PublicUser> = await res.json();

      if (!data.success) {
        // Surface the specific message (including the "verify your email" one)
        setError(data.message);

        // If unverified, offer to go to verify-pending
        if (res.status === 403) {
          setError(
            data.message +
              " — click 'Resend' below to get a new verification link."
          );
        }
        return;
      }

      // Cookie is set by the server; redirect to intended page or homepage
      const redirectTo = searchParams.get("redirect");
      // Only allow safe relative paths (no open-redirect)
      const safePath =
        redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
          ? redirectTo
          : "/";
      router.push(safePath);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0705] flex flex-col items-center justify-center px-4 py-16">
      {/* Background glow */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#7C4A1E] blur-[140px] rounded-full pointer-events-none"
        style={{ opacity: 0.1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block font-bebas text-3xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] via-[#E8A44A] to-[#F5ECD7] hover:opacity-80 transition-opacity">
            Albus Universe
          </a>
          <h1 className="font-bebas text-5xl text-[#F5ECD7] mt-1 tracking-wide">
            Welcome Back
          </h1>
          <p className="font-sora text-xs text-[#7A6A55] mt-2">
            New here?{" "}
            <a href="/signup" className="text-[#C47C2B] hover:text-[#E8A44A] transition-colors">
              Create an account
            </a>
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#110B0780] backdrop-blur-xl border border-white/5 rounded-[8px] p-8 flex flex-col gap-5">

          {/* Already-verified redirect banner */}
          {alreadyVerified && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/30 rounded-[4px] px-4 py-3 font-sora text-sm text-green-400 leading-relaxed"
            >
              ✓ Your email is already verified — sign in below.
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-[4px] px-4 py-3 font-sora text-sm text-red-400 leading-relaxed"
            >
              {error}
              {error.includes("Resend") && (
                <div className="mt-2">
                  <a
                    href={`/verify-pending?email=${encodeURIComponent(email)}`}
                    className="text-[#C47C2B] hover:text-[#E8A44A] transition-colors text-xs font-semibold"
                  >
                    → Go to Resend Page
                  </a>
                </div>
              )}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="font-sora text-xs text-[#7A6A55] tracking-wider uppercase">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0F0A06] border border-[#2A1F15] rounded-[4px] px-4 py-3 font-inter text-sm text-[#F5ECD7] placeholder-[#3A2F25] outline-none transition-all duration-200 focus:border-[#C47C2B] focus:shadow-[0_0_12px_rgba(196,124,43,0.15)]"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="font-sora text-xs text-[#7A6A55] tracking-wider uppercase">
                  Password
                </label>
                {/* Placeholder for future forgot-password */}
                <a href="#" className="font-sora text-xs text-[#5A4A3A] hover:text-[#C47C2B] transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full bg-[#0F0A06] border border-[#2A1F15] rounded-[4px] px-4 py-3 font-inter text-sm text-[#F5ECD7] placeholder-[#3A2F25] outline-none transition-all duration-200 focus:border-[#C47C2B] focus:shadow-[0_0_12px_rgba(196,124,43,0.15)]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full inline-flex items-center justify-center gap-2 font-sora font-semibold text-sm text-[#0A0705] bg-[#C47C2B] hover:bg-[#E8A44A] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 rounded-[4px] px-6 py-3.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-[#0A0705] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#C47C2B] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
