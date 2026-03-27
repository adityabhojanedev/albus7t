"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import Image from "next/image";

const RUNES = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ"];

const CARDS = [
  {
    icon: (
      <span className="text-4xl inline-block" style={{ filter: "sepia(1) hue-rotate(-20deg) saturate(2) brightness(1.2)" }}>
        ⚔️
      </span>
    ),
    title: "Highlights",
    description: "Clutch moments. Frame-perfect plays.",
  },
  {
    icon: (
      <span className="text-4xl inline-block" style={{ filter: "sepia(1) hue-rotate(-20deg) saturate(2) brightness(1.2)" }}>
        🔍
      </span>
    ),
    title: "Decoded",
    description: "Strategy breakdowns. Pro-level thinking.",
  },
  {
    icon: (
      <div className="relative w-[48px] h-[48px]">
        <Image src="/hat.png" alt="The Hat" fill className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" />
      </div>
    ),
    title: "The Hat",
    description: "Live. Unfiltered. Secretly in the game.",
  },
];

export default function AboutSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="about" className="relative w-full min-h-screen bg-[#0A0705] flex flex-col items-center justify-center overflow-hidden py-24 z-0">

      {/* Faint Horizontal Parchment Line (Top Edge) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2A1F15] to-transparent z-[5] pointer-events-none" />

      {/* Large Blurred Orb (Top Right) */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-[#7C4A1E] blur-[100px] rounded-full z-[1] pointer-events-none"
        style={{ opacity: 0.12 }}
      />

      {/* Floating Rune Symbols */}
      {mounted && (
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={`about-rune-${i}`}
              animate={{ y: [-15, 15, -15] }}
              transition={{
                duration: 7 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3,
              }}
              className="absolute text-[#C47C2B]"
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${15 + Math.random() * 70}%`,
                opacity: 0.04,
                fontSize: `${1.2 + Math.random()}rem`,
              }}
            >
              {RUNES[i % RUNES.length]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content Container */}
      <div className="relative z-[10] flex flex-col items-center text-center w-full px-6 max-w-[1000px] mx-auto">

        {/* Section Label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 }}
          className="font-sora text-xs tracking-[0.2em] text-[#7A6A55] uppercase mb-3 block"
        >
          The Story
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
          className="font-bebas text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] via-[#E8A44A] to-[#F5ECD7] mb-6"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.1 }}
        >
          Who Is{" "}
          <motion.span
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              color: "#E8A44A",
              WebkitTextFillColor: "#E8A44A",
              textShadow: "0 0 12px #E8A44A88",
            }}
          >
            Albus
          </motion.span>
          ?
        </motion.h2>

        {/* Divider Line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 60, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          className="h-[2px] bg-[#C47C2B] mx-auto mb-8 shadow-[0_0_8px_rgba(196,124,43,0.5)]"
        />

        {/* Body Paragraph 1 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
          className="font-inter text-sm text-[#F5ECD7] leading-loose max-w-[600px] mx-auto mb-6"
        >
          Albus isn&apos;t just a creator — it&apos;s a whole{" "}
          <motion.span
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-[#E8A44A] inline-block font-medium"
            style={{ textShadow: "0 0 12px #E8A44A88" }}
          >
            universe
          </motion.span>{" "}
          built around one thing: gaming that means something.
        </motion.p>

        {/* Body Paragraph 2 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.55 }}
          className="font-inter text-sm text-[#F5ECD7] leading-loose max-w-[600px] mx-auto mb-16"
        >
          From lightning-fast highlight reels to slow, methodical esports
          breakdowns — every corner of the Albus world has a role to play.
          This isn&apos;t content for the casual scroll. This is content for
          people who actually care about the game.
        </motion.p>

        {/* Three Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {CARDS.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.7 + idx * 0.15,
              }}
              className="group relative flex flex-col items-center bg-[#110B07] border border-[#2A1F15] rounded-[6px] p-[28px] transition-all duration-300 hover:border-[#C47C2B] hover:shadow-[0_0_24px_rgba(196,124,43,0.2)]"
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center min-h-[50px]">
                {card.icon}
              </div>
              <h3 className="font-bebas text-xl text-[#E8A44A] tracking-wider mb-2">
                {card.title}
              </h3>
              <p className="font-sora text-xs text-[#7A6A55] leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
