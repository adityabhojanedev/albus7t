import { motion } from "framer-motion";
import Link from "next/link";

export const metadata = {
  title: "Email Verified — Albus Universe",
};

export default function VerifySuccessPage() {
  return (
    <main className="min-h-screen bg-[#0A0705] flex flex-col items-center justify-center px-4 py-16">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(196,124,43,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[400px] text-center">
        {/* Animated checkmark ring */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#1A0F08] border-2 border-[#C47C2B] flex items-center justify-center shadow-[0_0_40px_rgba(196,124,43,0.3)]">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-10 h-10"
          >
            <path
              d="M10 25L20 35L38 14"
              stroke="#C47C2B"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="50"
              strokeDashoffset="0"
              style={{
                animation: "drawCheck 0.6s ease forwards",
              }}
            />
          </svg>
        </div>

        <style jsx>{`
          @keyframes drawCheck {
            from { stroke-dashoffset: 50; }
            to { stroke-dashoffset: 0; }
          }
        `}</style>

        <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wide mb-3">
          You&apos;re Verified!
        </h1>
        <p className="font-inter text-sm text-[#7A6A55] leading-loose max-w-[320px] mx-auto mb-10">
          Your email has been confirmed. Welcome to the Albus Universe — your account is ready.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center font-sora font-semibold text-sm text-[#0A0705] bg-[#C47C2B] hover:bg-[#E8A44A] hover:shadow-[0_0_20px_rgba(232,164,74,0.4)] transition-all duration-300 rounded-[4px] px-8 py-3.5"
        >
          Go to Login →
        </Link>
      </div>
    </main>
  );
}
