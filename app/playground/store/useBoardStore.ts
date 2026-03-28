import { create } from 'zustand';

export type Tool = 'select' | 'pan' | 'pen' | 'eraser' | 'laser' | 'circle' | 'rectangle' | 'path' | 'lock';

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
  isLocked?: boolean;
}

export interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  scaleX?: number;
  scaleY?: number;
  animationPath?: number[]; // flat [x1,y1,x2,y2,...] in canvas coords
  isLocked?: boolean;
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  themeColor: string;
  players: Player[];
}

export interface SavedMap {
  id: string;
  title: string;
  category: string;
  imageUrl: string;    // compressed thumbnail for sidebar display only
  sourceUrl?: string;  // full-resolution source – used when loading to canvas
}

const MAP_CATEGORIES = ['PUBG MOBILE', 'Valorant', 'CS2', 'Apex Legends', 'General'];
export { MAP_CATEGORIES };

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
  toggleElementLock: (id: string) => void;

  teams: Team[];
  addTeam: (team: Omit<Team, 'id'>, spawnX?: number, spawnY?: number) => void;
  updateTeam: (teamId: string, teamData: Partial<Team>) => void;
  updatePlayerPosition: (teamId: string, playerId: string, newX: number, newY: number, newScaleX?: number, newScaleY?: number) => void;
  updatePlayerAnimationPath: (teamId: string, playerId: string, path: number[]) => void;
  clearPlayerAnimationPath: (teamId: string, playerId: string) => void;
  clearAllAnimationPaths: () => void;
  togglePlayerLock: (teamId: string, playerId: string) => void;
  removeTeam: (teamId: string) => void;

  // Animation state
  isAnimating: boolean;
  setAnimating: (val: boolean) => void;

  savedTeams: Team[];
  loadSavedTeams: () => void;
  saveTeamToLibrary: (teamData: Omit<Team, 'id'>) => void;
  removeSavedTeam: (teamId: string) => void;
  updateSavedTeam: (teamId: string, data: Partial<Omit<Team, 'id'>>) => void;

  // Which saved-library team is being edited in AddTeamModal
  editingSavedTeamId: string | null;
  setEditingSavedTeamId: (id: string | null) => void;

  savedMaps: SavedMap[];
  loadSavedMaps: () => void;
  addSavedMap: (map: Omit<SavedMap, 'id'>) => void;
  removeSavedMap: (mapId: string) => void;
  updateSavedMap: (mapId: string, data: Partial<Omit<SavedMap, 'id'>>) => void;

  isAddTeamModalOpen: boolean;
  setAddTeamModalOpen: (open: boolean) => void;

  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

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
  setSelectedElementId: (id) => set({ selectedElementId: id, selectedPlayerId: null }),

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
    const persistentElements = elements.filter(el => !el.isLaser);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(persistentElements);
    set({ history: newHistory, historyStep: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyStep } = get();
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      set({ elements: history[prevStep], historyStep: prevStep });
    }
  },

  redo: () => {
    const { history, historyStep } = get();
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      set({ elements: history[nextStep], historyStep: nextStep });
    }
  },

  addElement: (el) => set({ elements: [...get().elements, el] }),

  updateElement: (id, newProps) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? { ...el, ...newProps } : el)
  })),

  removeElement: (id) => {
    const el = get().elements.find(e => e.id === id);
    if (el?.isLocked) return; // Block deletion of locked elements
    set((state) => ({ elements: state.elements.filter(el => el.id !== id) }));
  },

  clearElements: () => {
    set({ elements: [], history: [[]], historyStep: 0, teams: [] });
    get().commitHistory();
  },

  toggleElementLock: (id) => set((state) => {
    const el = state.elements.find(e => e.id === id);
    if (!el) return state;
    const wasLocked = !!el.isLocked;
    if (wasLocked) {
      // Unlocking → move to END of array so it renders AFTER any eraser
      // strokes that were drawn while it was locked (destination-out only
      // affects elements drawn before it on the canvas).
      return {
        elements: [
          ...state.elements.filter(e => e.id !== id),
          { ...el, isLocked: false }
        ]
      };
    }
    // Locking → keep current position
    return {
      elements: state.elements.map(e => e.id === id ? { ...e, isLocked: true } : e)
    };
  }),

  teams: [],
  addTeam: (teamData, spawnX, spawnY) => set((state) => {
    const teamId = Math.random().toString(36).substring(2, 9);
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
    const newTeam: Team = { ...teamData, id: teamId, players: populatedPlayers };
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

  updatePlayerAnimationPath: (teamId, playerId, path) => set((state) => ({
    teams: state.teams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        players: t.players.map(p => p.id === playerId ? { ...p, animationPath: path } : p)
      };
    })
  })),

  clearPlayerAnimationPath: (teamId, playerId) => set((state) => ({
    teams: state.teams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        players: t.players.map(p => p.id === playerId ? { ...p, animationPath: undefined } : p)
      };
    })
  })),

  clearAllAnimationPaths: () => set((state) => ({
    teams: state.teams.map(t => ({
      ...t,
      players: t.players.map(p => ({ ...p, animationPath: undefined }))
    }))
  })),

  togglePlayerLock: (teamId, playerId) => set((state) => ({
    teams: state.teams.map(t => {
      if (t.id !== teamId) return t;
      return {
        ...t,
        players: t.players.map(p => p.id === playerId ? { ...p, isLocked: !p.isLocked } : p)
      };
    })
  })),

  removeTeam: (teamId) => set((state) => ({ teams: state.teams.filter(t => t.id !== teamId) })),

  isAnimating: false,
  setAnimating: (val) => set({ isAnimating: val }),

  savedTeams: [],
  loadSavedTeams: () => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem('albus_saved_teams');
      if (data) set({ savedTeams: JSON.parse(data) });
    } catch (e) {
      console.error('Failed to parse saved teams', e);
    }
  },
  updateSavedTeam: (teamId, data) => set((state) => {
    const newSaved = state.savedTeams.map(t =>
      t.id === teamId ? { ...t, ...data } : t
    );
    localStorage.setItem('albus_saved_teams', JSON.stringify(newSaved));
    return { savedTeams: newSaved };
  }),

  editingSavedTeamId: null,
  setEditingSavedTeamId: (id) => set({ editingSavedTeamId: id }),
  saveTeamToLibrary: (teamData) => set((state) => {
    const teamId = Math.random().toString(36).substring(2, 9);
    const players = teamData.players.map((p, idx) => ({
      ...p,
      id: Math.random().toString(36).substring(2, 9),
      name: p.name.trim() || `Player ${idx + 1}`,
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

  savedMaps: [],
  loadSavedMaps: () => {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem('albus_saved_maps');
      if (data) set({ savedMaps: JSON.parse(data) });
    } catch (e) {
      console.error('Failed to parse saved maps', e);
    }
  },
  addSavedMap: (mapData) => set((state) => {
    const newMap: SavedMap = { ...mapData, id: Math.random().toString(36).substring(2, 9) };
    const newSaved = [...state.savedMaps, newMap];
    localStorage.setItem('albus_saved_maps', JSON.stringify(newSaved));
    return { savedMaps: newSaved };
  }),
  removeSavedMap: (mapId) => set((state) => {
    const newSaved = state.savedMaps.filter(m => m.id !== mapId);
    localStorage.setItem('albus_saved_maps', JSON.stringify(newSaved));
    return { savedMaps: newSaved };
  }),
  updateSavedMap: (mapId, data) => set((state) => {
    const newSaved = state.savedMaps.map(m =>
      m.id === mapId ? { ...m, ...data } : m
    );
    localStorage.setItem('albus_saved_maps', JSON.stringify(newSaved));
    return { savedMaps: newSaved };
  }),

  isAddTeamModalOpen: false,
  setAddTeamModalOpen: (open) => set({ isAddTeamModalOpen: open }),

  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
