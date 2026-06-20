"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "Streams", href: "https://www.twitch.tv/albus7t" },
  { name: "Esport", href: "/esports" },
  { name: "Guides", href: "/guides" },
  { name: "Playground", href: "#" },
  { name: "Feedback", href: "#" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaygroundModalOpen, setIsPlaygroundModalOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [playgroundError, setPlaygroundError] = useState("");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "sending" | "sent" | "error" | "limitReached">("idle");
  const [feedbackError, setFeedbackError] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleOpenModal = () => setIsPlaygroundModalOpen(true);
    window.addEventListener("openPlaygroundModal", handleOpenModal);
    return () => window.removeEventListener("openPlaygroundModal", handleOpenModal);
  }, []);

  const handleLinkClick = async (e: React.MouseEvent, linkName: string, href: string) => {
    if (linkName === "Playground") {
      e.preventDefault();
      setIsOpen(false);
      // Step 1: Check if the user is signed in
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          // Not signed in → redirect to login with return path
          router.push("/login?redirect=/playground");
          return;
        }
      } catch {
        router.push("/login?redirect=/playground");
        return;
      }
      // Step 2: Signed in → show passcode modal
      setPasscode("");
      setPlaygroundError("");
      setIsPlaygroundModalOpen(true);
      return;
    }

    if (linkName === "Feedback") {
      e.preventDefault();
      setIsOpen(false);

      // Require sign-in before opening the modal
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          router.push("/login?redirect=/");
          return;
        }
      } catch {
        router.push("/login?redirect=/");
        return;
      }

      setFeedbackSubject("");
      setFeedbackMessage("");
      setFeedbackStatus("idle");
      setFeedbackError("");
      setIsFeedbackOpen(true);
      return;
    }

    if (href.startsWith("#")) {
      e.preventDefault();
      if (pathname !== "/") {
        router.push("/" + href);
      } else {
        document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const handlePlaygroundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "albus123") {
      setIsPlaygroundModalOpen(false);
      sessionStorage.setItem("albus_authenticated", "true");
      router.push("/playground");
    } else {
      setPlaygroundError("Incorrect passcode. Access denied.");
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackStatus === "sending") return;
    setFeedbackStatus("sending");
    setFeedbackError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: feedbackSubject, message: feedbackMessage }),
      });
      const data = await res.json();

      if (data.success) {
        setFeedbackStatus("sent");
        setFeedbackSubject("");
        setFeedbackMessage("");
      } else if (res.status === 401) {
        // Session expired mid-session
        setFeedbackStatus("error");
        setFeedbackError("Your session has expired. Please sign in again.");
      } else if (res.status === 429) {
        // Daily limit reached — treat like success so UI is positive
        setFeedbackStatus("limitReached");
      } else {
        setFeedbackStatus("error");
        setFeedbackError(data.message);
      }
    } catch {
      setFeedbackStatus("error");
      setFeedbackError("Network error. Please try again.");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.8 }}
        className="fixed top-0 left-0 w-full z-50 bg-[#0A0705CC] backdrop-blur-md border-b border-[#2A1F15]"
      >
        <div className="w-full flex items-center justify-between px-6 md:px-10 py-4">
          {/* Left: Logo */}
          <Link href="/">
            <span className="font-bebas text-3xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] to-[#E8A44A]">
              ALBUS7T
            </span>
          </Link>

          {/* Right: Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
              >
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.name, link.href)}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`group relative font-sora text-sm transition-colors duration-300 ${
                    link.name === "Playground" ? "text-[#C47C2B] font-bold" :
                    link.name === "Feedback" ? "text-[#F5ECD7] hover:text-[#E8A44A]" :
                    link.name === "Home" ? "text-[#E8A44A]" : "text-[#F5ECD7] hover:text-[#E8A44A]"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-[1px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out ${
                      link.name === "Playground" ? "bg-[#C47C2B]" : "bg-[#E8A44A]"
                    }`}
                  />
                </a>
              </motion.div>
            ))}
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#F5ECD7] w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-[2px] bg-current block rounded-full transition-transform"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-[2px] bg-current block rounded-full transition-opacity"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-6 h-[2px] bg-current block rounded-full transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="md:hidden overflow-hidden bg-[#0A0705CC] backdrop-blur-md border-b border-white/5"
            >
              <div className="flex flex-col py-4 px-6 gap-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.name, link.href)}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={`block py-4 font-sora text-lg transition-colors duration-300 ${
                        link.name === "Playground" ? "text-[#C47C2B]" : "text-[#F5ECD7] hover:text-[#E8A44A]"
                      }`}
                    >
                      {link.name}
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Playground Passcode Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {isPlaygroundModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={() => {
              setIsPlaygroundModalOpen(false);
              setPlaygroundError("");
              setPasscode("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[400px] bg-[#0A0705AA] backdrop-blur-xl border border-white/10 rounded-[12px] p-8 shadow-[0_0_50px_rgba(196,124,43,0.25)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#C47C2B]/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-wider mb-1">Restricted Area</h3>
                    <p className="font-inter text-xs text-[#7A6A55]">Enter secret code to access Playground.</p>
                  </div>
                  <button
                    onClick={() => { setIsPlaygroundModalOpen(false); setPlaygroundError(""); setPasscode(""); }}
                    className="text-[#7A6A55] hover:text-[#C47C2B] transition-colors p-2 -mr-2 -mt-2 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <form onSubmit={handlePlaygroundSubmit} className="flex flex-col gap-4">
                  <div>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter secret code..."
                      className="w-full bg-[#1A0F0880] backdrop-blur-sm border border-white/10 text-[#F5ECD7] font-inter text-sm rounded-[6px] px-4 py-3 focus:outline-none focus:border-[#C47C2B] transition-colors"
                      autoFocus
                    />
                    {playgroundError && (
                      <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-red-500 text-xs font-inter mt-2 block"
                      >
                        {playgroundError}
                      </motion.span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full font-sora font-semibold text-sm text-[#0A0705] bg-[#C47C2B] hover:bg-[#E8A44A] transition-colors rounded-[6px] py-3 mt-2"
                  >
                    Enter Playground
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Feedback Modal ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={() => setIsFeedbackOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[480px] bg-[#0A0705] border border-[#2A1F15] rounded-[12px] p-8 shadow-[0_0_60px_rgba(196,124,43,0.2)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-[250px] h-[250px] bg-[#C47C2B]/8 blur-[90px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-sora text-[10px] tracking-[0.2em] text-[#7A6A55] uppercase mb-1">Share your thoughts</p>
                    <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-wider">Send Feedback</h3>
                  </div>
                  <button
                    onClick={() => setIsFeedbackOpen(false)}
                    className="text-[#5A4A3A] hover:text-[#C47C2B] transition-colors p-1 focus:outline-none"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Success state */}
                {feedbackStatus === "sent" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-8 gap-4 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-sora font-semibold text-[#F5ECD7] mb-1">Feedback sent!</p>
                      <p className="font-inter text-xs text-[#7A6A55]">Thank you — we really appreciate it.</p>
                    </div>
                    <button
                      onClick={() => { setFeedbackStatus("idle"); setIsFeedbackOpen(false); }}
                      className="font-sora text-xs text-[#C47C2B] hover:text-[#E8A44A] transition-colors mt-2"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : feedbackStatus === "limitReached" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-8 gap-4 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#C47C2B]/10 border border-[#C47C2B]/30 flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C47C2B" strokeWidth="1.8">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-sora font-semibold text-[#E8A44A] mb-1">Already submitted today</p>
                      <p className="font-inter text-xs text-[#7A6A55] leading-relaxed max-w-[260px]">
                        You&apos;ve shared your thoughts for today — come back tomorrow and we&apos;d love to hear more!
                      </p>
                    </div>
                    <button
                      onClick={() => { setFeedbackStatus("idle"); setIsFeedbackOpen(false); }}
                      className="font-sora text-xs text-[#C47C2B] hover:text-[#E8A44A] transition-colors mt-2"
                    >
                      Got it
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
                    {/* Subject */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sora text-[10px] tracking-wider text-[#7A6A55] uppercase">Subject</label>
                      <input
                        type="text"
                        value={feedbackSubject}
                        onChange={(e) => setFeedbackSubject(e.target.value)}
                        placeholder="What's this about?"
                        maxLength={200}
                        className="w-full bg-[#0F0A06] border border-[#2A1F15] rounded-[4px] px-4 py-3 font-inter text-sm text-[#F5ECD7] placeholder-[#3A2F25] outline-none transition-all duration-200 focus:border-[#C47C2B] focus:shadow-[0_0_12px_rgba(196,124,43,0.12)]"
                      />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sora text-[10px] tracking-wider text-[#7A6A55] uppercase">Message</label>
                      <textarea
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="Tell us what's on your mind..."
                        maxLength={2000}
                        rows={5}
                        className="w-full bg-[#0F0A06] border border-[#2A1F15] rounded-[4px] px-4 py-3 font-inter text-sm text-[#F5ECD7] placeholder-[#3A2F25] outline-none transition-all duration-200 focus:border-[#C47C2B] focus:shadow-[0_0_12px_rgba(196,124,43,0.12)] resize-none"
                      />
                      <span className="font-inter text-[10px] text-[#3A2F25] self-end">
                        {feedbackMessage.length}/2000
                      </span>
                    </div>

                    {/* Error */}
                    {feedbackStatus === "error" && feedbackError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-inter text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-[4px] px-3 py-2"
                      >
                        {feedbackError}
                      </motion.p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={feedbackStatus === "sending"}
                      className="w-full inline-flex items-center justify-center gap-2 font-sora font-semibold text-sm text-[#0A0705] bg-[#C47C2B] hover:bg-[#E8A44A] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 rounded-[4px] py-3 mt-1"
                    >
                      {feedbackStatus === "sending" ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        "Send Feedback →"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
