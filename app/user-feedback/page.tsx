"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface FeedbackEntry {
  _id: string;
  subject: string;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function UserFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<FeedbackEntry | null>(null);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setFeedbacks(d.data);
        else setError(d.message);
      })
      .catch(() => setError("Failed to load feedbacks."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0705] px-4 py-12">
      {/* Ambient glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#7C4A1E] blur-[160px] rounded-full pointer-events-none opacity-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#C47C2B] blur-[140px] rounded-full pointer-events-none opacity-5" />

      <div className="relative z-10 max-w-[900px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="font-sora text-xs tracking-[0.2em] text-[#7A6A55] uppercase mb-2">Admin View</p>
            <h1 className="font-bebas text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] via-[#E8A44A] to-[#F5ECD7] tracking-wide">
              User Feedback
            </h1>
            {!loading && (
              <p className="font-inter text-xs text-[#5A4A3A] mt-1">
                {feedbacks.length} submission{feedbacks.length !== 1 ? "s" : ""} total
              </p>
            )}
          </div>
          <Link
            href="/"
            className="font-sora text-xs text-[#7A6A55] hover:text-[#C47C2B] transition-colors border border-[#2A1F15] hover:border-[#C47C2B]/40 rounded-[4px] px-4 py-2"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#2A1F15] to-transparent mb-8" />

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-[#C47C2B] border-t-transparent animate-spin" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-[6px] px-5 py-4 font-inter text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && feedbacks.length === 0 && (
          <div className="text-center py-24">
            <p className="font-bebas text-3xl text-[#3A2F25] tracking-wide mb-2">No Feedback Yet</p>
            <p className="font-inter text-xs text-[#5A4A3A]">Feedback submitted by users will appear here.</p>
          </div>
        )}

        {/* Feedback list */}
        {!loading && !error && feedbacks.length > 0 && (
          <div className="flex flex-col gap-4">
            {feedbacks.map((fb, i) => (
              <motion.div
                key={fb._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                onClick={() => setSelected(fb)}
                className="group cursor-pointer bg-[#110B07] border border-[#2A1F15] hover:border-[#C47C2B]/40 rounded-[8px] p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(196,124,43,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Subject */}
                    <h2 className="font-sora font-semibold text-[#F5ECD7] text-sm mb-1 truncate group-hover:text-[#E8A44A] transition-colors">
                      {fb.subject}
                    </h2>
                    {/* Message preview */}
                    <p className="font-inter text-xs text-[#7A6A55] leading-relaxed line-clamp-2">
                      {fb.message}
                    </p>
                  </div>

                  {/* Right meta */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-sora text-[10px] text-[#5A4A3A] whitespace-nowrap">
                      {timeAgo(fb.createdAt)}
                    </span>
                    {fb.user ? (
                      <div className="flex items-center gap-1.5 bg-[#1A0F08] border border-[#2A1F15] rounded-full px-2.5 py-1">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#C47C2B] to-[#7C4A1E] flex items-center justify-center">
                          <span className="text-[8px] text-[#0A0705] font-bold">
                            {fb.user.username[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="font-sora text-[10px] text-[#C47C2B] font-semibold">
                          {fb.user.username}
                        </span>
                      </div>
                    ) : (
                      <span className="font-sora text-[10px] text-[#3A2F25] border border-[#2A1F15] rounded-full px-2.5 py-1">
                        Anonymous
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1A0F08]">
                  <span className="font-inter text-[10px] text-[#3A2F25]">
                    {formatDate(fb.createdAt)}
                  </span>
                  {fb.user?.email && (
                    <span className="font-inter text-[10px] text-[#3A2F25]">
                      {fb.user.email}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[560px] bg-[#110B07] border border-[#2A1F15] rounded-[12px] p-7 shadow-[0_0_60px_rgba(196,124,43,0.15)]"
            >
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#C47C2B]/8 blur-[80px] rounded-full pointer-events-none" />

              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-[#5A4A3A] hover:text-[#C47C2B] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* User info */}
              {selected.user ? (
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C47C2B] to-[#7C4A1E] flex items-center justify-center">
                    <span className="font-bebas text-lg text-[#0A0705]">
                      {selected.user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-sora font-semibold text-sm text-[#E8A44A]">{selected.user.username}</p>
                    <p className="font-inter text-xs text-[#5A4A3A]">{selected.user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-full bg-[#1A0F08] border border-[#2A1F15] flex items-center justify-center">
                    <span className="text-[#5A4A3A] text-xs">?</span>
                  </div>
                  <span className="font-sora text-xs text-[#5A4A3A]">Anonymous</span>
                </div>
              )}

              {/* Subject */}
              <h2 className="font-bebas text-2xl text-[#F5ECD7] tracking-wide mb-3">{selected.subject}</h2>

              {/* Message */}
              <div className="bg-[#0A0705] border border-[#1A0F08] rounded-[6px] p-4 mb-5">
                <p className="font-inter text-sm text-[#A09080] leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              {/* Date */}
              <p className="font-inter text-xs text-[#3A2F25]">{formatDate(selected.createdAt)}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
