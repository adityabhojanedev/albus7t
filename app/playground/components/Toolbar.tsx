"use client";

import { useBoardStore, Tool } from "../store/useBoardStore";
import { useHotkeyStore, formatKeyDisplay } from "../store/useHotkeyStore";
import {
  Pointer, Hand, Pen, Zap, Circle, Square, Type,
  ZoomIn, ZoomOut, Trash2, Download,
  Eraser, Undo2, Redo2, XCircle, PaintBucket, Check, Scissors, Save,
  Route, Lock, Unlock, ImageOff, Swords, HeartPulse, ImagePlus, Link as LinkIcon, Upload, Video, GripVertical, ChevronLeft, ChevronRight, Trash
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useBoardStageRef } from "../hooks/useBoardStageRef";

// ─── Tooltip Component ────────────────────────────────────────────────────────
const Tooltip = ({ label, shortcut, isAtBottom = false, children }: { label: string, shortcut?: string, isAtBottom?: boolean, children: React.ReactNode }) => (
  <div className="relative group/tooltip flex items-center justify-center">
    {children}
    <div className={`pointer-events-none absolute left-1/2 -translate-x-1/2 ${isAtBottom ? 'bottom-full mb-2 group-hover/tooltip:-translate-y-1' : 'top-full mt-2 group-hover/tooltip:translate-y-1'} opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 z-[60] bg-[#0A0705] text-[#F5ECD7] text-[10px] font-sora font-medium px-2.5 py-1.5 rounded-[6px] border border-[#2A1F15] shadow-2xl whitespace-nowrap flex items-center gap-1.5`}>
      {label}
      {shortcut && <span className="text-[#7A6A55] font-mono text-[9px] bg-[#1A0F08] px-1.5 py-0.5 rounded border border-[#2A1F15]">{formatKeyDisplay(shortcut)}</span>}
    </div>
  </div>
);

// ─── Tool Button ──────────────────────────────────────────────────────────────
const ToolBtn = ({
  tool, activeTool, onClick, icon: Icon, label, danger = false, shortcutKey, isAtBottom = false
}: {
  tool: Tool | 'delete' | 'crop' | 'save_gallery';
  activeTool?: Tool;
  onClick: (t: Tool | 'delete' | 'crop' | 'save_gallery') => void;
  icon: React.ElementType;
  label: string;
  danger?: boolean;
  shortcutKey?: string;
  isAtBottom?: boolean;
}) => {
  const isActive = activeTool === tool;
  return (
    <Tooltip label={label} shortcut={shortcutKey} isAtBottom={isAtBottom}>
      <button
        onClick={() => onClick(tool)}
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
    </Tooltip>
  );
};

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => <div className="w-px h-6 bg-[#2A1F15] mx-1 flex-shrink-0" />;

// ─── Export Button ────────────────────────────────────────────────────────────
function ExportButton({ isAtBottom }: { isAtBottom: boolean }) {
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
      <Tooltip label="Export canvas" isAtBottom={isAtBottom}>
        <button
          onClick={() => setOpen(!open)}
          className={`p-2 rounded-md transition-all duration-200 ${
            open
              ? 'bg-[#C47C2B] text-[#0A0705] shadow-[0_0_15px_rgba(196,124,43,0.4)]'
              : 'text-[#F5ECD7] hover:bg-[#2A1F15] hover:text-[#E8A44A]'
          }`}
        >
          <Download size={20} />
        </button>
      </Tooltip>
      {open && (
        <div className={`absolute ${isAtBottom ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'} left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] rounded-[8px] shadow-2xl z-50 min-w-[150px] py-1`}>
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
function AddImageButton({ isOpen, onToggle, isAtBottom }: { isOpen: boolean; onToggle: () => void; isAtBottom: boolean }) {
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
      onToggle();
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
    onToggle();
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
      <Tooltip label="Add Image" shortcut={shortcutKey} isAtBottom={isAtBottom}>
        <button
          onClick={() => { onToggle(); setMode(null); setError(''); }}
          className={`relative p-2 rounded-md transition-all duration-200 ${
            isOpen
              ? 'bg-[#C47C2B] text-[#0A0705] shadow-[0_0_15px_rgba(196,124,43,0.4)]'
              : 'text-[#F5ECD7] hover:bg-[#2A1F15] hover:text-[#E8A44A]'
          }`}
        >
          <ImagePlus size={20} />
          {/* Shortcut badge — matches ToolBtn style exactly */}
          <span className={`absolute -bottom-0.5 -right-0.5 text-[8px] font-mono leading-none px-1 py-[1px] rounded transition-colors ${
            isOpen ? 'bg-[#0A0705]/40 text-[#0A0705]' : 'bg-[#2A1F15] text-[#7A6A55]'
          }`}>
            {formatKeyDisplay(shortcutKey)}
          </span>
        </button>
      </Tooltip>

      {isOpen && (
        <div className={`absolute ${isAtBottom ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'} left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] rounded-[10px] shadow-2xl z-50 min-w-[200px] py-2 overflow-hidden`}>
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

// ─── Add YouTube Button ────────────────────────────────────────────────────────
function AddYouTubeButton({ isOpen, onToggle, isAtBottom }: { isOpen: boolean; onToggle: () => void; isAtBottom: boolean }) {
  const [urlValue, setUrlValue] = useState('');
  const [error, setError] = useState('');
  const stageRef = useBoardStageRef();
  const { addElement, commitHistory } = useBoardStore();

  // Read the current shortcut key from hotkey store
  const shortcutKey = useHotkeyStore(s =>
    s.bindings.find(b => b.actionId === 'add_youtube')?.currentKey ?? 'y'
  );

  // Listen for keyboard shortcut event dispatched by useKeyboardShortcuts
  useEffect(() => {
    const handler = () => {
      onToggle();
      setError('');
    };
    window.addEventListener('albus:add-youtube-toggle', handler);
    return () => window.removeEventListener('albus:add-youtube-toggle', handler);
  }, []);

  const handleUrlSubmit = () => {
    if (!urlValue.trim()) { setError('Enter a YouTube URL.'); return; }
    
    let videoId = '';
    const urlStr = urlValue.trim();
    const match = urlStr.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([^&?\s/]{11})/);
    if (match) {
      videoId = match[1];
    }
    
    if (!videoId || videoId.length !== 11) {
      setError('Invalid YouTube URL.');
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;
    const scale = stage.scaleX();
    const pos = stage.position();
    const cx = (stage.width()  / 2 - pos.x) / scale;
    const cy = (stage.height() / 2 - pos.y) / scale;
    const w = 480;
    const h = 270;

    addElement({
      id: Math.random().toString(36).substring(2, 9),
      type: 'youtube',
      youtubeUrl: videoId,
      x: cx - w / 2,
      y: cy - h / 2,
      width: w,
      height: h,
      color: '',
      strokeWidth: 0,
    });
    commitHistory();
    onToggle();
    setUrlValue('');
    setError('');
  };

  return (
    <div className="relative">
      <Tooltip label="Add YouTube Video" shortcut={shortcutKey} isAtBottom={isAtBottom}>
        <button
          onClick={() => { 
            onToggle();
            if (isOpen) setUrlValue('');
            setError(''); 
          }}
          className={`relative p-2 rounded-md transition-all duration-200 ${
            isOpen
              ? 'bg-[#C47C2B] text-[#0A0705] shadow-[0_0_15px_rgba(196,124,43,0.4)]'
              : 'text-[#F5ECD7] hover:bg-[#2A1F15] hover:text-[#E8A44A]'
          }`}
        >
          <Video size={20} />
          {/* Shortcut badge — matches ToolBtn style */}
          <span className={`absolute -bottom-0.5 -right-0.5 text-[8px] font-mono leading-none px-1 py-[1px] rounded transition-colors ${
            isOpen ? 'bg-[#0A0705]/40 text-[#0A0705]' : 'bg-[#2A1F15] text-[#7A6A55]'
          }`}>
            {formatKeyDisplay(shortcutKey)}
          </span>
        </button>
      </Tooltip>

      {isOpen && (
        <div className={`absolute ${isAtBottom ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'} left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] rounded-[10px] shadow-2xl z-50 min-w-[200px] py-2 overflow-hidden`}>
          <div className="px-3 pb-1.5 border-b border-[#2A1F15] mb-1 flex items-center justify-between">
            <span className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-inter font-semibold">Add YouTube Video</span>
          </div>

          <div className="px-3 py-2 flex flex-col gap-2">
            <div className="flex bg-[#1A0F08] border border-[#2A1F15] rounded overflow-hidden focus-within:border-[#C47C2B] transition-colors">
              <span className="flex items-center px-2 text-[#7A6A55]"><Video size={11} /></span>
              <input
                autoFocus
                value={urlValue}
                onChange={e => { setUrlValue(e.target.value); setError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') handleUrlSubmit(); }}
                placeholder="https://youtube.com/watch?v=..."
                className="bg-transparent text-[#F5ECD7] text-[11px] py-1.5 w-full focus:outline-none pr-2"
              />
            </div>
            {error && <p className="text-red-400 text-[10px]">{error}</p>}
            <button
              onClick={handleUrlSubmit}
              className="w-full flex items-center justify-center gap-1 bg-[#C47C2B]/10 hover:bg-[#C47C2B]/20 text-[#C47C2B] border border-[#C47C2B]/30 py-1.5 rounded text-[11px] font-sora font-semibold transition-colors"
            >
              Add Video
            </button>
          </div>
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

  const keyFor = (toolId: string) => bindings.find(b => b.toolId === toolId)?.currentKey || '';

  // ── Toolbar dragging state ─────────────────────────────────────────────────
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragUnlocked, setIsDragUnlocked] = useState(false);
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const [dragReady, setDragReady] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const holdTimerRef = useRef<number | null>(null);
  const toolbarDragData = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toolbarPos) {
      setIsAtBottom(toolbarPos.y > window.innerHeight / 2);
    } else {
      setIsAtBottom(false);
    }
  }, [toolbarPos]);

  const handleScroll = (offset: number) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleGripMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragReady(false);
    if (holdTimerRef.current) { window.clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
    holdTimerRef.current = window.setTimeout(() => {
      setIsDragUnlocked(true);
      setDragReady(true);
      const rect = toolbarRef.current?.getBoundingClientRect();
      if (!rect) return;
      const startX = rect.left;
      const startY = rect.top;
      toolbarDragData.current = { mx: e.clientX, my: e.clientY, ox: startX, oy: startY };
      setIsDraggingToolbar(true);
      const onMove = (ev: MouseEvent) => {
        if (!toolbarDragData.current) return;
        const d = toolbarDragData.current;
        setToolbarPos({ x: d.ox + (ev.clientX - d.mx), y: d.oy + (ev.clientY - d.my) });
      };
      const onUp = () => {
        setIsDraggingToolbar(false);
        toolbarDragData.current = null;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    }, 1000);
    const cancelHold = () => {
      if (holdTimerRef.current) { window.clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
      setDragReady(false);
      window.removeEventListener('mouseup', cancelHold);
    };
    window.addEventListener('mouseup', cancelHold);
  }, []);

  const toolbarStyle: React.CSSProperties = toolbarPos
    ? { position: 'fixed', left: toolbarPos.x, top: toolbarPos.y, transform: 'none', transition: isDraggingToolbar ? 'none' : 'box-shadow 0.2s ease' }
    : {};

  const [openPopoverTool, setOpenPopoverTool] = useState<Tool | 'image' | 'youtube' | null>(null);
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
    
    setSelectedElementId(null);
  };

  const isSelectedLocked = !!selectedElement?.isLocked;
  const [showElementColorPicker, setShowElementColorPicker] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Timeout avoids synchronous setState cascading render warning
    const t = setTimeout(() => setShowElementColorPicker(false), 0);
    return () => clearTimeout(t);
  }, [selectedElementId]);

  const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 10));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.1));

  const hasAnyPath = teams.some(t => t.players.some(p => p.animationPath && p.animationPath.length >= 4));

  const handleLockClick = () => {
    if (selectedElementId) {
      toggleElementLock(selectedElementId);
    } else {
      setTool(activeTool === 'lock' ? 'select' : 'lock');
    }
  };

  const handleToolClick = (tool: Tool | 'delete' | 'crop' | 'save_gallery') => {
    if (tool === 'delete') {
      if (selectedElementId) {
        removeElement(selectedElementId);
        commitHistory();
        setSelectedElementId(null);
      }
      return;
    }
    if (tool === 'crop') return;
    if (tool === 'save_gallery') return;

    if (activeTool === tool) {
      setOpenPopoverTool(prev => prev === tool ? null : tool as any);
    } else {
      setOpenPopoverTool(null);
      setTool(tool as Tool);
    }
  };

  const handlePopoverToggle = (tool: Tool | 'image' | 'youtube') => {
    setOpenPopoverTool(prev => prev === tool ? null : tool);
  };

  // Broadcast popover state so ContextualHelp can show the tutorial guide
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('albus:youtube-popover-state', { detail: openPopoverTool === 'youtube' }));
  }, [openPopoverTool]);

  const colors = ['#C47C2B', '#E8A44A', '#FFFFFF', '#FF3B30', '#34C759', '#007AFF', '#A259FF'];

  const handleColorChange = (color: string) => {
    setStrokeColor(color);
    if (selectedElementId) {
      const el = elements.find(e => e.id === selectedElementId);
      if (el) {
        updateElement(selectedElementId, { color });
        commitHistory();
      }
    }
  };

  const renderSettingsPopover = (showFillToggle = false) => (
    <div className={`absolute ${isAtBottom ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'} left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[8px] shadow-2xl flex flex-col items-center gap-3 z-50 min-w-[160px]`}>
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
    <div
      ref={toolbarRef}
      className={`z-50 flex items-center gap-1 bg-[#0A0705CC] backdrop-blur-md border rounded-[12px] px-1 py-1 shadow-2xl transition-shadow duration-200 max-w-[95vw] md:max-w-[80vw] ${
        toolbarPos ? 'border-[#C47C2B]/30' : 'absolute top-4 left-1/2 -translate-x-1/2 border-[#2A1F15]'
      } ${isDraggingToolbar ? 'shadow-[0_0_32px_rgba(196,124,43,0.25)]' : ''}`}
      style={toolbarStyle}
    >
      {/* ── Drag Grip Handle ────────────────────────────────────────────────── */}
      <Tooltip label="Hold 1s to drag toolbar" isAtBottom={isAtBottom}>
        <div
          onMouseDown={handleGripMouseDown}
          className={`flex items-center justify-center p-1.5 rounded-md flex-shrink-0 select-none transition-all duration-200 ${
            dragReady || isDraggingToolbar
              ? 'text-[#C47C2B] bg-[#C47C2B]/15 cursor-grabbing scale-110'
              : 'text-[#3A2F25] hover:text-[#7A6A55] cursor-grab hover:bg-[#2A1F15]/50'
          }`}
          style={{ touchAction: 'none' }}
        >
          <GripVertical size={16} className={`transition-all duration-300 ${dragReady ? 'opacity-100' : 'opacity-60'}`} />
        </div>
      </Tooltip>
      <div className="w-px h-5 bg-[#2A1F15] mx-0.5 flex-shrink-0" />

      <button onClick={() => handleScroll(-200)} className="p-1 text-[#7A6A55] hover:text-[#F5ECD7] flex-shrink-0 transition-colors"><ChevronLeft size={18} /></button>

      <div 
        ref={scrollRef}
        className="flex items-center overflow-x-auto scroll-smooth"
        style={{
          paddingTop: '250px', marginTop: '-250px',
          paddingBottom: '250px', marginBottom: '-250px',
          pointerEvents: 'none',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div 
          className="flex items-center gap-1 pointer-events-auto px-1"
          onWheel={(e) => {
            if (scrollRef.current) scrollRef.current.scrollLeft += e.deltaY;
          }}
        >


      <ToolBtn tool="select" activeTool={activeTool} onClick={handleToolClick} icon={Pointer} label="Select" shortcutKey={keyFor('select')} />
      <ToolBtn tool="pan" activeTool={activeTool} onClick={handleToolClick} icon={Hand} label="Pan" shortcutKey={keyFor('pan')} />

      <Divider />

      <div className="relative" onMouseEnter={handleMouseEnterTool} onMouseLeave={handleMouseLeaveTool}>
        <ToolBtn tool="pen" activeTool={activeTool} onClick={handleToolClick} icon={Pen} label="Pen" shortcutKey={keyFor('pen')} />
        {openPopoverTool === 'pen' && renderSettingsPopover()}
      </div>

      <div className="relative" onMouseEnter={handleMouseEnterTool} onMouseLeave={handleMouseLeaveTool}>
        <ToolBtn tool="eraser" activeTool={activeTool} onClick={handleToolClick} icon={Eraser} label="Eraser" shortcutKey={keyFor('eraser')} />
        {openPopoverTool === 'eraser' && (
          <div className={`absolute ${isAtBottom ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'} left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[8px] shadow-2xl flex flex-col items-center gap-2 z-50`}>
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
          <div className={`absolute ${isAtBottom ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'} left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[8px] shadow-2xl flex flex-col items-center gap-3 z-50 min-w-[160px]`}>
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

      {/* ── Add Image & Video ──────────────────────────────────────────── */}
      <AddImageButton isOpen={openPopoverTool === 'image'} onToggle={() => handlePopoverToggle('image')} isAtBottom={isAtBottom} />
      <AddYouTubeButton isOpen={openPopoverTool === 'youtube'} onToggle={() => handlePopoverToggle('youtube')} isAtBottom={isAtBottom} />

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
      <Tooltip label={selectedElementId ? (isSelectedLocked ? 'Unlock selected element' : 'Lock selected element') : (activeTool === 'lock' ? 'Exit lock mode' : 'Enter lock mode (click elements to lock)')} isAtBottom={isAtBottom}>
        <button
          onClick={handleLockClick}
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
      </Tooltip>

      {/* Context: element selected → show color/crop/delete */}
      {selectedElementId && (
        <>
          <Divider />
          {isColoredElement && (
            <div className="relative">
              <Tooltip label="Change element color" isAtBottom={isAtBottom}>
                <button
                  onClick={() => setShowElementColorPicker(!showElementColorPicker)}
                  className="p-2 rounded-md transition-all duration-200 hover:bg-[#2A1F15]"
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-[#2A1F15]"
                    style={{ backgroundColor: selectedElement?.color || strokeColor }}
                  />
                </button>
              </Tooltip>
              {showElementColorPicker && (
                <div className={`absolute ${isAtBottom ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'} left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[8px] shadow-2xl z-50 min-w-[160px]`}>
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
      <Tooltip label="Undo" isAtBottom={isAtBottom}>
        <button onClick={undo} disabled={historyStep <= 0}
          className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] disabled:opacity-30 transition-colors">
          <Undo2 size={18} />
        </button>
      </Tooltip>
      <Tooltip label="Redo" isAtBottom={isAtBottom}>
        <button onClick={redo} disabled={historyStep >= history.length - 1}
          className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] disabled:opacity-30 transition-colors">
          <Redo2 size={18} />
        </button>
      </Tooltip>

      <Divider />

      <Tooltip label="Zoom Out" isAtBottom={isAtBottom}>
        <button onClick={handleZoomOut} className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] transition-colors"><ZoomOut size={18} /></button>
      </Tooltip>
      <span className="text-[#F5ECD7] font-inter text-xs font-medium w-11 text-center">{Math.round(zoom * 100)}%</span>
      <Tooltip label="Zoom In" isAtBottom={isAtBottom}>
        <button onClick={handleZoomIn} className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] transition-colors"><ZoomIn size={18} /></button>
      </Tooltip>
      <Divider />

      {/* ── Group 5: Export ────────────────────────────────────── */}
      <ExportButton isAtBottom={isAtBottom} />

      <Divider />

      {/* ── Group 5: Danger ───────────────────────────────────── */}
      {backgroundImage && (
        <Tooltip label="Clear background map" isAtBottom={isAtBottom}>
          <button
            onClick={() => setBackgroundImage(null)}
            className="flex items-center gap-1 p-1.5 pl-2 pr-2.5 text-[#7A6A55] hover:text-amber-400 hover:bg-[#2A1F15] rounded-md transition-all text-[10px] font-inter border border-[#2A1F15] hover:border-amber-600/30"
          >
            <ImageOff size={14} />
            <span className="hidden sm:inline">Clear Map</span>
          </button>
        </Tooltip>
      )}

      <Tooltip label="Clear all drawings & players" isAtBottom={isAtBottom}>
        <button
          onClick={clearElements}
          className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
        >
          <Trash size={18} />
        </button>
      </Tooltip>
        </div>
      </div>

      <button onClick={() => handleScroll(200)} className="p-1 text-[#7A6A55] hover:text-[#F5ECD7] flex-shrink-0 transition-colors"><ChevronRight size={18} /></button>
    </div>
  );
}
