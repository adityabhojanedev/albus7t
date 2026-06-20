"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import { ChevronDown, ChevronRight, Menu, X, Globe, BookOpen, MessageSquareWarning } from "lucide-react";
import { pubgChapters, Language, Chapter } from "./pubgData";
import { valoChapters } from "./valoData";

// ============================================================================
// DATA & CONTENT
// ============================================================================

type GameKey = "PUBG" | "VALORANT";

interface DocItem {
  id: string;
  title: string;
  content?: React.ReactNode;
  isChapterData?: boolean;
  chapterData?: Chapter;
}

interface DocCategory {
  title: string;
  items: DocItem[];
}

const pubgCategories: DocCategory[] = [
  {
    title: "Fundamentals & Roles",
    items: pubgChapters.slice(0, 2).map((ch) => ({
      id: ch.id,
      title: ch.title.split(": ")[1] || ch.title,
      isChapterData: true,
      chapterData: ch,
    })),
  },
  {
    title: "Tactics & Strategy",
    items: pubgChapters.slice(2, 5).map((ch) => ({
      id: ch.id,
      title: ch.title.split(": ")[1] || ch.title,
      isChapterData: true,
      chapterData: ch,
    })),
  },
  {
    title: "Advanced Execution",
    items: pubgChapters.slice(5, 8).map((ch) => ({
      id: ch.id,
      title: ch.title.split(": ")[1] || ch.title,
      isChapterData: true,
      chapterData: ch,
    })),
  },
  {
    title: "Psychology & Analysis",
    items: pubgChapters.slice(8, 12).map((ch) => ({
      id: ch.id,
      title: ch.title.split(": ")[1] || ch.title,
      isChapterData: true,
      chapterData: ch,
    })),
  },
];

const valoCategories: DocCategory[] = [
  {
    title: "Fundamentals & Roles",
    items: valoChapters.slice(0, 2).map((ch) => ({
      id: ch.id,
      title: ch.title.split(": ")[1] || ch.title,
      isChapterData: true,
      chapterData: ch,
    })),
  },
  {
    title: "Tactics & Strategy",
    items: valoChapters.slice(2, 5).map((ch) => ({
      id: ch.id,
      title: ch.title.split(": ")[1] || ch.title,
      isChapterData: true,
      chapterData: ch,
    })),
  },
  {
    title: "Advanced Execution",
    items: valoChapters.slice(5, 8).map((ch) => ({
      id: ch.id,
      title: ch.title.split(": ")[1] || ch.title,
      isChapterData: true,
      chapterData: ch,
    })),
  },
  {
    title: "Psychology & Analysis",
    items: valoChapters.slice(8, 12).map((ch) => ({
      id: ch.id,
      title: ch.title.split(": ")[1] || ch.title,
      isChapterData: true,
      chapterData: ch,
    })),
  },
];

const docsData: Record<GameKey, DocCategory[]> = {
  PUBG: pubgCategories,
  VALORANT: valoCategories,
};

// ============================================================================
// COMPONENTS
// ============================================================================

function SidebarCategory({ title, items, activeId, onSelect, accentColor, isOpen, onToggle }: { 
  title: string; items: DocItem[]; activeId: string; onSelect: (id: string) => void; accentColor: string;
  isOpen: boolean; onToggle: () => void;
}) {
  const hasActive = items.some(i => i.id === activeId);

  return (
    <div className="mb-4">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 text-[#7A6A55] hover:text-[#F5ECD7] transition-colors group"
      >
        <span className={`text-[11px] font-bold uppercase tracking-widest ${hasActive && !isOpen ? "text-[#F5ECD7]" : ""}`}>
          {title}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""} group-hover:text-[#F5ECD7]`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-1 space-y-1"
          >
            {items.map(item => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-inter transition-all duration-200 ${
                    isActive 
                      ? "bg-[#1A0F08] text-[#F5ECD7] font-medium shadow-sm border border-[#2A1F15]" 
                      : "text-[#A89A85] hover:bg-[#1A0F08]/60 hover:text-[#F5ECD7] border border-transparent"
                  }`}
                >
                  <span className="truncate pr-2">{item.title}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GameChapterView({ chapter, language, gameName, accentColor }: { chapter: Chapter; language: Language; gameName: string; accentColor: string }) {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h2 style={{ color: accentColor }} className="font-sora font-semibold tracking-widest uppercase text-sm mb-2">{gameName} Guide</h2>
        <h1 className="font-bebas text-4xl md:text-5xl text-[#F5ECD7] tracking-wider mb-2 leading-tight">
          {chapter.title}
        </h1>
      </div>

      <div className="space-y-8 text-[#A89A85] text-base md:text-lg leading-relaxed font-inter">
        <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 md:p-8 rounded-xl shadow-lg">
          <p className="whitespace-pre-wrap">{chapter.description[language]}</p>
        </div>

        <div>
          <h3 className="text-sm font-sora font-bold text-[#E8A44A] uppercase tracking-widest mb-4">
            Key Concepts
          </h3>
          <div className="flex flex-wrap gap-2">
            {chapter.keyConcepts.split(",").map((concept: string, idx: number) => (
              <span key={idx} className="bg-[#C47C2B]/10 text-[#C47C2B] px-4 py-2 rounded-full text-xs font-semibold border border-[#C47C2B]/20">
                {concept.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#0F0A06] border border-[#2A1F15] rounded-xl overflow-hidden shadow-md">
          <div className="bg-[#1A0F08] border-b border-[#2A1F15] px-6 py-4 flex items-center gap-3">
            <BookOpen size={18} className="text-[#C47C2B]" />
            <h4 className="font-sora font-semibold text-[#F5ECD7] text-sm uppercase tracking-wide">
              {chapter.exampleTitle || "Example"}
            </h4>
          </div>
          <div className="p-6 md:p-8">
            <p className="whitespace-pre-wrap">{chapter.example[language]}</p>
          </div>
        </div>

        <div 
          className="p-6 md:p-8 rounded-r-xl shadow-sm border-t border-r border-b border-[#2A1F15]"
          style={{ 
            borderLeft: `4px solid ${accentColor}`,
            background: `linear-gradient(to bottom right, ${accentColor}1A, transparent)` 
          }}
        >
          <h4 style={{ color: accentColor }} className="font-bold text-xs uppercase tracking-widest block mb-3">
            Pro Tip: {chapter.proTipTitle}
          </h4>
          <p className="italic text-[#F5ECD7] whitespace-pre-wrap leading-relaxed">{chapter.proTip[language]}</p>
        </div>
      </div>
    </div>
  );
}

export default function EsportsDocsPage() {
  const [activeGame, setActiveGame] = useState<GameKey>("PUBG");
  const [activeDocId, setActiveDocId] = useState<string>(docsData["PUBG"][0].items[0].id);
  const [isGameSelectorOpen, setIsGameSelectorOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("EN");
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number>(0);

  // Default to first item when switching games
  const handleGameChange = (game: GameKey) => {
    setActiveGame(game);
    setActiveDocId(docsData[game][0].items[0].id);
    setIsGameSelectorOpen(false);
    setIsMobileSidebarOpen(false);
    setOpenCategoryIndex(0);
  };

  const handleDocChange = (id: string) => {
    setActiveDocId(id);
    setIsMobileSidebarOpen(false);
  };

  // Find active content
  const accentColor = activeGame === "PUBG" ? "#C47C2B" : "#FF4655";
  let activeContent: React.ReactNode = null;
  let activeDocItem: DocItem | null = null;
  
  for (const cat of docsData[activeGame]) {
    for (const item of cat.items) {
      if (item.id === activeDocId) {
        activeDocItem = item;
      }
    }
  }

  if (activeDocItem) {
    if (activeDocItem.isChapterData && activeDocItem.chapterData) {
      activeContent = (
        <GameChapterView 
          chapter={activeDocItem.chapterData} 
          language={language} 
          gameName={activeGame === "PUBG" ? "PUBG Mobile" : "Valorant"} 
          accentColor={accentColor} 
        />
      );
    } else {
      activeContent = activeDocItem.content;
    }
  }

  // Animation variants
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" } 
    },
    exit: { 
      opacity: 0, 
      y: -15, 
      filter: "blur(4px)",
      transition: { duration: 0.2, ease: "easeIn" } 
    }
  };

  return (
    <main className="w-full h-screen flex flex-col bg-[#0A0705] text-[#F5ECD7] font-inter overflow-hidden">
      {/* Absolute Navbar so it spans top */}
      <div className="shrink-0 relative z-50">
        <Navbar />
      </div>

      {/* Main Layout Container (Below Navbar) */}
      <div className="flex-1 flex overflow-hidden pt-20">
        
        {/* Mobile Sidebar Toggle */}
        <button 
          className="md:hidden fixed bottom-6 right-6 z-50 text-[#0A0705] p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: accentColor }}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* ======================= SIDEBAR ======================= */}
        <aside className={`
          fixed md:relative z-40 w-80 h-full bg-[#050302] border-r border-[#2A1F15] flex flex-col transition-transform duration-300 shadow-2xl md:shadow-none
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          
          {/* Game Selector Dropdown */}
          <div className="p-6 border-b border-[#2A1F15] relative bg-[#0A0705]">
            <span className="text-[#7A6A55] text-[10px] font-bold uppercase tracking-widest mb-3 block">Select Game</span>
            <button 
              className="w-full flex items-center justify-between bg-[#1A0F08] border border-[#2A1F15] rounded-xl p-3.5 hover:border-[#C47C2B]/50 transition-colors shadow-sm"
              onClick={() => setIsGameSelectorOpen(!isGameSelectorOpen)}
            >
              <span className="font-sora font-semibold text-[#F5ECD7] tracking-wide">
                {activeGame === "PUBG" ? "PUBG MOBILE" : "VALORANT"}
              </span>
              <ChevronDown size={18} className={`text-[#7A6A55] transition-transform duration-300 ${isGameSelectorOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isGameSelectorOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-6 right-6 top-[92px] bg-[#1A0F08] border border-[#2A1F15] rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <button 
                    className="w-full text-left px-5 py-3.5 hover:bg-[#C47C2B]/10 text-[#A89A85] hover:text-[#C47C2B] font-sora text-sm font-medium transition-colors"
                    onClick={() => handleGameChange("PUBG")}
                  >
                    PUBG MOBILE
                  </button>
                  <button 
                    className="w-full text-left px-5 py-3.5 hover:bg-[#FF4655]/10 text-[#A89A85] hover:text-[#FF4655] font-sora text-sm font-medium transition-colors border-t border-[#2A1F15]"
                    onClick={() => handleGameChange("VALORANT")}
                  >
                    VALORANT
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {docsData[activeGame].map((category, catIdx) => (
              <SidebarCategory
                key={catIdx}
                title={category.title}
                items={category.items}
                activeId={activeDocId}
                onSelect={handleDocChange}
                accentColor={accentColor}
                isOpen={openCategoryIndex === catIdx}
                onToggle={() => setOpenCategoryIndex(catIdx === openCategoryIndex ? -1 : catIdx)}
              />
            ))}
          </div>
        </aside>

        {/* ======================= MAIN CONTENT AREA ======================= */}
        <div className="flex-1 relative overflow-y-auto custom-scrollbar bg-[#0A0705]">
          {/* Top Bar for Language Toggle (PUBG Only) */}
          <div className="sticky top-0 z-30 bg-[#0A0705]/90 backdrop-blur-md border-b border-[#2A1F15] px-8 md:px-12 py-4 flex items-center justify-between min-h-[64px]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-sora text-[#7A6A55] uppercase tracking-widest">
              <span className="hidden md:inline">{activeGame}</span>
              <ChevronRight size={12} className="hidden md:block" />
              <span style={{ color: accentColor }} className="truncate max-w-[200px] md:max-w-none">
                {activeDocItem?.title}
              </span>
            </div>

            {/* Actions: Feedback & Language Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.dispatchEvent(new Event("openFeedbackModal"))}
                className="flex items-center gap-2 text-xs font-semibold text-[#7A6A55] hover:text-[#C47C2B] transition-colors bg-[#1A0F08] px-3 py-1.5 rounded-lg border border-[#2A1F15]"
              >
                <MessageSquareWarning size={14} />
                <span className="hidden md:inline">Report Issue</span>
              </button>

              {/* Always show Language Toggle since both use chapters now */}
              <div className="flex items-center bg-[#1A0F08] p-1 rounded-lg border border-[#2A1F15]">
                <button
                  onClick={() => setLanguage("EN")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    language === "EN" ? "bg-[#2A1F15] text-[#F5ECD7] shadow-sm" : "text-[#7A6A55] hover:text-[#A89A85]"
                  }`}
                >
                  <Globe size={14} />
                  ENG
                </button>
                <button
                  onClick={() => setLanguage("HI")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    language === "HI" ? "bg-[#2A1F15] text-[#F5ECD7] shadow-sm" : "text-[#7A6A55] hover:text-[#A89A85]"
                  }`}
                >
                  HIN
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-5xl px-8 md:px-12 py-8 md:py-12 min-h-full flex flex-col w-full">
            {/* Dynamic Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDocId + language}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-1"
              >
                {activeContent}
              </motion.div>
            </AnimatePresence>
            
            {/* Footer inside content area */}
            <div className="mt-24 border-t border-[#2A1F15] pt-8 text-center text-[#7A6A55] text-xs font-inter">
              Albus Esports Strategic Analysis · Data tailored for optimal export.
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
