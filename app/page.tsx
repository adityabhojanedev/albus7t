"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import HeroSection from "@/app/components/HeroSection";
import AboutSection from "@/app/components/AboutSection";
import CommunitySection from "@/app/components/CommunitySection";
import NewsletterSection from "@/app/components/NewsletterSection";
import VideosSection from "@/app/components/VideosSection";
import Footer from "@/app/components/Footer";
import YouTubeModal from "@/app/components/YouTubeModal";

export default function Home() {
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-[#0A0705]">
      <Navbar />
      <HeroSection onYouTubeClick={() => setIsYouTubeModalOpen(true)} />
      <VideosSection onYouTubeClick={() => setIsYouTubeModalOpen(true)} />
      <CommunitySection />
      <AboutSection />
      {/* <NewsletterSection /> */}
      <Footer />

      <YouTubeModal 
        isOpen={isYouTubeModalOpen} 
        onClose={() => setIsYouTubeModalOpen(false)} 
      />
    </main>
  );
}
