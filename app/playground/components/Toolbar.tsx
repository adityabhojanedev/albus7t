"use client";

import { useBoardStore, Tool } from "../store/useBoardStore";
import { useHotkeyStore, formatKeyDisplay } from "../store/useHotkeyStore";
import {
  Pointer, Hand, Pen, Zap, Circle, Square,
  ZoomIn, ZoomOut, Trash2,
  Eraser, Undo2, Redo2, XCircle, PaintBucket, Check, Scissors,
  Route, Lock, Unlock, ImageOff, Swords, HeartPulse
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ─── Tool Button ──────────────────────────────────────────────────────────────
const ToolBtn = ({
  tool, activeTool, onClick, icon: Icon, label, danger = false, shortcutKey
}: {
  tool: Tool | 'delete' | 'crop';
  activeTool?: Tool;
  onClick: (t: Tool | 'delete' | 'crop') => void;
  icon: React.ElementType;
  label: string;
  danger?: boolean;
  shortcutKey?: string;
}) => {
  const isActive = activeTool === tool;
  return (
    <button
      onClick={() => onClick(tool)}
      title={shortcutKey ? `${label} (${formatKeyDisplay(shortcutKey)})` : label}
      className={`relative p-2 rounded-md transition-all duration-200 ${
        danger
          ? 'text-red-500/80 hover:text-red-400 hover:bg-red-500/10'
          : isActive
            ? 'bg-[#C47C2B] text-[#0A0705] shadow-[0_0_15px_rgba(196,124,43,0.4)]'
            : 'text-[#F5ECD7] hover:bg-[#2A1F15] hover:text-[#E8A44A]'
      }`}
    >
      <Icon size={20} />
      {shortcutKey && (
        <span className={`absolute -bottom-0.5 -right-0.5 text-[8px] font-mono leading-none px-1 py-[1px] rounded transition-colors ${
          isActive
            ? 'bg-[#0A0705]/40 text-[#0A0705]'
            : 'bg-[#2A1F15] text-[#7A6A55]'
        }`}>
          {formatKeyDisplay(shortcutKey)}
        </span>
      )}
    </button>
  );
};

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => <div className="w-px h-6 bg-[#2A1F15] mx-1 flex-shrink-0" />;

// ─── Main Toolbar ─────────────────────────────────────────────────────────────
export default function Toolbar() {
  const {
    activeTool, setTool, zoom, setZoom,
    clearElements, backgroundImage, setBackgroundImage,
    undo, redo, historyStep, history,
    eraserSize, setEraserSize, shapeFillType, toggleShapeFillType,
    strokeColor, setStrokeColor, strokeWidth, setStrokeWidth,
    selectedElementId, removeElement, setSelectedElementId, elements, commitHistory,
    toggleElementLock,
    croppingElementId, setCroppingElementId,
    teams, clearAllAnimationPaths,
    stagedFight, clearStagedFight,
    clearStagedRevive,
  } = useBoardStore();

  const { bindings, loadBindings } = useHotkeyStore();
  useEffect(() => { loadBindings(); }, [loadBindings]);

  // Helper to get current key for a tool
  const keyFor = (toolId: string) => bindings.find(b => b.toolId === toolId)?.currentKey || '';

  const [openPopoverTool, setOpenPopoverTool] = useState<Tool | null>(null);
  const hoverTimer = useRef<number | null>(null);

  const handleMouseEnterTool = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
  };
  const handleMouseLeaveTool = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenPopoverTool(null), 1000);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);
  const isImageSelected = selectedElement?.type === 'image';
  const isSelectedLocked = !!selectedElement?.isLocked;

  const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 10));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.1));

  const hasAnyPath = teams.some(t => t.players.some(p => p.animationPath && p.animationPath.length >= 4));

  // Lock the selected element directly — if nothing selected, enter lock-mode tool
  const handleLockClick = () => {
    if (selectedElementId) {
      toggleElementLock(selectedElementId);
    } else {
      setTool(activeTool === 'lock' ? 'select' : 'lock');
    }
  };

  const handleToolClick = (tool: Tool | 'delete' | 'crop') => {
    if (tool === 'delete') {
      if (selectedElementId) {
        removeElement(selectedElementId);
        commitHistory();
        setSelectedElementId(null);
      }
      return;
    }
    if (tool === 'crop') return;

    if (activeTool === tool) {
      setOpenPopoverTool(prev => prev === tool ? null : tool as Tool);
    } else {
      setOpenPopoverTool(null);
      setTool(tool as Tool);
    }
  };

  const colors = ['#C47C2B', '#E8A44A', '#FFFFFF', '#FF3B30', '#34C759', '#007AFF', '#A259FF'];

  const renderSettingsPopover = (showFillToggle = false) => (
    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[8px] shadow-2xl flex flex-col items-center gap-3 z-50 min-w-[140px]">
      <div className="w-full">
        <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold border-b border-[#2A1F15] pb-1 w-full text-center block mb-2">Thickness: {strokeWidth}px</span>
        <input type="range" min="1" max="25" value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="w-full accent-[#C47C2B]" />
      </div>
      <div className="w-full">
        <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold border-b border-[#2A1F15] pb-1 w-full text-center block mb-2">Color</span>
        <div className="flex gap-1.5 justify-center flex-wrap w-[120px]">
          {colors.map(c => (
            <button key={c} onClick={() => setStrokeColor(c)}
              className={`w-4 h-4 rounded-full border ${strokeColor === c ? 'border-white scale-125' : 'border-black/50'} transition-transform`}
              style={{ backgroundColor: c }} title={c}
            />
          ))}
        </div>
      </div>
      {showFillToggle && (
        <div className="w-full pt-1">
          <button onClick={toggleShapeFillType} title="Toggle Fill"
            className={`flex items-center justify-center w-full gap-1.5 px-3 py-1.5 rounded transition-all text-xs font-sora ${
              shapeFillType === 'solid'
                ? 'bg-[#C47C2B]/20 text-[#C47C2B] border border-[#C47C2B]/50'
                : 'text-[#7A6A55] border border-transparent hover:text-[#F5ECD7] hover:bg-[#2A1F15]'
            }`}
          >
            <PaintBucket size={14} />
            {shapeFillType === 'solid' ? 'Filled' : 'Hollow'}
          </button>
        </div>
      )}
    </div>
  );

  // ── Crop mode UI ────────────────────────────────────────────────────────────
  if (croppingElementId) {
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#0A0705CC] backdrop-blur-md border border-[#2A1F15] rounded-[12px] p-2 shadow-2xl">
        <span className="text-[#F5ECD7] text-sm font-sora font-semibold px-4 border-r border-[#2A1F15]">Crop Image</span>
        <span className="text-[#7A6A55] font-inter text-xs px-2 hidden md:block">Drag the bounds and hit Enter</span>
        <button onClick={() => setCroppingElementId(null)} className="px-4 py-1.5 rounded text-xs text-[#7A6A55] hover:text-[#F5ECD7] hover:bg-[#2A1F15] transition-colors ml-4">Cancel</button>
        <button
          onClick={() => { const event = new KeyboardEvent('keydown', { key: 'Enter' }); window.dispatchEvent(event); }}
          className="px-4 py-1.5 rounded text-xs text-[#0A0705] bg-[#C47C2B] font-bold hover:bg-[#E8A44A] transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(196,124,43,0.3)]"
        >
          <Check size={14} /> Apply Crop
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex flex-wrap items-center gap-1 bg-[#0A0705CC] backdrop-blur-md border border-[#2A1F15] rounded-[12px] px-2 py-2 shadow-2xl">

      {/* ── Group 1: Navigation tools ─────────────────────────── */}
      <ToolBtn tool="select" activeTool={activeTool} onClick={handleToolClick} icon={Pointer} label="Select" shortcutKey={keyFor('select')} />
      <ToolBtn tool="pan" activeTool={activeTool} onClick={handleToolClick} icon={Hand} label="Pan" shortcutKey={keyFor('pan')} />

      <Divider />

      {/* ── Group 2: Drawing tools ────────────────────────────── */}
      <div className="relative" onMouseEnter={handleMouseEnterTool} onMouseLeave={handleMouseLeaveTool}>
        <ToolBtn tool="pen" activeTool={activeTool} onClick={handleToolClick} icon={Pen} label="Pen" shortcutKey={keyFor('pen')} />
        {openPopoverTool === 'pen' && renderSettingsPopover()}
      </div>

      <div className="relative" onMouseEnter={handleMouseEnterTool} onMouseLeave={handleMouseLeaveTool}>
        <ToolBtn tool="eraser" activeTool={activeTool} onClick={handleToolClick} icon={Eraser} label="Eraser" shortcutKey={keyFor('eraser')} />
        {openPopoverTool === 'eraser' && (
          <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[8px] shadow-2xl flex flex-col items-center gap-2 z-50">
            <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold border-b border-[#2A1F15] pb-1 w-full text-center mb-1">Eraser: {eraserSize}px</span>
            <input type="range" min="10" max="150" value={eraserSize}
              onChange={(e) => setEraserSize(Number(e.target.value))}
              className="w-24 accent-[#C47C2B]" />
          </div>
        )}
      </div>

      <div className="relative" onMouseEnter={handleMouseEnterTool} onMouseLeave={handleMouseLeaveTool}>
        <ToolBtn tool="laser" activeTool={activeTool} onClick={handleToolClick} icon={Zap} label="Laser" shortcutKey={keyFor('laser')} />
        {openPopoverTool === 'laser' && renderSettingsPopover()}
      </div>

      <div className="relative" onMouseEnter={handleMouseEnterTool} onMouseLeave={handleMouseLeaveTool}>
        <ToolBtn tool="circle" activeTool={activeTool} onClick={handleToolClick} icon={Circle} label="Circle" shortcutKey={keyFor('circle')} />
        {openPopoverTool === 'circle' && renderSettingsPopover(true)}
      </div>

      <div className="relative" onMouseEnter={handleMouseEnterTool} onMouseLeave={handleMouseLeaveTool}>
        <ToolBtn tool="rectangle" activeTool={activeTool} onClick={handleToolClick} icon={Square} label="Rectangle" shortcutKey={keyFor('rectangle')} />
        {openPopoverTool === 'rectangle' && renderSettingsPopover(true)}
      </div>

      <Divider />

      {/* ── Group 3: Tactical tools ───────────────────────────── */}
      <div className="relative group">
        <ToolBtn tool="path" activeTool={activeTool} onClick={handleToolClick} icon={Route} label="Path Tool" shortcutKey={keyFor('path')} />
        {activeTool === 'path' && hasAnyPath && (
          <button
            onClick={clearAllAnimationPaths}
            title="Clear all routes"
            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] hover:scale-110 transition-transform z-10"
          >
            <XCircle size={10} />
          </button>
        )}
      </div>

      {/* Fight tool */}
      <ToolBtn tool="fight" activeTool={activeTool} onClick={(t) => {
        if (activeTool === 'fight') {
          clearStagedFight();
          setTool('select');
        } else {
          setTool(t as Tool);
        }
      }} icon={Swords} label="Fight Tool" />

      {/* Revive tool */}
      <ToolBtn tool="revive" activeTool={activeTool} onClick={(t) => {
        if (activeTool === 'revive') {
          clearStagedRevive();
          setTool('select');
        } else {
          setTool(t as Tool);
        }
      }} icon={HeartPulse} label="Revive Tool" />

      {/* Lock button — locks selected element directly; enters lock-mode if nothing selected */}
      <button
        onClick={handleLockClick}
        title={selectedElementId
          ? isSelectedLocked ? 'Unlock selected element' : 'Lock selected element'
          : activeTool === 'lock' ? 'Exit lock mode' : 'Enter lock mode (click elements to lock)'}
        className={`p-2 rounded-md transition-all duration-200 ${
          isSelectedLocked && selectedElementId
            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
            : activeTool === 'lock'
              ? 'bg-[#C47C2B] text-[#0A0705] shadow-[0_0_15px_rgba(196,124,43,0.4)]'
              : 'text-[#F5ECD7] hover:bg-[#2A1F15] hover:text-[#E8A44A]'
        }`}
      >
        {isSelectedLocked && selectedElementId ? <Unlock size={20} /> : <Lock size={20} />}
      </button>

      {/* Context: image selected → show crop/delete */}
      {selectedElementId && (
        <>
          <Divider />
          {isImageSelected && (
            <ToolBtn tool="crop" activeTool={undefined} onClick={() => setCroppingElementId(selectedElementId)} icon={Scissors} label="Crop Image" />
          )}
          <ToolBtn tool="delete" activeTool={undefined} onClick={handleToolClick} icon={Trash2} label="Delete (Del)" danger />
        </>
      )}

      <Divider />

      {/* ── Group 4: History + Zoom ───────────────────────────── */}
      <button onClick={undo} disabled={historyStep <= 0} title="Undo"
        className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] disabled:opacity-30 transition-colors">
        <Undo2 size={18} />
      </button>
      <button onClick={redo} disabled={historyStep >= history.length - 1} title="Redo"
        className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] disabled:opacity-30 transition-colors">
        <Redo2 size={18} />
      </button>

      <Divider />

      <button onClick={handleZoomOut} className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] transition-colors"><ZoomOut size={18} /></button>
      <span className="text-[#F5ECD7] font-inter text-xs font-medium w-11 text-center">{Math.round(zoom * 100)}%</span>
      <button onClick={handleZoomIn} className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] transition-colors"><ZoomIn size={18} /></button>

      <Divider />

      {/* ── Group 5: Danger ───────────────────────────────────── */}
      {backgroundImage && (
        <button
          onClick={() => setBackgroundImage(null)}
          title="Clear background map"
          className="flex items-center gap-1 p-1.5 pl-2 pr-2.5 text-[#7A6A55] hover:text-amber-400 hover:bg-[#2A1F15] rounded-md transition-all text-[10px] font-inter border border-[#2A1F15] hover:border-amber-600/30"
        >
          <ImageOff size={14} />
          <span className="hidden sm:inline">Clear Map</span>
        </button>
      )}

      <button
        onClick={clearElements}
        title="Clear all drawings &amp; players"
        className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
