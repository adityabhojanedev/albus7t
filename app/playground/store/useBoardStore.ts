import { create } from 'zustand';

export type Tool = 'select' | 'pan' | 'pen' | 'eraser' | 'laser' | 'circle' | 'rectangle';

export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  type: 'line' | 'eraser' | 'circle' | 'rectangle' | 'image';
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  isLaser?: boolean;
  color: string;
  strokeWidth: number;
  fillType?: 'transparent' | 'solid';
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
  image?: HTMLImageElement;
  crop?: { x: number; y: number; width: number; height: number };
}

export interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  scaleX?: number;
  scaleY?: number;
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string; // the base64 or URL
  themeColor: string;
  players: Player[];
}

interface BoardState {
  activeTool: Tool;
  setTool: (tool: Tool) => void;
  
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;

  selectedPlayerId: string | null;
  setSelectedPlayerId: (id: string | null) => void;

  editingTeamId: string | null;
  setEditingTeamId: (id: string | null) => void;

  croppingElementId: string | null;
  setCroppingElementId: (id: string | null) => void;

  eraserSize: number;
  setEraserSize: (size: number) => void;

  shapeFillType: 'transparent' | 'solid';
  toggleShapeFillType: () => void;

  strokeColor: string;
  setStrokeColor: (color: string) => void;
  
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;

  zoom: number;
  setZoom: (zoom: number) => void;
  setZoomByWheel: (scaleBy: number, pointer: Point, stagePos: Point) => void;
  stagePosition: Point;
  setStagePosition: (pos: Point) => void;

  backgroundImage: HTMLImageElement | null;
  setBackgroundImage: (img: HTMLImageElement | null) => void;

  elements: DrawingElement[];
  addElement: (el: DrawingElement) => void;
  updateElement: (id: string, newProps: Partial<DrawingElement>) => void;
  removeElement: (id: string) => void;
  clearElements: () => void;

  teams: Team[];
  addTeam: (team: Omit<Team, 'id'>, spawnX?: number, spawnY?: number) => void;
  updateTeam: (teamId: string, teamData: Partial<Team>) => void;
  updatePlayerPosition: (teamId: string, playerId: string, newX: number, newY: number, newScaleX?: number, newScaleY?: number) => void;
  removeTeam: (teamId: string) => void;

  savedTeams: Team[];
  loadSavedTeams: () => void;
  saveTeamToLibrary: (teamData: Omit<Team, 'id'>) => void;
  removeSavedTeam: (teamId: string) => void;

  isAddTeamModalOpen: boolean;
  setAddTeamModalOpen: (open: boolean) => void;

  // History for Undo/Redo
  history: DrawingElement[][];
  historyStep: number;
  commitHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  activeTool: 'pan',
  setTool: (tool) => set({ activeTool: tool }),
  
  selectedElementId: null,
  setSelectedElementId: (id) => set({ selectedElementId: id, selectedPlayerId: null }), // Sync clear

  selectedPlayerId: null,
  setSelectedPlayerId: (id) => set({ selectedPlayerId: id, selectedElementId: null }),

  editingTeamId: null,
  setEditingTeamId: (id) => set({ editingTeamId: id }),

  croppingElementId: null,
  setCroppingElementId: (id) => set({ croppingElementId: id }),

  eraserSize: 30,
  setEraserSize: (size) => set({ eraserSize: size }),

  shapeFillType: 'transparent',
  toggleShapeFillType: () => set((state) => ({ 
    shapeFillType: state.shapeFillType === 'transparent' ? 'solid' : 'transparent' 
  })),

  strokeColor: '#C47C2B',
  setStrokeColor: (color) => set({ strokeColor: color }),

  strokeWidth: 4,
  setStrokeWidth: (width) => set({ strokeWidth: width }),

  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
  
  setZoomByWheel: (scaleBy, pointer, stagePos) => {
    const { zoom } = get();
    const oldScale = zoom;
    const newScale = oldScale * scaleBy;
    const clampedScale = Math.max(0.1, Math.min(newScale, 10));
    
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    set({ zoom: clampedScale, stagePosition: newPos });
  },

  stagePosition: { x: 0, y: 0 },
  setStagePosition: (pos) => set({ stagePosition: pos }),

  backgroundImage: null,
  setBackgroundImage: (img) => set({ backgroundImage: img }),

  elements: [],
  history: [[]],
  historyStep: 0,

  commitHistory: () => {
    const { elements, history, historyStep } = get();
    // Filter out laser elements so they don't persist in undo stack after fading
    const persistentElements = elements.filter(el => !el.isLaser);
    
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(persistentElements);

    set({ 
      history: newHistory,
      historyStep: newHistory.length - 1 
    });
  },

  undo: () => {
    const { history, historyStep } = get();
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      set({
        elements: history[prevStep],
        historyStep: prevStep
      });
    }
  },

  redo: () => {
    const { history, historyStep } = get();
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      set({
        elements: history[nextStep],
        historyStep: nextStep
      });
    }
  },

  addElement: (el) => set({ elements: [...get().elements, el] }),
  
  updateElement: (id, newProps) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? { ...el, ...newProps } : el)
  })),

  removeElement: (id) => set((state) => ({
    elements: state.elements.filter(el => el.id !== id)
  })),
  
  clearElements: () => {
    set({ elements: [], history: [[]], historyStep: 0, teams: [] });
    get().commitHistory();
  },

  teams: [],
  addTeam: (teamData, spawnX, spawnY) => set((state) => {
    // Generate a new ID and calculate staggered spawn positions
    const teamId = Math.random().toString(36).substring(2, 9);
    
    // Slight offset matrix so players don't spawn on top of each other
    const offsets = [
      { dx: -30, dy: -30 }, 
      { dx: 30, dy: -30 }, 
      { dx: -30, dy: 30 }, 
      { dx: 30, dy: 30 }
    ];

    const centerX = spawnX ?? window.innerWidth / 2;
    const centerY = spawnY ?? window.innerHeight / 2;

    const populatedPlayers = teamData.players.map((p, index) => ({
      ...p,
      x: centerX + (offsets[index]?.dx || 0),
      y: centerY + (offsets[index]?.dy || 0),
    }));

    const newTeam: Team = {
      ...teamData,
      id: teamId,
      players: populatedPlayers
    };

    return { teams: [...state.teams, newTeam] };
  }),

  updateTeam: (teamId, teamData) => set((state) => ({
    teams: state.teams.map(t => t.id === teamId ? { ...t, ...teamData } : t)
  })),

  updatePlayerPosition: (teamId, playerId, newX, newY, newScaleX, newScaleY) => set((state) => ({
    teams: state.teams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        players: t.players.map(p => p.id === playerId ? { 
          ...p, 
          x: newX, 
          y: newY,
          scaleX: newScaleX ?? p.scaleX,
          scaleY: newScaleY ?? p.scaleY
        } : p)
      };
    })
  })),

  removeTeam: (teamId) => set((state) => ({ teams: state.teams.filter(t => t.id !== teamId) })),

  savedTeams: [],
  loadSavedTeams: () => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem('albus_saved_teams');
      if (data) set({ savedTeams: JSON.parse(data) });
    } catch(e) {
      console.error("Failed to parse saved teams", e);
    }
  },
  saveTeamToLibrary: (teamData) => set((state) => {
    const teamId = Math.random().toString(36).substring(2, 9);
    // Assign structural IDs to players
    const players = teamData.players.map((p, idx) => ({ 
      ...p, 
      id: Math.random().toString(36).substring(2, 9), 
      name: p.name.trim() || `Player ${idx+1}`,
      x: 0, 
      y: 0
    }));
    const newTeam: Team = { ...teamData, id: teamId, players };
    const newSaved = [...state.savedTeams, newTeam];
    localStorage.setItem('albus_saved_teams', JSON.stringify(newSaved));
    return { savedTeams: newSaved };
  }),
  removeSavedTeam: (teamId) => set((state) => {
    const newSaved = state.savedTeams.filter(t => t.id !== teamId);
    localStorage.setItem('albus_saved_teams', JSON.stringify(newSaved));
    return { savedTeams: newSaved };
  }),

  isAddTeamModalOpen: false,
  setAddTeamModalOpen: (open) => set({ isAddTeamModalOpen: open }),
}));
