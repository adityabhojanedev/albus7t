"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Toolbar from "./components/Toolbar";
import CanvasContainer from "./components/CanvasContainer";
import SidebarDrawer from "./components/SidebarDrawer";
import HotkeyEditorModal from "./components/HotkeyEditorModal";
import ContextualHelp from "./components/ContextualHelp";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useHotkeyStore } from "./store/useHotkeyStore";

// ── Auth gate types ────────────────────────────────────────────────────────────
type AuthState = "checking" | "unauthenticated" | "locked" | "authorized";

export default function PlaygroundPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const loadBindings = useHotkeyStore((s) => s.loadBindings);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          // Not signed in
          setAuthState("unauthenticated");
          return;
        }
        // Signed in — check if they've entered the secret code this session
        const stored = sessionStorage.getItem("albus_authenticated");
        setAuthState(stored === "true" ? "authorized" : "locked");
      } catch {
        setAuthState("unauthenticated");
      }
    }

    checkAuth();
  }, []);

  useEffect(() => {
    if (authState === "authorized") loadBindings();
  }, [authState, loadBindings]);

  // Global keyboard shortcut listener — only active when authorized
  useKeyboardShortcuts();

  // ── Gate 1: Checking ────────────────────────────────────────────────────────
  if (authState === "checking") {
    return (
      <div className="w-screen h-screen bg-[#0A0705] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C47C2B] border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Gate 2: Not signed in ───────────────────────────────────────────────────
  if (authState === "unauthenticated") {
    return (
      <div className="w-screen h-screen bg-[#0A0705] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#7C4A1E] blur-[160px] rounded-full opacity-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 flex flex-col items-center text-center max-w-[400px]"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-[#1A0F08] border border-[#2A1F15] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(196,124,43,0.15)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C47C2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="font-bebas text-4xl text-[#F5ECD7] tracking-wide mb-2">Sign In Required</h1>
          <p className="font-inter text-sm text-[#7A6A55] leading-relaxed mb-8">
            The Playground is exclusive to signed-in members of the Albus Universe.
            Create an account or sign in to continue.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => router.push("/login?redirect=/playground")}
              className="flex-1 font-sora font-semibold text-sm text-[#0A0705] bg-[#C47C2B] hover:bg-[#E8A44A] transition-all duration-300 rounded-[6px] py-3"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="flex-1 font-sora font-semibold text-sm text-[#C47C2B] border border-[#7C4A1E] hover:border-[#E8A44A] hover:text-[#E8A44A] transition-all duration-300 rounded-[6px] py-3"
            >
              Create Account
            </button>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-6 font-sora text-xs text-[#5A4A3A] hover:text-[#C47C2B] transition-colors"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Gate 3: Signed in but no secret code ───────────────────────────────────
  if (authState === "locked") {
    const handlePasscodeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (passcode === "albus123") {
        sessionStorage.setItem("albus_authenticated", "true");
        setAuthState("authorized");
      } else {
        setPasscodeError("Incorrect code. Access denied.");
        setPasscode("");
      }
    };

    return (
      <div className="w-screen h-screen bg-[#0A0705] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C4A1E] blur-[160px] rounded-full opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C47C2B] blur-[140px] rounded-full opacity-5 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 w-full max-w-[400px] bg-[#0A0705AA] backdrop-blur-xl border border-white/10 rounded-[12px] p-8 shadow-[0_0_60px_rgba(196,124,43,0.2)]"
        >
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#C47C2B]/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col">
            {/* Icon + title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#1A0F08] border border-[#2A1F15] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C47C2B" strokeWidth="1.5">
                  <path d="M12 2a5 5 0 0 1 5 5v3H7V7a5 5 0 0 1 5-5z" />
                  <rect x="3" y="10" width="18" height="12" rx="2" />
                  <circle cx="12" cy="16" r="1.5" fill="#C47C2B" />
                </svg>
              </div>
              <div>
                <h2 className="font-bebas text-2xl text-[#F5ECD7] tracking-wider">Secret Code</h2>
                <p className="font-inter text-xs text-[#7A6A55]">One more step to enter the Playground.</p>
              </div>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="flex flex-col gap-4">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => { setPasscode(e.target.value); setPasscodeError(""); }}
                  placeholder="Enter secret code..."
                  className="w-full bg-[#1A0F0880] border border-white/10 text-[#F5ECD7] font-inter text-sm rounded-[6px] px-4 py-3 focus:outline-none focus:border-[#C47C2B] transition-colors"
                  autoFocus
                />
                {passcodeError && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-red-500 text-xs font-inter mt-2 block"
                  >
                    {passcodeError}
                  </motion.span>
                )}
              </div>
              <button
                type="submit"
                className="w-full font-sora font-semibold text-sm text-[#0A0705] bg-[#C47C2B] hover:bg-[#E8A44A] transition-colors rounded-[6px] py-3"
              >
                Enter Playground
              </button>
            </form>

            <button
              onClick={() => router.push("/")}
              className="mt-5 font-sora text-xs text-[#5A4A3A] hover:text-[#C47C2B] transition-colors text-center"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Gate 4: Fully authorized ────────────────────────────────────────────────
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0705]">
      <Toolbar />
      <SidebarDrawer />
      <CanvasContainer />
      <HotkeyEditorModal />
      <ContextualHelp />
    </div>
  );
}
