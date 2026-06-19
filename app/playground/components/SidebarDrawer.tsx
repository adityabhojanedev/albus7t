"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useBoardStore, MAP_CATEGORIES, SavedMap } from '../store/useBoardStore';
import {
  Settings, X, Users, Map, Trash2, Upload,
  Plus, Save, Link as LinkIcon, AlertCircle, GripHorizontal, Pencil, Check,
  Keyboard, Image as ImageIcon, ArrowRight,
  Edit2, CheckSquare, Square
} from 'lucide-react';
import AddTeamModal from './AddTeamModal';
import { useHotkeyStore } from '../store/useHotkeyStore';

// ─── Animated drag card ───────────────────────────────────────────────────────
function DragCard({
  children,
  onDragStart,
  onDragEnd,
  className = '',
}: {
  children: React.ReactNode;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  className?: string;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={e => { setDragging(true); onDragStart(e); }}
      onDragEnd={e => { setDragging(false); onDragEnd?.(e); }}
      className={`
        group relative select-none cursor-grab active:cursor-grabbing
        transition-all duration-200 ease-out
        ${dragging
          ? 'opacity-50 scale-95 rotate-1 ring-2 ring-[#C47C2B]/60'
          : 'opacity-100 scale-100 rotate-0 hover:scale-[1.02] hover:-translate-y-0.5'
        }
        ${className}
      `}
      style={{
        filter: dragging ? 'drop-shadow(0 8px 16px rgba(196,124,43,0.4))' : undefined,
      }}
    >
      {children}
    </div>
  );
}

// ─── Inline edit row ──────────────────────────────────────────────────────────
function MapEditRow({ mapId, initialTitle, initialCategory, onDone }: {
  mapId: string;
  initialTitle: string;
  initialCategory: string;
  onDone: () => void;
}) {
  const { updateSavedMap } = useBoardStore();
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState(initialCategory);

  const save = () => {
    if (title.trim()) updateSavedMap(mapId, { title: title.trim(), category: category.trim() || 'General' });
    onDone();
  };

  return (
    <div className="flex flex-col gap-1.5 px-2 pb-2 bg-[#0F0A06] border-t border-[#2A1F15] animate-in fade-in slide-in-from-top-1 duration-150">
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="bg-[#1A0F08] border border-[#2A1F15] rounded text-[#F5ECD7] text-[11px] px-2 py-1 focus:outline-none focus:border-[#C47C2B] w-full mt-2"
      />
      <input
        value={category}
        onChange={e => setCategory(e.target.value)}
        placeholder="Category"
        list="cat-suggestions"
        className="bg-[#1A0F08] border border-[#2A1F15] rounded text-[#F5ECD7] text-[11px] px-2 py-1 focus:outline-none focus:border-[#C47C2B] w-full"
      />
      <datalist id="cat-suggestions">
        {MAP_CATEGORIES.map(c => <option key={c} value={c} />)}
      </datalist>
      <div className="flex gap-1.5">
        <button onClick={save} className="flex-1 flex items-center justify-center gap-1 bg-[#C47C2B]/20 hover:bg-[#C47C2B]/30 text-[#C47C2B] text-[10px] font-sora py-1 rounded transition-colors">
          <Check size={10} /> Save
        </button>
        <button onClick={onDone} className="flex-1 text-[#7A6A55] hover:text-[#F5ECD7] text-[10px] font-sora py-1 bg-[#1A0F08] rounded transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Add form shared component ────────────────────────────────────────────────
function AddImageForm({
  label,
  placeholder,
  onSave,
  categories,
  showCategory = true,
  requireTitle = true,
}: {
  label: string;
  placeholder: string;
  onSave: (data: { title: string; category: string; imageUrl: string; sourceUrl: string }) => void;
  categories: string[];
  showCategory?: boolean;
  requireTitle?: boolean;
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const makeThumbnail = (img: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    const scale = Math.min(200 / img.width, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.65);
  };

  const resolvedTitle = () => title.trim() || (requireTitle ? '' : 'Image');
  const resolvedCategory = () => (showCategory ? category.trim() : '') || 'General';

  const handleUrl = () => {
    if (requireTitle && !title.trim()) { setError('Enter a title.'); return; }
    if (!url.trim()) { setError('Enter an image URL.'); return; }
    setSaving(true); setError('');
    const proxied = url.startsWith('data:') ? url : `/api/proxy-image?url=${encodeURIComponent(url)}`;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = proxied;
    img.onload = () => {
      onSave({ title: resolvedTitle(), category: resolvedCategory(), imageUrl: makeThumbnail(img), sourceUrl: proxied });
      setTitle(''); setCategory(''); setUrl(''); setSaving(false);
    };
    img.onerror = () => { setError('Could not load image.'); setSaving(false); };
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (requireTitle && !title.trim()) { setError('Enter a title first.'); return; }
    const reader = new FileReader();
    reader.onload = evt => {
      const dataUrl = evt.target?.result as string;
      const img = new window.Image();
      img.src = dataUrl;
      img.onload = () => {
        onSave({ title: resolvedTitle() || file.name.replace(/\.[^.]+$/, ''), category: resolvedCategory(), imageUrl: makeThumbnail(img), sourceUrl: dataUrl });
        setTitle(''); setCategory(''); setError('');
      };
    };
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="bg-[#0F0A06] border border-[#2A1F15] rounded-xl p-3 flex flex-col gap-2">
      <p className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-semibold">{label}</p>
      <input
        value={title}
        onChange={e => { setTitle(e.target.value); setError(''); }}
        placeholder={placeholder}
        className="bg-[#1A0F08] border border-[#2A1F15] rounded-lg text-[#F5ECD7] text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-[#C47C2B] transition-colors w-full"
      />
      {showCategory && (
        <>
          <input
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="Category (e.g. PUBG MOBILE)"
            list="form-cat-list"
            className="bg-[#1A0F08] border border-[#2A1F15] rounded-lg text-[#F5ECD7] text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-[#C47C2B] transition-colors w-full"
          />
          <datalist id="form-cat-list">
            {categories.map(c => <option key={c} value={c} />)}
          </datalist>
        </>
      )}
      <div className="flex bg-[#1A0F08] border border-[#2A1F15] rounded-lg overflow-hidden focus-within:border-[#C47C2B] transition-colors">
        <span className="flex items-center px-2 text-[#7A6A55]"><LinkIcon size={11} /></span>
        <input
          value={url}
          onChange={e => { setUrl(e.target.value); setError(''); }}
          placeholder="Paste image URL..."
          className="bg-transparent text-[#F5ECD7] text-[11px] py-1.5 w-full focus:outline-none"
          onKeyDown={e => { if (e.key === 'Enter') handleUrl(); }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleUrl}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-1 bg-[#C47C2B]/10 hover:bg-[#C47C2B]/20 text-[#C47C2B] border border-[#C47C2B]/30 py-1.5 rounded-lg text-[11px] font-sora font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 active:scale-[0.98]"
        >
          <Save size={11} /> {saving ? 'Saving…' : 'Save URL'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button
          onClick={() => fileRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-1 bg-[#2A1F15] hover:bg-[#3A2F25] text-[#F5ECD7] py-1.5 rounded-lg text-[11px] font-sora transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Upload size={11} /> Upload
        </button>
      </div>
      {error && (
        <div className="flex items-start gap-1.5 text-red-400 text-[11px] bg-red-500/10 border border-red-500/20 px-2 py-1.5 rounded-lg animate-in fade-in duration-200">
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />{error}
        </div>
      )}
    </div>
  );
}


// ─── Main Sidebar ─────────────────────────────────────────────────────────────
export default function SidebarDrawer() {
  const {
    isSidebarOpen, setSidebarOpen,
    isAddTeamModalOpen, setAddTeamModalOpen,
    savedTeams, loadSavedTeams, removeSavedTeam,
    setEditingSavedTeamId,
    savedMaps, loadSavedMaps, addSavedMap, removeSavedMap, updateSavedMap,
    setBackgroundImage, backgroundImage,
    addElement, commitHistory,
  } = useBoardStore();

  const { setEditorOpen } = useHotkeyStore();

  type Tab = 'squads' | 'maps' | 'gallery';
  const [activeTab, setActiveTab] = useState<Tab>('squads');
  const [filterCat, setFilterCat] = useState('All');
  const [editingMapId, setEditingMapId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedGalleryIds, setSelectedGalleryIds] = useState<Set<string>>(new Set());

  // Quick-upload refs
  const bgFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSavedTeams();
    loadSavedMaps();
  }, [loadSavedTeams, loadSavedMaps]);

  // Filtered lists by itemType
  const mapItems    = savedMaps.filter(m => (m.itemType ?? 'map') === 'map');
  const galleryItems = savedMaps.filter(m => m.itemType === 'gallery');

  const usedMapCats = ['All', ...Array.from(new Set(mapItems.map(m => m.category)))];
  const filteredMapItems = filterCat === 'All' ? mapItems : mapItems.filter(m => m.category === filterCat);

  // Move between sections
  const moveItem = useCallback((id: string, toType: 'map' | 'gallery') => {
    setMovingId(id);
    setTimeout(() => {
      updateSavedMap(id, { itemType: toType });
      setMovingId(null);
    }, 280);
  }, [updateSavedMap]);

  // Load as background
  const handleLoadMap = (map: SavedMap) => {
    const src = map.sourceUrl || map.imageUrl;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => setBackgroundImage(img);
  };

  // Add to canvas as element
  const addToCanvas = useCallback((map: SavedMap) => {
    const src = map.sourceUrl || map.imageUrl;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      const w = Math.min(img.width, 600);
      const h = img.height * (w / img.width);
      addElement({
        id: Math.random().toString(36).substring(2, 9),
        type: 'image',
        image: img,
        x: 80 + Math.random() * 80,
        y: 80 + Math.random() * 80,
        width: w,
        height: h,
        color: '',
        strokeWidth: 0,
      });
      commitHistory();
      setSidebarOpen(false);
    };
  }, [addElement, commitHistory, setSidebarOpen]);

  // Quick-upload background
  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const img = new window.Image();
      img.src = evt.target?.result as string;
      img.onload = () => setBackgroundImage(img);
    };
    reader.readAsDataURL(file);
    if (bgFileRef.current) bgFileRef.current.value = '';
  };

  const tabCount: Record<Tab, number> = {
    squads: savedTeams.length,
    maps: mapItems.length,
    gallery: galleryItems.length,
  };

  return (
    <>
      {/* Gear trigger */}
      <button
        onClick={() => setSidebarOpen(true)}
        title="Board Settings"
        className="absolute top-4 right-4 z-50 p-2.5 bg-[#0A0705CC] backdrop-blur-md border border-[#2A1F15] rounded-xl text-[#C47C2B] hover:bg-[#C47C2B] hover:text-[#0A0705] transition-all duration-200 shadow-2xl hover:scale-110 hover:shadow-[0_0_20px_rgba(196,124,43,0.4)]"
      >
        <Settings size={20} />
      </button>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[3px]"
          onClick={() => setSidebarOpen(false)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => setSidebarOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside className={`
        fixed top-0 right-0 z-[70] w-[320px] h-screen
        bg-[#0A0705] border-l border-[#2A1F15]
        flex flex-col
        transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
        shadow-[-24px_0_80px_rgba(0,0,0,0.8)]
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#2A1F15]">
          <div className="flex items-center gap-2">
            <div className="bg-[#C47C2B]/20 p-1.5 rounded-lg">
              <Settings size={14} className="text-[#C47C2B]" />
            </div>
            <span className="text-[#F5ECD7] font-sora font-bold text-sm">Board Settings</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-[#7A6A55] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex border-b border-[#2A1F15]">
          {(['squads', 'maps', 'gallery'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-sora font-semibold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab
                  ? 'text-[#C47C2B] border-[#C47C2B] bg-[#C47C2B]/5'
                  : 'text-[#7A6A55] border-transparent hover:text-[#F5ECD7] hover:bg-[#1A0F08]'
              }`}
            >
              <span className="flex items-center gap-1">
                {tab === 'squads' ? <Users size={12} /> : tab === 'maps' ? <Map size={12} /> : <ImageIcon size={12} />}
                {tab}
              </span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-[#C47C2B]/20 text-[#C47C2B]' : 'bg-[#1A0F08] text-[#3A2F25]'
              }`}>
                {tabCount[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">

          {/* ══ SQUADS TAB ══════════════════════════════════════════════ */}
          {activeTab === 'squads' && (
            <div className="p-3 flex flex-col gap-3">
              <button
                onClick={() => { setSidebarOpen(false); setEditingSavedTeamId(null); setAddTeamModalOpen(true); }}
                className="w-full flex items-center justify-center gap-2 bg-[#C47C2B]/10 hover:bg-[#C47C2B]/20 text-[#C47C2B] border border-dashed border-[#C47C2B]/40 py-2.5 rounded-xl text-xs font-sora font-semibold transition-all hover:scale-[1.01] hover:shadow-[0_0_12px_rgba(196,124,43,0.2)] active:scale-[0.99]"
              >
                <Plus size={13} /> Create New Squad
              </button>

              {savedTeams.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#1A0F08] border border-[#2A1F15] flex items-center justify-center">
                    <Users size={28} className="text-[#2A1F15]" />
                  </div>
                  <p className="text-[#7A6A55] text-xs">No squads saved yet.</p>
                </div>
              ) : (
                <>
                  <p className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-inter flex items-center gap-1.5">
                    <GripHorizontal size={10} /> Drag onto canvas to spawn
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {savedTeams.map(team => (
                      <DragCard
                        key={team.id}
                        className="bg-[#0F0A06] border border-[#2A1F15] hover:border-[#C47C2B]/40 rounded-xl p-2 hover:shadow-[0_0_16px_rgba(196,124,43,0.12)]"
                        onDragStart={e => {
                          e.dataTransfer.setData('application/json', JSON.stringify(team));
                          e.dataTransfer.effectAllowed = 'copy';
                          setTimeout(() => setSidebarOpen(false), 100);
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-8 h-8 rounded-full border-2 overflow-hidden flex-shrink-0 shadow-lg" style={{ borderColor: team.themeColor }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={team.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#F5ECD7] text-[11px] font-sora font-semibold truncate">{team.name}</p>
                            <p className="text-[#7A6A55] text-[10px]">{team.players.length} players</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <GripHorizontal size={12} className="text-[#3A2F25] group-hover:text-[#C47C2B]/40 transition-colors" />
                          <div className="flex gap-1">
                            <button
                              onClick={e => { e.stopPropagation(); setEditingSavedTeamId(team.id); setAddTeamModalOpen(true); }}
                              title="Edit squad"
                              className="p-1 text-[#7A6A55] hover:text-[#C47C2B] hover:bg-[#C47C2B]/10 rounded transition-all"
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); removeSavedTeam(team.id); }}
                              title="Delete squad"
                              className="p-1 text-[#7A6A55] hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </DragCard>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ MAPS TAB ════════════════════════════════════════════════ */}
          {activeTab === 'maps' && (
            <div className="p-3 flex flex-col gap-3">

              {/* Active background badge */}
              {backgroundImage && (
                <div className="flex items-center justify-between bg-[#C47C2B]/10 border border-[#C47C2B]/25 px-3 py-2 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#C47C2B] animate-pulse flex-shrink-0" />
                    <span className="text-[#C47C2B] text-[11px] font-semibold">Background active</span>
                  </div>
                  <button onClick={() => setBackgroundImage(null)} className="text-[#7A6A55] hover:text-[#FF3B30] transition-colors p-1">
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* Quick set background from file */}
              <div className="flex gap-2">
                <input ref={bgFileRef} type="file" accept="image/*" className="hidden" onChange={handleBgFileUpload} />
                <button
                  onClick={() => bgFileRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#1A0F08] hover:bg-[#2A1F15] border border-[#2A1F15] hover:border-[#C47C2B]/30 text-[#F5ECD7] py-2 rounded-xl text-[11px] font-sora transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Upload size={12} className="text-[#C47C2B]" /> Upload & Set Background
                </button>
              </div>

              {/* Save map form */}
              <AddImageForm
                label="Save Map to Library"
                placeholder="Map title (e.g. Erangel)"
                categories={MAP_CATEGORIES}
                onSave={data => addSavedMap({ ...data, itemType: 'map' })}
              />

              {/* Map grid */}
              {mapItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#1A0F08] border border-[#2A1F15] flex items-center justify-center">
                    <Map size={24} className="text-[#2A1F15]" />
                  </div>
                  <p className="text-[#7A6A55] text-xs max-w-[180px] leading-relaxed">No maps saved. Add one above or move images from Gallery.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Header row: hint label + category filter */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-inter whitespace-nowrap flex-shrink-0">
                      Drag or click to set
                    </span>
                    <select
                      value={filterCat}
                      onChange={e => setFilterCat(e.target.value)}
                      className="bg-[#1A0F08] border border-[#2A1F15] rounded-lg text-[#F5ECD7] text-[10px] px-2 py-1 focus:outline-none focus:border-[#C47C2B] transition-colors appearance-none flex-shrink-0"
                    >
                      {usedMapCats.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {filteredMapItems.length === 0 ? (
                    <p className="text-[#7A6A55] text-[11px] text-center py-3">No maps in this category.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {filteredMapItems.map(map => (
                        <DragCard
                          key={map.id}
                          className={`
                            flex flex-col rounded-xl overflow-hidden border bg-[#0F0A06]
                            hover:shadow-[0_0_16px_rgba(196,124,43,0.15)]
                            ${movingId === map.id ? 'opacity-0 scale-90' : 'border-[#2A1F15] hover:border-[#C47C2B]/50'}
                          `}
                          onDragStart={e => {
                            e.dataTransfer.setData(
                              'application/albus-map-bg',
                              JSON.stringify({ sourceUrl: map.sourceUrl || map.imageUrl })
                            );
                            e.dataTransfer.effectAllowed = 'copy';
                            setTimeout(() => setSidebarOpen(false), 100);
                          }}
                        >
                          {/* Thumbnail */}
                          <div className="relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={map.imageUrl}
                              alt={map.title}
                              className="w-full h-[68px] object-cover transition-transform duration-300 group-hover:scale-110"
                              draggable={false}
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 flex items-center justify-center transition-all duration-200">
                              <button
                                onClick={() => { handleLoadMap(map); setSidebarOpen(false); }}
                                className="opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 bg-[#C47C2B] hover:bg-[#E8A44A] text-[#0A0705] text-[10px] font-sora font-bold px-2.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5"
                              >
                                <Map size={10} /> Set Background
                              </button>
                            </div>
                            {/* Category badge */}
                            <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full group-hover:opacity-0 transition-opacity duration-200 max-w-[calc(100%-8px)]">
                              <span className="block text-[#C47C2B] text-[8px] font-inter font-semibold uppercase truncate">
                                {map.category}
                              </span>
                            </div>
                          </div>

                          {/* Inline edit / footer */}
                          {editingMapId === map.id ? (
                            <MapEditRow
                              mapId={map.id}
                              initialTitle={map.title}
                              initialCategory={map.category}
                              onDone={() => setEditingMapId(null)}
                            />
                          ) : (
                            <div className="flex items-center gap-1 px-1.5 py-1.5">
                              <span className="text-[#F5ECD7] text-[10px] font-inter truncate flex-1">{map.title}</span>
                              {/* Move to Gallery */}
                              <button
                                onClick={e => { e.stopPropagation(); moveItem(map.id, 'gallery'); }}
                                title="Move to Gallery"
                                className="p-0.5 text-[#7A6A55] hover:text-[#C47C2B] hover:bg-[#C47C2B]/10 rounded transition-all flex-shrink-0 group/mv"
                              >
                                <ImageIcon size={10} />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); setEditingMapId(map.id); }}
                                title="Edit"
                                className="p-0.5 text-[#7A6A55] hover:text-[#C47C2B] transition-colors flex-shrink-0"
                              >
                                <Pencil size={10} />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); removeSavedMap(map.id); }}
                                title="Delete"
                                className="p-0.5 text-[#7A6A55] hover:text-red-400 transition-colors flex-shrink-0"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          )}
                        </DragCard>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ══ GALLERY TAB ════════════════════════════════════════════ */}
          {activeTab === 'gallery' && (
            <div className="p-3 flex flex-col gap-3">

              {/* Header description */}
              <div className="bg-[#1A0F08] border border-[#2A1F15] rounded-xl px-3 py-2.5 flex items-start gap-2.5">
                <ImageIcon size={14} className="text-[#C47C2B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#F5ECD7] text-[11px] font-sora font-semibold">Image Gallery</p>
                  <p className="text-[#7A6A55] text-[10px] font-inter leading-relaxed mt-0.5">
                    Drag or click images to place them as canvas elements. Drag onto the canvas or use the overlay button.
                  </p>
                </div>
              </div>

              {/* Save gallery image form */}
              <AddImageForm
                label="Add Image to Gallery"
                placeholder="Title (optional)"
                categories={[]}
                showCategory={false}
                requireTitle={false}
                onSave={data => addSavedMap({ ...data, itemType: 'gallery' })}
              />

              {galleryItems.length > 0 && (
                <div className="flex items-center justify-between mt-1 mb-1 px-1">
                  <span className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-inter font-semibold">Saved Images</span>
                  <button
                    onClick={() => {
                      if (isMultiSelect) setSelectedGalleryIds(new Set());
                      setIsMultiSelect(!isMultiSelect);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-[10px] font-sora font-semibold ${isMultiSelect ? 'text-[#C47C2B] bg-[#C47C2B]/10' : 'text-[#7A6A55] hover:text-[#F5ECD7] hover:bg-[#2A1F15]'}`}
                  >
                    {isMultiSelect ? <CheckSquare size={12} /> : <Square size={12} />}
                    Select Multiple
                  </button>
                </div>
              )}

              {/* Gallery grid */}
              {galleryItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#1A0F08] border border-[#2A1F15] flex items-center justify-center">
                    <ImageIcon size={24} className="text-[#2A1F15]" />
                  </div>
                  <p className="text-[#7A6A55] text-xs max-w-[180px] leading-relaxed">
                    No gallery images yet. Add some above or move maps from the Maps tab.
                  </p>
                  <button
                    onClick={() => setActiveTab('maps')}
                    className="flex items-center gap-1.5 text-[#C47C2B] text-[11px] font-sora hover:underline transition-all"
                  >
                    View Maps <ArrowRight size={11} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {galleryItems.map(map => (
                    <DragCard
                      key={map.id}
                      className={`
                        flex flex-col rounded-xl overflow-hidden border bg-[#0F0A06]
                        hover:shadow-[0_0_20px_rgba(196,124,43,0.18)]
                        ${movingId === map.id ? 'opacity-0 scale-90' : 'border-[#2A1F15] hover:border-[#C47C2B]/50'}
                      `}
                      onDragStart={e => {
                        // If we are in multi-select and dragging a selected item, drag all selected
                        const isDraggingSelectedGroup = isMultiSelect && selectedGalleryIds.has(map.id);
                        const itemsToDrag = isDraggingSelectedGroup 
                          ? galleryItems.filter(i => selectedGalleryIds.has(i.id))
                          : [map];

                        e.dataTransfer.setData(
                          'application/albus-gallery-images',
                          JSON.stringify(itemsToDrag.map(i => ({ sourceUrl: i.sourceUrl || i.imageUrl, title: i.title })))
                        );
                        e.dataTransfer.effectAllowed = 'copy';

                        // Custom drag image for multi-select (stack effect)
                        if (itemsToDrag.length > 1) {
                          const dragGhost = document.createElement('div');
                          dragGhost.style.position = 'absolute';
                          dragGhost.style.top = '-1000px';
                          dragGhost.style.left = '-1000px';
                          dragGhost.style.pointerEvents = 'none';
                          dragGhost.style.display = 'flex';
                          dragGhost.style.width = '100px';
                          dragGhost.style.height = '100px';

                          // Create stacked images up to 3
                          itemsToDrag.slice(0, 3).forEach((item, index) => {
                            const img = document.createElement('img');
                            img.src = item.imageUrl;
                            img.style.position = 'absolute';
                            img.style.width = '80px';
                            img.style.height = '80px';
                            img.style.objectFit = 'cover';
                            img.style.borderRadius = '8px';
                            img.style.border = '2px solid #C47C2B';
                            img.style.transform = `translate(${index * 10}px, ${index * 10}px) rotate(${index * 5}deg)`;
                            img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
                            img.style.zIndex = (3 - index).toString();
                            dragGhost.appendChild(img);
                          });

                          // Add a badge indicating count
                          const badge = document.createElement('div');
                          badge.textContent = `+${itemsToDrag.length}`;
                          badge.style.position = 'absolute';
                          badge.style.bottom = '5px';
                          badge.style.right = '5px';
                          badge.style.backgroundColor = '#C47C2B';
                          badge.style.color = '#0A0705';
                          badge.style.fontSize = '12px';
                          badge.style.fontWeight = 'bold';
                          badge.style.padding = '2px 6px';
                          badge.style.borderRadius = '12px';
                          badge.style.zIndex = '10';
                          dragGhost.appendChild(badge);

                          document.body.appendChild(dragGhost);
                          e.dataTransfer.setDragImage(dragGhost, 50, 50);

                          // Cleanup ghost element shortly after drag starts
                          setTimeout(() => {
                            if (dragGhost.parentNode) document.body.removeChild(dragGhost);
                          }, 100);
                        }

                        // Close sidebar shortly after dragging starts
                        setTimeout(() => {
                          setSidebarOpen(false);
                          setIsMultiSelect(false);
                          setSelectedGalleryIds(new Set());
                        }, 200);
                      }}
                    >
                      {/* Thumbnail */}
                      <div className="relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={map.imageUrl}
                          alt={map.title}
                          className="w-full h-[72px] object-cover transition-transform duration-300 group-hover:scale-110"
                          draggable={false}
                        />
                        {/* Overlay */}
                        <div className={`absolute inset-0 transition-all duration-200 ${isMultiSelect && selectedGalleryIds.has(map.id) ? 'bg-[#C47C2B]/20 border-2 border-[#C47C2B]' : 'bg-black/0 group-hover:bg-black/55'}`}>
                          {isMultiSelect ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newSet = new Set(selectedGalleryIds);
                                if (newSet.has(map.id)) newSet.delete(map.id);
                                else newSet.add(map.id);
                                setSelectedGalleryIds(newSet);
                              }}
                              className={`absolute top-2 right-2 p-1 rounded-md transition-colors ${selectedGalleryIds.has(map.id) ? 'bg-[#C47C2B] text-[#0A0705]' : 'bg-black/50 text-white/50 hover:text-white'}`}
                            >
                              <Check size={14} />
                            </button>
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <button
                                onClick={() => addToCanvas(map)}
                                className="opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 bg-[#C47C2B] hover:bg-[#E8A44A] text-[#0A0705] text-[10px] font-sora font-bold px-2.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5"
                              >
                                <ImageIcon size={10} /> Add to Canvas
                              </button>
                            </div>
                          )}
                        </div>
                        {/* Category badge */}
                        <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full group-hover:opacity-0 transition-opacity duration-200 max-w-[calc(100%-8px)]">
                          <span className="block text-[#C47C2B] text-[8px] font-inter font-semibold uppercase truncate">
                            {map.category}
                          </span>
                        </div>
                      </div>

                      {/* Inline edit / footer */}
                      {editingMapId === map.id ? (
                        <MapEditRow
                          mapId={map.id}
                          initialTitle={map.title}
                          initialCategory={map.category}
                          onDone={() => setEditingMapId(null)}
                        />
                      ) : (
                        <div className="flex items-center gap-1 px-1.5 py-1.5">
                          <span className="text-[#F5ECD7] text-[10px] font-inter truncate flex-1">{map.title}</span>
                          {/* Edit */}
                          <button
                            onClick={e => { e.stopPropagation(); setEditingMapId(map.id); }}
                            title="Edit"
                            className="p-0.5 text-[#7A6A55] hover:text-[#C47C2B] hover:bg-[#C47C2B]/10 rounded transition-all flex-shrink-0"
                          >
                            <Edit2 size={10} />
                          </button>
                          {/* Move to Maps */}
                          <button
                            onClick={e => { e.stopPropagation(); moveItem(map.id, 'map'); }}
                            title="Move to Maps"
                            className="p-0.5 text-[#7A6A55] hover:text-[#C47C2B] hover:bg-[#C47C2B]/10 rounded transition-all flex-shrink-0"
                          >
                            <Map size={10} />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); removeSavedMap(map.id); }}
                            title="Delete"
                            className="p-0.5 text-[#7A6A55] hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      )}
                    </DragCard>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-[#2A1F15] px-4 py-2 flex flex-col gap-2">
          <button
            onClick={() => { setEditorOpen(true); setSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-2 bg-[#1A0F08] hover:bg-[#2A1F15] border border-[#2A1F15] hover:border-[#C47C2B]/30 text-[#7A6A55] hover:text-[#C47C2B] py-2 rounded-lg text-xs font-sora font-semibold transition-all"
          >
            <Keyboard size={13} />
            Customize Shortcuts
          </button>
          <p className="text-[#3A2F25] text-[10px] font-inter text-center tracking-wider">ALBUS TACTICAL BOARD · PHASE 5</p>
        </div>
      </aside>

      {isAddTeamModalOpen && <AddTeamModal />}
    </>
  );
}
