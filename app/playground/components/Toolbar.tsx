"use client";

import { useBoardStore, Tool } from "../store/useBoardStore";
import { useHotkeyStore, formatKeyDisplay } from "../store/useHotkeyStore";
import {
  Pointer, Hand, Pen, Zap, Circle, Square, Type,
  ZoomIn, ZoomOut, Trash2, Download,
  Eraser, Undo2, Redo2, XCircle, PaintBucket, Check, Scissors, Save,
  Route, Lock, Unlock, ImageOff, Swords, HeartPulse, ImagePlus, Link as LinkIcon, Upload
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useBoardStageRef } from "../hooks/useBoardStageRef";

// ─── Tool Button ──────────────────────────────────────────────────────────────
const ToolBtn = ({
  tool, activeTool, onClick, icon: Icon, label, danger = false, shortcutKey
}: {
  tool: Tool | 'delete' | 'crop' | 'save_gallery';
  activeTool?: Tool;
  onClick: (t: any) => void;
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

// ─── Add Image Button ────────────────────────────────────────────────────────
function AddImageButton() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'url' | 'upload' | null>(null);
  const [urlValue, setUrlValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const stageRef = useBoardStageRef();
  const { addElement, commitHistory } = useBoardStore();

  // Read the current shortcut key from hotkey store (user-customizable)
  const shortcutKey = useHotkeyStore(s =>
    s.bindings.find(b => b.actionId === 'add_image')?.currentKey ?? 'i'
  );

  // Listen for keyboard shortcut event dispatched by useKeyboardShortcuts
  useEffect(() => {
    const handler = () => {
      setOpen(o => !o);
      setMode(null);
      setError('');
    };
    window.addEventListener('albus:add-image-toggle', handler);
    return () => window.removeEventListener('albus:add-image-toggle', handler);
  }, []);

  const insertImage = (img: HTMLImageElement) => {
    const stage = stageRef.current;
    if (!stage) return;
    const scale = stage.scaleX();
    const pos = stage.position();
    const cx = (stage.width()  / 2 - pos.x) / scale;
    const cy = (stage.height() / 2 - pos.y) / scale;
    const maxW = Math.min(img.width,  stage.width()  / scale * 0.7);
    const maxH = Math.min(img.height, stage.height() / scale * 0.7);
    const ratio = Math.min(maxW / img.width, maxH / img.height);
    const w = img.width  * ratio;
    const h = img.height * ratio;
    addElement({
      id: Math.random().toString(36).substring(2, 9),
      type: 'image',
      image: img,
      x: cx - w / 2,
      y: cy - h / 2,
      width: w,
      height: h,
      color: '',
      strokeWidth: 0,
    });
    commitHistory();
    setOpen(false);
    setMode(null);
    setUrlValue('');
    setError('');
  };

  const handleUrlLoad = () => {
    if (!urlValue.trim()) { setError('Enter an image URL.'); return; }
    setLoading(true); setError('');
    const proxied = `/api/proxy-image?url=${encodeURIComponent(urlValue.trim())}`;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = proxied;
    img.onload  = () => { setLoading(false); insertImage(img); };
    img.onerror = () => { setLoading(false); setError('Could not load image. Try a direct image URL.'); };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      const img = new window.Image();
      img.src = dataUrl;
      img.onload = () => insertImage(img);
    };
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(o => !o); setMode(null); setError(''); }}
        title={`Add Image (${formatKeyDisplay(shortcutKey)})`}
        className={`relative p-2 rounded-md transition-all duration-200 ${
          open
            ? 'bg-[#C47C2B] text-[#0A0705] shadow-[0_0_15px_rgba(196,124,43,0.4)]'
            : 'text-[#F5ECD7] hover:bg-[#2A1F15] hover:text-[#E8A44A]'
        }`}
      >
        <ImagePlus size={20} />
        {/* Shortcut badge — matches ToolBtn style exactly */}
        <span className={`absolute -bottom-0.5 -right-0.5 text-[8px] font-mono leading-none px-1 py-[1px] rounded transition-colors ${
          open ? 'bg-[#0A0705]/40 text-[#0A0705]' : 'bg-[#2A1F15] text-[#7A6A55]'
        }`}>
          {formatKeyDisplay(shortcutKey)}
        </span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] rounded-[10px] shadow-2xl z-50 min-w-[200px] py-2 overflow-hidden">
          <div className="px-3 pb-1.5 border-b border-[#2A1F15] mb-1 flex items-center justify-between">
            <span className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-inter font-semibold">Add Image</span>
            <span className="text-[#3A2F25] text-[9px] font-mono">{formatKeyDisplay(shortcutKey)}</span>
          </div>

          {/* Option: URL */}
          {mode !== 'url' && (
            <button
              onClick={() => setMode('url')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sora text-[#F5ECD7] hover:bg-[#2A1F15] hover:text-[#E8A44A] transition-colors"
            >
              <LinkIcon size={13} className="text-[#C47C2B]" />
              Paste Image URL
            </button>
          )}

          {mode === 'url' && (
            <div className="px-3 py-2 flex flex-col gap-2">
              <div className="flex bg-[#1A0F08] border border-[#2A1F15] rounded overflow-hidden focus-within:border-[#C47C2B] transition-colors">
                <span className="flex items-center px-2 text-[#7A6A55]"><LinkIcon size={11} /></span>
                <input
                  autoFocus
                  value={urlValue}
                  onChange={e => { setUrlValue(e.target.value); setError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleUrlLoad(); }}
                  placeholder="https://example.com/img.png"
                  className="bg-transparent text-[#F5ECD7] text-[11px] py-1.5 w-full focus:outline-none pr-2"
                />
              </div>
              {error && <p className="text-red-400 text-[10px]">{error}</p>}
              <div className="flex gap-1.5">
                <button
                  onClick={handleUrlLoad}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-1 bg-[#C47C2B]/10 hover:bg-[#C47C2B]/20 text-[#C47C2B] border border-[#C47C2B]/30 py-1.5 rounded text-[11px] font-sora font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading…' : 'Add to Canvas'}
                </button>
                <button
                  onClick={() => { setMode(null); setError(''); }}
                  className="px-3 py-1.5 rounded text-[11px] text-[#7A6A55] hover:text-[#F5ECD7] bg-[#1A0F08] transition-colors"
                >Back</button>
              </div>
            </div>
          )}

          {/* Option: Upload from PC */}
          {mode !== 'url' && (
            <>
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sora text-[#F5ECD7] hover:bg-[#2A1F15] hover:text-[#E8A44A] transition-colors"
              >
                <Upload size={13} className="text-[#C47C2B]" />
                Upload from PC
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </>
          )}
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
    addSavedMap,
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

  const selectedElement = elements.find(e => e.id === selectedElementId);
  const isImageSelected = selectedElement?.type === 'image';
  const isColoredElement = selectedElement && ['path', 'circle', 'rectangle', 'text'].includes(selectedElement.type);

  const handleSaveToGallery = () => {
    if (!selectedElement || selectedElement.type !== 'image' || !selectedElement.image) return;
    
    const img = selectedElement.image;
    // Generate thumbnail
    const thumbCanvas = document.createElement('canvas');
    const scale = Math.min(200 / img.width, 1);
    thumbCanvas.width = img.width * scale;
    thumbCanvas.height = img.height * scale;
    thumbCanvas.getContext('2d')?.drawImage(img, 0, 0, thumbCanvas.width, thumbCanvas.height);
    const thumbUrl = thumbCanvas.toDataURL('image/jpeg', 0.65);

    addSavedMap({
      title: 'Canvas Image',
      category: 'General',
      imageUrl: thumbUrl,
      sourceUrl: img.src,
      itemType: 'gallery'
    });
    
    // Deselect to indicate action completed
    setSelectedElementId(null);
  };

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

      {/* ── Add Image ──────────────────────────────────────────── */}
      <AddImageButton />

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
            <>
              <ToolBtn tool="crop" activeTool={undefined} onClick={() => setCroppingElementId(selectedElementId)} icon={Scissors} label="Crop Image" />
              <ToolBtn tool="save_gallery" activeTool={undefined} onClick={handleSaveToGallery} icon={Save} label="Save to Gallery" />
            </>
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
