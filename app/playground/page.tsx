"use client";

import Toolbar from "./components/Toolbar";
import CanvasContainer from "./components/CanvasContainer";
import SidebarDrawer from "./components/SidebarDrawer";
import HotkeyEditorModal from "./components/HotkeyEditorModal";
import TutorialPanel from "./components/TutorialPanel";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useHotkeyStore } from "./store/useHotkeyStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PlaygroundPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const loadBindings = useHotkeyStore(s => s.loadBindings);

  useEffect(() => {
    const authFlag = sessionStorage.getItem("albus_authenticated");
    if (authFlag === "true") {
      setIsAuthorized(true);
    } else {
      router.replace("/");
    }
  }, [router]);

  // Load saved hotkey bindings on mount
  useEffect(() => { loadBindings(); }, [loadBindings]);

  // Global keyboard shortcut listener
  useKeyboardShortcuts();

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

      {/* Hotkey editor modal */}
      <HotkeyEditorModal />

      {/* Shortcuts tutorial panel */}
      <TutorialPanel />
    </div>
  );
}
