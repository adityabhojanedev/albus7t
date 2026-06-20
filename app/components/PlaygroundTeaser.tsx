"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const TeaserCanvas = dynamic(() => import("./TeaserCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#1A0F08] border border-white/5 rounded-[12px]">
      <Loader2 size={32} className="animate-spin text-[#C47C2B]" />
    </div>
  )
});

export default function PlaygroundTeaser() {
  const handleOpenPlayground = () => {
    window.dispatchEvent(new Event('openPlaygroundModal'));
  };

  return (
    <section className="relative w-full py-24 bg-[#0A0705] flex flex-col items-center justify-center overflow-hidden z-0 border-y border-[#2A1F15]">
      
      {/* Faint Background Orb */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7C4A1E] blur-[100px] rounded-full z-[1] pointer-events-none mix-blend-screen"
        style={{ opacity: 0.10 }}
      />

      <div className="relative z-10 flex flex-col items-center text-center w-full px-6 max-w-[1000px] mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-sora text-xs tracking-[0.2em] text-[#7A6A55] uppercase mb-4 block"
        >
          Interactive Tool
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
          className="font-bebas text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] via-[#E8A44A] to-[#F5ECD7] mb-6 drop-shadow-[0_0_15px_rgba(196,124,43,0.3)]"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.1 }}
        >
          Tactics Canvas
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          className="font-inter text-sm text-[#7A6A55] max-w-[500px] leading-loose mb-12"
        >
          Draw plays, analyze frames, and break the meta. Get a taste of the tool below, then unlock the full experience.
        </motion.p>

        {/* Canvas Teaser Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
          className="w-full h-[400px] md:h-[500px] max-w-[800px] relative mb-12"
        >
          <TeaserCanvas />
        </motion.div>

        <motion.button
          onClick={handleOpenPlayground}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.6 }}
          className="inline-flex items-center justify-center font-sora font-semibold text-[#0A0705] bg-[#C47C2B] hover:bg-[#E8A44A] hover:shadow-[0_0_20px_#E8A44A55] transition-all duration-300 rounded-[4px] px-[36px] py-[14px]"
        >
          Unlock Full Access <span className="ml-2 font-inter font-bold">🔒</span>
        </motion.button>
      </div>
    </section>
  );
}
