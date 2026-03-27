import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function YouTubeModal({ isOpen, onClose }: YouTubeModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[500px] bg-[#0A0705] border border-[#2A1F15] rounded-[12px] p-8 shadow-[0_0_50px_rgba(196,124,43,0.15)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#C47C2B]/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-wider mb-2">Choose Your Vibe</h3>
                <p className="font-inter text-sm text-[#7A6A55]">Explore the Albus Universe across our channels.</p>
              </div>
              <button 
                onClick={onClose}
                className="text-[#7A6A55] hover:text-[#C47C2B] transition-colors p-2 -mr-2 -mt-2 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
              {[
                {
                  name: "Albus7T",
                  desc: "Gaming Content",
                  url: "https://www.youtube.com/@Albus7T",
                },
                {
                  name: "Albus Decoded",
                  desc: "Gaming Guide & Esport",
                  url: "https://www.youtube.com/@AlbusDecoded",
                },
                {
                  name: "Albus7T Ki Hat",
                  desc: "Live Streaming",
                  url: "https://youtube.com/@albus7tkihat",
                }
              ].map((channel, i) => (
                <motion.a
                  key={channel.name}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="group flex items-center justify-between p-4 rounded-[8px] bg-[#1A0F08] border border-[#2A1F15] hover:border-[#C47C2B] hover:shadow-[0_0_20px_rgba(196,124,43,0.1)] transition-all duration-300"
                >
                  <div>
                    <h4 className="font-sora font-semibold text-[#E8A44A] text-lg mb-1 group-hover:text-[#F5ECD7] transition-colors">{channel.name}</h4>
                    <span className="font-inter text-xs text-[#7A6A55] tracking-wide uppercase">{channel.desc}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#0A0705] border border-[#2A1F15] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C47C2B]/10 group-hover:border-[#C47C2B]/30 transition-all duration-300">
                    <span className="text-[#C47C2B] font-inter font-bold">→</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
