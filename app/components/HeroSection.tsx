"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const RUNES = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ"];

const TAGLINES = [
  "We don't just play games. We live them, decode them, and stream them with style.",
  "Every frame analyzed. Every meta broken.",
  "Beyond the highlights. Into the universe.",
  "Clutch moments. Tactical brilliance. Pure chaos."
];

export default function HeroSection() {
  const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

  const [mounted, setMounted] = useState(false);

  // Parallax setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const orb1X = useTransform(smoothX, [-0.5, 0.5], [40, -40]);
  const orb1Y = useTransform(smoothY, [-0.5, 0.5], [40, -40]);
  const orb2X = useTransform(smoothX, [-0.5, 0.5], [-50, 50]);
  const orb2Y = useTransform(smoothY, [-0.5, 0.5], [-50, 50]);
  
  const runesBgX = useTransform(smoothX, [-0.5, 0.5], [20, -20]);
  const runesBgY = useTransform(smoothY, [-0.5, 0.5], [20, -20]);
  const runesFgX = useTransform(smoothX, [-0.5, 0.5], [-35, 35]);
  const runesFgY = useTransform(smoothY, [-0.5, 0.5], [-35, 35]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === "undefined") return;
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToNext = () => {
    document.getElementById("latest-videos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" onMouseMove={handleMouseMove} className="relative w-full h-screen overflow-hidden bg-[#0A0705] flex flex-col justify-center items-center z-0">

      {/* 1. Top Edge Parchment Fade */}
      <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-b from-[#1A0F08] to-transparent z-[5] pointer-events-none" />

      {/* 2. Radial Glow Orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#7C4A1E] blur-3xl rounded-full z-[1] pointer-events-none"
        style={{ opacity: 0.15, x: orb1X, y: orb1Y }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#C47C2B] blur-3xl rounded-full z-[1] pointer-events-none"
        style={{ opacity: 0.10, x: orb2X, y: orb2Y }}
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
        <>
          {/* Background Runes and Dots (slower parallax) */}
          <motion.div style={{ x: runesBgX, y: runesBgY }} className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`rune-bg-${i}`}
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
                  opacity: 0.1,
                  fontSize: `${1.2 + Math.random()}rem`,
                }}
              >
                {RUNES[i % RUNES.length]}
              </motion.div>
            ))}
            {Array.from({ length: 12 }).map((_, i) => {
              const size = 2 + Math.random() * 2;
              return (
                <motion.div
                  key={`dot-bg-${i}`}
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
                    opacity: 0.15,
                  }}
                />
              );
            })}
          </motion.div>

          {/* Foreground Runes and Dots (faster, opposite parallax) */}
          <motion.div style={{ x: runesFgX, y: runesFgY }} className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`rune-fg-${i}`}
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
                  opacity: 0.2,
                  fontSize: `${1.8 + Math.random()}rem`,
                  filter: 'blur(1px)' // Foreground blur for depth of field
                }}
              >
                {RUNES[(i + 5) % RUNES.length]}
              </motion.div>
            ))}
            {Array.from({ length: 13 }).map((_, i) => {
              const size = 3 + Math.random() * 2;
              return (
                <motion.div
                  key={`dot-fg-${i}`}
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
                    opacity: 0.3,
                  }}
                />
              );
            })}
          </motion.div>
        </>
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

        {/* Animated scroll arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            onClick={scrollToNext}
            onHoverStart={scrollToNext}
            aria-label="Scroll to next section"
            whileHover={{ scale: 1.1 }}
            className="group relative flex flex-col items-center gap-1 focus:outline-none"
          >
            {/* Glow ring */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#C47C2B] blur-md pointer-events-none"
            />
            {/* Stacked chevrons */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 flex flex-col items-center"
            >
              <svg
                width="28" height="18" viewBox="0 0 28 18" fill="none"
                className="opacity-30 -mb-2"
              >
                <polyline points="2,2 14,14 26,2" stroke="#C47C2B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg
                width="28" height="18" viewBox="0 0 28 18" fill="none"
                className="opacity-70"
              >
                <polyline points="2,2 14,14 26,2" stroke="#E8A44A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.button>
        </motion.div>
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
