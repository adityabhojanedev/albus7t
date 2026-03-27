"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STEPS = [
  {
    step: "01",
    icon: "💬",
    title: "Drop a Comment",
    description: "Every breakdown starts with a conversation. Jump in.",
  },
  {
    step: "02",
    icon: "🌙",
    title: "Catch the Drop",
    description: "Live sessions, midnight energy. Don't miss the moment.",
  },
  {
    step: "03",
    icon: "⚔️",
    title: "Debate the Strats",
    description: "Think you know better? Prove it in the community posts.",
  },
];

export default function CommunitySection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="community" className="relative w-full min-h-screen bg-[#0A0705] flex flex-col items-center justify-center overflow-hidden py-24 z-0">
      
      {/* Background Elements */}
      {/* 1. Top Edge Parchment Fade */}
      <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-b from-[#1A0F08] to-transparent z-[5] pointer-events-none" />

      {/* 2. Blurred Orb (Bottom Left) */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#7C4A1E] blur-[100px] rounded-full z-[1] pointer-events-none"
        style={{ opacity: 0.10 }}
      />
      
      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center w-full px-6 max-w-[1000px] mx-auto">
        
        {/* Section Label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 }}
          className="font-sora text-xs tracking-[0.2em] text-[#7A6A55] uppercase mb-4 block"
        >
          The Community
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
          className="font-bebas text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] via-[#E8A44A] to-[#F5ECD7] mb-6 drop-shadow-[0_0_18px_rgba(196,124,43,0.27)]"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.1 }}
        >
          You&apos;re Not Just a Viewer Here
        </motion.h2>

        {/* Divider Line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 60, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          className="h-[2px] bg-[#C47C2B] mx-auto mb-8 shadow-[0_0_8px_rgba(196,124,43,0.5)]"
        />

        {/* Body Copy */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
          className="font-inter text-sm text-[#F5ECD7] leading-loose max-w-[580px] mx-auto mb-16"
        >
          The Albus community isn&apos;t an audience — it&apos;s a{" "}
          <motion.span
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-[#E8A44A] inline-block font-medium"
            style={{ textShadow: "0 0 10px rgba(232,164,74,0.53)" }}
          >
            squad
          </motion.span>
          . Whether you&apos;re breaking down a pro play in the comments, catching a live drop at{" "}
          <motion.span
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-[#C47C2B] inline-block font-medium"
            style={{ textShadow: "0 0 10px rgba(196,124,43,0.53)" }}
          >
            midnight
          </motion.span>
          , or debating strats in the community posts, there&apos;s always something happening.
        </motion.p>

        {/* Timeline Flow */}
        <div className="relative w-full max-w-[900px] mx-auto mb-16 flex flex-col md:flex-row items-start md:items-start justify-between mt-8">
          
          {/* Mobile vertical line base */}
          <div className="absolute left-[23px] top-0 w-[2px] h-full bg-[#2A1F15] md:hidden z-0" />
          
          {/* Mobile vertical line animated */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
            className="absolute left-[23px] top-0 w-[2px] h-full bg-[#C47C2B] origin-top md:hidden z-0 shadow-[0_0_12px_rgba(196,124,43,0.5)]"
          />

          {/* Desktop horizontal line base */}
          <div className="hidden md:block absolute left-0 top-[23px] w-full h-[2px] bg-[#2A1F15] z-0" />
          
          {/* Desktop horizontal line animated */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
            className="hidden md:block absolute left-0 top-[23px] w-full h-[2px] bg-[#C47C2B] origin-left z-0 shadow-[0_0_12px_rgba(196,124,43,0.5)]"
          />

          {/* Timeline Steps */}
          {STEPS.map((step, idx) => (
            <div key={step.step} className="relative flex flex-col items-start md:items-center w-full md:w-1/3 pl-[64px] md:pl-0 mb-12 md:mb-0 z-10">
              
              {/* Step Node */}
              <motion.div
                initial={{ scale: 0, backgroundColor: "#1A0F08", borderColor: "#2A1F15", boxShadow: "0 0 0px transparent" }}
                whileInView={{ scale: 1, backgroundColor: "#1A0F08", borderColor: "#C47C2B", boxShadow: "0 0 16px rgba(196,124,43,0.4)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: 0.6 + idx * 0.3, ease: "backOut" }}
                className="absolute left-0 md:relative md:left-auto flex flex-col items-center justify-center w-[48px] h-[48px] rounded-full border-2 bg-[#1A0F08] z-20"
              >
                <span className="font-bebas text-sm text-[#7A6A55] leading-none mt-1">{step.step}</span>
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + idx * 0.3 }}
                  className="w-[8px] h-[8px] bg-[#C47C2B] rounded-full mt-0.5" 
                />
              </motion.div>

              {/* Step Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 1.0 + idx * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col items-start md:items-center mt-0 md:mt-8 text-left md:text-center"
              >
                <div 
                  className="text-2xl mb-3"
                  style={{ filter: "sepia(1) hue-rotate(-20deg) saturate(2) brightness(1.2)" }}
                >
                  {step.icon}
                </div>
                <h3 className="font-bebas text-2xl text-[#E8A44A] tracking-wider mb-2">
                  {step.title}
                </h3>
                <p className="font-sora text-xs text-[#7A6A55] leading-relaxed max-w-[180px]">
                  {step.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* CTA Area */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 1.8 }}
           className="flex flex-col items-center w-full"
        >
          <a
            href="https://discord.com/invite/d6YkJP4XwG"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-sora font-semibold text-[#C47C2B] bg-transparent border border-[#7C4A1E] hover:border-[#E8A44A] hover:text-[#E8A44A] hover:bg-[#7C4A1E18] transition-all duration-300 rounded-[4px] px-[36px] py-[14px] w-full sm:w-auto mb-4"
          >
            Join the conversation <span className="ml-2 font-inter font-bold">→</span>
          </a>
          <span className="font-inter text-xs text-[#7A6A55]">
            Discord · YouTube Community · Comment Section
          </span>
        </motion.div>
        
      </div>
    </section>
  );
}
