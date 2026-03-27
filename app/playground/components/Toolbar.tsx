"use client";

import { useBoardStore, Tool } from "../store/useBoardStore";
import { 
  Pointer, Hand, Pen, Zap, Circle, Square, 
  ZoomIn, ZoomOut, Image as ImageIcon, Trash2,
  Eraser, Undo2, Redo2, XCircle, PaintBucket, AlertCircle, Check, Scissors, Users
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AddTeamModal from "./AddTeamModal";

const ToolBtn = ({ 
  tool, activeTool, onClick, icon: Icon, label 
}: { 
  tool: Tool | 'delete' | 'crop', activeTool?: Tool, onClick: (t: Tool | 'delete' | 'crop') => void, icon: React.ElementType, label: string 
}) => {
  const isActive = activeTool === tool;
  return (
    <button
      onClick={() => onClick(tool)}
      title={label}
      className={`p-2 rounded-md transition-all duration-200 ${
        isActive 
          ? "bg-[#C47C2B] text-[#0A0705] shadow-[0_0_15px_rgba(196,124,43,0.4)]" 
          : "text-[#F5ECD7] hover:bg-[#2A1F15] hover:text-[#E8A44A]"
      }`}
    >
      <Icon size={20} />
    </button>
  );
};

export default function Toolbar() {
  const { 
    activeTool, setTool, zoom, setZoom, 
    setBackgroundImage, clearElements, backgroundImage,
    undo, redo, historyStep, history,
    eraserSize, setEraserSize, shapeFillType, toggleShapeFillType,
    strokeColor, setStrokeColor, strokeWidth, setStrokeWidth,
    selectedElementId, removeElement, setSelectedElementId, addElement, elements, commitHistory,
    croppingElementId, setCroppingElementId,
    isAddTeamModalOpen, setAddTeamModalOpen,
    savedTeams, loadSavedTeams, removeSavedTeam
  } = useBoardStore();

  const [isTeamLibraryOpen, setTeamLibraryOpen] = useState(false);

  useEffect(() => {
    loadSavedTeams();
  }, [loadSavedTeams]);

  const selectedElement = elements.find(el => el.id === selectedElementId);
  const isImageSelected = selectedElement?.type === 'image';

  const [openPopoverTool, setOpenPopoverTool] = useState<Tool | null>(null);
  const hoverTimer = useRef<number | null>(null);

  const handleMouseEnterTool = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
  };

  const handleMouseLeaveTool = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    // Hide popover after 1 second of no interaction
    hoverTimer.current = window.setTimeout(() => setOpenPopoverTool(null), 1000);
  };

  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Zoom controls
  const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 10));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.1));

  // Image handling
  const handleLoadUrl = () => {
    if (!imageUrl) return;
    setImageError("");

    // Private Next.js API Route Bypass
    const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = proxiedUrl;
    
    img.onload = () => {
      insertImageToBoard(img);
      setImageUrl("");
    };

    img.onerror = () => {
      setImageError("Failed to load map. URL blocked or invalid format.");
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => insertImageToBoard(img);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const insertImageToBoard = (imgFinal: HTMLImageElement) => {
    // Calculate a rough center for placement (ideally using stage position, but window works as default)
    const stageCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    addElement({
      id: Math.random().toString(36).substring(2, 9),
      type: 'image',
      image: imgFinal,
      x: stageCenter.x - (imgFinal.width / 2),
      y: stageCenter.y - (imgFinal.height / 2),
      width: imgFinal.width,
      height: imgFinal.height,
      color: 'transparent',
      strokeWidth: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0
    });
    commitHistory();
    setTool('select');
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
    if (tool === 'crop') return; // Handled directly in onClick override, but here for typing safety
    
    // Allow users to instantly open options if they click the active tool again
    if (activeTool === tool) {
      setOpenPopoverTool(prev => prev === tool ? null : tool as Tool);
    } else {
      setOpenPopoverTool(null);
      setTool(tool as Tool);
    }
  };

  const colors = ['#C47C2B', '#E8A44A', '#FFFFFF', '#FF3B30', '#34C759', '#007AFF', '#A259FF'];

  // Shared generic stroke style popover
  const renderSettingsPopover = (showFillToggle = false) => (
    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[8px] shadow-2xl flex flex-col items-center gap-3 z-50 min-w-[140px]">
      <div className="w-full">
        <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold border-b border-[#2A1F15] pb-1 w-full text-center block mb-2">Thickness: {strokeWidth}px</span>
        <input 
          type="range" min="1" max="25" 
          value={strokeWidth} 
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="w-full accent-[#C47C2B]"
        />
      </div>

      <div className="w-full">
        <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold border-b border-[#2A1F15] pb-1 w-full text-center block mb-2">Color</span>
        <div className="flex gap-1.5 justify-center flex-wrap w-[120px]">
          {colors.map(c => (
            <button 
              key={c}
              onClick={() => setStrokeColor(c)}
              className={`w-4 h-4 rounded-full border ${strokeColor === c ? 'border-white scale-125' : 'border-black/50'} transition-transform`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      {showFillToggle && (
        <div className="w-full pt-1">
          <button
            onClick={toggleShapeFillType}
            title="Toggle Fill"
            className={`flex items-center justify-center w-full gap-1.5 px-3 py-1.5 rounded transition-all text-xs font-sora ${
              shapeFillType === 'solid' ? "bg-[#C47C2B]/20 text-[#C47C2B] border border-[#C47C2B]/50" : "text-[#7A6A55] border border-transparent hover:text-[#F5ECD7] hover:bg-[#2A1F15]"
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
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            window.dispatchEvent(event);
          }} 
          className="px-4 py-1.5 rounded text-xs text-[#0A0705] bg-[#C47C2B] font-bold hover:bg-[#E8A44A] transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(196,124,43,0.3)]"
        >
          <Check size={14} /> Apply Crop
        </button>
      </div>
    );
  }

  return (
    <>
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col md:flex-row items-center gap-4 bg-[#0A0705CC] backdrop-blur-md border border-[#2A1F15] rounded-[12px] p-2 shadow-2xl">
      
      {/* Primary Tools */}
      <div className="flex items-center gap-1 border-r border-[#2A1F15] pr-4">
        <ToolBtn tool="select" activeTool={activeTool} onClick={handleToolClick} icon={Pointer} label="Select Tool (V)" />
        <ToolBtn tool="pan" activeTool={activeTool} onClick={handleToolClick} icon={Hand} label="Pan Tool (H or Space)" />
        <div 
          className="relative flex flex-col items-center"
          onMouseEnter={handleMouseEnterTool}
          onMouseLeave={handleMouseLeaveTool}
        >
          <ToolBtn tool="pen" activeTool={activeTool} onClick={handleToolClick} icon={Pen} label="Pen Tool (P)" />
          {openPopoverTool === 'pen' && renderSettingsPopover()}
        </div>
        
        <div 
          className="relative flex flex-col items-center"
          onMouseEnter={handleMouseEnterTool}
          onMouseLeave={handleMouseLeaveTool}
        >
          <ToolBtn tool="eraser" activeTool={activeTool} onClick={handleToolClick} icon={Eraser} label="Eraser Tool (E)" />
          {openPopoverTool === 'eraser' && (
            <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[8px] shadow-2xl flex flex-col items-center gap-2 z-50">
              <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold border-b border-[#2A1F15] pb-1 w-full text-center mb-1">Eraser Size: {eraserSize}px</span>
              <input 
                type="range" 
                min="10" max="150" 
                value={eraserSize} 
                onChange={(e) => setEraserSize(Number(e.target.value))}
                className="w-24 accent-[#C47C2B]"
              />
            </div>
          )}
        </div>

        <div 
          className="relative flex flex-col items-center"
          onMouseEnter={handleMouseEnterTool}
          onMouseLeave={handleMouseLeaveTool}
        >
          <ToolBtn tool="laser" activeTool={activeTool} onClick={handleToolClick} icon={Zap} label="Laser Tool (L) - Fades quickly" />
          {openPopoverTool === 'laser' && renderSettingsPopover()}
        </div>
        
        <div 
          className="relative flex flex-col items-center"
          onMouseEnter={handleMouseEnterTool}
          onMouseLeave={handleMouseLeaveTool}
        >
          <ToolBtn tool="circle" activeTool={activeTool} onClick={handleToolClick} icon={Circle} label="Draw Circle (C)" />
          {openPopoverTool === 'circle' && renderSettingsPopover(true)}
        </div>
        
        <div 
          className="relative flex flex-col items-center"
          onMouseEnter={handleMouseEnterTool}
          onMouseLeave={handleMouseLeaveTool}
        >
          <ToolBtn tool="rectangle" activeTool={activeTool} onClick={handleToolClick} icon={Square} label="Draw Rectangle (R)" />
          {openPopoverTool === 'rectangle' && renderSettingsPopover(true)}
        </div>

        {selectedElementId && (
          <div className="ml-2 pl-2 flex items-center gap-1 border-l border-[#2A1F15]">
            {isImageSelected && (
              <ToolBtn tool="crop" activeTool={undefined} onClick={() => setCroppingElementId(selectedElementId)} icon={Scissors} label="Crop Image" />
            )}
            <ToolBtn tool="delete" activeTool={undefined} onClick={handleToolClick} icon={Trash2} label="Delete Selected (Del)" />
          </div>
        )}
      </div>

      {/* Viewport / Actions */}
      <div className="flex items-center gap-2 border-r border-[#2A1F15] pr-4">
        <button 
          onClick={undo} 
          disabled={historyStep <= 0}
          title="Undo"
          className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] disabled:opacity-50 disabled:hover:text-[#7A6A55] transition-colors"
        >
          <Undo2 size={18} />
        </button>
        <button 
          onClick={redo} 
          disabled={historyStep >= history.length - 1}
          title="Redo"
          className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] disabled:opacity-50 disabled:hover:text-[#7A6A55] transition-colors pr-4 border-r border-[#2A1F15]/50"
        >
          <Redo2 size={18} />
        </button>

        <button onClick={handleZoomOut} className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] transition-colors ml-2"><ZoomOut size={18} /></button>
        <span className="text-[#F5ECD7] font-inter text-xs font-medium w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button onClick={handleZoomIn} className="p-2 text-[#7A6A55] hover:text-[#F5ECD7] transition-colors"><ZoomIn size={18} /></button>
        
        <button 
          onClick={clearElements} 
          title="Clear all drawings"
          className="p-2 text-red-500/80 hover:text-red-400 hover:bg-red-500/10 rounded overflow-hidden transition-all ml-2"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Map Importer */}
      <div className="flex items-center gap-2 relative">
        <div className="flex bg-[#1A0F08] border border-[#2A1F15] rounded overflow-hidden">
          <input 
            type="text" 
            value={imageUrl}
            onChange={(e) => { setImageUrl(e.target.value); setImageError(""); }}
            placeholder="Paste Map URL..."
            className="bg-transparent text-[#F5ECD7] text-xs font-inter px-3 py-1.5 w-[140px] focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleLoadUrl()}
          />
          <button 
            onClick={handleLoadUrl}
            className="bg-[#2A1F15] text-[#C47C2B] text-xs font-sora font-semibold px-3 hover:bg-[#C47C2B] hover:text-[#0A0705] transition-colors"
          >
            Load
          </button>
        </div>
        
        {imageError && (
          <div className="absolute top-full left-0 mt-3 whitespace-nowrap flex items-center gap-1.5 text-red-500 bg-[#0F0A06] border border-red-500/20 px-3 py-1.5 rounded-md text-xs font-inter shadow-xl">
            <AlertCircle size={14} />
            {imageError}
          </div>
        )}
        
        <span className="text-[#7A6A55] text-xs px-1">or</span>
        
        <input 
          type="file" 
          accept="image/png, image/jpeg, image/webp" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-[#2A1F15] text-[#F5ECD7] hover:text-[#C47C2B] hover:border-[#C47C2B] border border-transparent transition-all px-3 py-1.5 rounded text-xs font-sora"
        >
          <ImageIcon size={14} /> Upload
        </button>

        {backgroundImage && (
          <button 
            onClick={() => setBackgroundImage(null)}
            title="Clear Map"
            className="flex items-center gap-1 ml-2 text-red-500/80 hover:text-red-400 transition-colors text-xs font-sora"
          >
            <XCircle size={14} /> Clear Map
          </button>
        )}
      </div>

      {/* Teams UI */}
      <div className="relative flex items-center pl-2 ml-2 border-l border-[#2A1F15]">
        <button 
          onClick={() => setTeamLibraryOpen(!isTeamLibraryOpen)}
          className="flex items-center gap-2 bg-[#1A0F08] border border-[#C47C2B]/30 text-[#C47C2B] hover:bg-[#C47C2B] hover:text-[#0A0705] transition-all px-3 py-1.5 rounded text-xs font-sora shadow-[0_0_10px_rgba(196,124,43,0.15)]"
        >
          <Users size={14} /> Squads
        </button>

        {isTeamLibraryOpen && (
          <div className="absolute top-[calc(100%+12px)] right-0 bg-[#0A0705] border border-[#2A1F15] p-3 rounded-[12px] shadow-2xl flex flex-col gap-3 z-50 min-w-[220px] max-h-[300px] overflow-y-auto custom-scrollbar">
            
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold">Squad Library</span>
              <span className="text-[#C47C2B] text-xs font-bold">{savedTeams.length}</span>
            </div>

            {savedTeams.length === 0 ? (
              <div className="text-[#7A6A55] text-xs text-center py-4 border border-dashed border-[#2A1F15] rounded-lg">
                No squads saved yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {savedTeams.map(team => (
                  <div key={team.id} className="flex items-center justify-between bg-[#1A0F08] border border-[#2A1F15] p-2 rounded-lg group">
                    <div 
                      className="flex items-center gap-2 cursor-grab flex-1"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify(team));
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                    >
                      <div className="w-6 h-6 rounded-full border border-white/20 overflow-hidden flex-shrink-0" style={{ borderColor: team.themeColor }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={team.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[#F5ECD7] text-xs font-inter truncate w-[110px]">{team.name}</span>
                    </div>
                    <button 
                      onClick={() => removeSavedTeam(team.id)}
                      className="text-[#7A6A55] hover:text-[#FF3B30] opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete saved squad"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={() => { setTeamLibraryOpen(false); setAddTeamModalOpen(true); }}
              className="w-full bg-[#C47C2B]/10 hover:bg-[#C47C2B]/20 text-[#C47C2B] border border-dashed border-[#C47C2B]/30 py-2 rounded-lg text-xs font-sora transition-colors mt-2"
            >
              + Create New Squad
            </button>
          </div>
        )}
      </div>

    </div>
    
    {isAddTeamModalOpen && <AddTeamModal />}
    </>
  );
}
