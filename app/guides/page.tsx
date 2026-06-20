"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Search, ChevronDown } from "lucide-react";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type TabKey = "VALORANT" | "ARENA" | "RUST" | "CONTENT";

const TABS: { id: TabKey; label: string; color: string; glow: string }[] = [
  { id: "VALORANT", label: "VALORANT", color: "#FF4655", glow: "rgba(255, 70, 85, 0.4)" },
  { id: "ARENA", label: "ARENA BREAKOUT", color: "#8FBC8F", glow: "rgba(143, 188, 143, 0.4)" },
  { id: "RUST", label: "RUST", color: "#E67E22", glow: "rgba(230, 126, 34, 0.4)" },
  { id: "CONTENT", label: "CONTENT SERIES", color: "#C47C2B", glow: "rgba(196, 124, 43, 0.4)" },
];

// ============================================================================
// COMPONENTS
// ============================================================================

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export default function GuidesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("VALORANT");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeTheme = TABS.find((t) => t.id === activeTab)!;
  const filteredTabs = TABS.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <main className="w-full min-h-screen flex flex-col bg-[#050302] text-[#F5ECD7] font-inter overflow-x-hidden selection:bg-[#C47C2B]/30">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 pt-32 pb-24">
        
        {/* HERO & DROPDOWN */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 relative z-50 gap-6">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="font-bebas text-6xl md:text-8xl tracking-wider text-[#C47C2B] drop-shadow-[0_0_15px_rgba(196,124,43,0.3)]"
          >
            BEGINNER GUIDES
          </motion.h1>

          <div className="relative z-50 w-full md:w-64">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#1A0F08]/90 backdrop-blur-md border border-[#C47C2B]/50 rounded-xl font-sora font-bold text-[#F5ECD7] hover:border-[#C47C2B] transition-colors"
            >
              <span>{activeTheme.label}</span>
              <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#0F0A06] border border-[#2A1F15] rounded-xl shadow-2xl overflow-hidden origin-top"
                >
                  <div className="p-2 border-b border-[#2A1F15] relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A55]" />
                    <input 
                      type="text"
                      placeholder="Search games..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#1A0F08] text-[#F5ECD7] text-sm rounded-lg pl-9 pr-3 py-2 outline-none border border-transparent focus:border-[#C47C2B]/50 transition-colors placeholder:text-[#7A6A55]"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                    {filteredTabs.length > 0 ? (
                      filteredTabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsDropdownOpen(false);
                            setSearchQuery("");
                          }}
                          className={`w-full text-left px-4 py-3 text-sm font-sora font-semibold rounded-lg transition-colors ${
                            activeTab === tab.id ? "bg-[#C47C2B]/20 text-[#C47C2B]" : "text-[#A89A85] hover:bg-[#1A0F08] hover:text-[#F5ECD7]"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-[#7A6A55] text-center font-sora">No games found.</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* BENTO GRID CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            {activeTab === "VALORANT" && <ValorantGrid />}
            {activeTab === "ARENA" && <ArenaGrid />}
            {activeTab === "RUST" && <RustGrid />}
            {activeTab === "CONTENT" && <ContentGrid />}
          </motion.div>
        </AnimatePresence>

      </div>
      <Footer />
    </main>
  );
}

// ============================================================================
// VALORANT GRID
// ============================================================================

function ValorantGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
      
      {/* Big Hero Card */}
      <motion.div variants={cardVariants} className="md:col-span-2 lg:col-span-2 row-span-2 bg-gradient-to-br from-[#1A0F08] to-[#0A0705] border border-[#FF4655]/30 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4655]/10 blur-[80px] rounded-full group-hover:bg-[#FF4655]/20 transition-colors" />
        <h2 className="font-bebas text-4xl text-[#FF4655] tracking-widest mb-4">What is VALORANT?</h2>
        <p className="text-[#A89A85] text-lg leading-relaxed mb-8">
          A 5v5 tactical shooter where one team attacks and plants the Spike while the other team defends and prevents the plant.
        </p>
        
        <div className="bg-[#050302] border border-[#2A1F15] rounded-xl p-6">
          <h3 className="font-sora font-semibold text-[#F5ECD7] mb-4 uppercase tracking-widest text-sm">Win Condition</h3>
          <ul className="space-y-3 text-[#A89A85]">
            <li className="flex gap-3"><span className="text-[#FF4655]">●</span> First team to win 13 rounds wins the match.</li>
            <li className="flex gap-3"><span className="text-[#FF4655]">●</span> Every round matters because money carries over.</li>
          </ul>
        </div>
      </motion.div>

      {/* Core Basics - Crosshair */}
      <motion.div variants={cardVariants} className="md:col-span-1 lg:col-span-2 bg-[#0F0A06] border border-[#2A1F15] rounded-3xl p-8 flex flex-col justify-center">
        <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-widest mb-3">Crosshair Placement</h3>
        <p className="text-[#A89A85] mb-6">Keep your crosshair at head level at all times.</p>
        <div className="bg-[#FF4655]/10 border-l-4 border-[#FF4655] p-4 rounded-r-lg">
          <span className="text-[#FF4655] font-bold text-xs uppercase tracking-wider block mb-1">Common Mistake</span>
          <p className="italic text-[#F5ECD7] text-sm">"Looking at the ground while moving."</p>
        </div>
      </motion.div>

      {/* Economy Management */}
      <motion.div variants={cardVariants} className="md:col-span-1 lg:col-span-2 bg-[#0F0A06] border border-[#2A1F15] rounded-3xl p-8">
        <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-widest mb-3">Economy Management</h3>
        <p className="text-[#A89A85] mb-6">You buy weapons and abilities each round.</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {["Full Buy", "Half Buy", "Eco Round", "Force Buy"].map(type => (
            <div key={type} className="bg-[#1A0F08] border border-[#2A1F15] rounded-lg p-3 text-center text-sm font-sora font-semibold text-[#FF4655]">
              {type}
            </div>
          ))}
        </div>
        <p className="italic border-l-2 border-[#FFD700] pl-3 text-[#7A6A55] text-sm">"New players often lose because they buy randomly."</p>
      </motion.div>

      {/* Roles Section - 4 Squares */}
      <motion.div variants={cardVariants} className="md:col-span-3 lg:col-span-4 mt-4">
        <h2 className="font-bebas text-4xl text-[#F5ECD7] tracking-widest mb-6 flex items-center gap-4">
          VALORANT ROLES <span className="h-[1px] flex-1 bg-gradient-to-r from-[#2A1F15] to-transparent" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Duelist */}
          <div className="bg-gradient-to-b from-[#1A0F08] to-[#0F0A06] border border-[#FF4655]/20 hover:border-[#FF4655] transition-colors rounded-2xl p-6">
            <h4 className="font-sora font-bold text-[#FF4655] text-xl mb-2">Duelist</h4>
            <p className="text-xs text-[#F5ECD7] mb-4">Create space and take first fights.</p>
            <div className="text-xs text-[#A89A85] mb-4 border-l border-[#2A1F15] pl-3">
              <strong className="block text-[#7A6A55] mb-1">Examples:</strong>
              Jett, Reyna, Phoenix
            </div>
            <div className="bg-[#FF4655]/10 rounded px-3 py-2 text-[10px] text-[#FF4655] font-bold uppercase">
              Best for: Aggressive / Aim-focused
            </div>
          </div>
          {/* Initiator */}
          <div className="bg-gradient-to-b from-[#1A0F08] to-[#0F0A06] border border-[#00FF9D]/20 hover:border-[#00FF9D] transition-colors rounded-2xl p-6">
            <h4 className="font-sora font-bold text-[#00FF9D] text-xl mb-2">Initiator</h4>
            <p className="text-xs text-[#F5ECD7] mb-4">Gather information & help enter sites.</p>
            <div className="text-xs text-[#A89A85] mb-4 border-l border-[#2A1F15] pl-3">
              <strong className="block text-[#7A6A55] mb-1">Examples:</strong>
              Sova, Skye, Fade
            </div>
            <div className="bg-[#00FF9D]/10 rounded px-3 py-2 text-[10px] text-[#00FF9D] font-bold uppercase">
              Best for: Team / Strategic players
            </div>
          </div>
          {/* Controller */}
          <div className="bg-gradient-to-b from-[#1A0F08] to-[#0F0A06] border border-[#B82BFF]/20 hover:border-[#B82BFF] transition-colors rounded-2xl p-6">
            <h4 className="font-sora font-bold text-[#B82BFF] text-xl mb-2">Controller</h4>
            <p className="text-xs text-[#F5ECD7] mb-4">Block vision and control the map.</p>
            <div className="text-xs text-[#A89A85] mb-4 border-l border-[#2A1F15] pl-3">
              <strong className="block text-[#7A6A55] mb-1">Examples:</strong>
              Omen, Brimstone, Viper
            </div>
            <div className="bg-[#B82BFF]/10 rounded px-3 py-2 text-[10px] text-[#B82BFF] font-bold uppercase">
              Best for: Tactical thinkers
            </div>
          </div>
          {/* Sentinel */}
          <div className="bg-gradient-to-b from-[#1A0F08] to-[#0F0A06] border border-[#FFD700]/20 hover:border-[#FFD700] transition-colors rounded-2xl p-6">
            <h4 className="font-sora font-bold text-[#FFD700] text-xl mb-2">Sentinel</h4>
            <p className="text-xs text-[#F5ECD7] mb-4">Defend areas and watch flanks.</p>
            <div className="text-xs text-[#A89A85] mb-4 border-l border-[#2A1F15] pl-3">
              <strong className="block text-[#7A6A55] mb-1">Examples:</strong>
              Killjoy, Cypher, Sage
            </div>
            <div className="bg-[#FFD700]/10 rounded px-3 py-2 text-[10px] text-[#FFD700] font-bold uppercase">
              Best for: Defensive players
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trading & Advice */}
      <motion.div variants={cardVariants} className="md:col-span-3 lg:col-span-4 bg-[#0F0A06] border border-[#2A1F15] rounded-3xl p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-widest mb-3">Trading Teammates</h3>
          <p className="text-[#A89A85] mb-4">If your teammate dies, immediately try to eliminate the enemy.</p>
          <div className="bg-[#1A0F08] border border-[#FF4655] rounded-lg p-4">
            <strong className="text-[#FF4655] uppercase text-xs tracking-wider block mb-1">Golden Rule</strong>
            <span className="text-[#F5ECD7] italic">"Never peek alone if a teammate can trade for you."</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-widest mb-3">Beginner Advice</h3>
          <p className="text-[#A89A85] text-lg leading-relaxed border-l-2 border-[#2A1F15] pl-4">
            Don't focus on kills. Focus on <strong className="text-[#00FF9D]">surviving</strong>, <strong className="text-[#00FF9D]">trading teammates</strong>, and <strong className="text-[#00FF9D]">learning maps</strong>.
          </p>
        </div>
      </motion.div>

    </div>
  );
}

// ============================================================================
// ARENA BREAKOUT GRID
// ============================================================================

function ArenaGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
      
      {/* Big Hero Card */}
      <motion.div variants={cardVariants} className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-[#0F140F] to-[#050A05] border border-[#8FBC8F]/30 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#8FBC8F]/10 blur-[100px] rounded-full group-hover:bg-[#8FBC8F]/20 transition-colors" />
        <h2 className="font-bebas text-4xl text-[#8FBC8F] tracking-widest mb-4">What is Arena Breakout?</h2>
        <p className="text-[#A89A85] text-lg leading-relaxed mb-6">
          An extraction shooter where your goal is to enter a map, collect loot, survive, and successfully extract. Unlike PUBG, winning isn't about being the last player alive.
        </p>
        <div className="inline-block bg-[#8FBC8F]/20 border border-[#8FBC8F] rounded-lg px-6 py-3 font-sora font-bold text-[#F5ECD7]">
          Winning = Extracting with valuable loot.
        </div>
      </motion.div>

      {/* Rule #1 */}
      <motion.div variants={cardVariants} className="md:col-span-1 lg:col-span-1 bg-[#1A1F1A] border border-[#2A3F2A] rounded-3xl p-8 flex flex-col justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        <h3 className="font-bebas text-4xl text-[#FFD700] tracking-widest mb-2 z-10">RULE #1</h3>
        <p className="text-2xl font-sora font-bold text-[#F5ECD7] mb-6 z-10">Survival &gt; Kills</p>
        <div className="text-xs text-[#A89A85] text-left space-y-2 z-10">
          <p>Many new players <span className="text-[#FF4655]">chase fights</span>.</p>
          <p>Experienced players <span className="text-[#00FF9D]">chase profit</span>.</p>
        </div>
      </motion.div>

      {/* Core Loop */}
      <motion.div variants={cardVariants} className="md:col-span-1 lg:col-span-2 bg-[#0F0A06] border border-[#2A1F15] rounded-3xl p-8">
        <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-widest mb-6">Core Gameplay Loop</h3>
        <div className="flex flex-col gap-3">
          {["Enter raid.", "Loot valuable items.", "Fight or avoid players.", "Reach extraction point.", "Sell loot and upgrade inventory."].map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-[#8FBC8F]/20 flex items-center justify-center text-[#8FBC8F] text-xs font-bold">{i+1}</div>
              <span className="text-[#A89A85] text-sm">{step}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Loadout Basics */}
      <motion.div variants={cardVariants} className="md:col-span-2 lg:col-span-2 bg-[#0F0A06] border border-[#2A1F15] rounded-3xl p-8">
        <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-widest mb-6">Loadout Basics</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1A0F08] rounded-xl p-4 border-l-2 border-[#A89A85]">
            <strong className="text-[#F5ECD7] block mb-2 font-sora text-sm">Budget Loadout</strong>
            <ul className="text-xs text-[#7A6A55] space-y-1 list-disc pl-4">
              <li>Cheap weapon</li><li>Basic armor</li><li>Essential meds</li>
            </ul>
          </div>
          <div className="bg-[#1A0F08] rounded-xl p-4 border-l-2 border-[#8FBC8F]">
            <strong className="text-[#8FBC8F] block mb-2 font-sora text-sm">High-Tier Loadout</strong>
            <ul className="text-xs text-[#7A6A55] space-y-1 list-disc pl-4">
              <li>Better ammo</li><li>Better armor</li><li>Bigger risk</li>
            </ul>
          </div>
        </div>
        <div className="text-center font-bold text-[#FF4655] text-sm uppercase tracking-wider">
          "Never bring gear you can't afford to lose."
        </div>
      </motion.div>

      {/* Roles & Mistakes */}
      <motion.div variants={cardVariants} className="md:col-span-3 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-gradient-to-b from-[#1A0F08] to-[#0F0A06] border border-[#2A1F15] rounded-3xl p-8">
          <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-widest mb-6">Important Roles</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-[#2A1F15] pb-2"><strong className="text-[#8FBC8F]">Point Man</strong> <span className="text-[#A89A85] text-sm">Moves first, checks corners.</span></div>
            <div className="flex justify-between border-b border-[#2A1F15] pb-2"><strong className="text-[#8FBC8F]">Marksman</strong> <span className="text-[#A89A85] text-sm">Provides long-range cover.</span></div>
            <div className="flex justify-between border-b border-[#2A1F15] pb-2"><strong className="text-[#8FBC8F]">Support</strong> <span className="text-[#A89A85] text-sm">Carries meds and utility.</span></div>
            <div className="flex justify-between"><strong className="text-[#8FBC8F]">Loot Specialist</strong> <span className="text-[#A89A85] text-sm">Maximizes profits.</span></div>
          </div>
        </div>
        <div className="bg-gradient-to-b from-[#1A0F08] to-[#0F0A06] border border-[#FF4655]/30 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-5 text-[#FF4655]">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21H23L12 2ZM12 6L19.53 19H4.47L12 6ZM11 10V14H13V10H11ZM11 16V18H13V16H11Z"/></svg>
          </div>
          <h3 className="font-bebas text-3xl text-[#FF4655] tracking-widest mb-4">Beginner Mistakes</h3>
          <ul className="text-[#A89A85] text-sm space-y-2 mb-6 list-disc pl-5">
            <li>Sprinting everywhere</li>
            <li>Ignoring sound</li>
            <li>Over-looting</li>
            <li>Fighting every player</li>
          </ul>
          <div className="bg-[#FF4655]/10 border-l-4 border-[#FF4655] p-3 text-xs text-[#F5ECD7]">
            <strong className="block text-[#FF4655] mb-1">Golden Rule</strong>
            If your backpack is full of good loot, extract. Don't get greedy.
          </div>
        </div>
      </motion.div>

    </div>
  );
}

// ============================================================================
// RUST GRID
// ============================================================================

function RustGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
      
      {/* Big Hero Card */}
      <motion.div variants={cardVariants} className="md:col-span-3 lg:col-span-4 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] bg-[#0F0A06] border border-[#E67E22]/50 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0A06] via-[#0F0A06]/80 to-transparent z-0" />
        <div className="relative z-10 md:w-2/3">
          <h2 className="font-bebas text-5xl text-[#E67E22] tracking-widest mb-4">What is Rust?</h2>
          <p className="text-[#F5ECD7] text-lg leading-relaxed mb-4">
            A brutal survival game where players gather resources, build bases, raid enemies, and survive on a shared server.
          </p>
          <div className="inline-block bg-[#FF3B30]/20 border border-[#FF3B30] rounded px-4 py-2 text-[#FF3B30] font-bold text-sm uppercase tracking-widest">
            There are NO safe zones for most of the map.
          </div>
        </div>
      </motion.div>

      {/* First Hour Guide */}
      <motion.div variants={cardVariants} className="md:col-span-3 lg:col-span-4">
        <h2 className="font-bebas text-3xl text-[#F5ECD7] tracking-widest mb-6 border-b border-[#2A1F15] pb-2">First Hour Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A0F08] border border-[#2A1F15] rounded-2xl p-6 relative overflow-hidden">
            <div className="text-6xl font-bebas text-[#2A1F15] absolute right-4 top-4 z-0 pointer-events-none">1</div>
            <h4 className="font-sora font-bold text-[#E67E22] text-lg mb-3 relative z-10">Gather Resources</h4>
            <ul className="text-[#A89A85] text-sm space-y-1 mb-4 relative z-10 list-disc pl-4">
              <li>Wood</li><li>Stone</li><li>Cloth</li>
            </ul>
            <p className="text-[#F5ECD7] text-xs font-bold relative z-10 border-t border-[#2A1F15] pt-2">Craft basic tools immediately.</p>
          </div>
          <div className="bg-[#1A0F08] border border-[#2A1F15] rounded-2xl p-6 relative overflow-hidden">
            <div className="text-6xl font-bebas text-[#2A1F15] absolute right-4 top-4 z-0 pointer-events-none">2</div>
            <h4 className="font-sora font-bold text-[#E67E22] text-lg mb-3 relative z-10">Build Starter Base</h4>
            <ul className="text-[#A89A85] text-sm space-y-1 mb-4 relative z-10 list-disc pl-4">
              <li>Tool Cupboard</li><li>Door & Lock</li><li>Sleeping Bag</li>
            </ul>
            <p className="text-[#FF4655] text-xs font-bold relative z-10 border-t border-[#2A1F15] pt-2">Without these, you lose progress.</p>
          </div>
          <div className="bg-[#1A0F08] border border-[#2A1F15] rounded-2xl p-6 relative overflow-hidden">
            <div className="text-6xl font-bebas text-[#2A1F15] absolute right-4 top-4 z-0 pointer-events-none">3</div>
            <h4 className="font-sora font-bold text-[#E67E22] text-lg mb-3 relative z-10">Upgrade Base</h4>
            <ul className="text-[#A89A85] text-sm space-y-1 mb-4 relative z-10 list-disc pl-4">
              <li>Stone walls</li><li>Metal door</li><li>Airlock</li>
            </ul>
            <p className="text-[#F5ECD7] text-[10px] uppercase tracking-wider relative z-10 border-t border-[#2A1F15] pt-2">Bases are raided because they skip airlocks.</p>
          </div>
        </div>
      </motion.div>

      {/* Core Roles */}
      <motion.div variants={cardVariants} className="md:col-span-1 lg:col-span-2 bg-[#0F0A06] border border-[#2A1F15] rounded-3xl p-8">
        <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-widest mb-6">Core Roles</h3>
        <div className="space-y-4">
          <div className="flex justify-between border-b border-[#2A1F15] pb-2"><strong className="text-[#E67E22]">Farmer</strong> <span className="text-[#A89A85] text-sm">Collects resources.</span></div>
          <div className="flex justify-between border-b border-[#2A1F15] pb-2"><strong className="text-[#E67E22]">Builder</strong> <span className="text-[#A89A85] text-sm">Designs & upgrades base.</span></div>
          <div className="flex justify-between border-b border-[#2A1F15] pb-2"><strong className="text-[#E67E22]">PvP Player</strong> <span className="text-[#A89A85] text-sm">Protects team / fights.</span></div>
          <div className="flex justify-between"><strong className="text-[#E67E22]">Scout</strong> <span className="text-[#A89A85] text-sm">Gathers intel on players.</span></div>
        </div>
      </motion.div>

      {/* PvP & Raiding */}
      <motion.div variants={cardVariants} className="md:col-span-2 lg:col-span-2 bg-[#0F0A06] border border-[#2A1F15] rounded-3xl p-8 flex flex-col justify-between">
        <div className="mb-6">
          <h3 className="font-bebas text-3xl text-[#F5ECD7] tracking-widest mb-2">PvP Basics</h3>
          <p className="text-[#E67E22] font-sora font-bold text-sm mb-3">Positioning Matters More Than Aim</p>
          <div className="flex gap-8 text-sm">
            <div>
              <strong className="text-[#00FF9D] block mb-1">Use:</strong>
              <ul className="text-[#A89A85] list-disc pl-4"><li>Rocks</li><li>Trees</li><li>High ground</li></ul>
            </div>
            <div>
              <strong className="text-[#FF4655] block mb-1">Avoid:</strong>
              <ul className="text-[#A89A85] list-disc pl-4"><li>Open fields</li><li>Predictable routes</li></ul>
            </div>
          </div>
        </div>
        <div className="bg-[#1A0F08] rounded-xl p-4 border border-[#2A1F15]">
          <h4 className="font-sora font-bold text-[#F5ECD7] mb-2 text-sm">Raiding Basics</h4>
          <p className="text-xs text-[#A89A85] mb-2">Goal: Break into bases & steal loot. (Door Raid, Wall Raid, Offline Raid).</p>
          <span className="text-[10px] text-[#E67E22] font-bold uppercase tracking-wider">New players should learn defense first.</span>
        </div>
      </motion.div>

      {/* Mistakes */}
      <motion.div variants={cardVariants} className="md:col-span-3 lg:col-span-4 bg-[#1A0F08] border border-[#FF3B30]/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h4 className="font-bebas text-2xl text-[#FF3B30] tracking-widest mb-1">Beginner Mistakes</h4>
          <p className="text-[#A89A85] text-sm">Building near roads • Storing all loot in one box • Farming without protection • Roaming with expensive gear</p>
        </div>
      </motion.div>

    </div>
  );
}

// ============================================================================
// CONTENT SERIES GRID
// ============================================================================

function ContentGrid() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      
      <motion.div variants={cardVariants} className="text-center mb-6">
        <h2 className="font-bebas text-5xl text-[#F5ECD7] tracking-widest mb-4">Content Strategy</h2>
        <p className="text-[#A89A85] text-lg">Hooks and Series ideas specifically designed for the new Beginner Guide playlists.</p>
      </motion.div>

      {/* Hook Examples */}
      <motion.div variants={cardVariants} className="bg-[#0F0A06] border border-[#2A1F15] rounded-3xl p-8">
        <h3 className="font-bebas text-3xl text-[#C47C2B] tracking-widest mb-6">High-Converting Hooks</h3>
        <div className="space-y-4">
          <div className="bg-[#1A0F08] border-l-4 border-[#FF4655] p-4 rounded-r-xl">
            <span className="text-xs text-[#7A6A55] font-bold uppercase tracking-widest mb-1 block">VALORANT Mobile</span>
            <p className="text-[#F5ECD7] font-sora font-semibold">"New to VALORANT Mobile? Learn every role in 5 minutes."</p>
          </div>
          <div className="bg-[#1A0F08] border-l-4 border-[#8FBC8F] p-4 rounded-r-xl">
            <span className="text-xs text-[#7A6A55] font-bold uppercase tracking-widest mb-1 block">Arena Breakout</span>
            <p className="text-[#F5ECD7] font-sora font-semibold">"Stop losing gear! The beginner mistakes that make Arena Breakout players go broke."</p>
          </div>
          <div className="bg-[#1A0F08] border-l-4 border-[#E67E22] p-4 rounded-r-xl">
            <span className="text-xs text-[#7A6A55] font-bold uppercase tracking-widest mb-1 block">Rust Mobile</span>
            <p className="text-[#F5ECD7] font-sora font-semibold">"Your first 24 hours in Rust Mobile: what to do and what not to do."</p>
          </div>
        </div>
      </motion.div>

      {/* Master Series Idea */}
      <motion.div variants={cardVariants} className="bg-gradient-to-br from-[#1A0F08] to-[#2A1F15] border border-[#C47C2B]/50 rounded-3xl p-10 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[#C47C2B]/5 group-hover:bg-[#C47C2B]/10 transition-colors" />
        <h4 className="relative z-10 font-sora font-bold text-[#C47C2B] uppercase tracking-widest text-sm mb-4">Master Playlist Concept</h4>
        <h2 className="relative z-10 font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-8 drop-shadow-[0_0_15px_rgba(196,124,43,0.5)]">
          "From Noob to Pro: Complete Beginner Guides 2026"
        </h2>
        <div className="relative z-10 flex flex-wrap justify-center gap-3">
          <span className="bg-[#050302] border border-[#FF4655] text-[#FF4655] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">VALORANT Mobile</span>
          <span className="bg-[#050302] border border-[#8FBC8F] text-[#8FBC8F] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">Arena Breakout</span>
          <span className="bg-[#050302] border border-[#E67E22] text-[#E67E22] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">Rust Mobile</span>
          <span className="bg-[#050302] border border-[#FFD700] text-[#FFD700] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">PUBG/BGMI</span>
          <span className="bg-[#050302] border border-[#00FF9D] text-[#00FF9D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">Extraction Fundamentals</span>
        </div>
      </motion.div>

    </div>
  );
}
