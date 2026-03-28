"use client";

import { useState, useRef, useEffect } from 'react';
import { useBoardStore, MAP_CATEGORIES } from '../store/useBoardStore';
import {
  Settings, X, Users, Map, Trash2, Upload,
  Plus, Save, Link as LinkIcon, AlertCircle, GripHorizontal, Pencil, Check
} from 'lucide-react';
import AddTeamModal from './AddTeamModal';

// ─── Mini inline-edit row ─────────────────────────────────────────────────────
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
    <div className="flex flex-col gap-1.5 px-2 pb-2 bg-[#0F0A06] border-t border-[#2A1F15]">
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Map title"
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

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
export default function SidebarDrawer() {
  const {
    isSidebarOpen, setSidebarOpen,
    isAddTeamModalOpen, setAddTeamModalOpen,
    savedTeams, loadSavedTeams, removeSavedTeam,
    setEditingSavedTeamId,
    savedMaps, loadSavedMaps, addSavedMap, removeSavedMap,
    setBackgroundImage, backgroundImage,
  } = useBoardStore();

  type Tab = 'squads' | 'maps';
  const [activeTab, setActiveTab] = useState<Tab>('squads');

  // Map form
  const [mapUrl, setMapUrl] = useState('');
  const [mapTitle, setMapTitle] = useState('');
  const [mapCategory, setMapCategory] = useState('');
  const [mapError, setMapError] = useState('');
  const [mapSaving, setMapSaving] = useState(false);

  // Category filter
  const [filterCat, setFilterCat] = useState('All');

  // Inline edit state for maps
  const [editingMapId, setEditingMapId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSavedTeams();
    loadSavedMaps();
  }, [loadSavedTeams, loadSavedMaps]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const makeThumbnail = (img: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    const scale = Math.min(200 / img.width, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.65);
  };

  const handleSaveMapFromUrl = () => {
    if (!mapTitle.trim()) { setMapError('Enter a map title.'); return; }
    if (!mapUrl.trim()) { setMapError('Enter an image URL.'); return; }
    setMapSaving(true); setMapError('');
    const proxied = mapUrl.startsWith('data:') ? mapUrl : `/api/proxy-image?url=${encodeURIComponent(mapUrl)}`;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = proxied;
    img.onload = () => {
      addSavedMap({
        title: mapTitle.trim(),
        category: mapCategory.trim() || 'General',
        imageUrl: makeThumbnail(img),  // small preview for sidebar
        sourceUrl: proxied,            // full-res URL for canvas loading
      });
      setMapUrl(''); setMapTitle(''); setMapSaving(false);
    };
    img.onerror = () => { setMapError('Could not load image.'); setMapSaving(false); };
  };

  const handleFileToLibrary = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!mapTitle.trim()) { setMapError('Enter a title first.'); return; }
    const reader = new FileReader();
    reader.onload = evt => {
      const dataUrl = evt.target?.result as string;
      const img = new window.Image();
      img.src = dataUrl;
      img.onload = () => {
        addSavedMap({
          title: mapTitle.trim(),
          category: mapCategory.trim() || 'General',
          imageUrl: makeThumbnail(img),  // compressed thumbnail for sidebar
          sourceUrl: dataUrl,            // original data URL — full resolution
        });
        setMapTitle(''); setMapCategory(''); setMapError('');
      };
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

  // Load map from library to canvas BACKGROUND (full-res)
  const handleLoadMap = (map: { imageUrl: string; sourceUrl?: string }) => {
    const src = map.sourceUrl || map.imageUrl;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => setBackgroundImage(img);
    img.onerror = () => setMapError('Could not load map.');
  };

  // Filter logic
  const usedCategories = ['All', ...Array.from(new Set(savedMaps.map(m => m.category)))];
  const filteredMaps = filterCat === 'All' ? savedMaps : savedMaps.filter(m => m.category === filterCat);

  return (
    <>
      {/* Gear trigger */}
      <button
        onClick={() => setSidebarOpen(true)}
        title="Board Settings"
        className="absolute top-4 right-4 z-50 p-2.5 bg-[#0A0705CC] backdrop-blur-md border border-[#2A1F15] rounded-xl text-[#C47C2B] hover:bg-[#C47C2B] hover:text-[#0A0705] transition-all shadow-2xl hover:scale-110"
      >
        <Settings size={20} />
      </button>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
          onClick={() => setSidebarOpen(false)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => setSidebarOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside className={`
        fixed top-0 right-0 z-[70] w-[320px] h-screen
        bg-[#0A0705] border-l border-[#2A1F15]
        flex flex-col transition-transform duration-300 ease-out
        shadow-[-20px_0_60px_rgba(0,0,0,0.7)]
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
          {(['squads', 'maps'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-sora font-semibold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab ? 'text-[#C47C2B] border-[#C47C2B]' : 'text-[#7A6A55] border-transparent hover:text-[#F5ECD7]'
              }`}
            >
              {tab === 'squads' ? <Users size={13} /> : <Map size={13} />}
              {tab === 'squads' ? `Squads (${savedTeams.length})` : `Maps (${savedMaps.length})`}
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
                className="w-full flex items-center justify-center gap-2 bg-[#C47C2B]/10 hover:bg-[#C47C2B]/20 text-[#C47C2B] border border-dashed border-[#C47C2B]/40 py-2.5 rounded-lg text-xs font-sora font-semibold transition-colors"
              >
                <Plus size={13} /> Create New Squad
              </button>

              {savedTeams.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Users size={28} className="text-[#2A1F15]" />
                  <p className="text-[#7A6A55] text-xs">No squads saved yet.</p>
                </div>
              ) : (
                <>
                  <p className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-inter">Drag onto canvas to spawn</p>
                  <div className="grid grid-cols-2 gap-2">
                    {savedTeams.map(team => (
                      <div
                        key={team.id}
                        className="group relative bg-[#0F0A06] border border-[#2A1F15] hover:border-[#C47C2B]/30 rounded-lg p-2 transition-colors select-none"
                        draggable
                        onDragStart={e => {
                          e.dataTransfer.setData('application/json', JSON.stringify(team));
                          e.dataTransfer.effectAllowed = 'copy';
                          setSidebarOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1.5 cursor-grab active:cursor-grabbing">
                          <div className="w-8 h-8 rounded-full border-2 overflow-hidden flex-shrink-0" style={{ borderColor: team.themeColor }}>
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
                            {/* Edit */}
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setEditingSavedTeamId(team.id);
                                setAddTeamModalOpen(true);
                              }}
                              title="Edit squad"
                              className="p-1 text-[#7A6A55] hover:text-[#C47C2B] hover:bg-[#C47C2B]/10 rounded transition-all"
                            >
                              <Pencil size={11} />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={e => { e.stopPropagation(); removeSavedTeam(team.id); }}
                              title="Delete squad"
                              className="p-1 text-[#7A6A55] hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ MAPS TAB ════════════════════════════════════════════════ */}
          {activeTab === 'maps' && (
            <div className="p-3 flex flex-col gap-3">

              {/* Active background status */}
              {backgroundImage && (
                <div className="flex items-center justify-between bg-[#C47C2B]/10 border border-[#C47C2B]/20 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#C47C2B] animate-pulse flex-shrink-0" />
                    <span className="text-[#C47C2B] text-[11px] font-semibold">Background active</span>
                  </div>
                  <button onClick={() => setBackgroundImage(null)} className="text-[#7A6A55] hover:text-[#FF3B30] transition-colors">
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* Quick load: Upload file directly to canvas background */}
              <div className="flex gap-2">
                <input ref={bgFileRef} type="file" accept="image/*" className="hidden" onChange={handleBgFileUpload} />
                <button
                  onClick={() => bgFileRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#1A0F08] hover:bg-[#2A1F15] border border-[#2A1F15] text-[#F5ECD7] py-2 rounded-lg text-[11px] font-sora transition-colors"
                >
                  <Upload size={12} /> Upload Map to Canvas
                </button>
              </div>

              {/* Save to library form */}
              <div className="bg-[#0F0A06] border border-[#2A1F15] rounded-lg p-3 flex flex-col gap-2">
                <p className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-semibold">Save Map to Library</p>

                <input
                  value={mapTitle}
                  onChange={e => { setMapTitle(e.target.value); setMapError(''); }}
                  placeholder="Map title (e.g. Erangel)"
                  className="bg-[#1A0F08] border border-[#2A1F15] rounded text-[#F5ECD7] text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-[#C47C2B] transition-colors"
                />

                {/* Category as text input with datalist */}
                <input
                  value={mapCategory}
                  onChange={e => setMapCategory(e.target.value)}
                  placeholder="Category (e.g. PUBG MOBILE)"
                  list="sidebar-cat-list"
                  className="bg-[#1A0F08] border border-[#2A1F15] rounded text-[#F5ECD7] text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-[#C47C2B] transition-colors"
                />
                <datalist id="sidebar-cat-list">
                  {MAP_CATEGORIES.map(c => <option key={c} value={c} />)}
                </datalist>

                <div className="flex bg-[#1A0F08] border border-[#2A1F15] rounded overflow-hidden focus-within:border-[#C47C2B] transition-colors">
                  <span className="flex items-center px-2 text-[#7A6A55]"><LinkIcon size={11} /></span>
                  <input
                    value={mapUrl}
                    onChange={e => { setMapUrl(e.target.value); setMapError(''); }}
                    placeholder="Paste image URL..."
                    className="bg-transparent text-[#F5ECD7] text-[11px] py-1.5 w-full focus:outline-none"
                    onKeyDown={e => { if (e.key === 'Enter') handleSaveMapFromUrl(); }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveMapFromUrl}
                    disabled={mapSaving}
                    className="flex-1 flex items-center justify-center gap-1 bg-[#C47C2B]/10 hover:bg-[#C47C2B]/20 text-[#C47C2B] border border-[#C47C2B]/30 py-1.5 rounded text-[11px] font-sora font-semibold transition-colors disabled:opacity-50"
                  >
                    <Save size={11} /> {mapSaving ? 'Saving…' : 'Save URL'}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileToLibrary} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1 bg-[#2A1F15] hover:bg-[#3A2F25] text-[#F5ECD7] py-1.5 rounded text-[11px] font-sora transition-colors"
                  >
                    <Upload size={11} /> Upload
                  </button>
                </div>

                {mapError && (
                  <div className="flex items-start gap-1.5 text-red-400 text-[11px] bg-red-500/10 border border-red-500/20 px-2 py-1.5 rounded">
                    <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />{mapError}
                  </div>
                )}
              </div>

              {/* Saved maps section */}
              {savedMaps.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <Map size={26} className="text-[#2A1F15]" />
                  <p className="text-[#7A6A55] text-xs">No maps in library yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-inter">Click or drag a map onto the canvas</p>

                  {/* Category filter dropdown */}
                  <select
                    value={filterCat}
                    onChange={e => setFilterCat(e.target.value)}
                    className="bg-[#1A0F08] border border-[#2A1F15] rounded text-[#F5ECD7] text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-[#C47C2B] transition-colors appearance-none w-full"
                  >
                    {usedCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  {filteredMaps.length === 0 ? (
                    <p className="text-[#7A6A55] text-[11px] text-center py-3">No maps in this category.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {filteredMaps.map(map => (
                        <div key={map.id} className="relative flex flex-col rounded-lg overflow-hidden border border-[#2A1F15] hover:border-[#C47C2B]/40 transition-colors bg-[#0F0A06]">
                          {/* Thumbnail */}
                          <div
                            className="cursor-pointer relative group"
                            draggable
                            onDragStart={e => {
                              e.dataTransfer.setData(
                                'application/albus-map-bg',
                                JSON.stringify({ sourceUrl: map.sourceUrl || map.imageUrl })
                              );
                              e.dataTransfer.effectAllowed = 'copy';
                              setSidebarOpen(false);
                            }}
                            onClick={() => { handleLoadMap(map); setSidebarOpen(false); }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={map.imageUrl} alt={map.title} className="w-full h-[60px] object-cover" draggable={false} />
                            <div className="absolute inset-0 bg-[#C47C2B]/0 group-hover:bg-[#C47C2B]/20 flex items-center justify-center transition-colors">
                              <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] font-sora font-bold drop-shadow-xl transition-opacity">Load</span>
                            </div>
                          </div>

                          {/* Inline edit row */}
                          {editingMapId === map.id ? (
                            <MapEditRow
                              mapId={map.id}
                              initialTitle={map.title}
                              initialCategory={map.category}
                              onDone={() => setEditingMapId(null)}
                            />
                          ) : (
                            /* Footer row */
                            <div className="flex items-center px-1.5 py-1 gap-1">
                              <span className="text-[#F5ECD7] text-[10px] font-inter truncate flex-1">{map.title}</span>
                              {/* Edit */}
                              <button
                                onClick={e => { e.stopPropagation(); setEditingMapId(map.id); }}
                                title="Edit map info"
                                className="p-0.5 text-[#7A6A55] hover:text-[#C47C2B] transition-colors flex-shrink-0"
                              >
                                <Pencil size={10} />
                              </button>
                              {/* Delete */}
                              <button
                                onClick={e => { e.stopPropagation(); removeSavedMap(map.id); }}
                                title="Delete map"
                                className="p-0.5 text-[#7A6A55] hover:text-red-400 transition-colors flex-shrink-0"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-[#2A1F15] px-4 py-2">
          <p className="text-[#3A2F25] text-[10px] font-inter text-center tracking-wider">ALBUS TACTICAL BOARD · PHASE 3</p>
        </div>
      </aside>

      {isAddTeamModalOpen && <AddTeamModal />}
    </>
  );
}
