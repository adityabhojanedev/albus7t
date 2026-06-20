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

export const pubgChapters: Chapter[] = [
  {
    id: "ch1",
    title: "CHAPTER 1: TEAM FOUNDATION & SYNERGY",
    description: {
      EN: "A squad of four talented solo players is still a bad team. Foundation is about converting four individuals into a single unit — standardized drop spots so nobody lands 300m apart chasing loot, a shared callout language so \"enemy north 330, behind the boulder\" means the same thing to everyone, and a loot distribution system so your fragger gets Level 3 armor while your IGL gets the 4x scope. Without this layer, every other chapter breaks down.",
      HI: "Chaar talented solo players ki squad bhi ek bad team hoti hai. Foundation ka matlab hai chaar individuals ko ek single unit mein convert karna: standardized drop spots taaki koi 300m door na gire loot ke peeche, ek shared callout language jisse \"enemy north 330, behind the boulder\" ka matlab sabke liye same ho, aur ek loot distribution system jisse aapke fragger ko Level 3 armor mile aur IGL ko 4x scope. Is layer ke bina baaki har chapter break down ho jata hai."
    },
    keyConcepts: "Callout language, Drop standardization, Loot priority, Squad synergy",
    exampleTitle: "Callout Example",
    example: {
      EN: "Wrong: \"He's over there near the rocks!\"\nCorrect: \"One contact, North 330, behind the tall boulder, stationary.\"\nEvery callout must include: count + clock/compass direction + landmark + movement status.",
      HI: "Wrong: \"Wo wahan rocks ke paas hai!\"\nCorrect: \"One contact, North 330, tall boulder ke peeche, stationary.\"\nHar callout mein count + clock/compass direction + landmark + movement status hona chahiye."
    },
    proTipTitle: "PMGC Standard",
    proTip: {
      EN: "Top teams like Alpha Gaming and DRX pre-build a custom callout map before every tournament, assigning unique codenames to every major landmark on each map. \"Crow house\" or \"radio tower\" is faster than any compass reading in a high-pressure fight.",
      HI: "Alpha Gaming aur DRX jaisi top teams har tournament se pehle custom callout map banati hain, jisme har major landmark ka ek unique codename hota hai. High-pressure fight mein compass reading se fast \"Crow house\" ya \"radio tower\" bolna hota hai."
    }
  },
  {
    id: "ch2",
    title: "CHAPTER 2: PLAYER ROLES & RESPONSIBILITIES",
    description: {
      EN: "Roles exist to eliminate hesitation. In a chaotic team fight, nobody has time to think about who should push, who should hold, or who should throw the grenade. Roles make those decisions in advance.\nThe four core roles:\n- IGL (In-Game Leader): Reads the map, calls all rotations and engagement decisions.\n- Entry Fragger: Highest mechanical skill player, initiates all pushes first.\n- Support: Trails slightly behind to provide utility, watches flanks, handles revives.\n- Scout: Drives ahead, gathers intel, identifies zone shifts early.",
      HI: "Roles hesitation ko eliminate karne ke liye hote hain. Ek chaotic team fight mein, kisi ke paas sochne ka time nahi hota ki kaun push karega, kaun hold karega, ya kaun grenade throw karega. Roles ye decisions in advance tay kar dete hain.\nChar core roles:\n- IGL: map read karta hai, rotations aur engagement calls deta hai.\n- Entry Fragger: highest mechanical skill, pehle push initiate karta hai.\n- Support: peeche reh kar utility provide karta hai, flanks watch karta hai, revives handle karta hai.\n- Scout: aage drive karta hai, intel gather karta hai, zone shifts ko early identify karta hai."
    },
    keyConcepts: "Role definition, IGL calling, Fragger mechanics, Support utility, Scout intel",
    exampleTitle: "House Push Sequence",
    example: {
      EN: "Scout confirms enemy in the building → IGL calls \"push in 3\" → Fragger kicks the door as Support throws a flashbang through the side window → IGL enters last and immediately assumes a holding angle for counterattacks.",
      HI: "Scout confirm karta hai ki building mein enemy hai → IGL \"push in 3\" ki call deta hai → Fragger door kick karta hai jabki Support side window se flashbang throw karta hai → IGL last mein enter karta hai aur counterattacks ke liye ek holding angle assume le leta hai."
    },
    proTipTitle: "Role Fluidity",
    proTip: {
      EN: "Elite IGLs like DOK of Alpha Gaming also carry the team's primary DMR — the IGL role is cognitive, not positional. The best teams can swap roles mid-match when a player dies, with the support temporarily becoming the caller until the IGL is revived.",
      HI: "Alpha Gaming ke DOK jaise elite IGLs team ka primary DMR bhi carry karte hain. IGL ka role cognitive hota hai, positional nahi. Best teams mid-match mein roles swap kar sakti hain jab koi player marta hai, jahan support temporarily caller ban jata hai jab tak IGL revive na ho jaye."
    }
  },
  {
    id: "ch3",
    title: "CHAPTER 3: MACRO PLAY — MAP STRATEGY & ZONE CONTROL",
    description: {
      EN: "Macro is the \"big picture\" — predicting where the zone will collapse, securing advantageous positions before enemies do, and never being caught rotating through open ground. A 750–800m early-jump rule gives your team a 5–10 second advantage on landing. Pro rotation timing means moving 60–90 seconds before the zone forces you to, using vehicles until 300–500m from the destination, then going on foot. Bridge choke situations require pre-planned alternate routes — bridge blocks lose matches.",
      HI: "Macro ek \"big picture\" hai: zone kahan collapse hoga predict karna, enemies se pehle advantageous positions secure karna, aur open ground mein rotate karte hue kabhi nahi phasna. 750-800m early-jump rule team ko landing pe 5-10 second ka advantage deta hai. Pro rotation timing ka matlab zone ke force karne se 60-90 seconds pehle move karna. Destination se 300-500m tak vehicles use karein, phir on foot jayen. Bridge chokes ke liye pre-planned alternate routes hone chahiye, bridge blocks matches lose karwate hain."
    },
    keyConcepts: "Zone prediction, Rotation timing, Vehicle management, Drop selection",
    exampleTitle: "Bridge Situation",
    example: {
      EN: "IGL reads the zone shifting across the bridge → team immediately loads vehicles and races to secure the far-bank compounds → by the time enemy teams realize the zone is there, your squad owns the best buildings and has set up crossfires on the bridge itself.",
      HI: "IGL read karta hai ki zone bridge ke us paar shift ho raha hai → team immediately vehicles mein load hoti hai aur far-bank compounds secure karne ke liye race karti hai → jab tak enemy teams realize karti hain, aapki squad best buildings own kar rahi hoti hai aur bridge pe crossfire set kar chuki hoti hai."
    },
    proTipTitle: "PMWC 2025 Meta",
    proTip: {
      EN: "At PMWC 2025, champion teams used \"edge-first\" rotations — hugging the zone edge with smoke cover rather than cutting through the center, eliminating the risk of being caught in the open by multiple teams simultaneously.",
      HI: "PMWC 2025 mein, champion teams ne \"edge-first\" rotations use ki: center se cut karne ke bajaye smoke cover ke saath zone edge ko hug karte hue, jisse open mein multiple teams dwara catch hone ka risk eliminate ho gaya."
    }
  },
  {
    id: "ch4",
    title: "CHAPTER 4: MICRO PLAY — TEAM FIGHTS & CROSSFIRES",
    description: {
      EN: "Micro is how you win the actual 4v4 gunfight. The core principle: never let enemies face just one target. Spread your squad into an L-shape or triangle formation so any enemy who takes cover from one player is exposed to another. Crossfire means at least two players have overlapping lines of fire on the same position. Trading is the backup rule: if a teammate is knocked, the person who knocked them must die before they can finish the revive. In the 2025 meta, the DBS shotgun has significantly changed close-quarter combat — doorway holds are now extremely high-risk.",
      HI: "Micro wo hai jis se aap actual 4v4 gunfight win karte hain. Core principle: enemies ko kabhi sirf ek target face karne mat do. Apni squad ko L-shape ya triangle formation mein spread karo taaki jo bhi enemy ek se cover le, wo doosre ko expose ho jaye. Crossfire ka matlab hai kam se kam do players ki firing line ek position pe overlap ho. Trading backup rule hai: agar teammate knock hua, toh jisne knock kiya use marna padega pehle. 2025 meta mein DBS ne close-quarter combat ko change kar diya hai, doorway holds ab extremely high-risk hain."
    },
    keyConcepts: "Crossfire setup, Trading kills, Formation spacing, CQC meta",
    exampleTitle: "L-Shape Crossfire",
    example: {
      EN: "Player A holds a wall corner facing south. Player B holds a position 15m east, also angled south. Any enemy who peeks Player A exposes their right flank to Player B. If they turn to fight Player B, Player A gets a free shot to their side. They cannot simultaneously win both angles.",
      HI: "Player A south face karte hue wall corner hold karta hai. Player B 15m east mein ek position hold karta hai, wo bhi south angled. Jo enemy Player A ko peek karega wo Player B ko apna right flank expose karega. Agar wo turn karke Player B se fight karta hai, Player A ko free side shot milta hai. Wo simultaneously dono angles win nahi kar sakte."
    },
    proTipTitle: "Engagement Criteria",
    proTip: {
      EN: "The IGL's rule before calling any push: confirm ample cover for withdrawal, confirm crossfire positions are set, confirm no third party is within 200m. Engagement without a clear advantage is a liability, not aggression.",
      HI: "Push call karne se pehle IGL ka rule: withdrawal ke liye ample cover confirm karo, crossfire positions set hain confirm karo, 200m ke andar koi third party nahi hai confirm karo. Bina clear advantage ke engage karna liability hai, aggression nahi."
    }
  },
  {
    id: "ch5",
    title: "CHAPTER 5: COMPOUND CRASH — COORDINATED EXECUTIONS",
    description: {
      EN: "The compound crash is the most choreographed sequence in PUBG Mobile esports — driving vehicles directly into an enemy-held compound from multiple angles simultaneously. The principle is time compression: defenders can only watch one direction at once. If all four attackers arrive from different angles at the exact same second, the defenders simply cannot react fast enough. Timing precision is measured in under-a-second windows. One player arriving late gives defenders a moment to reset and the entire execution fails.",
      HI: "Compound crash PUBG Mobile esports ka sabse choreographed sequence hai: directly enemy-held compound mein vehicles drive karna multiple angles se simultaneously. Principle time compression hai: defenders ek time pe ek hi direction watch kar sakte hain. Agar charo attackers exact same second pe different angles se aate hain, toh defenders fast enough react nahi kar pate. Timing precision microseconds mein measure hoti hai. Ek player ka late arrive karna defenders ko reset karne ka moment deta hai aur crash fail ho jata hai."
    },
    keyConcepts: "Execution timing, Multi-angle entry, Vehicle tactics, Simultaneous pressure",
    exampleTitle: "4-Point Compound Entry",
    example: {
      EN: "Two players drive to the front entrance. Two players loop to the back windows. IGL counts down from 3 on voice comms. At zero, all four jump out and open fire simultaneously — defenders face 270 degrees of incoming fire with zero time to choose a direction.",
      HI: "Do players front entrance pe drive karte hain. Do players back windows pe loop karte hain. IGL voice comms pe 3 se count down karta hai. Zero par charo ek saath jump out karke fire open karte hain. Defenders 270 degrees se incoming fire face karte hain aur direction choose karne ka zero time milta hai."
    },
    proTipTitle: "Abort Conditions",
    proTip: {
      EN: "Elite teams pre-agree on abort conditions before the crash: if any player calls \"abort\" during approach (third party spotted, timing broken, enemy positions changed), all four vehicles immediately diverge and reset. Committing to a broken crash is worse than not crashing at all.",
      HI: "Elite teams crash se pehle abort conditions pe pre-agree karti hain: agar approach ke dauran koi bhi 'abort' call deta hai (third party spotted, timing broken, enemy positions changed), toh charo vehicles immediately diverge aur reset karte hain. Broken crash mein commit karna bilkul na crash karne se zyada worse hai."
    }
  },
  {
    id: "ch6",
    title: "CHAPTER 6: UTILITY MANAGEMENT — GRENADES, SMOKES & FLASHBANGS",
    description: {
      EN: "At PMWC 2025, Alpha Gaming recorded 31 grenade kills in a single tournament — averaging nearly 8 per player. Utility is not secondary to gunplay; it creates the conditions for gunplay to work. The pro standard is 2–3 grenades per player per match minimum. Smoke grenades block sightlines and allow safe zone rotations. Flashbangs are best thrown in pairs with a 1.5-second stagger — one to force eyes closed, one to catch the re-peek. Molotovs deny healing spots for exactly 5 seconds — use them on knocked enemies to prevent self-revives. In the final circle, 8 smokes in a backpack create a complete vision wall.",
      HI: "PMWC 2025 mein, Alpha Gaming ne single tournament mein 31 grenade kills record kiye: average nearly 8 per player. Utility gunplay se secondary nahi hai; yeh gunplay ko work karne ki conditions create karta hai. Pro standard per match minimum 2-3 grenades per player hai. Smokes sightlines block karte hain aur safe zone rotations allow karte hain. Flashbangs pairs mein throw karna best hai 1.5-sec stagger ke saath. Molotovs healing spots ko exactly 5 seconds ke liye deny karte hain: inhein knocked enemies pe use karein taaki self-revives prevent ho sake. Final circle mein backpack ke 8 smokes ek complete vision wall create karte hain."
    },
    keyConcepts: "Smoke walls, Flash timing, Molotov denial, Inventory priority",
    exampleTitle: "Final-Circle Smoke Play",
    example: {
      EN: "Zone is 30m wide. Drop all healing items. Fill backpack with 8 smoke grenades. Throw in an overlapping 2-second rhythm, building a complete smoke wall on the most exposed side. Enemies trying to push walk blind into your entire squad's crossfire.",
      HI: "Zone 30m wide hai. Saare healing items drop kardo. Backpack ko 8 smoke grenades se fill kar lo. 2-second rhythm mein overlapping throw karo, most exposed side par ek complete smoke wall build karte hue. Enemies jo push karne ki try karenge wo blind hoke aapki entire squad ke crossfire mein walk in karenge."
    },
    proTipTitle: "2-Second Overlapping Smokes",
    proTip: {
      EN: "The PMWC meta standard is overlapping smokes thrown 2 seconds apart — this ensures no gap opens between clouds as the first one lands and the second is still travelling. Three players staggered creates a seamless wall. One player throwing all at once creates a patchy fence.",
      HI: "PMWC meta standard 2 seconds apart overlapping smokes throw karna hai: is se smoke clouds ke beech mein koi gap nahi open hota. Teen players ka stagger ek seamless wall create karta hai. Ek player agar sab ek saath throw kare toh patchy fence create hoti hai."
    }
  },
  {
    id: "ch7",
    title: "CHAPTER 7: DYNAMIC SPLITS — FORMATION & MAP CONTROL",
    description: {
      EN: "Standing together as a group of four makes your team a single grenade kill. Professional teams spread into formations: 2-2 (two pairs controlling separate buildings), 3-1 (three players on the main position, one player in an elevated or flanking spot), or even 1-1-2 in very late circles. The \"1\" in a 3-1 split is the highest-skill position — that player operates independently, must make their own decisions, and creates a third angle of pressure that enemies cannot account for while also dealing with the main three. Controlling more space means more information and more angles of attack.",
      HI: "Group of four mein ek saath stand karna aapki team ko ek single grenade kill bana deta hai. Professional teams formations mein spread hoti hain: 2-2, 3-1 (teen players main position pe, ek elevated ya flanking spot pe), ya 1-1-2 late circles mein. 3-1 split mein '1' highest-skill position hai: wo player independently operate karta hai, apne decisions khud leta hai, aur pressure ka ek third angle create karta hai jo enemies account for nahi kar pate. More space control karne ka matlab hai more information aur attack ke more angles."
    },
    keyConcepts: "2-2 split, 3-1 formation, Information control, Grenade denial",
    exampleTitle: "3-1 in End Circle",
    example: {
      EN: "Three players hold the main compound. The fourth hides in a small shack 80m uphill with a sniper. Enemy team attacks the main compound, fully focused on the front. The solo player shoots them in the back from elevation — a position the enemies never even checked because they didn't know anyone was there.",
      HI: "Three players main compound hold karte hain. Fourth player 80m uphill ek small shack mein sniper ke sath hide karta hai. Enemy team main compound pe attack karti hai, fully front pe focus karke. Solo player unhein peeche se elevation se shoot karta hai, ek aisi position jo enemies ne kabhi check hi nahi ki kyunki unhe pata nahi tha ki waha koi hai."
    },
    proTipTitle: "Split Communication",
    proTip: {
      EN: "The \"1\" player in a 3-1 must give a callout every 15–20 seconds about enemy positions they can see, even if not engaging. Their primary value is information, not just a flanking angle. A silent split player wastes the entire tactical concept.",
      HI: "3-1 mein '1' player ko har 15-20 seconds mein enemy positions ka callout dena padta hai jo wo dekh sakte hain, bhale hi wo engage na karein. Unki primary value information hai, sirf flanking angle nahi. Ek silent split player entire tactical concept ko waste kar deta hai."
    }
  },
  {
    id: "ch8",
    title: "CHAPTER 8: DATA & KILL FEED ANALYSIS",
    description: {
      EN: "The kill feed in the top-left corner is a real-time intelligence report that most teams completely ignore. Every kill tells you a story: which team is fighting, how many players remain, roughly where they are, and whether they will be a threat or an opportunity. Top professional teams cross-reference kill feed data with pre-studied opponent tendencies — if you watched 10 hours of Team X's VODs and know they always rotate south after winning a fight in Georgopol, a single kill feed entry transforms into an actionable IGL decision. This is why data preparation before tournament day is now as important as scrim hours.",
      HI: "Top-left mein kill feed ek real-time intelligence report hai jise most teams completely ignore karti hain. Har kill ek story batata hai: kaunsi team fight kar rahi hai, kitne players remain hain, roughly wo kahan hain, aur kya wo ek threat hain ya opportunity. Top professional teams kill feed data ko pre-studied opponent tendencies ke sath cross-reference karti hain. Agar aapne Team X ke 10 hours VODs watch kiye hain aur jante hain ki wo Georgopol win karne ke baad hamesha south rotate karte hain, toh ek single kill feed entry ek actionable IGL decision ban jati hai."
    },
    keyConcepts: "Kill feed reading, Opponent scouting, Live intelligence, Third-party timing",
    exampleTitle: "Kill Feed Decision Chain",
    example: {
      EN: "IGL sees kill feed: \"Team A\" eliminated two players near Pochinki. Pre-match prep told you Team A always lands Pochinki with 4 players. That means Team A now has only 2 players and just finished a fight — they are low on health, scattered, and vulnerable. IGL calls an immediate rotation to Pochinki for an easy elimination.",
      HI: "IGL kill feed dekhta hai: \"Team A\" ne Pochinki ke paas two players eliminate kiye. Pre-match prep mein pata tha ki Team A hamesha 4 players ke sath Pochinki land karti hai. That means Team A ke paas ab sirf 2 players hain aur unhone just ek fight finish ki hai: wo low on health hain, scattered, aur vulnerable hain. IGL turant Pochinki ke liye immediate rotation call karta hai ek easy elimination ke liye."
    },
    proTipTitle: "2025 Data Tools",
    proTip: {
      EN: "Top 2025 teams are tracking kill patterns, movement paths, and zone tendencies of every team in their bracket using match data tools. DRX's Korean coaching staff studied opponent rotation habits to the point of predicting enemy positions before the zone even closed.",
      HI: "Top 2025 teams match data tools use karke apne bracket ki har team ke kill patterns, movement paths, aur zone tendencies track kar rahi hain. DRX ke Korean coaching staff ne opponent rotation habits itni study ki ki zone close hone se pehle hi unki positions predict kar lete the."
    }
  },
  {
    id: "ch9",
    title: "CHAPTER 9: MIND GAMES & PSYCHOLOGICAL PRESSURE",
    description: {
      EN: "The goal of mind games is to force enemies to make decisions based on false information. Audio is the primary tool — PUBG Mobile players cannot see you but they can hear your vehicles, your footsteps, and your grenades landing. Misdirection is about making one thing sound like another. Speed is psychological: a team that moves twice as fast as expected breaks the opponent's decision cycle before they can react. Overwhelming aggression from an unexpected angle can cause entire enemy squads to freeze when they should be rotating — their brain needs 2–3 seconds to process what is happening, and those seconds are your opening.",
      HI: "Mind games ka goal enemies ko false information pe decisions lene ke liye force karna hai. Audio primary tool hai: PUBG Mobile players aapko dekh nahi sakte par aapke vehicles, footsteps aur grenades ki landing hear kar sakte hain. Misdirection ka matlab ek cheez ko doosri jaisa sound karana hai. Speed psychological hai: ek team jo expected se twice as fast move karti hai wo opponent ke decision cycle ko react karne se pehle break kar deti hai. Unexpected angle se overwhelming aggression entire enemy squads ko freeze kar sakta hai: unke brain ko process karne ke liye 2-3 seconds chahiye hote hain, aur wahi seconds aapka opening hote hain."
    },
    keyConcepts: "Audio misdirection, False retreats, Speed pressure, Decision disruption",
    exampleTitle: "The Fake Retreat",
    example: {
      EN: "Park three vehicles behind a hill out of sight. Send one player to drive loudly away in the opposite direction. Enemy team hears the engine leaving, assumes your team has rotated out, and rushes into the open to loot or reposition. Three players are still behind the hill — waiting for exactly that moment.",
      HI: "Three vehicles hill ke peeche out of sight park kardo. Ek player ko loudly opposite direction mein drive karne send karo. Enemy team engine ko leave karte hue hear karti hai, assume karti hai ki aapki team rotate out ho chuki hai, aur open mein rush karti hai loot ya reposition karne. Three players abhi bhi hill ke peeche hote hain, exactly us moment ke liye wait karte hue."
    },
    proTipTitle: "Cognitive Overload",
    proTip: {
      EN: "The best mind games do not require complex deception — they just require speed. If your team engages from a direction enemies never anticipated, the 2–3 seconds they spend identifying the threat is enough for your fragger to eliminate two of them before any real defense is mounted.",
      HI: "Best mind games mein complex deception require nahi hoti: they just require speed. Agar aap aisi direction se engage karte hain jo enemies ne never anticipate ki thi, toh threat identify karne mein unhe 2-3 seconds lagenge aur wo time aapke fragger ke liye do enemies eliminate karne ke liye enough hota hai before any real defense."
    }
  },
  {
    id: "ch10",
    title: "CHAPTER 10: VOD REVIEW — STRUCTURED ERROR ANALYSIS",
    description: {
      EN: "VOD review is the fastest shortcut to improvement that most teams refuse to take seriously because it forces them to confront their mistakes without ego. The process: watch every match death in slow motion, identify the exact moment the wrong decision was made (not the shot — the decision that led to the position), categorize errors by type (rotation mistake, utility failure, communication gap, role confusion), and build a correction drill for each category. Professional coaching staffs like those working with DRX treat VOD sessions as non-negotiable daily practice, often spending more time reviewing footage than actually playing.",
      HI: "VOD review improvement ka fastest shortcut hai jise zyadatar teams seriously refuse karti hain kyunki ye unhe bina ego ke mistakes ko confront karne force karta hai. Process: har match death ko slow motion mein watch karo, exact moment identify karo jab wrong decision liya gaya (shot nahi, balki wo decision jis wajah se wo position bani), errors ko type wise categorize karo (rotation mistake, utility failure, communication gap, role confusion), aur har category ke liye ek correction drill build karo. DRX jaisi teams mein VOD sessions daily non-negotiable practice hote hain."
    },
    keyConcepts: "Error categorization, Ego-free review, Decision analysis, Correction drills",
    exampleTitle: "VOD Review Protocol",
    example: {
      EN: "After each scrim session: IGL timestamps every death in the replay. Team watches each timestamp in silence first, then the player who died explains what they thought was happening at that moment. Coach identifies the gap between what the player believed and what the replay actually shows. A correction focus for the next session is agreed upon — no arguments, no blame, just data.",
      HI: "Har scrim session ke baad: IGL replay mein every death ko timestamp karta hai. Team har timestamp pehle silence mein dekhti hai, fir jis player ki death hui wo explain karta hai ki unhone us moment pe kya thought kiya tha. Coach player ki belief aur actual replay ke gap ko identify karta hai. Next session ke liye ek correction focus agree hota hai: no arguments, no blame, just data."
    },
    proTipTitle: "Progress Not Perfection",
    proTip: {
      EN: "Esports psychologist Gabriela Kloudova, who worked with PUBG Esports tournament winners Entropiq, emphasizes that elite teams track improvement over perfection — celebrating that a specific error type reduced by 30% this week, not demanding it be eliminated entirely. This framing prevents the psychological shutdown that makes VOD review sessions counterproductive.",
      HI: "Esports psychologist Gabriela Kloudova emphasize karti hain ki elite teams perfection se zyada improvement track karti hain: ye celebrate karti hain ki ek specific error type is week 30% reduce hua, use completely eliminate karne ki demand nahi karti. Ye framing psychological shutdown ko prevent karti hai jo VOD review sessions ko counterproductive banata hai."
    }
  },
  {
    id: "ch11",
    title: "CHAPTER 11: GLOBAL META ADAPTATION — REGIONAL PLAYSTYLE INTELLIGENCE",
    description: {
      EN: "PUBG Mobile at PMGC level is a genuine clash of distinct regional cultures, each with structural differences that reflect training environments, coaching philosophies, and local competitive incentives. Mongolian teams (Alpha Gaming) play extreme early aggression — IGL DOK's positioning sometimes sacrifices survival for information. Chinese teams (Weibo Gaming, TT Global) are methodical zone controllers. Korean teams (DRX, Nongshim RedForce) play deep tactical PUBG with coach-driven strategies. Southeast Asian teams are fast and highly adaptive. Your IGL must diagnose which style dominates a given lobby and adjust accordingly — playing passive in a passive lobby loses information, playing aggressive in an aggressive lobby loses lives.",
      HI: "PMGC level pe PUBG Mobile distinct regional cultures ka ek genuine clash hai. Mongolian teams extreme early aggression play karti hain: IGL DOK ki positioning kabhi kabhi information ke liye survival sacrifice karti hai. Chinese teams methodical zone controllers hoti hain. Korean teams coach-driven strategies ke sath deep tactical PUBG play karti hain. Southeast Asian teams fast aur highly adaptive hoti hain. Aapke IGL ko diagnose karna hota hai ki given lobby mein kaunsa style dominate kar raha hai aur accordingly adjust karna hota hai. Passive lobby mein passive khelna information lose karwata hai, aggressive lobby mein aggressive khelna lives lose karwata hai."
    },
    keyConcepts: "Regional scouting, Aggression calibration, Style countering, Lobby reading",
    exampleTitle: "Counter-Aggressive Response",
    example: {
      EN: "Lobby read: all remaining teams are driving aggressively, hunting kills. IGL decision: stop all vehicle movement, go completely silent, fortify inside a heavily looted compound with multiple interior angles set up. Let the aggressive teams eliminate each other. Enter the end circle with full health and full utility against depleted, low-health enemies.",
      HI: "Lobby read: saari remaining teams aggressively drive kar rahi hain, kills hunt karte hue. IGL decision: saari vehicle movement stop kardo, completely silent ho jao, ek heavily looted compound ke andar multiple interior angles set up karke fortify karo. Aggressive teams ko ek doosre ko eliminate karne do. End circle mein full health aur full utility ke sath depleted, low-health enemies ke against enter karo."
    },
    proTipTitle: "Cross-Platform Learning",
    proTip: {
      EN: "In 2025, elite PUBG Mobile organizations have begun sharing strategic frameworks with their PUBG PC sister teams — particularly zone control systems and late-game utility timing. The tactical vocabulary of PC PUBG is now actively influencing how top mobile squads structure their endgame play.",
      HI: "2025 mein, elite PUBG Mobile organizations apne PUBG PC sister teams ke sath strategic frameworks share kar rahi hain: particularly zone control systems aur late-game utility timing. PC PUBG ki tactical vocabulary ab top mobile squads ke endgame structure ko actively influence kar rahi hai."
    }
  },
  {
    id: "ch12",
    title: "CHAPTER 12: MENTAL STAMINA — TOURNAMENT PSYCHOLOGY",
    description: {
      EN: "A PMGC Grand Finals day involves 6 or more consecutive matches played under broadcast conditions, with financial stakes, organizational pressure, and a live audience watching every decision. Mental fatigue creates mechanical mistakes — aim loosens, callouts slow, positioning becomes reactive instead of proactive. Top esports organizations now employ dedicated sports psychologists. The core skills are: anxiety regulation (breathing protocols before each match), tilt prevention (the \"flush it\" protocol — consciously releasing the previous match's result before queuing the next one), concentration maintenance across 6+ hours, and confidence anchoring under pressure. As of 2025, esports is formally recognized as one of the most mentally demanding competitive disciplines in the world.",
      HI: "PMGC Grand Finals day mein 6 ya zyada consecutive matches live broadcast conditions mein khele jate hain, jisme financial stakes, organizational pressure aur live audience hoti hai. Mental fatigue mechanical mistakes create karti hai: aim loose ho jata hai, callouts slow ho jate hain, positioning proactive ki jagah reactive ban jati hai. Aajkal top esports organizations dedicated sports psychologists employ karti hain. Core skills: anxiety regulation (har match se pehle breathing protocols), tilt prevention (\"flush it\" protocol jisme previous match ka result consciously release kiya jata hai), 6+ hours tak concentration maintain karna. 2025 mein esports formally most mentally demanding competitive disciplines mein recognize hota hai."
    },
    keyConcepts: "Tilt management, Anxiety regulation, Confidence anchoring, Long-day focus",
    exampleTitle: "The Flush-It Protocol",
    example: {
      EN: "Team gets wiped in 16th place. Old way: three players go quiet, one player vents, the next match is played in emotional debt. New way: IGL calls \"flush it\" immediately after the results screen. 30-second breathing break, no discussion of what went wrong until the post-day review session. Next match starts with confidence framing: \"We know what to do. One match at a time.\"",
      HI: "Team 16th place pe wipe hui. Old way: three players quiet ho jate hain, ek player vent karta hai, next match emotional debt ke sath play kiya jata hai. New way: Results screen ke immediately baad IGL \"flush it\" call deta hai. 30-second breathing break hoti hai, post-day review tak koi discussion nahi hoti ki kya wrong hua. Next match confidence framing ke sath start hota hai: \"Humein pata hai kya karna hai. One match at a time.\""
    },
    proTipTitle: "Esports Psychology Mainstream",
    proTip: {
      EN: "As of late 2025, esports organizations and sports psychology researchers finalized nine evidence-based pillars of mental health support for professional players. Coaches now integrate formal mental conditioning alongside tactical preparation — teams that skip this layer are operating at a measurable competitive disadvantage at the international level.",
      HI: "Late 2025 tak, esports organizations aur sports psychology researchers ne professional players ke liye mental health support ke nine evidence-based pillars finalize kiye hain. Coaches ab tactical preparation ke alongside formal mental conditioning integrate karte hain. Jo teams is layer ko skip karti hain wo international level pe measurable competitive disadvantage pe operate kar rahi hain."
    }
  }
];
