"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VideoGrid from "@/components/VideoGrid";
import type { YouTubeVideo } from "@/lib/youtube";

const MAX_RESULTS = 9;

export default function LatestVideosSection() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/youtube-videos?maxResults=${MAX_RESULTS}`);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data: { videos?: YouTubeVideo[]; error?: string } = await res.json();

        if (data.error) throw new Error(data.error);

        if (!cancelled) {
          setVideos(data.videos ?? []);
        }
      } catch (err) {
        console.error("[LatestVideosSection] fetch error:", err);
        if (!cancelled) {
          setError(
            "Couldn't load the latest videos right now — quota may be exceeded or the API key is invalid. Please try again later."
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="latest-videos"
      className="relative w-full py-24 bg-[#0A0705] flex flex-col items-center justify-center overflow-hidden z-0"
    >
      {/* Top edge divider */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2A1F15] to-transparent z-[5] pointer-events-none" />

      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-120px] left-[-100px] w-[500px] h-[500px] bg-[#7C4A1E] blur-[130px] rounded-full z-[1] pointer-events-none mix-blend-screen"
        style={{ opacity: 0.14 }}
      />

      <div className="relative z-10 flex flex-col items-center w-full px-6 max-w-[1240px] mx-auto">

        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-14 px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 }}
            className="font-sora text-xs tracking-[0.2em] text-[#7A6A55] uppercase mb-4 block"
          >
            All Channels
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
            className="font-bebas text-transparent bg-clip-text bg-gradient-to-r from-[#C47C2B] via-[#E8A44A] to-[#F5ECD7] mb-4 drop-shadow-[0_0_15px_rgba(196,124,43,0.3)]"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)", lineHeight: 1.1 }}
          >
            Latest Videos
          </motion.h2>

          {/* Accent line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 48, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
            className="h-[2px] bg-[#C47C2B] mx-auto mb-5 shadow-[0_0_8px_rgba(196,124,43,0.5)]"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.35 }}
            className="font-inter text-sm text-[#7A6A55] max-w-[460px] leading-loose"
          >
            Fresh drops from every corner of the Albus Universe — pulled live from all channels.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.45 }}
          className="w-full"
        >
          <VideoGrid
            videos={videos}
            isLoading={isLoading}
            error={error}
            skeletonCount={MAX_RESULTS}
          />
        </motion.div>

        {/* CTA */}
        {!isLoading && !error && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 w-full mt-14"
          >
            <a
              href="https://www.youtube.com/@Albus7T"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-sora font-semibold text-[#C47C2B] bg-transparent border border-[#7C4A1E] hover:border-[#E8A44A] hover:text-[#E8A44A] hover:bg-[#7C4A1E18] transition-all duration-300 rounded-[4px] px-[36px] py-[14px] text-sm"
            >
              ALBUS7T <span className="ml-2 font-inter font-bold">→</span>
            </a>
            <a
              href="https://www.youtube.com/@AlbusDecoded"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-sora font-semibold text-[#C47C2B] bg-transparent border border-[#7C4A1E] hover:border-[#E8A44A] hover:text-[#E8A44A] hover:bg-[#7C4A1E18] transition-all duration-300 rounded-[4px] px-[36px] py-[14px] text-sm"
            >
              ALBUS DECODED <span className="ml-2 font-inter font-bold">→</span>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
