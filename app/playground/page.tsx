"use client";

import Toolbar from "./components/Toolbar";
import CanvasContainer from "./components/CanvasContainer";
import SidebarDrawer from "./components/SidebarDrawer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PlaygroundPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const authFlag = sessionStorage.getItem("albus_authenticated");
    if (authFlag === "true") {
      setIsAuthorized(true);
    } else {
      router.replace("/");
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="w-screen h-screen bg-[#0A0705] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C47C2B] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0705]">
      {/* Central toolbar */}
      <Toolbar />

      {/* Top-right sidebar trigger + drawer */}
      <SidebarDrawer />

      {/* Konva canvas workspace */}
      <CanvasContainer />
    </div>
  );
}
