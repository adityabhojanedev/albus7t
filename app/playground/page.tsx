"use client";

import { useEffect } from "react";
import Toolbar from "./components/Toolbar";
import CanvasContainer from "./components/CanvasContainer";
import SidebarDrawer from "./components/SidebarDrawer";
import HotkeyEditorModal from "./components/HotkeyEditorModal";
import ContextualHelp from "./components/ContextualHelp";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useHotkeyStore } from "./store/useHotkeyStore";

export default function PlaygroundPage() {
  const loadBindings = useHotkeyStore((s) => s.loadBindings);

  useEffect(() => {
    loadBindings();
  }, [loadBindings]);

  // Global keyboard shortcut listener
  useKeyboardShortcuts();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0705]">
      <Toolbar />
      <SidebarDrawer />
      <CanvasContainer />
      <HotkeyEditorModal />
      <ContextualHelp />
    </div>
  );
}
