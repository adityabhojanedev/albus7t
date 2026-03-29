"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useHotkeyStore, formatKeyDisplay, eventToKeyString, HotkeyBinding } from '../store/useHotkeyStore';
import {
  X, RotateCcw, Keyboard, Pointer, Hand, Pen, Eraser, Zap,
  Circle, Square, Route, Lock, Undo2, Redo2, Trash2, ZoomIn, ZoomOut, XCircle,
  AlertTriangle
} from 'lucide-react';

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  tool_select: Pointer,
  tool_pan: Hand,
  tool_pen: Pen,
  tool_eraser: Eraser,
  tool_laser: Zap,
  tool_circle: Circle,
  tool_rectangle: Square,
  tool_path: Route,
  tool_lock: Lock,
  action_undo: Undo2,
  action_redo: Redo2,
  action_delete: Trash2,
  action_deselect: XCircle,
  action_zoom_in: ZoomIn,
  action_zoom_out: ZoomOut,
};

// ─── Visual Keyboard Layout ──────────────────────────────────────────────────
const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift_R'],
  ['Ctrl', 'Alt', 'Space', 'Alt_R', 'Ctrl_R'],
];

const WIDE_KEYS: Record<string, number> = {
  'Backspace': 2,
  'Tab': 1.5,
  '\\': 1.5,
  'CapsLock': 1.8,
  'Enter': 2.2,
  'Shift': 2.4,
  'Shift_R': 2.6,
  'Ctrl': 1.4,
  'Alt': 1.4,
  'Space': 6,
  'Alt_R': 1.4,
  'Ctrl_R': 1.4,
};

function getKeyEventString(key: string): string {
  const map: Record<string, string> = {
    'Backspace': 'backspace',
    'Tab': 'tab',
    'CapsLock': 'capslock',
    'Enter': 'enter',
    'Shift': 'shift',
    'Shift_R': 'shift',
    'Ctrl': 'ctrl',
    'Ctrl_R': 'ctrl',
    'Alt': 'alt',
    'Alt_R': 'alt',
    'Space': ' ',
    '\\': '\\',
    "'": "'",
    ';': ';',
    ',': ',',
    '.': '.',
    '/': '/',
    '[': '[',
    ']': ']',
    '`': '`',
  };
  return map[key] || key.toLowerCase();
}

function getKeyLabel(key: string): string {
  const map: Record<string, string> = {
    'Backspace': '⌫',
    'Tab': 'Tab',
    'CapsLock': 'Caps',
    'Enter': '↵',
    'Shift': '⇧',
    'Shift_R': '⇧',
    'Ctrl': 'Ctrl',
    'Ctrl_R': 'Ctrl',
    'Alt': 'Alt',
    'Alt_R': 'Alt',
    'Space': '',
  };
  return map[key] ?? key.toUpperCase();
}

const MODIFIER_KEYS = ['Shift', 'Shift_R', 'Ctrl', 'Ctrl_R', 'Alt', 'Alt_R', 'CapsLock'];

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function HotkeyEditorModal() {
  const {
    bindings,
    isEditorOpen,
    listeningBindingId,
    setEditorOpen,
    setListeningBindingId,
    updateBinding,
    resetBinding,
    resetAllBindings,
  } = useHotkeyStore();

  const [conflictMsg, setConflictMsg] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);

  // Build a map: key string → binding label (for visual keyboard highlights)
  const keyToBinding = React.useMemo(() => {
    const map = new Map<string, HotkeyBinding>();
    for (const b of bindings) {
      // Only show simple (non-modifier) keys on the visual keyboard
      if (!b.currentKey.includes('+')) {
        map.set(b.currentKey, b);
      }
    }
    return map;
  }, [bindings]);

  // Listen for key presses when in "listening" mode
  const handleKeyCapture = useCallback((e: KeyboardEvent) => {
    if (!listeningBindingId) return;
    e.preventDefault();
    e.stopPropagation();

    const keyStr = eventToKeyString(e);
    if (!keyStr) return; // was a modifier-only press

    // Block dangerous browser shortcuts
    const dangerous = ['ctrl+w', 'ctrl+t', 'ctrl+n', 'ctrl+shift+i', 'ctrl+l', 'ctrl+d', 'f5', 'f11', 'f12'];
    if (dangerous.includes(keyStr)) {
      setConflictMsg('That key is reserved by the browser.');
      return;
    }

    const result = updateBinding(listeningBindingId, keyStr);
    if (!result.success) {
      setConflictMsg(`"${formatKeyDisplay(keyStr)}" is already bound to ${result.conflict}`);
      setTimeout(() => setConflictMsg(null), 3000);
    } else {
      setConflictMsg(null);
      setFlashId(listeningBindingId);
      setTimeout(() => setFlashId(null), 600);
    }
  }, [listeningBindingId, updateBinding, setListeningBindingId]);

  useEffect(() => {
    if (!isEditorOpen || !listeningBindingId) return;
    window.addEventListener('keydown', handleKeyCapture, true);
    return () => window.removeEventListener('keydown', handleKeyCapture, true);
  }, [isEditorOpen, listeningBindingId, handleKeyCapture]);

  // Click a key on the visual keyboard
  const handleVisualKeyClick = (keyStr: string) => {
    if (!listeningBindingId) return;
    if (['shift', 'ctrl', 'alt', 'capslock'].includes(keyStr)) return;

    const result = updateBinding(listeningBindingId, keyStr);
    if (!result.success) {
      setConflictMsg(`"${formatKeyDisplay(keyStr)}" is already bound to ${result.conflict}`);
      setTimeout(() => setConflictMsg(null), 3000);
    } else {
      setConflictMsg(null);
      setFlashId(listeningBindingId);
      setTimeout(() => setFlashId(null), 600);
    }
  };

  if (!isEditorOpen) return null;

  const toolBindings = bindings.filter(b => b.category === 'tool');
  const actionBindings = bindings.filter(b => b.category === 'action');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={() => setEditorOpen(false)}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-[90vw] max-w-[860px] max-h-[90vh] bg-[#0A0705] border border-[#2A1F15] rounded-2xl shadow-[0_0_80px_rgba(196,124,43,0.15)] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A1F15]">
          <div className="flex items-center gap-3">
            <div className="bg-[#C47C2B]/20 p-2 rounded-xl">
              <Keyboard size={18} className="text-[#C47C2B]" />
            </div>
            <div>
              <h2 className="text-[#F5ECD7] font-sora font-bold text-lg">Keyboard Shortcuts</h2>
              <p className="text-[#7A6A55] text-xs mt-0.5">Click any binding and press a key to customize</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetAllBindings}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#7A6A55] hover:text-[#C47C2B] hover:bg-[#C47C2B]/10 border border-[#2A1F15] rounded-lg transition-all"
            >
              <RotateCcw size={12} /> Reset All
            </button>
            <button
              onClick={() => setEditorOpen(false)}
              className="p-2 text-[#7A6A55] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Conflict toast */}
        {conflictMsg && (
          <div className="mx-6 mt-3 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-lg text-xs animate-pulse">
            <AlertTriangle size={14} className="flex-shrink-0" />
            {conflictMsg}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {/* Binding lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Tools */}
            <div>
              <h3 className="text-[#7A6A55] text-[10px] uppercase tracking-[0.2em] font-semibold mb-2 px-1">Tools</h3>
              <div className="bg-[#0F0A06] border border-[#2A1F15] rounded-xl overflow-hidden divide-y divide-[#1A130D]">
                {toolBindings.map(b => (
                  <BindingRow
                    key={b.id}
                    binding={b}
                    isListening={listeningBindingId === b.id}
                    isFlash={flashId === b.id}
                    onStartListening={() => { setListeningBindingId(b.id); setConflictMsg(null); }}
                    onReset={() => resetBinding(b.id)}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-[#7A6A55] text-[10px] uppercase tracking-[0.2em] font-semibold mb-2 px-1">Actions</h3>
              <div className="bg-[#0F0A06] border border-[#2A1F15] rounded-xl overflow-hidden divide-y divide-[#1A130D]">
                {actionBindings.map(b => (
                  <BindingRow
                    key={b.id}
                    binding={b}
                    isListening={listeningBindingId === b.id}
                    isFlash={flashId === b.id}
                    onStartListening={() => { setListeningBindingId(b.id); setConflictMsg(null); }}
                    onReset={() => resetBinding(b.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Visual Keyboard */}
          <div>
            <h3 className="text-[#7A6A55] text-[10px] uppercase tracking-[0.2em] font-semibold mb-3 px-1 flex items-center gap-2">
              <Keyboard size={12} />
              Interactive Keyboard
              {listeningBindingId && (
                <span className="text-[#C47C2B] normal-case tracking-normal font-normal animate-pulse">
                  — Click a key or press it on your keyboard
                </span>
              )}
            </h3>
            <div className="bg-[#0F0A06] border border-[#2A1F15] rounded-xl p-3 md:p-4">
              {KEYBOARD_ROWS.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1 mb-1 last:mb-0 justify-center">
                  {row.map((key, keyIdx) => {
                    const keyStr = getKeyEventString(key);
                    const isMod = MODIFIER_KEYS.includes(key);
                    const boundBinding = keyToBinding.get(keyStr);
                    const isBound = !!boundBinding;
                    const widthMultiplier = WIDE_KEYS[key] || 1;
                    const isListeningTarget = listeningBindingId !== null;

                    return (
                      <button
                        key={`${rowIdx}-${keyIdx}`}
                        onClick={() => handleVisualKeyClick(keyStr)}
                        disabled={!isListeningTarget || isMod}
                        title={isBound ? `${boundBinding.label}` : key}
                        className={`
                          relative flex flex-col items-center justify-center
                          rounded-lg border text-xs font-mono
                          transition-all duration-200
                          h-10 md:h-11
                          ${isMod
                            ? 'bg-[#1A0F08] border-[#2A1F15] text-[#3A2F25] cursor-default'
                            : isBound
                              ? 'bg-[#C47C2B]/15 border-[#C47C2B]/40 text-[#C47C2B] hover:bg-[#C47C2B]/25 hover:border-[#C47C2B]/60 shadow-[0_0_10px_rgba(196,124,43,0.1)]'
                              : isListeningTarget
                                ? 'bg-[#1A0F08] border-[#2A1F15] text-[#7A6A55] hover:bg-[#2A1F15] hover:border-[#C47C2B]/30 hover:text-[#F5ECD7] cursor-pointer'
                                : 'bg-[#1A0F08] border-[#2A1F15] text-[#3A2F25]'
                          }
                        `}
                        style={{ width: `${widthMultiplier * 2.8}rem` }}
                      >
                        <span className="text-[10px] leading-none">{getKeyLabel(key)}</span>
                        {isBound && (
                          <span className="text-[7px] mt-0.5 leading-none opacity-70 truncate max-w-full px-0.5">
                            {boundBinding.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="flex-shrink-0 border-t border-[#2A1F15] px-6 py-2.5 flex items-center justify-between">
          <p className="text-[#3A2F25] text-[10px] font-inter tracking-wider">ALBUS TACTICAL BOARD · HOTKEY EDITOR</p>
          {listeningBindingId && (
            <button
              onClick={() => setListeningBindingId(null)}
              className="text-[#7A6A55] hover:text-[#F5ECD7] text-xs transition-colors"
            >
              Cancel rebind
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Binding Row Component ────────────────────────────────────────────────────
function BindingRow({
  binding,
  isListening,
  isFlash,
  onStartListening,
  onReset,
}: {
  binding: HotkeyBinding;
  isListening: boolean;
  isFlash: boolean;
  onStartListening: () => void;
  onReset: () => void;
}) {
  const Icon = ICON_MAP[binding.id] || Keyboard;
  const isModified = binding.currentKey !== binding.defaultKey;

  return (
    <div
      className={`
        flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-200
        ${isListening
          ? 'bg-[#C47C2B]/10 border-l-2 border-l-[#C47C2B]'
          : isFlash
            ? 'bg-green-500/10'
            : 'hover:bg-[#1A0F08]'
        }
      `}
      onClick={onStartListening}
    >
      <Icon size={15} className={isListening ? 'text-[#C47C2B]' : 'text-[#7A6A55]'} />
      <span className={`flex-1 text-sm font-sora ${isListening ? 'text-[#C47C2B]' : 'text-[#F5ECD7]'}`}>
        {binding.label}
      </span>
      <div className="flex items-center gap-1.5">
        {isModified && (
          <button
            onClick={(e) => { e.stopPropagation(); onReset(); }}
            title="Reset to default"
            className="p-1 text-[#7A6A55] hover:text-[#C47C2B] transition-colors"
          >
            <RotateCcw size={10} />
          </button>
        )}
        <div
          className={`
            px-2 py-1 rounded-md text-xs font-mono min-w-[2.5rem] text-center transition-all
            ${isListening
              ? 'bg-[#C47C2B] text-[#0A0705] animate-pulse shadow-[0_0_15px_rgba(196,124,43,0.5)]'
              : isFlash
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : isModified
                  ? 'bg-[#C47C2B]/15 text-[#C47C2B] border border-[#C47C2B]/30'
                  : 'bg-[#1A0F08] text-[#7A6A55] border border-[#2A1F15]'
            }
          `}
        >
          {isListening ? '...' : formatKeyDisplay(binding.currentKey)}
        </div>
      </div>
    </div>
  );
}
