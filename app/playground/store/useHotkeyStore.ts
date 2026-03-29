import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────
export type HotkeyCategory = 'tool' | 'action';

export interface HotkeyBinding {
  id: string;
  label: string;
  category: HotkeyCategory;
  defaultKey: string;     // e.g. 'v', 'ctrl+z'
  currentKey: string;     // user-customized
  toolId?: string;        // maps to Tool type from useBoardStore ('select', 'pen', etc.)
  actionId?: string;      // maps to action ('undo', 'redo', 'delete', etc.)
}

const STORAGE_KEY = 'albus_hotkeys';

// ─── Default Bindings ─────────────────────────────────────────────────────────
const DEFAULT_BINDINGS: HotkeyBinding[] = [
  // Tools
  { id: 'tool_select',    label: 'Select',     category: 'tool', defaultKey: 'v', currentKey: 'v', toolId: 'select' },
  { id: 'tool_pan',       label: 'Hand / Pan', category: 'tool', defaultKey: 'h', currentKey: 'h', toolId: 'pan' },
  { id: 'tool_pen',       label: 'Pen',        category: 'tool', defaultKey: 'p', currentKey: 'p', toolId: 'pen' },
  { id: 'tool_eraser',    label: 'Eraser',     category: 'tool', defaultKey: 'e', currentKey: 'e', toolId: 'eraser' },
  { id: 'tool_laser',     label: 'Laser',      category: 'tool', defaultKey: 'l', currentKey: 'l', toolId: 'laser' },
  { id: 'tool_circle',    label: 'Circle',     category: 'tool', defaultKey: 'c', currentKey: 'c', toolId: 'circle' },
  { id: 'tool_rectangle', label: 'Rectangle',  category: 'tool', defaultKey: 'r', currentKey: 'r', toolId: 'rectangle' },
  { id: 'tool_path',      label: 'Path Route', category: 'tool', defaultKey: 't', currentKey: 't', toolId: 'path' },
  { id: 'tool_lock',      label: 'Lock Mode',  category: 'tool', defaultKey: 'k', currentKey: 'k', toolId: 'lock' },

  // Actions (modifier combos)
  { id: 'action_undo',     label: 'Undo',           category: 'action', defaultKey: 'ctrl+z',       currentKey: 'ctrl+z',       actionId: 'undo' },
  { id: 'action_redo',     label: 'Redo',           category: 'action', defaultKey: 'ctrl+shift+z', currentKey: 'ctrl+shift+z', actionId: 'redo' },
  { id: 'action_delete',   label: 'Delete',         category: 'action', defaultKey: 'delete',       currentKey: 'delete',       actionId: 'delete' },
  { id: 'action_deselect', label: 'Deselect All',   category: 'action', defaultKey: 'escape',       currentKey: 'escape',       actionId: 'deselect' },
  { id: 'action_zoom_in',  label: 'Zoom In',        category: 'action', defaultKey: '=',            currentKey: '=',            actionId: 'zoom_in' },
  { id: 'action_zoom_out', label: 'Zoom Out',       category: 'action', defaultKey: '-',            currentKey: '-',            actionId: 'zoom_out' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadFromStorage(): HotkeyBinding[] {
  if (typeof window === 'undefined') return DEFAULT_BINDINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BINDINGS;
    const saved = JSON.parse(raw) as Array<{ id: string; currentKey: string }>;
    // Merge saved keys onto defaults (handles new bindings added in updates)
    return DEFAULT_BINDINGS.map(def => {
      const saved_match = saved.find(s => s.id === def.id);
      return saved_match ? { ...def, currentKey: saved_match.currentKey } : def;
    });
  } catch {
    return DEFAULT_BINDINGS;
  }
}

function saveToStorage(bindings: HotkeyBinding[]) {
  if (typeof window === 'undefined') return;
  const minimal = bindings.map(b => ({ id: b.id, currentKey: b.currentKey }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
}

// ─── Pretty-print a key for display ──────────────────────────────────────────
export function formatKeyDisplay(key: string): string {
  if (!key) return '';
  const parts = key.split('+');
  return parts.map(p => {
    const lower = p.toLowerCase();
    if (lower === 'ctrl') return 'Ctrl';
    if (lower === 'shift') return '⇧';
    if (lower === 'alt') return 'Alt';
    if (lower === 'meta') return '⌘';
    if (lower === 'escape') return 'Esc';
    if (lower === 'delete') return 'Del';
    if (lower === 'backspace') return '⌫';
    if (lower === 'enter') return '↵';
    if (lower === ' ') return 'Space';
    if (lower === 'arrowup') return '↑';
    if (lower === 'arrowdown') return '↓';
    if (lower === 'arrowleft') return '←';
    if (lower === 'arrowright') return '→';
    return p.toUpperCase();
  }).join('+');
}

// ─── Convert a KeyboardEvent to our string format ────────────────────────────
export function eventToKeyString(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push('ctrl');
  if (e.shiftKey) parts.push('shift');
  if (e.altKey) parts.push('alt');

  const key = e.key.toLowerCase();
  // Skip standalone modifier keys
  if (['control', 'shift', 'alt', 'meta'].includes(key)) return '';
  parts.push(key);
  return parts.join('+');
}

// ─── Check if a KeyboardEvent matches a binding string ───────────────────────
export function matchesBinding(e: KeyboardEvent, bindingKey: string): boolean {
  const parts = bindingKey.split('+');
  const needsCtrl = parts.includes('ctrl');
  const needsShift = parts.includes('shift');
  const needsAlt = parts.includes('alt');
  const mainKey = parts.filter(p => !['ctrl', 'shift', 'alt'].includes(p))[0];

  if (!mainKey) return false;
  if (needsCtrl !== (e.ctrlKey || e.metaKey)) return false;
  if (needsShift !== e.shiftKey) return false;
  if (needsAlt !== e.altKey) return false;
  return e.key.toLowerCase() === mainKey;
}

// ─── Zustand Store ────────────────────────────────────────────────────────────
interface HotkeyStore {
  bindings: HotkeyBinding[];
  isEditorOpen: boolean;
  listeningBindingId: string | null; // which binding is being re-bound

  setEditorOpen: (open: boolean) => void;
  setListeningBindingId: (id: string | null) => void;

  loadBindings: () => void;
  updateBinding: (id: string, newKey: string) => { success: boolean; conflict?: string };
  resetBinding: (id: string) => void;
  resetAllBindings: () => void;

  getKeyForTool: (toolId: string) => string;
  getBindingForAction: (actionId: string) => HotkeyBinding | undefined;
  findConflict: (newKey: string, excludeId: string) => HotkeyBinding | undefined;
}

export const useHotkeyStore = create<HotkeyStore>((set, get) => ({
  bindings: DEFAULT_BINDINGS,
  isEditorOpen: false,
  listeningBindingId: null,

  setEditorOpen: (open) => set({ isEditorOpen: open, listeningBindingId: null }),
  setListeningBindingId: (id) => set({ listeningBindingId: id }),

  loadBindings: () => {
    set({ bindings: loadFromStorage() });
  },

  updateBinding: (id, newKey) => {
    const { bindings } = get();
    const conflict = bindings.find(b => b.id !== id && b.currentKey === newKey);
    if (conflict) {
      return { success: false, conflict: conflict.label };
    }
    const updated = bindings.map(b => b.id === id ? { ...b, currentKey: newKey } : b);
    saveToStorage(updated);
    set({ bindings: updated, listeningBindingId: null });
    return { success: true };
  },

  resetBinding: (id) => {
    const { bindings } = get();
    const updated = bindings.map(b => b.id === id ? { ...b, currentKey: b.defaultKey } : b);
    saveToStorage(updated);
    set({ bindings: updated });
  },

  resetAllBindings: () => {
    const reset = DEFAULT_BINDINGS.map(b => ({ ...b }));
    saveToStorage(reset);
    set({ bindings: reset });
  },

  getKeyForTool: (toolId) => {
    const binding = get().bindings.find(b => b.toolId === toolId);
    return binding?.currentKey || '';
  },

  getBindingForAction: (actionId) => {
    return get().bindings.find(b => b.actionId === actionId);
  },

  findConflict: (newKey, excludeId) => {
    return get().bindings.find(b => b.id !== excludeId && b.currentKey === newKey);
  },
}));
