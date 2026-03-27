"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const TacticsCanvas = dynamic(() => import("./TacticsCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0F0A06]">
      <div className="flex flex-col items-center text-[#C47C2B] gap-4">
        <Loader2 size={40} className="animate-spin" />
        <span className="font-bebas text-2xl tracking-widest">Loading Board Engine...</span>
      </div>
    </div>
  ),
});

export default function CanvasContainer() {
  return <TacticsCanvas />;
}
