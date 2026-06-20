"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

// ============================================================================
// DATA & CONTENT
// ============================================================================

type GameKey = "PUBG" | "VALORANT";

interface DocItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface DocCategory {
  title: string;
  items: DocItem[];
}

const pubgDocs: DocCategory[] = [
  {
    title: "Role Guide",
    items: [
      {
        id: "pubg-entry",
        title: "Entry Fragger (Assaulter)",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Entry Fragger <span className="text-[#C47C2B]">(Assaulter)</span></h1>
            <div className="space-y-6 text-[#A89A85] text-base leading-relaxed">
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#E8A44A] mb-3">Early Game</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Land aggressively and secure first weapons.</li>
                  <li>Take first contact in compound fights.</li>
                  <li>Force enemies to reveal positions.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#E8A44A] mb-3">Mid Game</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Lead pushes into compounds.</li>
                  <li>Clear first floor while teammates trade behind.</li>
                  <li>Never overextend beyond support range.</li>
                </ul>
              </div>
              <div className="bg-[#C47C2B]/10 border-l-4 border-[#C47C2B] p-4 rounded-r-lg">
                <span className="text-[#C47C2B] font-bold text-xs uppercase tracking-wider block mb-2">Strategic Tip</span>
                <p className="italic text-[#F5ECD7]">"Don't play for kills, play for information. Every shot you force reveals enemy positions."</p>
              </div>
              <div className="bg-[#1A0F08] border border-[#2A1F15] p-4 rounded-lg">
                <span className="text-[#7A6A55] uppercase tracking-wider font-bold text-xs block mb-1">Content Hook</span>
                <span className="text-[#F5ECD7]">"90% of PUBG players lose compound pushes because their entry fragger makes this one mistake..."</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "pubg-scout",
        title: "Scout",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Scout</h1>
            <div className="space-y-6 text-[#A89A85] text-base leading-relaxed">
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#E8A44A] mb-3">Early Game</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Secure vehicles.</li>
                  <li>Gather information on rotations.</li>
                  <li>Identify occupied compounds.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#E8A44A] mb-3">Mid Game</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Play 50-100m ahead of squad.</li>
                  <li>Check ridges and common camping spots.</li>
                  <li>Mark enemy rotations before they become threats.</li>
                </ul>
              </div>
              <div className="bg-[#C47C2B]/10 border-l-4 border-[#C47C2B] p-4 rounded-r-lg">
                <span className="text-[#C47C2B] font-bold text-xs uppercase tracking-wider block mb-2">Strategic Tip</span>
                <p className="italic text-[#F5ECD7]">"Good scouts prevent fights. Great scouts choose fights."</p>
              </div>
              <div className="bg-[#1A0F08] border border-[#2A1F15] p-4 rounded-lg">
                <span className="text-[#7A6A55] uppercase tracking-wider font-bold text-xs block mb-1">Content Hook</span>
                <span className="text-[#F5ECD7]">"A scout's job isn't spotting enemies—it's deciding which fights your squad should never take."</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "pubg-support",
        title: "Support Player",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Support Player</h1>
            <div className="space-y-6 text-[#A89A85] text-base leading-relaxed">
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#E8A44A] mb-3">Early Game</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Carry extra meds, smokes, utilities.</li>
                  <li>Prioritize team survival over kills.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#E8A44A] mb-3">Mid Game</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Smoke knocked teammates.</li>
                  <li>Maintain crossfire angles.</li>
                  <li>Hold escape routes during rotations.</li>
                </ul>
              </div>
              <div className="bg-[#C47C2B]/10 border-l-4 border-[#C47C2B] p-4 rounded-r-lg">
                <span className="text-[#C47C2B] font-bold text-xs uppercase tracking-wider block mb-2">Strategic Tip</span>
                <p className="italic text-[#F5ECD7]">"Every smoke should create either: Cover, A revive opportunity, or A rotation path. Never waste smokes."</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "pubg-igl",
        title: "IGL (In-Game Leader)",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">IGL <span className="text-[#C47C2B]">(In-Game Leader)</span></h1>
            <div className="space-y-6 text-[#A89A85] text-base leading-relaxed">
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#E8A44A] mb-3">Early Game</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Plan loot routes.</li>
                  <li>Control team rotations.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#E8A44A] mb-3">Mid Game</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Predict next zone.</li>
                  <li>Decide whether to fight or rotate.</li>
                  <li>Keep team moving before zone pressure starts.</li>
                </ul>
              </div>
              <div className="bg-[#C47C2B]/10 border-l-4 border-[#C47C2B] p-4 rounded-r-lg">
                <span className="text-[#C47C2B] font-bold text-xs uppercase tracking-wider block mb-2">Strategic Tip</span>
                <p className="italic text-[#F5ECD7]">"Winning teams rotate early. Losing teams rotate because zone forces them."</p>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: "Mid-Game Strategies",
    items: [
      {
        id: "pubg-rotation",
        title: "Rotation Rule",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Rotation Rule</h1>
            <div className="bg-[#1A0F08] border border-[#2A1F15] p-8 rounded-xl shadow-inner text-[#A89A85] text-lg">
              <p className="mb-6">When <strong className="text-[#E8A44A] text-xl">Zone 3</strong> appears, Ask 3 Questions:</p>
              <ol className="list-decimal pl-6 space-y-4 mb-8">
                <li>Where is the next power position?</li>
                <li>Which team gets there first?</li>
                <li>Can we reach it safely?</li>
              </ol>
              <div className="border-l-4 border-[#FF3B30] pl-4 py-2">
                <p className="italic text-[#F5ECD7] text-xl">"Most squads die because they rotate too late."</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "pubg-compound",
        title: "Compound Push Formula",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Compound Push Formula</h1>
            <div className="bg-[#1A0F08] border border-[#2A1F15] p-8 rounded-xl shadow-inner text-[#A89A85] text-lg">
              <ol className="list-decimal pl-6 space-y-4 mb-8">
                <li><strong className="text-[#E8A44A]">Scout</strong> gathers info.</li>
                <li><strong className="text-[#E8A44A]">Support</strong> throws smokes.</li>
                <li><strong className="text-[#E8A44A]">Fragger</strong> enters.</li>
                <li><strong className="text-[#E8A44A]">IGL</strong> coordinates trades.</li>
              </ol>
              <div className="border-l-4 border-[#FF3B30] pl-4 py-2">
                <p className="italic text-[#F5ECD7] text-xl">"If any step is missing, push success rate drops massively."</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "pubg-thirdparty",
        title: "Third-Party Strategy",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Third-Party Strategy</h1>
            <div className="bg-[#1A0F08] border border-[#2A1F15] p-8 rounded-xl shadow-inner text-[#A89A85] text-lg">
              <p className="mb-6">Best time to attack:</p>
              <ul className="list-disc pl-6 space-y-4 mb-8">
                <li>When two squads are already fighting.</li>
                <li>When knocks appear in kill feed.</li>
                <li>When grenades and utilities are already used.</li>
              </ul>
              <div className="border-l-4 border-[#FF3B30] pl-4 py-2">
                <p className="italic text-[#F5ECD7] text-xl">"Never be the first team to shoot."</p>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: "Content Creation",
    items: [
      {
        id: "pubg-content",
        title: "Best Content Series Ideas",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Content Series Ideas</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "30 Days Learning IGL Secrets",
                "Why Pro Scouts Are More Important Than Fraggers",
                "Mid-Game Decisions That Win Chicken Dinners",
                "Role Guide: Support Players Are Underrated"
              ].map((idea, i) => (
                <div key={i} className="bg-[#0F0A06] border border-[#C47C2B]/30 rounded-lg p-5 shadow-[0_4px_20px_rgba(196,124,43,0.1)] flex items-center">
                  <span className="text-[#F5ECD7] font-sora font-semibold">"{idea}"</span>
                </div>
              ))}
            </div>
          </div>
        )
      }
    ]
  }
];

const valoDocs: DocCategory[] = [
  {
    title: "Strategic Role Guide",
    items: [
      {
        id: "valo-duelist",
        title: "Duelist",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Duelist</h1>
            <div className="space-y-6 text-[#A89A85] text-base leading-relaxed">
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#FF4655] mb-3">Early Round</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Take first space.</li>
                  <li>Create pressure.</li>
                  <li>Force defenders off angles.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#FF4655] mb-3">Mid Round</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Play off information.</li>
                  <li>Rotate quickly after gaining map control.</li>
                  <li>Re-hit weak sites.</li>
                </ul>
              </div>
              <div className="bg-[#FF4655]/10 border-l-4 border-[#FF4655] p-4 rounded-r-lg">
                <span className="text-[#FF4655] font-bold text-xs uppercase tracking-wider block mb-2">Common Mistake</span>
                <p className="italic text-[#F5ECD7]">"Getting kills without creating space."</p>
              </div>
              <div className="bg-[#1A0F08] border border-[#2A1F15] p-4 rounded-lg">
                <span className="text-[#7A6A55] uppercase tracking-wider font-bold text-xs block mb-1">Content Hook</span>
                <span className="text-[#F5ECD7]">"A 20-kill duelist can still lose games if they're not doing this..."</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "valo-initiator",
        title: "Initiator",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Initiator</h1>
            <div className="space-y-6 text-[#A89A85] text-base leading-relaxed">
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#00FF9D] mb-3">Early Round</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Gather information first.</li>
                  <li>Drone, flash, recon before anyone peeks.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#00FF9D] mb-3">Mid Round</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Save utility for site hits.</li>
                  <li>Set up duelists.</li>
                </ul>
              </div>
              <div className="bg-[#00FF9D]/10 border-l-4 border-[#00FF9D] p-4 rounded-r-lg">
                <span className="text-[#00FF9D] font-bold text-xs uppercase tracking-wider block mb-2">Strategic Tip</span>
                <p className="italic text-[#F5ECD7]">"Information wins more rounds than aim."</p>
              </div>
              <div className="bg-[#1A0F08] border border-[#2A1F15] p-4 rounded-lg">
                <span className="text-[#7A6A55] uppercase tracking-wider font-bold text-xs block mb-1">Content Hook</span>
                <span className="text-[#F5ECD7]">"The difference between a Diamond and Ascendant Initiator is one mid-round decision."</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "valo-controller",
        title: "Controller",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Controller</h1>
            <div className="space-y-6 text-[#A89A85] text-base leading-relaxed">
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#B82BFF] mb-3">Early Round</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Deny vision.</li>
                  <li>Control choke points.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#B82BFF] mb-3">Mid Round</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Fake pressure using smokes.</li>
                  <li>Force rotations.</li>
                </ul>
              </div>
              <div className="bg-[#B82BFF]/10 border-l-4 border-[#B82BFF] p-4 rounded-r-lg">
                <span className="text-[#B82BFF] font-bold text-xs uppercase tracking-wider block mb-2">Strategic Tip</span>
                <p className="italic text-[#F5ECD7]">"Bad smokes help enemies more than teammates."</p>
              </div>
              <div className="bg-[#1A0F08] border border-[#2A1F15] p-4 rounded-lg">
                <span className="text-[#7A6A55] uppercase tracking-wider font-bold text-xs block mb-1">Content Hook</span>
                <span className="text-[#F5ECD7]">"Most Omen and Brimstone players accidentally help the enemy team."</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "valo-sentinel",
        title: "Sentinel",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Sentinel</h1>
            <div className="space-y-6 text-[#A89A85] text-base leading-relaxed">
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#FFD700] mb-3">Early Round</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Lock flanks.</li>
                  <li>Anchor sites.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-sora font-semibold text-[#FFD700] mb-3">Mid Round</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Reposition utility.</li>
                  <li>Watch rotations.</li>
                </ul>
              </div>
              <div className="bg-[#FFD700]/10 border-l-4 border-[#FFD700] p-4 rounded-r-lg">
                <span className="text-[#FFD700] font-bold text-xs uppercase tracking-wider block mb-2">Strategic Tip</span>
                <p className="italic text-[#F5ECD7]">"Sentinels win rounds by wasting enemy time."</p>
              </div>
              <div className="bg-[#1A0F08] border border-[#2A1F15] p-4 rounded-lg">
                <span className="text-[#7A6A55] uppercase tracking-wider font-bold text-xs block mb-1">Content Hook</span>
                <span className="text-[#F5ECD7]">"A Sentinel's job isn't getting kills. It's making the enemy waste 30 seconds."</span>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: "Mid-Round Concepts",
    items: [
      {
        id: "valo-numbers",
        title: "Numbers Advantage Rule",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Numbers Advantage Rule</h1>
            <div className="bg-[#1A0F08] border border-[#2A1F15] p-8 rounded-xl shadow-inner text-[#A89A85] text-lg">
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <span className="bg-[#00FF9D]/20 text-[#00FF9D] font-bold px-3 py-1 rounded text-xl">5v4</span>
                  <span className="text-[#F5ECD7]">Play slower.</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-[#FF4655]/20 text-[#FF4655] font-bold px-3 py-1 rounded text-xl">4v5</span>
                  <span className="text-[#F5ECD7]">Create a play.</span>
                </div>
              </div>
              <div className="border-l-4 border-[#FFD700] pl-4 py-2">
                <p className="italic text-[#A89A85] text-xl">"Many ranked players do the opposite."</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "valo-rotation",
        title: "Mid-Round Rotation",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Mid-Round Rotation</h1>
            <div className="bg-[#1A0F08] border border-[#2A1F15] p-8 rounded-xl shadow-inner text-[#A89A85] text-lg">
              <p className="mb-4">If:</p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Utility is spent</li>
                <li>Site looks stacked</li>
                <li>You gained information</li>
              </ul>
              <p className="text-[#FF4655] font-bold text-2xl uppercase tracking-wider mb-6">Rotate immediately.</p>
              <div className="border-l-4 border-[#FFD700] pl-4 py-2">
                <p className="italic text-[#A89A85] text-xl">"Don't force a bad execute."</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "valo-execute",
        title: "Perfect Site Execute",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Perfect Site Execute</h1>
            <div className="bg-[#1A0F08] border border-[#2A1F15] p-8 rounded-xl shadow-inner text-[#A89A85] text-lg">
              <ol className="list-decimal pl-6 space-y-4 mb-8">
                <li><strong className="text-[#B82BFF]">Controller</strong> smokes.</li>
                <li><strong className="text-[#00FF9D]">Initiator</strong> gathers info.</li>
                <li><strong className="text-[#FF4655]">Duelist</strong> enters.</li>
                <li><strong className="text-[#F5ECD7]">Team</strong> trades.</li>
                <li><strong className="text-[#FFD700]">Sentinel</strong> secures flank.</li>
              </ol>
              <div className="border-l-4 border-[#FFD700] pl-4 py-2">
                <p className="italic text-[#A89A85] text-xl">"That's how high-level teams execute sites."</p>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: "Content Creation",
    items: [
      {
        id: "valo-content",
        title: "Best Content Series Ideas",
        content: (
          <div className="flex flex-col gap-6">
            <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Content Series Ideas</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "One Minute Role Mastery",
                "Mid-Round Decisions Radiant Players Make",
                "How Every Role Wins Rounds",
                "Why Your Duelist Isn't The Problem"
              ].map((idea, i) => (
                <div key={i} className="bg-[#0F0A06] border border-[#FF4655]/30 rounded-lg p-5 shadow-[0_4px_20px_rgba(255,70,85,0.1)] flex items-center">
                  <span className="text-[#F5ECD7] font-sora font-semibold">"{idea}"</span>
                </div>
              ))}
            </div>
          </div>
        )
      }
    ]
  }
];

const docsData: Record<GameKey, DocCategory[]> = {
  PUBG: pubgDocs,
  VALORANT: valoDocs,
};

// ============================================================================
// COMPONENTS
// ============================================================================

export default function EsportsDocsPage() {
  const [activeGame, setActiveGame] = useState<GameKey>("PUBG");
  const [activeDocId, setActiveDocId] = useState<string>(pubgDocs[0].items[0].id);
  const [isGameSelectorOpen, setIsGameSelectorOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Default to first item when switching games
  const handleGameChange = (game: GameKey) => {
    setActiveGame(game);
    setActiveDocId(docsData[game][0].items[0].id);
    setIsGameSelectorOpen(false);
    setIsMobileSidebarOpen(false);
  };

  const handleDocChange = (id: string) => {
    setActiveDocId(id);
    setIsMobileSidebarOpen(false);
  };

  // Find active content
  let activeContent: React.ReactNode = null;
  for (const cat of docsData[activeGame]) {
    for (const item of cat.items) {
      if (item.id === activeDocId) {
        activeContent = item.content;
      }
    }
  }

  // Animation variants
  const contentVariants: Variants = {
    hidden: { opacity: 0, x: 20, filter: "blur(4px)" },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" } 
    },
    exit: { 
      opacity: 0, 
      x: -20, 
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
          className="md:hidden fixed bottom-6 right-6 z-50 bg-[#C47C2B] text-[#0A0705] p-4 rounded-full shadow-lg"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* ======================= SIDEBAR ======================= */}
        <aside className={`
          fixed md:relative z-40 w-72 h-full bg-[#0A0705] border-r border-[#2A1F15] flex flex-col transition-transform duration-300
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          
          {/* Game Selector Dropdown */}
          <div className="p-6 border-b border-[#2A1F15] relative">
            <span className="text-[#7A6A55] text-[10px] font-bold uppercase tracking-widest mb-2 block">Select Game</span>
            <button 
              className="w-full flex items-center justify-between bg-[#1A0F08] border border-[#2A1F15] rounded-lg p-3 hover:border-[#C47C2B]/50 transition-colors"
              onClick={() => setIsGameSelectorOpen(!isGameSelectorOpen)}
            >
              <span className="font-sora font-semibold text-[#F5ECD7]">
                {activeGame === "PUBG" ? "PUBG MOBILE" : "VALORANT"}
              </span>
              <ChevronDown size={16} className={`text-[#7A6A55] transition-transform ${isGameSelectorOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isGameSelectorOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-6 right-6 top-[88px] bg-[#1A0F08] border border-[#2A1F15] rounded-lg shadow-2xl z-50 overflow-hidden"
                >
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-[#C47C2B]/10 text-[#A89A85] hover:text-[#C47C2B] font-sora text-sm transition-colors"
                    onClick={() => handleGameChange("PUBG")}
                  >
                    PUBG MOBILE
                  </button>
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-[#FF4655]/10 text-[#A89A85] hover:text-[#FF4655] font-sora text-sm transition-colors border-t border-[#2A1F15]"
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
              <div key={catIdx} className="mb-8">
                <h4 className="text-[#7A6A55] text-xs font-bold uppercase tracking-widest mb-3">
                  {category.title}
                </h4>
                <ul className="space-y-1">
                  {category.items.map((item) => {
                    const isActive = activeDocId === item.id;
                    const accentColor = activeGame === "PUBG" ? "#C47C2B" : "#FF4655";
                    const hoverBg = activeGame === "PUBG" ? "hover:bg-[#C47C2B]/10" : "hover:bg-[#FF4655]/10";
                    
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleDocChange(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-inter transition-colors ${
                            isActive ? "bg-[#1A0F08] text-[#F5ECD7] font-semibold" : `text-[#A89A85] ${hoverBg}`
                          }`}
                          style={isActive ? { borderLeft: `3px solid ${accentColor}` } : { borderLeft: `3px solid transparent` }}
                        >
                          {item.title}
                          {isActive && <ChevronRight size={14} style={{ color: accentColor }} />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* ======================= MAIN CONTENT AREA ======================= */}
        <div className="flex-1 relative overflow-y-auto custom-scrollbar bg-[#050302]">
          <div className="max-w-5xl px-8 md:px-12 py-6 md:py-8 min-h-full flex flex-col w-full">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-sora text-[#7A6A55] mb-8 uppercase tracking-widest">
              <span>{activeGame}</span>
              <ChevronRight size={12} />
              <span className={activeGame === "PUBG" ? "text-[#C47C2B]" : "text-[#FF4655]"}>
                {docsData[activeGame].find(c => c.items.some(i => i.id === activeDocId))?.title}
              </span>
            </div>

            {/* Dynamic Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDocId}
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
            <div className="mt-32 border-t border-[#2A1F15] pt-8 text-center text-[#7A6A55] text-xs font-inter">
              Albus Esports Strategic Analysis · Data tailored for optimal export.
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
