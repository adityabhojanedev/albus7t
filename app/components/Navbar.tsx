"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "Streams", href: "https://www.twitch.tv/albus7t" },
  { name: "Esport", href: "#" },
  { name: "Guides", href: "#" },
  { name: "Playground", href: "#" },
  { name: "About", href: "#about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaygroundModalOpen, setIsPlaygroundModalOpen] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLinkClick = (e: React.MouseEvent, linkName: string, href: string) => {
    if (linkName === "Playground") {
      e.preventDefault();
      setIsPlaygroundModalOpen(true);
      setIsOpen(false);
      return;
    }

    if (href.startsWith("#")) {
      e.preventDefault();
      document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
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
      setError("Incorrect passcode. Access denied.");
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
              className="md:hidden overflow-hidden bg-[#0F0A06] border-b border-[#2A1F15]"
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

      {/* Playground Passcode Modal */}
      <AnimatePresence>
        {isPlaygroundModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={() => {
              setIsPlaygroundModalOpen(false);
              setError("");
              setPasscode("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[400px] bg-[#0A0705] border border-[#2A1F15] rounded-[12px] p-8 shadow-[0_0_50px_rgba(196,124,43,0.15)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#C47C2B]/10 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-wider mb-1">Restricted Area</h3>
                    <p className="font-inter text-xs text-[#7A6A55]">Enter passcode to access Playground.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsPlaygroundModalOpen(false);
                      setError("");
                      setPasscode("");
                    }}
                    className="text-[#7A6A55] hover:text-[#C47C2B] transition-colors p-2 -mr-2 -mt-2 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <form onSubmit={handlePlaygroundSubmit} className="flex flex-col gap-4">
                  <div>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter Passcode..."
                      className="w-full bg-[#1A0F08] border border-[#2A1F15] text-[#F5ECD7] font-inter text-sm rounded-[6px] px-4 py-3 focus:outline-none focus:border-[#C47C2B] transition-colors"
                      autoFocus
                    />
                    {error && (
                      <motion.span 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                        className="text-red-500 text-xs font-inter mt-2 block"
                      >
                        {error}
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
    </>
  );
}
