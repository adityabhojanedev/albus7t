export type Language = "EN" | "HI";

export interface Chapter {
  id: string;
  title: string;
  description: Record<Language, string>;
  keyConcepts: string;
  exampleTitle: string;
  example: Record<Language, string>;
  proTipTitle: string;
  proTip: Record<Language, string>;
}

export const valoChapters: Chapter[] = [
  {
    id: "v_ch1",
    title: "CHAPTER 1: THE BASICS (TEAM FOUNDATION & ECONOMY)",
    description: {
      EN: "Getting all five players on the exact same page regarding communication and money. A team with broken economy is a team that cannot fight back. If one player buys a rifle while the rest of the team only has pistols, your ability to win rounds is crippled for the next two or three rounds. The three pillars of foundation are standardized communication, economy synchronization, and pre-round planning. In VCT 2025, teams that communicated economic state clearly maintained round-win consistency even after losing early pistol rounds.\n\nEconomy Types Every Team Must Know:\n- Full Buy: Full armor + rifles + all abilities. The strongest round.\n- Eco Round: Spend little to nothing. Goal is to save credits for the next full buy.\n- Force Buy: Spending everything you have even without full rifle + armor. Use this sparingly.\n- Half Buy / Light Buy: Partial spend to stay competitive while preserving some credits.\n- Anti-Eco: When the enemy is on eco, buy SMGs instead of rifles to maintain a credit advantage.",
      HI: "Paanchon players ko communication aur money ke baare mein same page par lana. Jis team ki economy broken hai wo fight back nahi kar sakti. Agar ek player rifle buy karta hai jabki baaki team ke paas sirf pistols hain, toh aapki win karne ki ability next 2-3 rounds ke liye cripple ho jati hai. Foundation ke three pillars hain: standardized communication, economy synchronization, aur pre-round planning.\n\nEconomy Types jo har team ko pata hone chahiye:\n- Full Buy: Full armor + rifles + all abilities. Sabse strongest round.\n- Eco Round: Spend little to nothing. Goal credits save karna hai next full buy ke liye.\n- Force Buy: Jo bhi hai sab spend kar do. Ise sparingly use karo.\n- Half Buy / Light Buy: Partial spend taaki competitive rahein aur kuch credits save ho jayein.\n- Anti-Eco: Jab enemy eco pe ho, rifles ki jagah SMGs buy karo taaki credit advantage rahe."
    },
    keyConcepts: "Callout language, Economy sync, Pre-round planning, Weapon drops",
    exampleTitle: "Economy Call Example",
    example: {
      EN: "You have 2,000 credits, but your teammates have 4,500. Instead of individually buying a cheap gun and dying, you call 'I'm broke, let's eco together' so next round everyone has 4,500 credits for a synchronized full buy.",
      HI: "Aapke paas 2,000 credits hain, par teammates ke paas 4,500. Akele cheap gun buy karke marne ki jagah, aap call dete hain 'I'm broke, let's eco together' taaki next round sabke paas 4,500 credits hon ek synchronized full buy ke liye."
    },
    proTipTitle: "VCT 2025 Standard",
    proTip: {
      EN: "At the VCT level, the IGL controls economy calls every single round. Individual players do not make personal buy decisions. Maximum credits cap at 9,000, so players who hoard credits without dropping weapons are effectively wasting resources.",
      HI: "VCT level par, IGL har single round economy calls control karta hai. Individual players personal buy decisions nahi lete. Max credits cap 9,000 hoti hai, toh jo players credits hoard karte hain wo basically resources waste karte hain."
    }
  },
  {
    id: "v_ch2",
    title: "CHAPTER 2: PLAYER ROLES & AGENT SYNERGY",
    description: {
      EN: "Every agent class has a strict job, and if players don't do their specific job, the entire execute collapses. In 2025, the meta moved heavily toward double-Initiator and even triple-Initiator setups, with teams sometimes dropping Sentinels entirely in favor of increased offensive information and pressure.\n\nThe Four Roles:\n- Duelist (Entry): The spearhead. Their job is to dive onto the site, create chaos, and force enemies to focus on them.\n- Initiator (Info/Flash): The setup player. They throw recon darts and flashes to make the Duelist's entry safer.\n- Controller (Smokes): The map shaper. They block enemy vision and cut off sniper angles.\n- Sentinel (Anchor/Lurk): The trap master. On defense they hold a site alone; on attack they watch the team's flank.",
      HI: "Har agent class ki ek strict job hoti hai, aur agar players apna specific job nahi karte, toh entire execute collapse ho jata hai. 2025 meta double ya triple-Initiator setups ki taraf move hua hai, jisme teams offensive firepower badhane ke liye Sentinel completely drop kar deti hain.\n\nThe Four Roles:\n- Duelist (Entry): The spearhead. Inka job site pe dive karna aur chaos create karna hai.\n- Initiator (Info/Flash): The setup player. Ye recon darts aur flashes throw karte hain taaki Duelist ki entry easy ho.\n- Controller (Smokes): The map shaper. Ye enemy vision block karte hain.\n- Sentinel (Anchor/Lurk): The trap master. Defense pe site hold karte hain aur attack pe team ka flank watch karte hain."
    },
    keyConcepts: "Agent Synergy, Double-Initiator Meta, Execution Roles",
    exampleTitle: "Pushing A Site",
    example: {
      EN: "The Initiator (Sova) shoots a recon dart to reveal positions, the Controller (Omen) smokes the sniper window and CT, and the Duelist (Raze) satchels in to kill blinded enemies while the Sentinel (Cypher) holds the flank.",
      HI: "Initiator (Sova) enemy position reveal karne ke liye recon dart shoot karta hai, Controller (Omen) sniper window aur CT smoke karta hai, aur Duelist (Raze) satchel karke blinded enemies ko kill karta hai: jabki Sentinel (Cypher) flank hold karta hai."
    },
    proTipTitle: "2025 Meta Shift",
    proTip: {
      EN: "The most significant role shift of VCT 2025 was the rise of double-Initiator compositions: running two info-gathering/flashing agents simultaneously with no Sentinel. The 2026 meta continues this trend.",
      HI: "VCT 2025 ka sabse significant role shift double-Initiator compositions ka rise tha: bina kisi Sentinel ke do info-gathering agents run karna. 2026 meta is trend ko continue kar raha hai."
    }
  },
  {
    id: "v_ch3",
    title: "CHAPTER 3: MACRO PLAY (MAP CONTROL & ROTATIONS)",
    description: {
      EN: "Macro is the 'Big Picture' strategy. It is about slowly taking map space, forcing enemy defenders to use their abilities early, reading when a site is over-defended, and quickly rotating to exploit the weakness. Mid control is the most contested macro objective in Valorant.\n\nThree Macro Layers:\n- Taking Mid: Controlling the middle of the map cuts off the enemy's ability to rotate quickly.\n- Poking and Prodding: Making deliberate noise and pressure at one site just to observe how the enemy responds.\n- Finding the Gap: Watching where the enemy's defense is weakest before committing to an execute.",
      HI: "Macro ek 'Big Picture' strategy hai. Ye map space slowly lene, enemy defenders ko early abilities use karne pe force karne, aur over-defended site ko read karke quickly rotate karne ke baare mein hai. Valorant mein Mid control sabse contested macro objective hai.\n\nThree Macro Layers:\n- Taking Mid: Map ka middle control karna enemy ki quick rotation block karta hai.\n- Poking and Prodding: Ek site pe deliberate noise banana sirf ye dekhne ke liye ki enemy kaise respond karti hai.\n- Finding the Gap: Execute commit karne se pehle weak defense wali jagah dhoondhna."
    },
    keyConcepts: "Mid control, Poking and prodding, Rotation reads, Map pool adaptation",
    exampleTitle: "Baiting A Rotation",
    example: {
      EN: "Your team makes loud noise at B Site. The enemy panics and sends four defenders to B. Your IGL reads the rotation through intel, calls a rotate, and your team quietly walks to a nearly empty A Site and plants the spike for free.",
      HI: "Aapki team B Site pe loud noise karti hai. Enemy panic hoke four defenders B bhejti hai. Aapka IGL rotation read karta hai aur 'rotate' call deta hai, aur aapki team quietly ek empty A Site pe walk karke free mein spike plant karti hai."
    },
    proTipTitle: "2025 Map Pool Impact",
    proTip: {
      EN: "VCT 2025's map pool changes forced teams to completely rebuild their smoke setups and retake routes. Top teams now build map-specific playbooks for every map in the active pool before each tournament.",
      HI: "VCT 2025 ke map pool changes ne teams ko apne smoke setups completely rebuild karne pe force kiya. Top teams ab har map ke liye tournament se pehle map-specific playbooks build karti hain."
    }
  },
  {
    id: "v_ch4",
    title: "CHAPTER 4: MICRO PLAY (TRADING & CROSSFIRES)",
    description: {
      EN: "Micro is the mechanics of fighting. Pro teams never take fair 1v1 fights. Every engagement should be a 2v1 or better. The two core micro concepts are trading and crossfires. In VCT 2025, double peeking became a signature technique.\n\nCombat Rules Every Pro Team Follows:\n- Never take a duel without a teammate positioned to trade you.\n- Crossfire angles must be set before any aggressive move is made.\n- The closer your teammate is when you peek, the faster the trade.\n- Post-plant crossfires are as important as site-entry crossfires.",
      HI: "Micro fighting ki mechanics hai. Pro teams kabhi fair 1v1 fights nahi leti. Har engagement 2v1 ya better honi chahiye. Do core micro concepts hain: trading aur crossfires. VCT 2025 mein, double peeking ek signature technique ban gayi.\n\nCombat Rules jo har Pro Team follow karti hai:\n- Bina trade backup ke kabhi duel mat lo.\n- Koi bhi aggressive move lene se pehle crossfire angles set hone chahiye.\n- Post-plant crossfires site-entry crossfires jitne hi important hain."
    },
    keyConcepts: "Trading, Crossfire positioning, Double peeking, Engagement timing",
    exampleTitle: "L-Shape Crossfire",
    example: {
      EN: "You and your teammate hold the entrance to a site in an L-shape. An enemy Raze rockets in and kills your teammate. Because you are perfectly positioned in a crossfire, you shoot the Raze in the side of the head before she can turn — a trade that costs the enemy a player.",
      HI: "Aap aur aapka teammate ek site entrance ko L-shape mein hold karte hain. Ek enemy Raze in rocket karti hai aur aapke teammate ko kill karti hai. Kyunki aap perfectly crossfire mein the, aap Raze ko shoot karte hain uske turn karne se pehle hi: ek aisi trade jo enemy ka player down karti hai."
    },
    proTipTitle: "Paper Rex Double Peeks",
    proTip: {
      EN: "Paper Rex built their entire attacking style around double peeks and aggressive crossfire setups that punish defenders who pre-aim a single angle. Their micro play forces defenders to choose between two simultaneous threats.",
      HI: "Paper Rex ne apna entire attacking style double peeks aur aggressive crossfire setups pe build kiya jo single angle pre-aim karne wale defenders ko punish karte hain. Unka micro play defenders ko do simultaneous threats ke beech choose karne pe majboor karta hai."
    }
  },
  {
    id: "v_ch5",
    title: "CHAPTER 5: EXECUTING & PLAYING FOR RETAKE",
    description: {
      EN: "A site execute is when all five players' abilities are deployed at the exact same moment to flood onto a site and overwhelm defenders. The defensive retake is the opposite philosophy: if five attackers rush a site, the lone defender should not try to be a hero — they retreat, stall with utility, and wait for teammates.\n\nExecute Sequence:\n- Controller smokes all defender angles simultaneously.\n- Initiator flashes deep into the site.\n- Duelist enters first on the flash timing.\n- Support players enter immediately behind.\n- Once the spike is planted, all five players take post-plant crossfire positions.",
      HI: "Site execute tab hota hai jab paanchon players ki abilities exact same moment pe deploy ki jati hain taaki defenders ko overwhelm kiya ja sake. Defensive retake iska opposite hai: agar 5 attackers rush karein, toh lone defender ko hero banne ki try nahi karni chahiye: unhe retreat karke utility se stall karna chahiye aur teammates ka wait karna chahiye.\n\nExecute Sequence:\n- Controller saare defender angles smoke karta hai.\n- Initiator site ke deep mein flash karta hai.\n- Duelist flash timing pe first enter karta hai.\n- Spike plant hote hi sabhi 5 players post-plant crossfire positions lete hain."
    },
    keyConcepts: "Ability timing, Simultaneous execute, Defensive stalling, Post-plant play",
    exampleTitle: "Defensive Retake",
    example: {
      EN: "You are defending C Site alone and see five enemies rushing. Instead of dying for nothing, you throw a utility ability to slow them, run backward to safety, and call the site. Your team regroups and fights a fair 5v5 retake.",
      HI: "Aap akele C Site defend kar rahe hain aur 5 enemies ko aate dekhte hain. Waste mein marne ki jagah, aap unhe slow karne ke liye utility throw karte hain, safety ke liye back run karte hain. Aapki team regroup karti hai aur ek fair 5v5 retake fight karti hai."
    },
    proTipTitle: "Post-Plant Priority",
    proTip: {
      EN: "At VCT 2025 level, the execute does not end when the spike is planted — it ends when the round is won. Elite teams spend as much practice time on post-plant crossfire setups as they do on initial entry.",
      HI: "VCT 2025 level par, execute spike plant hone pe end nahi hota: ye round win hone pe end hota hai. Elite teams initial entry jitna hi practice time post-plant crossfire setups pe spend karti hain."
    }
  },
  {
    id: "v_ch6",
    title: "CHAPTER 6: ULTIMATE ECONOMY & ABILITY COMBOS",
    description: {
      EN: "Ultimates are the most powerful tools in the game, but they are constantly wasted by teams who use them reactively. Elite teams build entire rounds around combining two ultimates for an uncounterable play. The first step is ultimate tracking (pressing Tab every round). The second step is ability layering.\n\nTop Ultimate Combos:\n- Fade Nightfall + Raze Showstopper\n- Sova Hunters Fury + teammate damage\n- Breach Rolling Thunder + Duelist entry\n- Omen Paranoia flash + entry",
      HI: "Ultimates game ke sabse powerful tools hain, par teams inhe aksar reactively use karke waste kar deti hain. Elite teams do ultimates ko combine karke entire rounds build karti hain ek uncounterable play ke liye. Pehla step ultimate tracking hai (har round Tab press karna). Doosra step ability layering hai.\n\nTop Ultimate Combos:\n- Fade Nightfall + Raze Showstopper\n- Sova Hunters Fury + teammate damage\n- Breach Rolling Thunder + Duelist entry\n- Omen Paranoia flash + entry"
    },
    keyConcepts: "Ultimate tracking, Ability layering, Combo timing, Counter-ult awareness",
    exampleTitle: "Fade + Raze Combo",
    example: {
      EN: "Your Fade uses Nightfall to deafen and reveal enemies. The moment the ability lands, your Raze fires the Showstopper rocket directly at the revealed cluster — securing multiple kills with zero counterplay.",
      HI: "Aapki Fade site pe chhipe enemies ko reveal karne ke liye Nightfall use karti hai. Jaise hi ability land karti hai, aapki Raze directly revealed cluster pe Showstopper rocket fire karti hai: zero counterplay ke sath multiple kills secure karte hue."
    },
    proTipTitle: "Tracking Tab",
    proTip: {
      EN: "At Masters Bangkok 2025, Tejo dominated because his ultimate combined with Omen smokes created uncounterable site denials. Over-reliance on a single ultimate combo is a strategic vulnerability if balance changes occur.",
      HI: "Masters Bangkok 2025 mein, Tejo ne isliye dominate kiya kyunki uske ultimate aur Omen smokes se uncounterable site denials ban gaye the. Ek hi ultimate combo par over-reliance ek strategic vulnerability hai agar game mein balance changes ho jayein."
    }
  },
  {
    id: "v_ch7",
    title: "CHAPTER 7: DEFAULTING (THE ANTI-RUSH)",
    description: {
      EN: "Bad teams pick a site and rush it every round. Good teams 'Default' — spreading across the entire map in a controlled formation (1-3-1 or 2-1-2) to gather information, bait out enemy utility, and identify the weakest point before committing. Only after finding the gap does your IGL commit to the execute.\n\nDefault Principles:\n- Spread to create multiple threats.\n- Avoid peeking aggressively — the goal is information.\n- Force enemy utility waste by faking interest at both sites.\n- The IGL sets a 'commit point' where the default converts into a full execute.",
      HI: "Bad teams ek site pick karke har round rush karti hain. Good teams 'Default' karti hain: entire map pe spread hoke (1-3-1 ya 2-1-2) info gather karti hain, enemy utility waste karwati hain, aur commit karne se pehle weakest point dhoondhti hain.\n\nDefault Principles:\n- Multiple threats create karne ke liye spread ho jao.\n- Aggressively peek avoid karo: goal information hai.\n- Dono sites pe fake interest dikhakar enemy ki utility waste karao.\n- IGL ek 'commit point' set karta hai jahan default full execute mein convert hota hai."
    },
    keyConcepts: "Default formations, Utility baiting, Information gathering, Commit timing",
    exampleTitle: "Baiting Utility",
    example: {
      EN: "Your team spreads silently. The enemy Cypher panics and wastes all his traps at B, while the enemy Omen blows two smokes at Mid. Since the defense has no utility left, your IGL calls a B execute against a completely dry defense.",
      HI: "Aapki team silently spread hoti hai. Enemy Cypher panic hoke apne saare traps B par waste kar deta hai, jabki Omen Mid pe do smokes blow kar deta hai. Ab defense ke paas utility nahi hai, toh aapka IGL ek completely dry defense ke against B execute call karta hai."
    },
    proTipTitle: "Fnatic Default Style",
    proTip: {
      EN: "Fnatic are the gold standard of default play in VCT EMEA. Their entire attacking style is built on the slowest, most methodical defaults — gathering information for 60–70 seconds, baiting out every piece of utility, before executing perfectly.",
      HI: "Fnatic VCT EMEA mein default play ke gold standard hain. Unka entire attacking style sabse slowest, methodical defaults pe based hai: 60-70 seconds tak info gather karna, har ek utility waste karwana, aur fir perfectly execute karna."
    }
  },
  {
    id: "v_ch8",
    title: "CHAPTER 8: DATA GATHERING & SETUP READING",
    description: {
      EN: "Memorizing how the enemy team likes to play and using that data to completely counter them before the round even begins. There are two layers: macro setup reading (identifying whether the enemy is aggressive or stacking a site) and economic reading (looking at the enemy's credit state to predict their buy).\n\nWhat to Track:\n- Which agents the enemy picked and their usual lineup tendencies.\n- How many credits the enemy spent last round to predict their exact buy.\n- Which ultimates the enemy has ready.\n- Early round rotations and numbers spotted at each site.",
      HI: "Enemy team ke khelne ke style ko memorize karna aur use counter karne ke liye data use karna. Iske do layers hain: macro setup reading (ye janna ki enemy aggressive hai ya site stack kar rahi hai) aur economic reading (enemy ke credits dekh kar unki buy predict karna).\n\nWhat to Track:\n- Enemy ke agent picks aur unki lineup tendencies.\n- Enemy ne last round kitne credits spend kiye taaki unki buy predict ho sake.\n- Enemy ke kaunse ultimates ready hain.\n- Early round rotations aur har site pe kitne log spot hue."
    },
    keyConcepts: "Agent tendency tracking, Economy reading, Setup recognition, Adaptation speed",
    exampleTitle: "Economic Countering",
    example: {
      EN: "You notice the enemy team is broke and can only afford Judges (shotguns). Your IGL calls for the team to avoid tight corners and choke points. Instead, you play every fight at rifle range where Judges are completely useless.",
      HI: "Aap notice karte hain ki enemy broke hai aur sirf Judges (shotguns) afford kar sakti hai. Aapka IGL call deta hai ki tight corners aur choke points avoid karein. Iski jagah, aap har fight long range pe lete hain jahan Judges bilkul useless hain."
    },
    proTipTitle: "2025 Coach Preparation",
    proTip: {
      EN: "At VCT 2025, top coaching staffs build opponent-specific playbooks before every series — mapping each enemy player's agent tendencies, preferred corners, and common rotation paths using game data tools.",
      HI: "VCT 2025 mein, top coaching staffs har series se pehle opponent-specific playbooks build karte hain: jisme game data tools use karke har enemy player ki tendencies, preferred corners, aur rotation paths map kiye jate hain."
    }
  },
  {
    id: "v_ch9",
    title: "CHAPTER 9: MID-ROUNDING & MIND GAMES",
    description: {
      EN: "Mid-rounding is the hardest cognitive skill in Valorant. It is the IGL's ability to completely change the strategy 45 seconds into a round based on new information — abandoning the original plan and calling an entirely different execute without creating confusion.\n\nThe Three Mind Game Weapons:\n- Conditioning: Establish a pattern over two or three rounds deliberately, then break it.\n- Fakes: Make a full fake execute at one site to pull defenders, then instantly rotate.\n- Mid-round pivot: Abandoning an execute mid-rotation if new audio intel reveals a heavy stack.",
      HI: "Mid-rounding Valorant ka sabse hard cognitive skill hai. Ye IGL ki ability hai jo new information ke basis pe round ke beech mein strategy completely change kar de: bina confusion ke old plan chhodkar naya execute call karna.\n\nThe Three Mind Game Weapons:\n- Conditioning: Janbujh kar 2-3 rounds ek pattern establish karo, fir use break kar do.\n- Fakes: Ek site pe full fake execute karke defenders ko pull karo, fir instantly rotate karo.\n- Mid-round pivot: Agar audio se pata chale ki site stacked hai, toh rotation beech mein cancel kar do."
    },
    keyConcepts: "Mid-round calling, Conditioning, Fakes, Timing reads, IGL decision speed",
    exampleTitle: "The Conditioned Fake",
    example: {
      EN: "For three rounds, your team throws a full smoke wall at B Site and immediately pushes. On the fourth round, you throw the exact same smoke wall at B — but your entire team is silently waiting outside A. The enemy rotates to B, leaving A empty.",
      HI: "Teen rounds tak, aapki team B Site pe full smoke wall throw karke push karti hai. Fourth round mein, aap exactly same smoke wall B pe throw karte hain: par poori team silently A ke bahar wait kar rahi hoti hai. Enemy B ki taraf rotate karti hai, aur A empty ho jata hai."
    },
    proTipTitle: "RRQ Champions 2025",
    proTip: {
      EN: "At VALORANT Champions 2025, RRQ developed a conditioning-based identity centered on double-Duelist compositions to create information confusion. They turned mind games into a structured system rather than improvisation.",
      HI: "VALORANT Champions 2025 mein, RRQ ne double-Duelist compositions ke through ek conditioning-based identity banayi. Unhone mind games ko improvisation ki jagah ek structured system mein badal diya."
    }
  },
  {
    id: "v_ch10",
    title: "CHAPTER 10: VOD REVIEW (FIXING MISTAKES)",
    description: {
      EN: "VOD review is the fastest shortcut to improvement that most teams avoid because it requires confronting mistakes without ego. The goal is to identify the exact decision that caused a loss, not just the aim that missed the shot. A professional VOD review session focuses on three categories: positioning errors, pacing errors, and utility errors.\n\nProfessional VOD Review Protocol:\n- IGL or coach timestamps every death and loss.\n- Team watches each timestamp in silence first.\n- The player involved explains what they believed was happening.\n- Coach identifies the gap between belief and reality.",
      HI: "VOD review improvement ka sabse fast shortcut hai jise zyada teams avoid karti hain kyunki isme bina ego ke mistakes confront karni padti hain. Goal us exact decision ko pakadna hai jisne loss karwaya, sirf missed aim nahi. Review 3 categories pe focus karta hai: positioning errors, pacing errors, aur utility errors.\n\nProfessional VOD Review Protocol:\n- IGL ya coach har death ko timestamp karta hai.\n- Team pehle us timestamp ko silence mein dekhti hai.\n- Involved player explain karta hai ki us moment pe usne kya socha.\n- Coach belief aur reality ke gap ko identify karta hai."
    },
    keyConcepts: "Error categorization, Ego-free analysis, Pacing review, Utility audit",
    exampleTitle: "Fixing The Real Problem",
    example: {
      EN: "You watch a replay and see you died holding an angle alone. The immediate reaction is 'my aim was off.' The actual mistake is that you peeked without asking your Initiator to flash first. The correction is communication timing, not aim training.",
      HI: "Aap replay mein dekhte hain ki aap akele angle hold karte hue mare. First reaction hota hai 'mera aim off tha'. Real mistake ye hoti hai ki aapne bina Initiator se flash mange peek kiya. Iski correction communication timing hai, aim training nahi."
    },
    proTipTitle: "Round-by-Round Coaching",
    proTip: {
      EN: "Professional VCT coaches break down VODs round by round as a complete system rather than isolated moments. The best coaching sessions end with two or three specific focus points for the next scrimmage block.",
      HI: "Professional VCT coaches VODs ko isolated moments ki jagah ek complete system ki tarah round-by-round break down karte hain. Best coaching sessions next practice ke liye sirf do ya teen specific focus points set karte hain."
    }
  },
  {
    id: "v_ch11",
    title: "CHAPTER 11: GLOBAL META ADAPTATION (PLAYSTYLES)",
    description: {
      EN: "Understanding how different teams globally play Valorant, identifying which regional style dominates a given match, and adapting your strategy to counter it rather than fight it head-on.\n\nThe Four Regional Styles at VCT 2025:\n- The Methodical Style (Fnatic, EMEA): Playing slow, perfect lineups. Counter: Play aggressively and break setups early.\n- W-Gaming Chaos (Paper Rex, Pacific): Sprinting, double peeking, pure speed. Counter: Play passive, set pre-placed traps.\n- Data-Driven Control (G2 Esports, EMEA): System-play with economy reads. Counter: Break economy early to force half-buys.\n- Hyper-Aggressive Information (EDG-inspired, China): Triple-Initiators, sacrificing Sentinels. Counter: Anchor defense heavily.",
      HI: "Ye samajhna ki globally alag teams Valorant kaise khelti hain, aur unke style ko counter karne ke liye apni strategy adapt karna.\n\nThe Four Regional Styles:\n- The Methodical Style (Fnatic, EMEA): Slow play, perfect lineups. Counter: Aggressive khelo aur unke setups early break karo.\n- W-Gaming Chaos (Paper Rex, Pacific): Sprinting, double peeking, speed. Counter: Passive khelo aur pre-placed traps set karo.\n- Data-Driven Control (G2 Esports, EMEA): Economy reads ke sath system-play. Counter: Unki economy ko early break karke half-buys force karao.\n- Hyper-Aggressive Information (EDG-inspired, China): Triple-Initiators. Counter: Sentinel se defense strongly anchor karo."
    },
    keyConcepts: "Regional playstyle scouting, Counter-style adaptation, Meta tracking",
    exampleTitle: "Countering W-Gaming",
    example: {
      EN: "You are playing a team that constantly pushes through their own smokes with W-key aggression. Your team adapts by having your Sentinel place Killjoy turrets and Cypher tripwires directly at the exit points of every smoke.",
      HI: "Aap ek aisi team ke against khel rahe hain jo lagatar apne smokes ke through W-key aggression se push karti hai. Aapki team adapt karti hai: aapka Sentinel saare smokes ke exit points pe directly Killjoy turrets aur Cypher tripwires laga deta hai."
    },
    proTipTitle: "Tejo Lesson",
    proTip: {
      EN: "The biggest meta adaptation lesson of VCT 2025 was the Tejo cycle. Teams that over-committed to Tejo-dependent compositions were completely lost when Riot nerfed him. Teams that maintained compositional flexibility performed consistently.",
      HI: "VCT 2025 ka sabse bada meta lesson Tejo cycle tha. Jo teams poori tarah Tejo-dependent comps pe rely karti thi, nerf aate hi wo lost ho gayin. Jinhone compositional flexibility maintain rakhi, unhone consistently perform kiya."
    }
  },
  {
    id: "v_ch12",
    title: "CHAPTER 12: MENTAL STAMINA & THE RESET",
    description: {
      EN: "Valorant is a game of momentum, and momentum is entirely psychological. Staying mentally unbreakable across a best-of-three or best-of-five series requires the same deliberate preparation that goes into agent compositions.\n\nThe Four Mental Tools:\n- The Reset ('Flush It'): After a lost round, call 'flush it'. No discussion of the mistake until post-game.\n- The Tactical Timeout: A formal pause to stop the enemy's momentum and reset energy.\n- Next Round Mentality: Compartmentalizing. A blown clutch or missed shot doesn't carry over.\n- Confidence Anchoring: The IGL gives a tactical confidence statement before high-pressure rounds.",
      HI: "Valorant ek momentum ka game hai, aur momentum poori tarah psychological hota hai. Best-of-3 ya best-of-5 series ke dauran mentally unbreakable rehne ke liye utni hi preparation chahiye jitni agent comps ke liye.\n\nThe Four Mental Tools:\n- The Reset ('Flush It'): Round lose hone ke baad 'flush it' call karo. Post-game tak us mistake ka koi discussion nahi.\n- The Tactical Timeout: Enemy ka momentum todne aur energy reset karne ke liye formal pause.\n- Next Round Mentality: Compartmentalize karna. Koi missed shot ya blown clutch next round mein nahi aana chahiye.\n- Confidence Anchoring: High-pressure rounds se pehle IGL ek tactical confidence statement deta hai."
    },
    keyConcepts: "Momentum management, The reset, Tactical timeout, Round-to-round mentality",
    exampleTitle: "The Fast Reset",
    example: {
      EN: "Your Duelist accidentally kills themselves with a grenade on match point. Old response: teammates sigh, going quiet. New response: IGL immediately says 'flush it, fast A split next round, everyone buy rifles.' The incident is gone.",
      HI: "Match point pe aapka Duelist accidentally apne hi grenade se mar jata hai. Old response: teammates sigh karte hain aur shant ho jate hain. New response: IGL turant kehta hai 'flush it, next round fast A split, sab rifles buy karo.' Wo incident wahin khatam ho jata hai."
    },
    proTipTitle: "VCT 2025 Rookie Pressure",
    proTip: {
      EN: "Coaching staffs now formally integrate mental preparation sessions before international events, including visualization exercises and breathing protocols. Teams that treat mental prep as optional operate at a disadvantage.",
      HI: "Coaching staffs ab international events se pehle formally mental preparation sessions integrate karte hain, jisme visualization exercises aur breathing protocols shamil hote hain. Jo teams isko optional manti hain wo disadvantage pe rehti hain."
    }
  }
];
