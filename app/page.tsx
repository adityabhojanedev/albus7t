"use client";

import Navbar from "@/app/components/Navbar";
import HeroSection from "@/app/components/HeroSection";
import AboutSection from "@/app/components/AboutSection";
import CommunitySection from "@/app/components/CommunitySection";
import PlaygroundTeaser from "@/app/components/PlaygroundTeaser";
import LatestVideosSection from "@/app/components/LatestVideosSection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#0A0705]">
      <Navbar />
      <HeroSection />
      <LatestVideosSection />
      <PlaygroundTeaser />
      <CommunitySection />
      <AboutSection />
      <Footer />
    </main>
  );
}
