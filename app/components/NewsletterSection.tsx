"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function NewsletterSection() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) setSubmitted(true);
  };

  return (
    <section id="newsletter" className="relative w-full py-32 flex flex-col items-center justify-center bg-[#0A0705] overflow-hidden z-0 min-h-screen">
      
      {/* Torn Parchment Top Edge (SVG Mimic) */}
      <div className="absolute top-0 left-0 w-full h-[60px] z-[5] pointer-events-none opacity-80" style={{ transform: "rotate(180deg)" }}>
        <svg preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" style={{ fill: '#1A0F08', width: '100%', height: '100%' }}>
          <path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" opacity=".25" />
          <path d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z" opacity=".5" />
          <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" />
        </svg>
      </div>

      {/* Ambient Glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7C4A1E] blur-[120px] rounded-full z-[1] pointer-events-none mix-blend-screen"
        style={{ opacity: 0.20 }}
      />

      <div className="relative z-10 w-full max-w-[720px] px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full bg-[#0D0805] border border-[#2A1F15] py-[40px] px-[24px] md:py-[64px] md:px-[80px] flex flex-col items-center shadow-[inset_0_0_60px_rgba(10,7,5,0.7)] rounded-[2px]"
        >
          {/* Corner Accents */}
          <div className="absolute top-4 left-4 text-[#C47C2B] text-lg md:text-2xl font-bold opacity-60 leading-none select-none">╔</div>
          <div className="absolute top-4 right-4 text-[#C47C2B] text-lg md:text-2xl font-bold opacity-60 leading-none select-none">╗</div>
          <div className="absolute bottom-4 left-4 text-[#C47C2B] text-lg md:text-2xl font-bold opacity-60 leading-none select-none">╚</div>
          <div className="absolute bottom-4 right-4 text-[#C47C2B] text-lg md:text-2xl font-bold opacity-60 leading-none select-none">╝</div>

          <div className="relative flex flex-col items-center w-full z-20">
            {/* Subtle Runes Flanking the Headline Container */}
            <div className="absolute top-[40%] left-[-20px] md:left-[-60px] text-[#C47C2B] opacity-[0.05] text-5xl pointer-events-none select-none -translate-y-1/2 font-bold">ᚢ</div>
            <div className="absolute top-[40%] right-[-20px] md:right-[-60px] text-[#C47C2B] opacity-[0.05] text-5xl pointer-events-none select-none -translate-y-1/2 font-bold">ᚨ</div>

            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sora text-xs tracking-[0.2em] text-[#7A6A55] uppercase mb-4"
            >
              Stay in the Loop
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-bebas text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] via-[#E8A44A] to-[#F5ECD7] mb-6 text-center w-full drop-shadow-[0_0_24px_rgba(196,124,43,0.33)]"
              style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", lineHeight: 1 }}
            >
              Never Miss a Drop
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-inter text-sm text-[#7A6A55] leading-loose max-w-[480px] text-center mb-10"
            >
              New highlight. New decode. New live session. Be the first to 
              know when Albus drops something new.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full relative flex justify-center"
            >
              <form 
                onSubmit={handleSubmit} 
                className="flex flex-col md:flex-row w-full max-w-[500px] group relative z-30 rounded-[4px] border border-[#2A1F15] bg-[#0A0705] focus-within:border-[#C47C2B] focus-within:shadow-[0_0_16px_rgba(196,124,43,0.27)] transition-all duration-300"
              >
                <input
                  type="email"
                  placeholder="Your email here"
                  required
                  value={email}
                  disabled={submitted}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow w-full bg-transparent py-[16px] px-[20px] font-sora text-sm text-[#F5ECD7] placeholder-[#3A2F25] focus:outline-none z-10 disabled:opacity-50"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  disabled={submitted}
                  className="shrink-0 bg-[#C47C2B] text-[#0A0705] font-sora font-semibold py-[16px] px-[32px] rounded-b-[3px] md:rounded-l-none md:rounded-r-[3px] hover:bg-[#E8A44A] hover:shadow-[0_0_20px_rgba(232,164,74,0.33)] transition-all duration-300 z-20 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Count Me In
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="mt-6 h-[24px] flex items-center justify-center w-full"
            >
              {!submitted ? (
                <span className="font-sora text-xs text-[#3A2F25]">
                  No spam. Just drops.
                </span>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="font-sora text-xs text-[#E8A44A]"
                >
                  ✦ You&apos;re in. Watch for the drop.
                </motion.span>
              )}
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
