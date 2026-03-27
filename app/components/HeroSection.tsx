"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const RUNES = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ"];

const TAGLINES = [
  "We don't just play games. We live them, decode them, and stream them with style.",
  "Every frame analyzed. Every meta broken.",
  "Beyond the highlights. Into the universe.",
  "Clutch moments. Tactical brilliance. Pure chaos."
];

export default function HeroSection({ onYouTubeClick }: { onYouTubeClick: () => void }) {
  const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToVideos = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("videos");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-[#0A0705] flex flex-col justify-center items-center z-0">

      {/* 1. Top Edge Parchment Fade */}
      <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-b from-[#1A0F08] to-transparent z-[5] pointer-events-none" />

      {/* 2. Radial Glow Orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#7C4A1E] blur-3xl rounded-full z-[1] pointer-events-none"
        style={{ opacity: 0.15 }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#C47C2B] blur-3xl rounded-full z-[1] pointer-events-none"
        style={{ opacity: 0.10 }}
      />

      {/* Subtle noise/grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.03]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
        }}
      />

      {/* 3. Floating Rune Symbols & 4. Ambient Particle Dots */}
      {mounted && (
        <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
          {/* 10 Runes */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={`rune-${i}`}
              animate={{ y: [-15, 15, -15] }}
              transition={{
                duration: 6 + Math.random() * 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
              className="absolute text-[#C47C2B]"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${10 + Math.random() * 80}%`,
                opacity: 0.15,
                fontSize: `${1.5 + Math.random()}rem`,
              }}
            >
              {RUNES[i % RUNES.length]}
            </motion.div>
          ))}
          {/* 25 Particle Dots */}
          {Array.from({ length: 25 }).map((_, i) => {
            const size = 2 + Math.random() * 2;
            return (
              <motion.div
                key={`dot-${i}`}
                animate={{ scale: [1, 1.6, 1] }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5,
                }}
                className="absolute bg-[#E8A44A] rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: 0.2, // bumped slightly for better visibility
                }}
              />
            );
          })}
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-[800px] w-full mx-auto px-4 sm:px-6 gap-6 pt-10 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="font-bebas tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] via-[#E8A44A] to-[#F5ECD7] uppercase"
          style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.1 }}
        >
          Welcome to the Albus Universe
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="font-sora font-medium text-[#7A6A55]"
          style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
        >
          One creator. Every side of the game.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
          className="font-inter font-light text-sm text-[#F5ECD7] leading-relaxed max-w-[520px]"
        >
          Clutch highlights that break replays. Esports breakdowns that rewire
          how you think. And somewhere in a corner of the internet, a hat quietly
          trying to sneak through a game without getting caught. This is the
          Albus Universe — and you&apos;re already in it.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mt-4">
          <motion.a
            href="#videos"
            onClick={scrollToVideos}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7, ease }}
            className="inline-flex items-center justify-center font-sora font-semibold text-[#0A0705] bg-[#C47C2B] hover:bg-[#E8A44A] hover:shadow-[0_0_20px_#E8A44A55] transition-all duration-300 rounded px-[28px] py-[12px] w-full sm:w-auto"
          >
            Explore the Universe <span className="ml-2 font-inter font-bold">↓</span>
          </motion.a>

          <motion.button
            onClick={onYouTubeClick}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8, ease }}
            className="inline-flex items-center justify-center font-sora font-semibold text-[#C47C2B] bg-transparent border border-[#7C4A1E] hover:border-[#E8A44A] hover:text-[#E8A44A] hover:bg-[#7C4A1E18] transition-all duration-300 rounded px-[28px] py-[12px] w-full sm:w-auto"
          >
            Watch Latest Drop <span className="ml-2 font-inter font-bold">→</span>
          </motion.button>
        </div>
      </div>

      {/* Scrolling Marquee inside the strict 100vh constraint */}
      <div className="absolute bottom-0 w-full bg-[#0F0A06] border-t border-[#2A1F15] overflow-hidden py-3 flex z-20">
        <motion.div
          className="flex whitespace-nowrap min-w-full"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ ease: "linear", duration: 35, repeat: Infinity }}
        >
          <div className="flex items-center justify-around min-w-fit pr-8">
            {TAGLINES.map((tagline, i) => (
              <div key={`set1-${i}`} className="flex items-center">
                <span className="font-bebas text-lg tracking-wide text-[#7A6A55] uppercase pr-8 mt-1">
                  &quot;{tagline}&quot;
                </span>
                <span className="text-[#C47C2B] text-[10px] pr-8">◆</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-around min-w-fit pr-8">
            {TAGLINES.map((tagline, i) => (
              <div key={`set2-${i}`} className="flex items-center">
                <span className="font-bebas text-lg tracking-wide text-[#7A6A55] uppercase pr-8 mt-1">
                  &quot;{tagline}&quot;
                </span>
                <span className="text-[#C47C2B] text-[10px] pr-8">◆</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
