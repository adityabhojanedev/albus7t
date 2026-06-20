import Link from "next/link";

export const metadata = {
  title: "Link Expired — Albus Universe",
};

export default function VerifyFailedPage() {
  return (
    <main className="min-h-screen bg-[#0A0705] flex flex-col items-center justify-center px-4 py-16">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 15%, rgba(239,68,68,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[420px] text-center">
        {/* Warning icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#1A0F08] border-2 border-red-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
            <path
              d="M24 14v14M24 34v2"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M21.18 6.5L4.5 35a3 3 0 002.58 4.5h33.84A3 3 0 0043.5 35L26.82 6.5a3 3 0 00-5.64 0z"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wide mb-3">
          Link Expired
        </h1>
        <p className="font-inter text-sm text-[#7A6A55] leading-loose max-w-[340px] mx-auto mb-10">
          This verification link is invalid or has expired. Verification links are
          only valid for <span className="text-[#E8A44A]">24 hours</span>.
          <br />
          <br />
          Head back to request a fresh link — it only takes a second.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/verify-pending"
            className="inline-flex items-center justify-center font-sora font-semibold text-sm text-[#0A0705] bg-[#C47C2B] hover:bg-[#E8A44A] transition-all duration-300 rounded-[4px] px-6 py-3"
          >
            Resend Verification Email
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center font-sora font-semibold text-sm text-[#C47C2B] border border-[#7C4A1E] hover:border-[#E8A44A] hover:text-[#E8A44A] transition-all duration-300 rounded-[4px] px-6 py-3"
          >
            Start Over
          </Link>
        </div>
      </div>
    </main>
  );
}
