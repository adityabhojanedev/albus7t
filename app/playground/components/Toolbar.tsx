"use client";

import { useBoardStore, Tool } from "../store/useBoardStore";
import { useHotkeyStore, formatKeyDisplay } from "../store/useHotkeyStore";
import {
  Pointer, Hand, Pen, Zap, Circle, Square, Type,
  ZoomIn, ZoomOut, Trash2, Download,
  Eraser, Undo2, Redo2, XCircle, PaintBucket, Check, Scissors,
  Route, Lock, Unlock, ImageOff, Swords, HeartPulse
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useBoardStageRef } from "../hooks/useBoardStageRef";

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

// ─── Export Button ────────────────────────────────────────────────────────────
function ExportButton() {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const stageRef = useBoardStageRef();

  const doExport = async (format: 'png' | 'jpg' | 'pdf') => {
    setExporting(true);
    try {
      const { exportAsPNG, exportAsJPG, exportAsPDF } = await import('../hooks/useExport');
      if (format === 'png') exportAsPNG(stageRef);
      else if (format === 'jpg') exportAsJPG(stageRef);
      else await exportAsPDF(stageRef);
    } finally {
      setExporting(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        title="Export canvas"
        className={`p-2 rounded-md transition-all duration-200 ${
          open
            ? 'bg-[#C47C2B] text-[#0A0705] shadow-[0_0_15px_rgba(196,124,43,0.4)]'
            : 'text-[#F5ECD7] hover:bg-[#2A1F15] hover:text-[#E8A44A]'
        }`}
      >
        <Download size={20} />
      </button>
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] rounded-[8px] shadow-2xl z-50 min-w-[150px] py-1">
          <div className="px-3 py-1.5 border-b border-[#2A1F15]">
            <span className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-inter font-semibold">Export As</span>
          </div>
          {(['png', 'jpg', 'pdf'] as const).map(fmt => (
            <button
              key={fmt}
              disabled={exporting}
              onClick={() => doExport(fmt)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sora text-[#F5ECD7] hover:bg-[#2A1F15] hover:text-[#E8A44A] transition-colors disabled:opacity-40"
            >
              <Download size={13} />
              {fmt.toUpperCase()}
              {fmt === 'pdf' && <span className="text-[#7A6A55] text-[9px] ml-auto">jsPDF</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Toolbar ─────────────────────────────────────────────────────────────
export default function Toolbar() {
  const {
    activeTool, setTool, zoom, setZoom,
    clearElements, backgroundImage, setBackgroundImage,
    undo, redo, historyStep, history,
    eraserSize, setEraserSize, shapeFillType, toggleShapeFillType,
    strokeColor, setStrokeColor, strokeWidth, setStrokeWidth,
    selectedElementId, removeElement, setSelectedElementId, elements, updateElement, commitHistory,
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
  const isColoredElement = selectedElement && ['text', 'line', 'circle', 'rectangle'].includes(selectedElement.type);
  const isSelectedLocked = !!selectedElement?.isLocked;
  const [showElementColorPicker, setShowElementColorPicker] = useState(false);

  // Close element color picker when selection changes
  useEffect(() => { setShowElementColorPicker(false); }, [selectedElementId]);

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

  // Color change handler — also updates selected element color in real-time
  const handleColorChange = (color: string) => {
    setStrokeColor(color);
    // If a text (or any drawing) element is selected, live-update its color
    if (selectedElementId) {
      const el = elements.find(e => e.id === selectedElementId);
      if (el) {
        updateElement(selectedElementId, { color });
        commitHistory();
      }
    }
  };

  const renderSettingsPopover = (showFillToggle = false) => (
    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[8px] shadow-2xl flex flex-col items-center gap-3 z-50 min-w-[160px]">
      <div className="w-full">
        <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold border-b border-[#2A1F15] pb-1 w-full text-center block mb-2">Thickness: {strokeWidth}px</span>
        <input type="range" min="1" max="25" value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="w-full accent-[#C47C2B]" />
      </div>
      <div className="w-full">
        <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold border-b border-[#2A1F15] pb-1 w-full text-center block mb-2">Color</span>
        <div className="flex items-center gap-2">
          <label
            className={`w-5 h-5 rounded-full border overflow-hidden cursor-pointer relative flex-shrink-0 transition-transform ${!colors.includes(strokeColor.toUpperCase()) && !colors.includes(strokeColor) ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'border-[#2A1F15] hover:scale-105'}`}
            title="Custom Color"
          >
            <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(red, yellow, green, cyan, blue, magenta, red)' }} />
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
          </label>
          <div className="w-[1px] h-4 bg-[#2A1F15]"></div>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {colors.map(c => (
              <button key={c} onClick={() => handleColorChange(c)}
                className={`w-4 h-4 rounded-full border ${strokeColor === c ? 'border-white scale-125' : 'border-black/50'} transition-transform`}
                style={{ backgroundColor: c }} title={c}
              />
            ))}
          </div>
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

      <div className="relative" onMouseEnter={handleMouseEnterTool} onMouseLeave={handleMouseLeaveTool}>
        <ToolBtn tool="text" activeTool={activeTool} onClick={handleToolClick} icon={Type} label="Text" shortcutKey={keyFor('text')} />
        {openPopoverTool === 'text' && (
          <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[8px] shadow-2xl flex flex-col items-center gap-3 z-50 min-w-[160px]">
            <div className="w-full">
              <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold border-b border-[#2A1F15] pb-1 w-full text-center block mb-2">Font Size: {Math.max(16, strokeWidth * 5)}px</span>
              <input type="range" min="1" max="25" value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-[#C47C2B]" />
            </div>
            <div className="w-full">
              <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold border-b border-[#2A1F15] pb-1 w-full text-center block mb-2">Color</span>
              <div className="flex items-center gap-2">
                <label
                  className={`w-5 h-5 rounded-full border overflow-hidden cursor-pointer relative flex-shrink-0 transition-transform ${!colors.includes(strokeColor.toUpperCase()) && !colors.includes(strokeColor) ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'border-[#2A1F15] hover:scale-105'}`}
                  title="Custom Color"
                >
                  <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(red, yellow, green, cyan, blue, magenta, red)' }} />
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  />
                </label>
                <div className="w-[1px] h-4 bg-[#2A1F15]"></div>
                <div className="flex gap-1.5 justify-center flex-wrap">
                  {colors.map(c => (
                    <button key={c} onClick={() => handleColorChange(c)}
                      className={`w-4 h-4 rounded-full border ${strokeColor === c ? 'border-white scale-125' : 'border-black/50'} transition-transform`}
                      style={{ backgroundColor: c }} title={c}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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

      {/* Context: element selected → show color/crop/delete */}
      {selectedElementId && (
        <>
          <Divider />
          {isColoredElement && (
            <div className="relative">
              <button
                onClick={() => setShowElementColorPicker(!showElementColorPicker)}
                title="Change element color"
                className="p-2 rounded-md transition-all duration-200 hover:bg-[#2A1F15]"
              >
                <div
                  className="w-5 h-5 rounded-full border-2 border-[#2A1F15]"
                  style={{ backgroundColor: selectedElement?.color || strokeColor }}
                />
              </button>
              {showElementColorPicker && (
                <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[8px] shadow-2xl z-50 min-w-[160px]">
                  <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold border-b border-[#2A1F15] pb-1 w-full text-center block mb-2">Element Color</span>
                  <div className="flex items-center gap-2">
                    <label
                      className={`w-5 h-5 rounded-full border overflow-hidden cursor-pointer relative flex-shrink-0 transition-transform ${!colors.includes((selectedElement?.color || '').toUpperCase()) && !colors.includes(selectedElement?.color || '') ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'border-[#2A1F15] hover:scale-105'}`}
                      title="Custom Color"
                    >
                      <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(red, yellow, green, cyan, blue, magenta, red)' }} />
                      <input
                        type="color"
                        value={selectedElement?.color || strokeColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                    </label>
                    <div className="w-[1px] h-4 bg-[#2A1F15]"></div>
                    <div className="flex gap-1.5 justify-center flex-wrap">
                      {colors.map(c => (
                        <button key={c} onClick={() => handleColorChange(c)}
                          className={`w-4 h-4 rounded-full border ${(selectedElement?.color || strokeColor) === c ? 'border-white scale-125' : 'border-black/50'} transition-transform`}
                          style={{ backgroundColor: c }} title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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

      {/* ── Group 5: Export ────────────────────────────────────── */}
      <ExportButton />

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
