"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

const VIDEOS_DATA = [
  {
    id: 1,
    title: "TOP 3 INSANE Endzone Fights in PUGB/BGMI Esports | You Won't Believe These Clutches!",
    channel: "ALBUS DECODED",
    views: "Tournament",
    duration: "10:24",
    videoId: "18NICCJcD98",
    thumbnail: "https://img.youtube.com/vi/18NICCJcD98/maxresdefault.jpg",
  },
  {
    id: 2,
    title: "Perfect Team Work by APG - BGMI ESPORT",
    channel: "ALBUS DECODED",
    views: "Highlights",
    duration: "4:00",
    videoId: "-Au6yWMZ5h0",
    thumbnail: "https://img.youtube.com/vi/-Au6yWMZ5h0/maxresdefault.jpg",
  },
  {
    id: 3,
    title: "Arena Breakout India Server Test Ping, Graphics, Gameplay & Beta Access Full Guide 2026 🔥",
    channel: "ALBUS7T",
    views: "Guides",
    duration: "13:46",
    videoId: "kW_p7ubES0k",
    thumbnail: "https://img.youtube.com/vi/kW_p7ubES0k/maxresdefault.jpg",
  },
  {
    id: 4,
    title: "Pheonix is Perfect Agent Trust me #valorantmobile",
    channel: "ALBUS7T",
    views: "Shorts",
    duration: "2:15",
    videoId: "guse340rg3w",
    thumbnail: "https://img.youtube.com/vi/guse340rg3w/maxresdefault.jpg",
  },
];

export default function VideosSection({ onYouTubeClick }: { onYouTubeClick: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(VIDEOS_DATA[0].id);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Anti-Race condition locks
  const [isProcessing, setIsProcessing] = useState(false);

  // Raw DOM map referencing initialized YouTube APi instances
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRefs = useRef<{ [key: number]: any }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuredVideo = VIDEOS_DATA.find((v) => v.id === activeVideoId)!;
  const secondaryVideos = VIDEOS_DATA.filter((v) => v.id !== activeVideoId);

  // Securely swap videos by commanding the raw YouTube object to pause before hiding it
  const handleSidebarClick = (id: number) => {
    if (isProcessing) return;

    const oldPlayer = playerRefs.current[activeVideoId];
    if (oldPlayer && typeof oldPlayer.pauseVideo === "function") {
      oldPlayer.pauseVideo();
    }

    setActiveVideoId(id);
    setHasStarted(false);
    setIsPlaying(false);
  };

  const handleInitialPlay = () => {
    if (isProcessing) return;
    
    const player = playerRefs.current[activeVideoId];
    if (player && typeof player.playVideo === "function") {
      setHasStarted(true);
      setIsPlaying(true);
      player.playVideo();
      
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  // Safely toggle pause by referencing the synchronous YouTube state
  const handlePlayPause = () => {
    if (isProcessing || !hasStarted) return;
    
    const player = playerRefs.current[activeVideoId];
    if (!player) return;

    setIsProcessing(true);
    
    // 1 = playing, 2 = paused
    const state = player.getPlayerState();
    if (state === 1 || isPlaying) {
       player.pauseVideo();
       setIsPlaying(false);
    } else {
       player.playVideo();
       setIsPlaying(true);
    }
    
    setTimeout(() => setIsProcessing(false), 500);
  };

  // YouTube strictly formatted options
  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      fs: 0,
      disablekb: 1,
    },
  };

  return (
    <section id="videos" className="relative w-full py-32 bg-[#0A0705] flex flex-col items-center justify-center overflow-hidden z-0">
      
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-b from-[#1A0F08] to-transparent z-[5] pointer-events-none" />

      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-[#7C4A1E] blur-[120px] rounded-full z-[1] pointer-events-none mix-blend-screen"
        style={{ opacity: 0.20 }}
      />

      <div className="relative z-10 flex flex-col items-center text-center w-full px-6 max-w-[1240px] mx-auto">
        
        <div className="flex flex-col items-center mb-16 px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 }}
            className="font-sora text-xs tracking-[0.2em] text-[#7A6A55] uppercase mb-4 block"
          >
            Fresh Drops
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
            className="font-bebas text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] via-[#E8A44A] to-[#F5ECD7] mb-6 drop-shadow-[0_0_15px_rgba(196,124,43,0.3)]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.1 }}
          >
            Latest from Albus
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
            className="font-inter text-sm text-[#7A6A55] max-w-[500px] leading-loose"
          >
            Highlights. Breakdowns. Live chaos. All in one place.
          </motion.p>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-[24px]">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full md:w-[65%] aspect-video bg-[#1A0F08] border border-[#2A1F15] rounded-[6px] overflow-hidden group block shrink-0 z-20"
          >
            {/* 1. Initial State: Custom Cinematic Thumbnail Cover */}
            <div className={`absolute inset-0 w-full h-full z-30 transition-opacity duration-[400ms] ${hasStarted ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}>
              <button 
                onClick={handleInitialPlay} 
                className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none flex flex-col items-start bg-black text-left"
              >
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={featuredVideo.thumbnail} 
                    alt={featuredVideo.title} 
                    className="object-cover w-full h-full transition-transform duration-[400ms] ease-out group-hover:scale-[1.04]" 
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0705] via-[#0A070599] to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-[400ms] pointer-events-none" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] pointer-events-none z-20">
                  <div className="flex items-center justify-center w-[64px] h-[64px] bg-[#C47C2B] rounded-full shadow-[0_0_32px_rgba(196,124,43,0.5)] md:scale-90 group-hover:scale-100 transition-transform duration-[400ms]">
                    <span className="text-[#0A0705] text-2xl ml-1">▶</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col text-left z-30 transform md:translate-y-2 group-hover:translate-y-0 transition-transform duration-[400ms]">
                  <span className="font-sora text-xs tracking-widest text-[#C47C2B] uppercase mb-2 block font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {featuredVideo.channel}
                  </span>
                  <h3 className="font-bebas text-3xl md:text-4xl text-[#F5ECD7] leading-none mb-2 line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {featuredVideo.title}
                  </h3>
                  <span className="font-sora text-xs text-[#7A6A55] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {featuredVideo.views} · {featuredVideo.duration}
                  </span>
                </div>
              </button>
            </div>

            {/* 2. Playing State: Zero-UI Raw YouTube Instance */}
            <div className={`absolute inset-0 w-full h-full z-[40] transition-opacity duration-[400ms] bg-black ${hasStarted ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
              
              {/* INVISIBLE CUSTOM EVENT CATCHER */}
              <div 
                className="absolute inset-0 w-full h-full z-[60] cursor-pointer" 
                onClick={handlePlayPause}
              >
                {!isPlaying && hasStarted && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center w-[72px] h-[72px] bg-[#C47C2B] rounded-full shadow-[0_0_40px_rgba(196,124,43,0.6)]">
                       <span className="text-[#0A0705] text-2xl ml-1">▶</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ALL 4 YOUTUBE IFRAMES PRE-MOUNTED IN THE BACKGROUND */}
              <div className="absolute inset-0 w-full h-full pointer-events-none z-[50] overflow-hidden">
                {mounted && VIDEOS_DATA.map((video) => {
                  const isActive = activeVideoId === video.id;

                  return (
                    <div 
                      key={video.id} 
                      className={`absolute inset-0 w-full h-full transition-opacity duration-[400ms] ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                      {/* Scaling the wrapper slightly hides YouTube's internal 1px border leaks on strict aspects! */}
                      <div className="absolute inset-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)]">
                        <YouTube
                          videoId={video.videoId}
                          opts={opts}
                          onReady={(e) => {
                            playerRefs.current[video.id] = e.target;
                          }}
                          onEnd={() => {
                            if (isActive) {
                              setIsPlaying(false);
                              setHasStarted(false);
                            }
                          }}
                          className="w-full h-full"
                          iframeClassName="w-full h-full pointer-events-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Secondary Videos Array */}
          <div className="w-full md:w-[35%] flex flex-col justify-between h-full pt-4 md:pt-0 z-20">
            {secondaryVideos.map((video, idx) => (
              <div key={video.id} className="flex flex-col w-full h-full">
                <motion.button
                  onClick={() => handleSidebarClick(video.id)}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.45 + idx * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                  className="group relative w-full flex flex-row items-center cursor-pointer focus:outline-none border-l-[2px] border-transparent hover:border-[#C47C2B] hover:shadow-[-8px_0_12px_-8px_rgba(196,124,43,0.4)] transition-all duration-300 pl-4 md:pl-6 py-2 md:py-4 flex-1 text-left"
                >
                  <div className="relative w-[120px] h-[68px] bg-[#1A0F08] border border-[#2A1F15] rounded-[4px] shrink-0 overflow-hidden shadow-lg">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="object-cover w-full h-full transition-transform duration-[300ms] group-hover:scale-[1.06]" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="text-[#C47C2B] text-[20px] ml-1">▶</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col text-left ml-4 justify-center">
                    <span className="font-sora text-[9px] tracking-[0.2em] text-[#C47C2B] uppercase mb-1 font-semibold block leading-none">
                      {video.channel}
                    </span>
                    <h4 className="font-sora text-sm text-[#F5ECD7] leading-snug line-clamp-2 mb-1 group-hover:text-[#E8A44A] transition-colors duration-300">
                      {video.title}
                    </h4>
                    <span className="font-sora text-[9px] text-[#7A6A55] block leading-none mt-1">
                      {video.views} · {video.duration}
                    </span>
                  </div>
                </motion.button>
                
                {idx < secondaryVideos.length - 1 && (
                  <div className="w-full pl-[144px] md:pl-[160px] pb-2 md:pb-0">
                    <div className="w-full h-[1px] bg-[#2A1F15] opacity-50" />
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 1.0 }}
          className="flex justify-center w-full mt-16 z-20"
        >
          <button
            onClick={onYouTubeClick}
            className="inline-flex items-center justify-center font-sora font-semibold text-[#C47C2B] bg-transparent border border-[#7C4A1E] hover:border-[#E8A44A] hover:text-[#E8A44A] hover:bg-[#7C4A1E18] transition-all duration-300 rounded-[4px] px-[36px] py-[14px]"
          >
            See Everything on YouTube <span className="ml-2 font-inter font-bold">→</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}

