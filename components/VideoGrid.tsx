"use client";

import { motion } from "framer-motion";
import type { YouTubeVideo } from "@/lib/youtube";

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

// ─── single card ──────────────────────────────────────────────────────────────

function VideoCard({ video, index }: { video: YouTubeVideo; index: number }) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <motion.a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.65,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.1 + index * 0.08,
      }}
      className="group relative flex flex-col overflow-hidden rounded-[6px] border border-white/5 bg-[#110B0780] backdrop-blur-lg transition-all duration-300 hover:border-[#C47C2B] hover:shadow-[0_0_28px_rgba(196,124,43,0.2)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C47C2B]"
      aria-label={`Watch "${video.title}" on YouTube`}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#0F0A06] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0705CC] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

        {/* play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center justify-center w-[52px] h-[52px] bg-[#C47C2B] rounded-full shadow-[0_0_24px_rgba(196,124,43,0.6)] scale-90 group-hover:scale-100 transition-transform duration-300">
            <span className="text-[#0A0705] text-xl ml-[3px]">▶</span>
          </div>
        </div>

        {/* channel label */}
        {video.channelTitle && (
          <span className="absolute top-3 left-3 font-sora text-[9px] tracking-[0.18em] text-[#C47C2B] uppercase font-semibold bg-[#0A0705CC] backdrop-blur-sm px-[8px] py-[4px] rounded-[3px] leading-none">
            {video.channelTitle}
          </span>
        )}
      </div>

      {/* Text info */}
      <div className="flex flex-col p-4 gap-2 flex-1">
        <h3 className="font-sora text-sm font-semibold text-[#F5ECD7] leading-snug line-clamp-2 group-hover:text-[#E8A44A] transition-colors duration-300">
          {video.title}
        </h3>

        <p className="font-inter text-xs text-[#7A6A55] leading-relaxed line-clamp-2 flex-1">
          {video.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <span className="font-sora text-[10px] text-[#7A6A55]">
            {formatDate(video.publishedAt)}
          </span>
          <span className="font-sora text-[10px] text-[#C47C2B] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
            Watch <span className="font-inter font-bold">→</span>
          </span>
        </div>
      </div>
    </motion.a>
  );
}

// ─── skeleton card (loading state) ────────────────────────────────────────────

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex flex-col overflow-hidden rounded-[6px] border border-white/5 bg-[#110B0780]"
    >
      <div className="w-full aspect-video bg-[#1A0F08] animate-pulse" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-[#2A1F15] rounded animate-pulse w-full" />
        <div className="h-3 bg-[#2A1F15] rounded animate-pulse w-4/5" />
        <div className="h-2 bg-[#1A0F08] rounded animate-pulse w-1/2 mt-2" />
      </div>
    </motion.div>
  );
}

// ─── main grid export ─────────────────────────────────────────────────────────

interface VideoGridProps {
  videos: YouTubeVideo[];
  isLoading?: boolean;
  error?: string | null;
  skeletonCount?: number;
}

export default function VideoGrid({
  videos,
  isLoading = false,
  error = null,
  skeletonCount = 6,
}: VideoGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 gap-4">
        <span className="text-4xl select-none">⚠️</span>
        <p className="font-sora text-sm text-[#7A6A55] text-center max-w-[380px]">
          {error}
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 gap-4">
        <span className="text-4xl select-none">🎬</span>
        <p className="font-sora text-sm text-[#7A6A55] text-center">
          No videos found. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
      {videos.map((video, i) => (
        <VideoCard key={video.id || i} video={video} index={i} />
      ))}
    </div>
  );
}
