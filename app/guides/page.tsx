// Force TS Server resync
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import { ChevronRight, ChevronDown, Menu, X, MonitorPlay, Crosshair, Map, Video, MessageSquareWarning } from "lucide-react";
import { guidesData, GuideGameKey, GuideItem, GuideCategory } from "@/app/guides/guidesData";

const GAME_INFO: Record<GuideGameKey, { label: string; accent: string; icon: React.ReactNode }> = {
  VALORANT: { label: "VALORANT", accent: "#FF4655", icon: <Crosshair size={16} /> },
  ARENA: { label: "ARENA BREAKOUT", accent: "#8FBC8F", icon: <Map size={16} /> },
  RUST: { label: "RUST", accent: "#E67E22", icon: <MonitorPlay size={16} /> },
  CONTENT: { label: "CONTENT SERIES", accent: "#C47C2B", icon: <Video size={16} /> },
};

export default function GuidesPage() {
  const [activeGame, setActiveGame] = useState<GuideGameKey>("VALORANT");
  const [activeDocId, setActiveDocId] = useState<string>(guidesData["VALORANT"][0].items[0].id);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isGameSelectorOpen, setIsGameSelectorOpen] = useState(false);

  const handleGameChange = (game: GuideGameKey) => {
    setActiveGame(game);
    setActiveDocId(guidesData[game][0].items[0].id);
    setIsMobileSidebarOpen(false);
  };

  const handleDocChange = (id: string) => {
    setActiveDocId(id);
    setIsMobileSidebarOpen(false);
  };

  // Find active content
  let activeContent: React.ReactNode = null;
  let activeDocItem: GuideItem | null = null;
  let activeCategoryTitle = "";
  
  for (const cat of guidesData[activeGame]) {
    for (const item of cat.items) {
      if (item.id === activeDocId) {
        activeDocItem = item;
        activeCategoryTitle = cat.title;
      }
    }
  }

  if (activeDocItem) {
    activeContent = activeDocItem.content;
  }

  const contentVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.4, ease: "easeOut" } 
    },
    exit: { 
      opacity: 0, 
      x: -20, 
      transition: { duration: 0.2, ease: "easeIn" } 
    }
  };

  const accentColor = GAME_INFO[activeGame].accent;

  return (
    <main className="w-full h-screen flex flex-col bg-[#050302] text-[#F5ECD7] font-inter overflow-hidden selection:bg-[#C47C2B]/30 relative">
      {/* Background glow effects to make it look distinct from Esports */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 blur-[120px] opacity-10 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: accentColor }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 blur-[120px] opacity-10 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: accentColor }}
      />

      <div className="shrink-0 relative z-50">
        <Navbar />
      </div>

      {/* Floating Layout Wrapper */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 md:px-8 pb-8 pt-24 md:pt-28 flex gap-6 h-full relative z-40 overflow-hidden">
        
        {/* Mobile Sidebar Toggle */}
        <button 
          className="md:hidden fixed bottom-6 right-6 z-50 text-[#0A0705] p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: accentColor }}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* FLOATING SIDEBAR */}
        <aside className={`
          fixed md:relative z-40 w-80 h-[calc(100vh-6rem)] md:h-full bg-[#0F0A06]/90 backdrop-blur-xl border border-[#2A1F15] rounded-3xl flex flex-col transition-transform duration-300 shadow-2xl shrink-0
          ${isMobileSidebarOpen ? "translate-x-0 inset-y-20 left-4" : "-translate-x-[150%] md:translate-x-0"}
        `}>
          {/* Game Selection Dropdown */}
          <div className="p-6 border-b border-[#2A1F15] relative bg-[#0F0A06]/50 rounded-t-3xl">
            <span className="text-[#7A6A55] text-[10px] font-bold uppercase tracking-widest mb-3 block">Select Game</span>
            <button 
              className="w-full flex items-center justify-between bg-[#1A0F08] border border-[#2A1F15] rounded-xl p-3.5 hover:border-[#C47C2B]/50 transition-colors shadow-sm"
              onClick={() => setIsGameSelectorOpen(!isGameSelectorOpen)}
            >
              <span className="font-sora font-semibold text-[#F5ECD7] tracking-wide flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-black/20" style={{ color: accentColor }}>
                  {GAME_INFO[activeGame].icon}
                </span>
                {GAME_INFO[activeGame].label}
              </span>
              <ChevronDown size={18} className={`text-[#7A6A55] transition-transform duration-300 ${isGameSelectorOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isGameSelectorOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-6 right-6 top-[92px] bg-[#1A0F08] border border-[#2A1F15] rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  {(Object.keys(GAME_INFO) as GuideGameKey[]).map(key => {
                    const info = GAME_INFO[key];
                    const isSelected = activeGame === key;
                    return (
                      <button 
                        key={key}
                        className="w-full flex items-center gap-3 text-left px-5 py-3.5 font-sora text-sm font-medium transition-colors border-b border-[#2A1F15] last:border-b-0 hover:bg-black/20"
                        style={{ color: isSelected ? info.accent : "#A89A85" }}
                        onClick={() => {
                          handleGameChange(key);
                          setIsGameSelectorOpen(false);
                        }}
                      >
                        <span className={`p-1.5 rounded-lg ${isSelected ? "bg-black/20" : "bg-[#0F0A06]"}`}>
                          {info.icon}
                        </span>
                        {info.label}
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Categories & Docs */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            {guidesData[activeGame].map((category: GuideCategory, catIdx: number) => (
              <div key={catIdx} className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#7A6A55] pl-2 mb-2">
                  {category.title}
                </h4>
                <div className="space-y-1">
                  {category.items.map(item => {
                    const isActive = activeDocId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleDocChange(item.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 relative group flex items-center justify-between ${
                          isActive 
                            ? "bg-[#1A0F08] text-[#F5ECD7] font-medium shadow-sm border border-[#2A1F15]" 
                            : "text-[#A89A85] hover:bg-[#1A0F08]/60 hover:text-[#F5ECD7] border border-transparent"
                        }`}
                      >
                        <span className="truncate pr-2 relative z-10">{item.title}</span>
                        {isActive && (
                          <motion.div 
                            layoutId="activeIndicator"
                            className="w-1.5 h-1.5 rounded-full shrink-0" 
                            style={{ backgroundColor: accentColor }} 
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* FLOATING CONTENT AREA */}
        <div className="flex-1 bg-[#0F0A06]/90 backdrop-blur-xl border border-[#2A1F15] rounded-3xl flex flex-col relative overflow-hidden shadow-2xl h-full">
          
          {/* Content Header */}
          <div className="shrink-0 border-b border-[#2A1F15] px-8 py-5 flex items-center justify-between bg-[#1A0F08]/50">
            <div className="flex items-center gap-2 text-xs font-sora text-[#7A6A55] uppercase tracking-widest">
              <span className="hidden md:inline">{GAME_INFO[activeGame].label}</span>
              <ChevronRight size={12} className="hidden md:block" />
              <span>{activeCategoryTitle}</span>
              <ChevronRight size={12} />
              <span style={{ color: accentColor }} className="truncate max-w-[150px] md:max-w-none">
                {activeDocItem?.title}
              </span>
            </div>
            
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openFeedbackModal'))}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#FF4655]/10 text-[#FF4655] hover:bg-[#FF4655]/20 border border-[#FF4655]/20 rounded-md text-xs font-semibold transition-colors"
            >
              <MessageSquareWarning size={14} />
              <span className="hidden md:inline">Report Issue</span>
            </button>
          </div>

          {/* Actual Content Wrapper */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 md:px-12 md:py-12 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDocId}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {activeContent}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </main>
  );
}
