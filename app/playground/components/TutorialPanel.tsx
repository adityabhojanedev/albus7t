"use client";

import { useState, useEffect } from 'react';
import { useHotkeyStore, formatKeyDisplay } from '../store/useHotkeyStore';
import {
  HelpCircle, ChevronDown, ChevronUp, Pointer, Hand, Pen, Eraser,
  Zap, Circle, Square, Route, Lock, MousePointerClick, Swords, HeartPulse,
} from 'lucide-react';

const STORAGE_KEY = 'albus_tutorial_collapsed';

interface ShortcutItem {
  icon: React.ElementType;
  label: string;
  key: string;   // display text for the shortcut
  color?: string;
}

export default function TutorialPanel() {
  const { bindings } = useHotkeyStore();
  const [collapsed, setCollapsed] = useState(true);

  // Restore collapsed state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setCollapsed(stored === 'true');
    } catch { /* ignore */ }
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* ignore */ }
  };

  // Get current keybinding for a tool
  const keyFor = (toolId: string) => {
    const b = bindings.find(b => b.toolId === toolId);
    return b ? formatKeyDisplay(b.currentKey) : '';
  };

  const navigation: ShortcutItem[] = [
    { icon: Pointer, label: 'Select', key: keyFor('select') },
    { icon: Hand, label: 'Pan / Move Map', key: keyFor('pan') },
    { icon: MousePointerClick, label: 'Zoom', key: 'Scroll' },
  ];

  const drawing: ShortcutItem[] = [
    { icon: Pen, label: 'Pen', key: keyFor('pen') },
    { icon: Eraser, label: 'Eraser', key: keyFor('eraser') },
    { icon: Zap, label: 'Laser', key: keyFor('laser') },
    { icon: Circle, label: 'Circle', key: keyFor('circle') },
    { icon: Square, label: 'Rectangle', key: keyFor('rectangle') },
  ];

  const tactical: ShortcutItem[] = [
    { icon: Route, label: 'Path Route', key: keyFor('path') },
    { icon: Swords, label: 'Fight Tool', key: '' },
    { icon: HeartPulse, label: 'Revive Tool', key: '' },
    { icon: Lock, label: 'Lock Mode', key: keyFor('lock') },
  ];

  const contextActions = [
    { label: 'Fight Tool', desc: 'Click Attacker → Victim → Choose outcome → Play', color: '#FF3B30' },
    { label: 'Revive Tool', desc: 'Click alive medic → knocked teammate → Play', color: '#34C759' },
    { label: 'Right-click Player', desc: 'Status Menu (Knock / Revive / Recall)', color: '#C47C2B' },
    { label: 'Ctrl+Z / Ctrl+⇧+Z', desc: 'Undo / Redo', color: '#7A6A55' },
    { label: 'Delete', desc: 'Remove selected element', color: '#FF3B30' },
  ];

  const renderSection = (title: string, items: ShortcutItem[]) => (
    <div className="mb-3">
      <p className="text-[#7A6A55] text-[9px] uppercase tracking-[0.15em] font-inter font-bold mb-1.5 px-1">{title}</p>
      <div className="flex flex-col gap-0.5">
        {items.map(item => (
          <div
            key={item.label}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#2A1F15]/50 transition-colors group"
          >
            <item.icon size={12} className="text-[#7A6A55] group-hover:text-[#C47C2B] transition-colors flex-shrink-0" />
            <span className="text-[#F5ECD7] text-[11px] font-inter flex-1 truncate">{item.label}</span>
            {item.key && (
              <kbd className="bg-[#1A0F08] border border-[#2A1F15] text-[#C47C2B] text-[9px] font-mono px-1.5 py-0.5 rounded flex-shrink-0">
                {item.key}
              </kbd>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="absolute bottom-4 left-4 z-40">
      {collapsed ? (
        /* Collapsed pill */
        <button
          onClick={toggle}
          className="flex items-center gap-1.5 bg-[#0A0705CC] backdrop-blur-md border border-[#2A1F15] hover:border-[#C47C2B]/40 rounded-full px-3 py-2 shadow-2xl transition-all hover:scale-105 group"
        >
          <HelpCircle size={14} className="text-[#C47C2B]" />
          <span className="text-[#F5ECD7] text-[11px] font-sora font-semibold">Shortcuts</span>
          <ChevronUp size={12} className="text-[#7A6A55] group-hover:text-[#C47C2B] transition-colors" />
        </button>
      ) : (
        /* Expanded panel */
        <div className="bg-[#0A0705E6] backdrop-blur-xl border border-[#2A1F15] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] w-[220px] overflow-hidden transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A1F15]">
            <div className="flex items-center gap-1.5">
              <HelpCircle size={13} className="text-[#C47C2B]" />
              <span className="text-[#F5ECD7] text-xs font-sora font-bold">Shortcuts</span>
            </div>
            <button
              onClick={toggle}
              className="p-1 text-[#7A6A55] hover:text-[#C47C2B] rounded hover:bg-[#2A1F15] transition-all"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="p-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
            {renderSection('Navigation', navigation)}
            {renderSection('Drawing', drawing)}
            {renderSection('Tactical', tactical)}

            {/* Context actions */}
            <div className="mb-1">
              <p className="text-[#7A6A55] text-[9px] uppercase tracking-[0.15em] font-inter font-bold mb-1.5 px-1">Actions</p>
              <div className="flex flex-col gap-0.5">
                {contextActions.map(item => (
                  <div key={item.label} className="px-2 py-1 rounded hover:bg-[#2A1F15]/50 transition-colors">
                    <span className="text-[11px] font-inter font-semibold" style={{ color: item.color }}>{item.label}</span>
                    <p className="text-[#7A6A55] text-[10px] font-inter leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 py-1.5 border-t border-[#2A1F15]">
            <p className="text-[#3A2F25] text-[9px] font-inter text-center tracking-wider">ALBUS TACTICAL BOARD · PHASE 5</p>
          </div>
        </div>
      )}
    </div>
  );
}
