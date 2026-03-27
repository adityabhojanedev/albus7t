"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { name: "Home", href: "#hero" },
      { name: "Streams", href: "https://www.twitch.tv/albus7t" },
      { name: "Esport", href: "#" },
      { name: "Guides", href: "#" },
      { name: "About", href: "#about" },
    ],
  },
  {
    title: "Channels",
    links: [
      { name: "albus7t", href: "https://www.youtube.com/@Albus7T" },
      { name: "albus decoded", href: "https://www.youtube.com/@AblusDecoded" },
      { name: "albus7t ki hat", href: "https://www.youtube.com/@Albus7TkiHat" },
    ],
  },
  {
    title: "Connect",
    links: [
      { name: "YouTube", href: "https://www.youtube.com/@Albus7T" },
      { name: "Instagram", href: "https://www.instagram.com/albus7t?igsh=MW5lb3ZpdXdvcW54cQ%3D%3D&utm_source=qr" },
      { name: "Discord", href: "https://discord.com/invite/d6YkJP4XwG" },
      { name: "Twitch", href: "https://www.twitch.tv/albus7t" },
    ],
  },
];

const SOCIALS = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@Albus7T",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/albus7t?igsh=MW5lb3ZpdXdvcW54cQ%3D%3D&utm_source=qr",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.com/invite/d6YkJP4XwG",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.82 2.84a14.7 14.7 0 0 0-5.64 0 14.65 14.65 0 0 0-4.48 2.37A17.15 17.15 0 0 0 1.34 18a15.22 15.22 0 0 0 5.46 3.06c.38-.5.71-1 1-1.54a11.12 11.12 0 0 1-3.66-1.74c.25-.19.51-.39.75-.6a8.55 8.55 0 0 0 14.16 0c.25.21.5.41.76.6a11.15 11.15 0 0 1-3.66 1.74 15.8 15.8 0 0 0 1 1.54A15.4 15.4 0 0 0 22.66 18a17.34 17.34 0 0 0-3.36-12.79 14.66 14.66 0 0 0-4.48-2.37zM8.52 14.4c-1.12 0-2.05-1-2.05-2.28s.9-2.28 2.05-2.28 2.05 1 2.05 2.28-.9 2.28-2.05 2.28zm6.96 0c-1.12 0-2.05-1-2.05-2.28s.9-2.28 2.05-2.28 2.05 1 2.05 2.28-.9 2.28-2.05 2.28z"/></svg>
    ),
  },
  {
    name: "Twitch",
    href: "https://www.twitch.tv/albus7t",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2H3v16h5v4l4-4h5l4-4V2z"/><path d="M11 11V7M16 11V7"/></svg>
    ),
  },
];

const FooterColumnAccordion = ({ col, index }: { col: typeof COLUMNS[0]; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 * index, ease: "easeOut" }}
      className="flex flex-col w-full md:w-auto mb-6 md:mb-0"
    >
      {/* Desktop Header */}
      <h4 className="hidden md:block font-bebas text-sm tracking-widest text-[#C47C2B] border-b border-[#2A1F15] pb-2 mb-4">
        {col.title}
      </h4>

      {/* Mobile Accordion Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex justify-between items-center w-full font-bebas text-sm tracking-widest text-[#C47C2B] border-b border-[#2A1F15] pb-2 mb-2 focus:outline-none"
      >
        <span>{col.title}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-[#C47C2B]">
          ▼
        </motion.span>
      </button>

      {/* Desktop Links (Always visible) */}
      <ul className="hidden md:flex flex-col gap-4">
        {col.links.map((link) => (
          <li key={link.name}>
            <a 
              href={link.href} 
              onClick={(e) => {
                if (link.href.startsWith("#")) {
                  e.preventDefault();
                  document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative inline-block transition-all duration-200"
            >
              <motion.span
                whileHover={{ x: 4, color: "#F5ECD7" }}
                className="font-sora text-xs text-[#7A6A55] inline-block transition-colors duration-200"
              >
                {link.name}
              </motion.span>
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile Links (Animated Accordion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden flex flex-col overflow-hidden"
          >
            <div className="py-2 flex flex-col gap-4 mb-2">
              {col.links.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    onClick={(e) => {
                      if (link.href.startsWith("#")) {
                        e.preventDefault();
                        document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="font-sora text-xs text-[#7A6A55] hover:text-[#F5ECD7] transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Footer() {
  return (
    <footer id="footer" className="relative w-full bg-[#070503] pt-[60px] pb-[24px] md:pt-[80px] md:pb-[32px] overflow-hidden z-0">
      
      {/* Torn Parchment Top Edge (SVG Mimic inverted) */}
      <div className="absolute top-0 left-0 w-full h-[40px] md:h-[60px] z-[5] pointer-events-none opacity-80" style={{ transform: "rotate(180deg)" }}>
        <svg preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" style={{ fill: '#1A0F08', width: '100%', height: '100%' }}>
          <path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" opacity=".25" />
          <path d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z" opacity=".5" />
          <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" />
        </svg>
      </div>

      {/* Atmospheric Radial Glow */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7C4A1E] blur-[150px] rounded-full z-[1] pointer-events-none"
        style={{ opacity: 0.08 }}
      />

      <div className="relative z-10 w-full max-w-[1240px] px-6 md:px-12 mx-auto pt-8 flex flex-col">
        
        {/* Inner Decor Brackets */}
        <div className="absolute top-0 left-6 text-[#2A1F15] text-[20px] leading-none select-none pointer-events-none">╔</div>
        <div className="absolute top-0 right-6 text-[#2A1F15] text-[20px] leading-none select-none pointer-events-none">╗</div>

        <div className="flex flex-col md:flex-row justify-between w-full mt-4 md:mt-8">
          
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center md:items-start text-center md:text-left mb-16 md:mb-0 md:w-1/3"
          >
            <div className="relative inline-block">
              {/* Flanking Decorative Runes */}
              <div className="absolute top-[50%] left-[-30px] font-bold text-[#C47C2B] opacity-[0.04] text-3xl pointer-events-none select-none -translate-y-1/2">ᛟ</div>
              <div className="absolute top-[50%] right-[-30px] font-bold text-[#C47C2B] opacity-[0.04] text-3xl pointer-events-none select-none -translate-y-1/2">ᚫ</div>
              <h2 className="font-bebas text-5xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] to-[#E8A44A] tracking-wider drop-shadow-[0_0_12px_rgba(196,124,43,0.4)]">
                ALBUS
              </h2>
            </div>
            
            <p className="font-sora text-xs text-[#7A6A55] leading-relaxed max-w-[220px] mt-2 mb-6">
              Albus Universe — Play. Decode. Stream. Repeat.
            </p>

            {/* Social Icons Row */}
            <div className="flex flex-row gap-[16px]">
              {SOCIALS.map((social, idx) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, color: "#E8A44A" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + idx * 0.1, ease: "backOut" }}
                  className="text-[#7A6A55] transition-colors duration-200 focus:outline-none"
                  aria-label={social.name}
                >
                  {social.svg}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation Columns */}
          <div className="flex flex-col md:flex-row w-full md:w-2/3 md:justify-end md:gap-x-24">
            {COLUMNS.map((col, i) => (
              <FooterColumnAccordion key={col.title} col={col} index={i} />
            ))}
          </div>

        </div>

        {/* Divider & Pulse Area */}
        <div className="relative w-full mt-10 md:mt-24 mb-6 md:mb-8 pt-6 md:pt-8 bg-transparent">
          {/* Solid line rendering left-to-right */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-[1px] bg-[#2A1F15] origin-left"
          />
          {/* Centered Glowing Element Over Line */}
          <motion.div
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[2px] bg-[#C47C2B] shadow-[0_0_10px_rgba(196,124,43,0.6)]"
          />
        </div>

        {/* Footer Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0"
        >
          <span className="font-sora text-xs text-[#3A2F25] text-center md:text-left transition-colors hover:text-[#7A6A55]">
            Built for gamers. Watched by legends.
          </span>
          <span className="font-sora text-xs text-[#3A2F25] text-center md:text-right hover:text-[#7A6A55] transition-colors duration-300">
            © 2025 Albus Universe. All rights reserved.
          </span>
        </motion.div>

      </div>
    </footer>
  );
}
