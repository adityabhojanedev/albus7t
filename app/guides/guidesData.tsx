import React from "react";
import { BookOpen } from "lucide-react";

export type GuideGameKey = "VALORANT" | "ARENA" | "RUST" | "CONTENT";

export interface GuideItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface GuideCategory {
  title: string;
  items: GuideItem[];
}

export const guidesData: Record<GuideGameKey, GuideCategory[]> = {
  VALORANT: [
    {
      title: "Beginner Basics",
      items: [
        {
          id: "val-what-is",
          title: "What is VALORANT?",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">What is VALORANT?</h1>
              <div className="space-y-6 text-[#A89A85] text-base leading-relaxed font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <p>A 5v5 tactical shooter where one team attacks and plants the Spike while the other team defends and prevents the plant.</p>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#FF4655] mb-4">Win Condition</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>First team to win 13 rounds wins the match.</li>
                    <li>Every round matters because money carries over.</li>
                  </ul>
                </div>
                <div className="bg-[#FF4655]/10 border-l-4 border-[#FF4655] p-6 rounded-r-xl">
                  <span className="text-[#FF4655] font-bold text-xs uppercase tracking-wider block mb-2">Beginner Advice</span>
                  <p className="italic text-[#F5ECD7]">Don't focus on kills. Focus on surviving, trading teammates, and learning maps.</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "val-crosshair",
          title: "Crosshair Placement",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Crosshair Placement</h1>
              <div className="space-y-6 text-[#A89A85] text-base leading-relaxed font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <p>Keep your crosshair at head level at all times. Pre-aiming where an enemy's head will be reduces the time you need to react.</p>
                </div>
                <div className="bg-[#FF4655]/10 border-l-4 border-[#FF4655] p-6 rounded-r-xl">
                  <span className="text-[#FF4655] font-bold text-xs uppercase tracking-wider block mb-2">Common Mistake</span>
                  <p className="italic text-[#F5ECD7]">"Looking at the ground while moving."</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "val-economy",
          title: "Economy Management",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Economy Management</h1>
              <div className="space-y-6 text-[#A89A85] text-base leading-relaxed font-inter">
                <p>You buy weapons and abilities each round using credits earned from kills, plants, and round wins.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#1A0F08] border border-[#2A1F15] rounded-xl p-4 text-center font-sora font-semibold text-[#FF4655]">Full Buy</div>
                  <div className="bg-[#1A0F08] border border-[#2A1F15] rounded-xl p-4 text-center font-sora font-semibold text-[#FF4655]">Half Buy</div>
                  <div className="bg-[#1A0F08] border border-[#2A1F15] rounded-xl p-4 text-center font-sora font-semibold text-[#FF4655]">Eco Round</div>
                  <div className="bg-[#1A0F08] border border-[#2A1F15] rounded-xl p-4 text-center font-sora font-semibold text-[#FF4655]">Force Buy</div>
                </div>
                <div className="bg-[#FFD700]/10 border-l-4 border-[#FFD700] p-6 rounded-r-xl">
                  <p className="italic text-[#F5ECD7]">"New players often lose because they buy randomly."</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "val-roles",
          title: "VALORANT Roles",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">VALORANT Roles</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#A89A85] font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#FF4655] mb-2">Duelist</h3>
                  <p className="mb-4">Create space and take first fights.</p>
                  <p className="text-sm"><strong>Examples:</strong> Jett, Reyna, Phoenix</p>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#00FF9D] mb-2">Initiator</h3>
                  <p className="mb-4">Gather information & help enter sites.</p>
                  <p className="text-sm"><strong>Examples:</strong> Sova, Skye, Fade</p>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#B82BFF] mb-2">Controller</h3>
                  <p className="mb-4">Block vision and control the map.</p>
                  <p className="text-sm"><strong>Examples:</strong> Omen, Brimstone, Viper</p>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#FFD700] mb-2">Sentinel</h3>
                  <p className="mb-4">Defend areas and watch flanks.</p>
                  <p className="text-sm"><strong>Examples:</strong> Killjoy, Cypher, Sage</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "val-trading",
          title: "Trading Teammates",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Trading Teammates</h1>
              <div className="space-y-6 text-[#A89A85] text-base leading-relaxed font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <p>If your teammate dies, immediately try to eliminate the enemy while their gun is resetting or their attention is diverted.</p>
                </div>
                <div className="bg-[#FF4655]/10 border-l-4 border-[#FF4655] p-6 rounded-r-xl">
                  <span className="text-[#FF4655] font-bold text-xs uppercase tracking-wider block mb-2">Golden Rule</span>
                  <p className="italic text-[#F5ECD7]">"Never peek alone if a teammate can trade for you."</p>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Tips & Tricks",
      items: [
        {
          id: "val-tips-coming-soon",
          title: "Coming Soon",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Advanced Tips</h1>
              <p className="text-[#A89A85]">This section will be populated with advanced tips and tricks in the future.</p>
            </div>
          )
        }
      ]
    },
    {
      title: "Game Settings",
      items: [
        {
          id: "val-settings-coming-soon",
          title: "Coming Soon",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Best Settings</h1>
              <p className="text-[#A89A85]">Optimal video, audio, and crosshair settings guide coming soon.</p>
            </div>
          )
        }
      ]
    },
    {
      title: "Sensitivity Guide",
      items: [
        {
          id: "val-sens-coming-soon",
          title: "Coming Soon",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Finding Your Sensitivity</h1>
              <p className="text-[#A89A85]">Comprehensive eDPI and sensitivity tuning guide coming soon.</p>
            </div>
          )
        }
      ]
    }
  ],
  ARENA: [
    {
      title: "Beginner Basics",
      items: [
        {
          id: "arena-what-is",
          title: "What is Arena Breakout?",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">What is Arena Breakout?</h1>
              <div className="space-y-6 text-[#A89A85] text-base leading-relaxed font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <p>An extraction shooter where your goal is to enter a map, collect loot, survive, and successfully extract. Unlike PUBG, winning isn't about being the last player alive.</p>
                </div>
                <div className="bg-[#8FBC8F]/10 border-l-4 border-[#8FBC8F] p-6 rounded-r-xl">
                  <p className="font-bold text-[#F5ECD7]">Winning = Extracting with valuable loot.</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "arena-rule1",
          title: "Rule #1: Survival > Kills",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Rule #1: Survival &gt; Kills</h1>
              <div className="space-y-6 text-[#A89A85] text-base leading-relaxed font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl flex gap-12">
                  <div>
                    <strong className="text-[#FF4655] block mb-2">Many new players</strong>
                    <p>Chase fights.</p>
                  </div>
                  <div>
                    <strong className="text-[#00FF9D] block mb-2">Experienced players</strong>
                    <p>Chase profit.</p>
                  </div>
                </div>
                <div className="bg-[#FF4655]/10 border-l-4 border-[#FF4655] p-6 rounded-r-xl">
                  <span className="text-[#FF4655] font-bold text-xs uppercase tracking-wider block mb-2">Golden Rule</span>
                  <p className="italic text-[#F5ECD7]">If your backpack is full of good loot, extract. Don't get greedy.</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "arena-core-loop",
          title: "Core Gameplay Loop",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Core Gameplay Loop</h1>
              <div className="space-y-4 text-[#A89A85] text-base leading-relaxed font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-4 rounded-xl flex items-center gap-4">
                  <span className="text-2xl font-bebas text-[#7A6A55]">01</span>
                  <span>Enter raid.</span>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-4 rounded-xl flex items-center gap-4">
                  <span className="text-2xl font-bebas text-[#7A6A55]">02</span>
                  <span>Loot valuable items.</span>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-4 rounded-xl flex items-center gap-4">
                  <span className="text-2xl font-bebas text-[#7A6A55]">03</span>
                  <span>Fight or avoid players.</span>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-4 rounded-xl flex items-center gap-4">
                  <span className="text-2xl font-bebas text-[#7A6A55]">04</span>
                  <span>Reach extraction point.</span>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-4 rounded-xl flex items-center gap-4">
                  <span className="text-2xl font-bebas text-[#7A6A55]">05</span>
                  <span>Sell loot and upgrade inventory.</span>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "arena-loadouts",
          title: "Loadout Basics",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Loadout Basics</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#A89A85] font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#8FBC8F] mb-4">Budget Loadout</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Cheap weapon</li>
                    <li>Basic armor</li>
                    <li>Essential meds</li>
                  </ul>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#8FBC8F] mb-4">High-Tier Loadout</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Better ammo</li>
                    <li>Better armor</li>
                    <li>Bigger risk</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[#FF4655]/10 border-l-4 border-[#FF4655] p-6 rounded-r-xl mt-2">
                <p className="italic text-[#FF4655] font-bold">"Never bring gear you can't afford to lose."</p>
              </div>
            </div>
          )
        },
        {
          id: "arena-roles-mistakes",
          title: "Roles & Mistakes",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Roles & Mistakes</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#A89A85] font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#8FBC8F] mb-4">Important Roles</h3>
                  <ul className="space-y-3">
                    <li><strong className="text-[#8FBC8F]">Point Man:</strong> Moves first, checks corners.</li>
                    <li><strong className="text-[#8FBC8F]">Marksman:</strong> Provides long-range cover.</li>
                    <li><strong className="text-[#8FBC8F]">Support:</strong> Carries meds and utility.</li>
                    <li><strong className="text-[#8FBC8F]">Loot Specialist:</strong> Maximizes profits.</li>
                  </ul>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#FF4655] mb-4">Beginner Mistakes</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Sprinting everywhere</li>
                    <li>Ignoring sound</li>
                    <li>Over-looting</li>
                    <li>Fighting every player</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Tips & Tricks",
      items: [
        {
          id: "arena-tips-coming-soon",
          title: "Coming Soon",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Advanced Tips</h1>
              <p className="text-[#A89A85]">This section will be populated with advanced tips and tricks in the future.</p>
            </div>
          )
        }
      ]
    },
    {
      title: "Game Settings",
      items: [
        {
          id: "arena-settings-coming-soon",
          title: "Coming Soon",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Best Settings</h1>
              <p className="text-[#A89A85]">Optimal video, audio, and control settings guide coming soon.</p>
            </div>
          )
        }
      ]
    }
  ],
  RUST: [
    {
      title: "Beginner Basics",
      items: [
        {
          id: "rust-what-is",
          title: "What is Rust?",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">What is Rust?</h1>
              <div className="space-y-6 text-[#A89A85] text-base leading-relaxed font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <p>A brutal survival game where players gather resources, build bases, raid enemies, and survive on a shared server.</p>
                </div>
                <div className="bg-[#FF3B30]/10 border-l-4 border-[#FF3B30] p-6 rounded-r-xl">
                  <p className="font-bold text-[#FF3B30] uppercase">There are NO safe zones for most of the map.</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "rust-first-hour",
          title: "First Hour Guide",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">First Hour Guide</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#A89A85] font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#E67E22] mb-4">1. Gather Resources</h3>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Wood</li><li>Stone</li><li>Cloth</li>
                  </ul>
                  <p className="text-xs text-[#F5ECD7]">Craft basic tools immediately.</p>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#E67E22] mb-4">2. Build Starter Base</h3>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Tool Cupboard</li><li>Door & Lock</li><li>Sleeping Bag</li>
                  </ul>
                  <p className="text-xs text-[#FF4655]">Without these, you lose progress.</p>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#E67E22] mb-4">3. Upgrade Base</h3>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>Stone walls</li><li>Metal door</li><li>Airlock</li>
                  </ul>
                  <p className="text-xs text-[#F5ECD7]">Bases are raided because they skip airlocks.</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "rust-roles",
          title: "Core Roles",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Core Roles</h1>
              <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl text-[#A89A85] font-inter">
                <ul className="space-y-4">
                  <li><strong className="text-[#E67E22]">Farmer:</strong> Collects resources.</li>
                  <li><strong className="text-[#E67E22]">Builder:</strong> Designs & upgrades base.</li>
                  <li><strong className="text-[#E67E22]">PvP Player:</strong> Protects team / fights.</li>
                  <li><strong className="text-[#E67E22]">Scout:</strong> Gathers intel on players.</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          id: "rust-pvp-raiding",
          title: "PvP & Raiding Basics",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">PvP & Raiding Basics</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#A89A85] font-inter">
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#F5ECD7] mb-2">PvP Basics</h3>
                  <p className="text-[#E67E22] font-semibold mb-4">Positioning Matters More Than Aim</p>
                  <div className="flex gap-8">
                    <div>
                      <strong className="text-[#00FF9D] block mb-2">Use:</strong>
                      <ul className="list-disc pl-5"><li>Rocks</li><li>Trees</li><li>High ground</li></ul>
                    </div>
                    <div>
                      <strong className="text-[#FF4655] block mb-2">Avoid:</strong>
                      <ul className="list-disc pl-5"><li>Open fields</li><li>Predictable routes</li></ul>
                    </div>
                  </div>
                </div>
                <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                  <h3 className="text-xl font-sora font-semibold text-[#F5ECD7] mb-4">Raiding Basics</h3>
                  <p className="mb-4">Goal: Break into bases & steal loot. (Door Raid, Wall Raid, Offline Raid).</p>
                  <p className="text-sm font-bold text-[#E67E22] uppercase">New players should learn defense first.</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "rust-mistakes",
          title: "Beginner Mistakes",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Beginner Mistakes</h1>
              <div className="bg-[#FF3B30]/10 border-l-4 border-[#FF3B30] p-6 rounded-r-xl text-[#A89A85] font-inter">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Building near roads</li>
                  <li>Storing all loot in one box</li>
                  <li>Farming without protection</li>
                  <li>Roaming with expensive gear</li>
                </ul>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "Tips & Tricks",
      items: [
        {
          id: "rust-tips-coming-soon",
          title: "Coming Soon",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Advanced Tips</h1>
              <p className="text-[#A89A85]">This section will be populated with advanced tips and tricks in the future.</p>
            </div>
          )
        }
      ]
    }
  ],
  CONTENT: [
    {
      title: "Content Strategy",
      items: [
        {
          id: "content-strategy",
          title: "Hooks & Ideas",
          content: (
            <div className="flex flex-col gap-6 max-w-4xl">
              <h1 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-2">Content Strategy</h1>
              <p className="text-[#A89A85] text-lg mb-4">Hooks and Series ideas specifically designed for the new Beginner Guide playlists.</p>
              
              <div className="bg-[#1A0F08] border border-[#2A1F15] p-6 rounded-xl">
                <h3 className="text-2xl font-bebas text-[#C47C2B] tracking-widest mb-6">High-Converting Hooks</h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-[#FF4655] pl-4">
                    <span className="text-xs text-[#7A6A55] font-bold uppercase tracking-widest mb-1 block">VALORANT Mobile</span>
                    <p className="text-[#F5ECD7] font-sora font-semibold">"New to VALORANT Mobile? Learn every role in 5 minutes."</p>
                  </div>
                  <div className="border-l-4 border-[#8FBC8F] pl-4">
                    <span className="text-xs text-[#7A6A55] font-bold uppercase tracking-widest mb-1 block">Arena Breakout</span>
                    <p className="text-[#F5ECD7] font-sora font-semibold">"Stop losing gear! The beginner mistakes that make Arena Breakout players go broke."</p>
                  </div>
                  <div className="border-l-4 border-[#E67E22] pl-4">
                    <span className="text-xs text-[#7A6A55] font-bold uppercase tracking-widest mb-1 block">Rust Mobile</span>
                    <p className="text-[#F5ECD7] font-sora font-semibold">"Your first 24 hours in Rust Mobile: what to do and what not to do."</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1A0F08] to-[#2A1F15] border border-[#C47C2B]/50 rounded-3xl p-10 text-center">
                <h4 className="font-sora font-bold text-[#C47C2B] uppercase tracking-widest text-sm mb-4">Master Playlist Concept</h4>
                <h2 className="font-bebas text-5xl text-[#F5ECD7] tracking-wider mb-8 drop-shadow-[0_0_15px_rgba(196,124,43,0.5)]">
                  "From Noob to Pro: Complete Beginner Guides 2026"
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="bg-[#050302] border border-[#FF4655] text-[#FF4655] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">VALORANT Mobile</span>
                  <span className="bg-[#050302] border border-[#8FBC8F] text-[#8FBC8F] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">Arena Breakout</span>
                  <span className="bg-[#050302] border border-[#E67E22] text-[#E67E22] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">Rust Mobile</span>
                  <span className="bg-[#050302] border border-[#FFD700] text-[#FFD700] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">PUBG/BGMI</span>
                </div>
              </div>

            </div>
          )
        }
      ]
    }
  ]
};
