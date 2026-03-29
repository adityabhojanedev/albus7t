"use client";

import { useEffect } from 'react';
import { useBoardStore, Tool } from '../store/useBoardStore';
import { useHotkeyStore, matchesBinding } from '../store/useHotkeyStore';

/**
 * Global keyboard shortcut listener.
 * Reads bindings from useHotkeyStore, dispatches to useBoardStore.
 * Mount once at page level (not inside canvas — avoids duplicate listeners).
 */
export function useKeyboardShortcuts() {
  const setTool = useBoardStore(s => s.setTool);
  const undo = useBoardStore(s => s.undo);
  const redo = useBoardStore(s => s.redo);
  const zoom = useBoardStore(s => s.zoom);
  const setZoom = useBoardStore(s => s.setZoom);

  const selectedElementId = useBoardStore(s => s.selectedElementId);
  const setSelectedElementId = useBoardStore(s => s.setSelectedElementId);
  const selectedPlayerId = useBoardStore(s => s.selectedPlayerId);
  const setSelectedPlayerId = useBoardStore(s => s.setSelectedPlayerId);
  const croppingElementId = useBoardStore(s => s.croppingElementId);
  const setCroppingElementId = useBoardStore(s => s.setCroppingElementId);
  const elements = useBoardStore(s => s.elements);
  const removeElement = useBoardStore(s => s.removeElement);
  const updateElement = useBoardStore(s => s.updateElement);
  const commitHistory = useBoardStore(s => s.commitHistory);
  const teams = useBoardStore(s => s.teams);
  const removeTeam = useBoardStore(s => s.removeTeam);

  const bindings = useHotkeyStore(s => s.bindings);
  const isEditorOpen = useHotkeyStore(s => s.isEditorOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip when hotkey editor modal is open (it captures keys itself)
      if (isEditorOpen) return;

      // Skip when typing into inputs
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // ── Check action bindings first (they may have modifiers) ──────
      for (const binding of bindings) {
        if (binding.category !== 'action') continue;
        if (!matchesBinding(e, binding.currentKey)) continue;

        e.preventDefault();

        switch (binding.actionId) {
          case 'undo':
            undo();
            return;
          case 'redo':
            redo();
            return;
          case 'delete': {
            if (croppingElementId) return;
            if (selectedElementId) {
              const el = elements.find(x => x.id === selectedElementId);
              if (el?.isLocked) return;
              removeElement(selectedElementId);
              commitHistory();
              setSelectedElementId(null);
            } else if (selectedPlayerId) {
              const team = teams.find(t => t.players.some(p => p.id === selectedPlayerId));
              const player = team?.players.find(p => p.id === selectedPlayerId);
              if (player?.isLocked) return;
              if (team) removeTeam(team.id);
              setSelectedPlayerId(null);
            }
            return;
          }
          case 'deselect':
            setCroppingElementId(null);
            setSelectedElementId(null);
            setSelectedPlayerId(null);
            return;
          case 'zoom_in':
            setZoom(Math.min(zoom * 1.2, 10));
            return;
          case 'zoom_out':
            setZoom(Math.max(zoom / 1.2, 0.1));
            return;
        }
      }

      // ── Check tool bindings (single keys, no modifiers) ────────────
      // Only fire tool shortcuts when no modifier is pressed
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      for (const binding of bindings) {
        if (binding.category !== 'tool') continue;
        if (!binding.toolId) continue;
        if (e.key.toLowerCase() !== binding.currentKey) continue;

        e.preventDefault();
        setTool(binding.toolId as Tool);
        return;
      }

      // ── Legacy Enter handling for crop confirm ─────────────────────
      if (e.key === 'Enter' && croppingElementId) {
        // This is handled inside TacticsCanvas since it needs stage refs
        // We don't prevent default here so TacticsCanvas can still handle it
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    bindings, isEditorOpen, setTool,
    undo, redo, zoom, setZoom,
    selectedElementId, setSelectedElementId,
    selectedPlayerId, setSelectedPlayerId,
    croppingElementId, setCroppingElementId,
    elements, removeElement, updateElement, commitHistory,
    teams, removeTeam,
  ]);
}
