"use client";

import { useState, useRef, useEffect } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { X, Upload, Link as LinkIcon, Users, Check, Trash2 } from 'lucide-react';

export default function AddTeamModal() {
  const {
    addTeam, updateTeam, removeTeam, setAddTeamModalOpen, saveTeamToLibrary,
    editingTeamId, setEditingTeamId, teams,
    editingSavedTeamId, setEditingSavedTeamId, savedTeams, updateSavedTeam
  } = useBoardStore();

  const [logoUrl, setLogoUrl] = useState("");
  const [teamName, setTeamName] = useState("");
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);
  const [themeColor, setThemeColor] = useState('#C47C2B');
  const [previewError, setPreviewError] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSavedTeamId) {
      // Editing a saved library team
      const t = savedTeams.find(t => t.id === editingSavedTeamId);
      if (t) {
        setLogoUrl(t.logoUrl);
        setTeamName(t.name || '');
        setThemeColor(t.themeColor);
        setPlayerNames([
          t.players[0]?.name || '',
          t.players[1]?.name || '',
          t.players[2]?.name || '',
          t.players[3]?.name || ''
        ]);
      }
    } else if (editingTeamId) {
      const teamToEdit = teams.find(t => t.id === editingTeamId);
      if (teamToEdit) {
        setLogoUrl(teamToEdit.logoUrl);
        setTeamName(teamToEdit.name || '');
        setThemeColor(teamToEdit.themeColor);
        setPlayerNames([
          teamToEdit.players[0]?.name || '',
          teamToEdit.players[1]?.name || '',
          teamToEdit.players[2]?.name || '',
          teamToEdit.players[3]?.name || ''
        ]);
      }
    }
  }, [editingTeamId, editingSavedTeamId, teams, savedTeams]);

  const colors = ['#C47C2B', '#E8A44A', '#FFFFFF', '#FF3B30', '#34C759', '#007AFF', '#A259FF'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoUrl(event.target?.result as string);
      setPreviewError(false);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePlayerNameChange = (index: number, val: string) => {
    const newNames = [...playerNames];
    newNames[index] = val;
    setPlayerNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLogo = (!logoUrl || previewError) ? 'https://ui-avatars.com/api/?name=Team&background=0D8ABC&color=fff' : logoUrl;

    if (editingSavedTeamId) {
      // Update saved library team
      const t = savedTeams.find(t => t.id === editingSavedTeamId);
      if (t) {
        updateSavedTeam(editingSavedTeamId, {
          name: teamName.trim() || 'Custom Squad',
          logoUrl: finalLogo,
          themeColor,
          players: t.players.map((p, idx) => ({ ...p, name: playerNames[idx].trim() || `Player ${idx + 1}` }))
        });
      }
      setEditingSavedTeamId(null);
    } else if (editingTeamId) {
      const teamToEdit = teams.find(t => t.id === editingTeamId);
      if (teamToEdit) {
        updateTeam(editingTeamId, {
          name: teamName.trim() || 'Custom Squad',
          logoUrl: finalLogo,
          themeColor,
          players: teamToEdit.players.map((p, idx) => ({ ...p, name: playerNames[idx].trim() || `Player ${idx + 1}` }))
        });
      }
      setEditingTeamId(null);
    } else {
      const teamData = {
        name: teamName.trim() || 'Custom Squad',
        logoUrl: finalLogo,
        themeColor,
        players: playerNames.map((name, idx) => ({
          id: Math.random().toString(36).substring(2, 9),
          name: name.trim() || `Player ${idx + 1}`,
          x: 0,
          y: 0,
          status: 'alive' as const,
          deathType: null,
        }))
      };
      saveTeamToLibrary(teamData);
      addTeam(teamData);
    }
    setAddTeamModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0A0705] border border-[#2A1F15] w-full max-w-[400px] rounded-2xl shadow-[0_0_40px_rgba(196,124,43,0.15)] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#2A1F15]">
          <div className="flex items-center gap-2">
            <div className="bg-[#C47C2B]/20 p-1.5 rounded-lg text-[#C47C2B]">
              <Users size={18} />
            </div>
            <h2 className="text-[#F5ECD7] font-sora text-lg font-bold">{editingTeamId ? 'Edit Squad' : 'Deploy Squad'}</h2>
          </div>
          <button 
            onClick={() => { setAddTeamModalOpen(false); setEditingTeamId(null); }}
            className="text-[#7A6A55] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 p-2 rounded-md transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col p-4 gap-4">
          
          {/* Squad Name Section */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold">Squad Name</label>
            <input 
              type="text" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. OMEGA ESPORTS"
              className="bg-[#1A0F08] border border-[#2A1F15] rounded-md text-[#F5ECD7] text-xs font-inter px-3 py-1.5 w-full focus:outline-none focus:border-[#C47C2B] transition-colors"
              required
            />
          </div>

          {/* Logo Section */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold">Squad Logo</label>
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-[#1A0F08] border border-[#2A1F15] flex-shrink-0 flex items-center justify-center overflow-hidden">
                {logoUrl && !previewError ? (
                  <img 
                    src={logoUrl} 
                    alt="Logo Preview" 
                    className="w-full h-full object-cover" 
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <Users size={18} className="text-[#7A6A55]" />
                )}
              </div>
              <div className="flex flex-col flex-1 gap-1.5">
                <div className="flex bg-[#1A0F08] border border-[#2A1F15] rounded-md overflow-hidden focus-within:border-[#C47C2B] transition-colors">
                  <span className="flex items-center justify-center px-2 text-[#7A6A55]"><LinkIcon size={12} /></span>
                  <input 
                    type="url" 
                    value={logoUrl}
                    onChange={(e) => { setLogoUrl(e.target.value); setPreviewError(false); }}
                    placeholder="Paste image URL..."
                    className="bg-transparent text-[#F5ECD7] text-[11px] font-inter py-1.5 w-full focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#7A6A55] text-[10px] font-medium">OR</span>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-[10px] font-sora text-[#C47C2B] hover:text-[#E8A44A] bg-[#C47C2B]/10 hover:bg-[#C47C2B]/20 py-1 px-2 rounded transition-colors"
                  >
                    <Upload size={12} /> Upload Local Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Color */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold flex items-center justify-between">
              <span>Theme Color</span>
              <span className="bg-[#1A0F08] px-1.5 py-0.5 rounded text-[9px] uppercase">{themeColor}</span>
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              
              <label 
                className={`w-6 h-6 rounded-full border border-[#2A1F15] overflow-hidden cursor-pointer relative flex-shrink-0 transition-transform ${!colors.includes(themeColor.toUpperCase()) ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:scale-105'}`}
                title="Custom Color"
              >
                <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(red, yellow, green, cyan, blue, magenta, red)' }} />
                <input 
                  type="color" 
                  value={themeColor} 
                  onChange={(e) => setThemeColor(e.target.value)} 
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" 
                />
              </label>

              <div className="w-[1px] h-4 bg-[#2A1F15] mx-1"></div>

              <div className="flex gap-2 flex-wrap">
                {colors.map(c => (
                  <button 
                    key={c}
                    type="button"
                    onClick={() => setThemeColor(c)}
                    className={`w-6 h-6 rounded-full border border-[#2A1F15] transition-transform duration-200 ${themeColor.toUpperCase() === c.toUpperCase() ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Player Names */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[#7A6A55] text-[10px] font-inter uppercase tracking-widest font-semibold">Roster (4 Players)</label>
            <div className="grid grid-cols-2 gap-2">
              {playerNames.map((name, i) => (
                <input 
                  key={i}
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(i, e.target.value)}
                  placeholder={`Player ${i + 1} Ign`}
                  className="bg-[#1A0F08] border border-[#2A1F15] rounded-md text-[#F5ECD7] text-xs font-inter px-2 py-1.5 focus:outline-none focus:border-[#C47C2B] transition-colors"
                />
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-2 pt-3 border-t border-[#2A1F15]">
            <div>
              {editingTeamId && (
                <button 
                  type="button"
                  onClick={() => {
                    removeTeam(editingTeamId);
                    setEditingTeamId(null);
                    setAddTeamModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg font-inter text-xs font-medium text-[#FF3B30] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> Delete
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => { setAddTeamModalOpen(false); setEditingTeamId(null); }}
                className="px-4 py-1.5 rounded-lg font-inter text-xs font-medium text-[#7A6A55] hover:text-[#F5ECD7] hover:bg-[#2A1F15] transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-inter font-bold text-[#0A0705] bg-[#C47C2B] hover:bg-[#E8A44A] transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(196,124,43,0.3)]"
              >
                <Check size={14} /> {editingTeamId ? 'Save' : 'Spawn Squad'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
