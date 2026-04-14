"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Line, Circle, Rect, Image as KonvaImage, Transformer, Group, Text, Arrow, Arc } from 'react-konva';
import { useBoardStore, Player, Team, StagedFight } from '../store/useBoardStore';
import { Pen, Lock } from 'lucide-react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import gsap from 'gsap';
import { setBoardStageRef } from '../hooks/useBoardStageRef';

// ─── Player Node ──────────────────────────────────────────────────────────────
const PlayerNode = React.memo(function PlayerNode({
  player, team, updatePlayerPosition, commitHistory,
  activeTool, onSelect, setEditingTeamId, onToggleLock, onPathClick,
  onContextMenu, onFightClick, onReviveClick,
}: {
  player: Player;
  team: Team;
  updatePlayerPosition: (tid: string, pid: string, x: number, y: number, sx?: number, sy?: number) => void;
  commitHistory: () => void;
  activeTool: string;
  onSelect: () => void;
  setEditingTeamId: (id: string) => void;
  onToggleLock: () => void;
  onPathClick: () => void;
  onContextMenu: (e: KonvaEventObject<PointerEvent | MouseEvent>) => void;
  onFightClick: () => void;
  onReviveClick: () => void;
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const circleRef = useRef<Konva.Circle>(null);
  const pulseTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!team.logoUrl) return;
    const image = new window.Image();
    image.crossOrigin = 'Anonymous';
    if (team.logoUrl.startsWith('http') && !team.logoUrl.includes('ui-avatars')) {
      image.src = `/api/proxy-image?url=${encodeURIComponent(team.logoUrl)}`;
    } else {
      image.src = team.logoUrl;
    }
    image.onload = () => setImg(image);
  }, [team.logoUrl]);

  // GSAP pulse for knocked state
  useEffect(() => {
    if (player.status === 'knocked' && circleRef.current) {
      pulseTweenRef.current = gsap.to(circleRef.current, {
        opacity: 0.45,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        onUpdate: () => { circleRef.current?.getLayer()?.batchDraw(); },
      });
    } else {
      if (pulseTweenRef.current) {
        pulseTweenRef.current.kill();
        pulseTweenRef.current = null;
      }
      // Reset opacity if leaving knocked
      if (circleRef.current) {
        circleRef.current.opacity(1);
        circleRef.current.getLayer()?.batchDraw();
      }
    }
    return () => {
      if (pulseTweenRef.current) {
        pulseTweenRef.current.kill();
        pulseTweenRef.current = null;
      }
    };
  }, [player.status]);

  // Status-aware props
  const isDead = player.status === 'dead';
  const isKnocked = player.status === 'knocked';
  const isDraggable = activeTool === 'select' && !player.isLocked && !isDead && !isKnocked;

  const strokeColor = isDead
    ? '#555555'
    : isKnocked
      ? '#FF0000'
      : player.isLocked ? '#888888' : team.themeColor;

  const groupOpacity = isDead ? 0.4 : 1;
  const groupRef = useRef<Konva.Group>(null);

  // Force Konva node opacity in sync with React state — overrides any stale GSAP values
  useEffect(() => {
    if (groupRef.current) {
      const target = isDead ? 0.4 : 1;
      groupRef.current.opacity(target);
      groupRef.current.getLayer()?.batchDraw();
    }
  }, [player.status, isDead]);

  const handleClick = (e: KonvaEventObject<Event>) => {
    e.cancelBubble = true;
    if (activeTool === 'select') { onSelect(); return; }
    if (activeTool === 'lock') { onToggleLock(); return; }
    if (activeTool === 'path') { onPathClick(); return; }
    if (activeTool === 'fight') { onFightClick(); return; }
    if (activeTool === 'revive') { onReviveClick(); return; }
  };

  return (
    <Group
      ref={groupRef}
      id={`player-${player.id}`}
      x={player.x}
      y={player.y}
      scaleX={player.scaleX || 1}
      scaleY={player.scaleY || 1}
      opacity={groupOpacity}
      draggable={isDraggable}
      onClick={handleClick}
      onTap={handleClick}
      onDblClick={(e) => { e.cancelBubble = true; onSelect(); setEditingTeamId(team.id); }}
      onDblTap={(e) => { e.cancelBubble = true; onSelect(); setEditingTeamId(team.id); }}
      onDragEnd={(e) => {
        updatePlayerPosition(team.id, player.id, e.target.x(), e.target.y(), e.target.scaleX(), e.target.scaleY());
        commitHistory();
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        updatePlayerPosition(team.id, player.id, node.x(), node.y(), node.scaleX(), node.scaleY());
        commitHistory();
      }}
      onContextMenu={onContextMenu}
    >
      <Circle
        ref={circleRef}
        radius={16}
        fillPatternImage={img || undefined}
        fillPatternOffset={img ? { x: img.width / 2, y: img.height / 2 } : undefined}
        fillPatternScale={img ? {
          x: Math.max(32 / img.width, 32 / img.height),
          y: Math.max(32 / img.width, 32 / img.height)
        } : undefined}
        stroke={strokeColor}
        strokeWidth={isKnocked ? 3.5 : player.isLocked ? 2 : 3}
        strokeDashArray={player.isLocked && !isDead && !isKnocked ? [4, 3] : undefined}
        hitStrokeWidth={20}
        fill={img ? undefined : '#1A0F08'}
      />

      {/* Dead state: X overlay */}
      {isDead && (
        <>
          <Line points={[-10, -10, 10, 10]} stroke="#FF3B30" strokeWidth={2.5} lineCap="round" listening={false} />
          <Line points={[-10, 10, 10, -10]} stroke="#FF3B30" strokeWidth={2.5} lineCap="round" listening={false} />
        </>
      )}

      {/* Knocked state: red cross icon */}
      {isKnocked && (
        <Text
          text="✚"
          x={14} y={-22}
          fontSize={12}
          fill="#FF0000"
          listening={false}
          shadowColor="#000"
          shadowBlur={3}
        />
      )}

      <Text
        text={player.name}
        y={22}
        fill={isDead ? '#666666' : isKnocked ? '#FF6B6B' : player.isLocked ? '#888888' : '#FFFFFF'}
        align="center"
        width={100}
        offsetX={50}
        fontSize={12}
        fontFamily="Inter, sans-serif"
        fontStyle="bold"
        shadowColor="#0A0705"
        shadowBlur={4}
        shadowOffset={{ x: 1, y: 1 }}
      />
      {/* Lock visual indicator on player — small amber badge, always clickable */}
      {player.isLocked && player.status === 'alive' && (
        <Group
          x={16} y={-24}
          listening={true}
          onClick={(e) => { e.cancelBubble = true; onToggleLock(); }}
          onTap={(e) => { e.cancelBubble = true; onToggleLock(); }}
          onMouseEnter={() => { document.body.style.cursor = 'pointer'; }}
          onMouseLeave={() => { document.body.style.cursor = ''; }}
        >
          <Circle radius={7} fill="#1A0F08" stroke="#C47C2B" strokeWidth={1.5} />
          <Text text="🔒" fontSize={9} offsetX={4.5} offsetY={5} listening={false} />
        </Group>
      )}
    </Group>
  );
});

// ─── Main Canvas ──────────────────────────────────────────────────────────────
export default function TacticsCanvas() {
  const {
    activeTool, zoom, stagePosition, setZoomByWheel, setStagePosition,
    elements, addElement, updateElement, removeElement, backgroundImage, setBackgroundImage,
    commitHistory, eraserSize, shapeFillType, strokeColor, strokeWidth,
    selectedElementId, setSelectedElementId, croppingElementId, setCroppingElementId,
    teams, updatePlayerPosition, addTeam,
    selectedPlayerId, setSelectedPlayerId,
    editingTeamId, setEditingTeamId, setAddTeamModalOpen,
    removeTeam, toggleElementLock, togglePlayerLock,
    updatePlayerAnimationPath, clearAllAnimationPaths,
    isAnimating, setAnimating,
    knockPlayer, eliminatePlayer, revivePlayer, recallPlayer,
    recallingPlayerId, recallingTeamId, setRecallingPlayer,
    stagedFight, setStagedFight, clearStagedFight,
    stagedRevive, setStagedRevive, clearStagedRevive,
  } = useBoardStore();

  const stageRef = useRef<Konva.Stage>(null);
  const eraserCursorRef = useRef<Konva.Circle>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const playerTrRef = useRef<Konva.Transformer>(null);
  const temporaryLayerRef = useRef<Konva.Layer>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Path tool local state
  const [pathTargetPlayerId, setPathTargetPlayerId] = useState<string | null>(null);
  const [pathTargetTeamId, setPathTargetTeamId] = useState<string | null>(null);
  const [draftPath, setDraftPath] = useState<number[]>([]);
  const [isDrawingPath, setIsDrawingPath] = useState(false);

  // Fight path drawing state (for integrated fight+path workflow)
  const [fightDraftPath, setFightDraftPath] = useState<number[]>([]);
  const [isDrawingFightPath, setIsDrawingFightPath] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    playerId: string; teamId: string; screenX: number; screenY: number; status: string;
  } | null>(null);

  // Fight/Revive UI state
  const [showOutcomePicker, setShowOutcomePicker] = useState(false);

  // Text editing state
  const [editingText, setEditingText] = useState<{
    id: string | null;
    x: number; y: number;
    value: string;
    fontSize: number;
    color: string;
    isNew: boolean;
    scaleX: number;
    scaleY: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Force-focus textarea after render — requestAnimationFrame ensures the DOM
  // has settled and Konva stage pointer events have completed processing
  useEffect(() => {
    if (editingText && textareaRef.current) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [editingText]);

  // Share stage ref with export hook
  useEffect(() => {
    if (stageRef.current) setBoardStageRef(stageRef.current);
    return () => setBoardStageRef(null);
  });

  // Resize canvas
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enter key for crop confirmation (needs stageRef access) + Escape for path cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'Enter') {
        if (croppingElementId) {
          const node = stageRef.current?.findOne('#cropBox');
          const el = elements.find(item => item.id === croppingElementId);
          const stage = stageRef.current;
          if (node && el && stage) {
            const newCropX = node.x() + (el.crop?.x || 0);
            const newCropY = node.y() + (el.crop?.y || 0);
            const newCropW = Math.max(10, node.width() * node.scaleX());
            const newCropH = Math.max(10, node.height() * node.scaleY());
            const absPos = node.getAbsolutePosition();
            const transform = stage.getAbsoluteTransform().copy().invert();
            const localPos = transform.point(absPos);
            updateElement(el.id, {
              crop: { x: newCropX, y: newCropY, width: newCropW, height: newCropH },
              width: newCropW, height: newCropH,
              x: localPos.x, y: localPos.y
            });
            commitHistory();
          }
          setCroppingElementId(null);
        } else {
          setSelectedElementId(null);
        }
      }
      // Escape also cancels path drawing state, context menu, recall mode, fight staging
      if (e.key === 'Escape') {
        setPathTargetPlayerId(null);
        setPathTargetTeamId(null);
        setDraftPath([]);
        setIsDrawingPath(false);
        setFightDraftPath([]);
        setIsDrawingFightPath(false);
        setContextMenu(null);
        setRecallingPlayer(null, null);
        clearStagedFight();
        setShowOutcomePicker(false);
        clearStagedRevive();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [croppingElementId, elements, commitHistory,
    setSelectedElementId, setCroppingElementId, updateElement, setRecallingPlayer, clearStagedFight, clearStagedRevive]);

  // Transformer attach
  useEffect(() => {
    if (trRef.current) {
      if (croppingElementId) {
        const node = stageRef.current?.findOne('#cropBox');
        if (node) { trRef.current.nodes([node]); trRef.current.getLayer()?.batchDraw(); }
      } else if (selectedElementId) {
        const node = stageRef.current?.findOne(`#${selectedElementId}`);
        if (node) { trRef.current.nodes([node]); trRef.current.getLayer()?.batchDraw(); }
      } else {
        trRef.current.nodes([]);
      }
    }
  }, [selectedElementId, croppingElementId, elements]);

  useEffect(() => {
    if (selectedPlayerId && playerTrRef.current) {
      const node = stageRef.current?.findOne(`#player-${selectedPlayerId}`);
      if (node) { playerTrRef.current.nodes([node]); playerTrRef.current.getLayer()?.batchDraw(); }
    }
  }, [selectedPlayerId, teams]);

  const checkDeselect = (e: KonvaEventObject<Event>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setContextMenu(null);

      // Recall placement: click canvas to drop the player
      if (recallingPlayerId && recallingTeamId) {
        const stage = stageRef.current;
        if (stage) {
          const pointer = stage.getRelativePointerPosition();
          if (pointer) {
            recallPlayer(recallingTeamId, recallingPlayerId, pointer.x, pointer.y);
            // Play GSAP drop-in animation
            setTimeout(() => {
              const node = stage.findOne(`#player-${recallingPlayerId}`) as Konva.Group | undefined;
              if (node) {
                node.scaleX(2);
                node.scaleY(2);
                node.opacity(0.3);
                gsap.to(node, {
                  scaleX: 1, scaleY: 1, opacity: 1,
                  duration: 0.5, ease: 'elastic.out(1, 0.5)',
                  onUpdate: () => { node.getLayer()?.batchDraw(); }
                });
              }
            }, 30);
          }
        }
        return;
      }

      setSelectedElementId(null);
      setSelectedPlayerId(null);
      if (croppingElementId) setCroppingElementId(null);
      // If in path mode and no target yet, clicking empty cancels path
      if (activeTool === 'path' && !isDrawingPath) {
        setPathTargetPlayerId(null);
        setPathTargetTeamId(null);
      }
      // Fight tool: clicking empty canvas during draw steps → skip drawing, advance step
      if (activeTool === 'fight' && !isDrawingFightPath) {
        if (stagedFight.step === 'drawP1') {
          setStagedFight({ p1Path: null, step: 'selectP2' });
        } else if (stagedFight.step === 'drawP2') {
          setStagedFight({ p2Path: null, step: 'ready' });
          setShowOutcomePicker(true);
        }
      }
    }
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const scaleBy = e.evt.deltaY < 0 ? 1.05 : 0.95;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    setZoomByWheel(scaleBy, pointer, stagePosition);
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex || !hex.startsWith('#')) return `rgba(196,124,43,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16) || 196;
    const g = parseInt(hex.slice(3, 5), 16) || 124;
    const b = parseInt(hex.slice(5, 7), 16) || 43;
    return `rgba(${r},${g},${b},${alpha})`;
  };

  // ── Pointer events ─────────────────────────────────────────────────────────
  // ── Commit text editing ─────────────────────────────────────────────────────
  const commitTextEditing = useCallback(() => {
    if (!editingText) return;
    const { id, x, y, value, fontSize, color, isNew, scaleX, scaleY } = editingText;
    const trimmed = value.trim();
    // Bake scale into fontSize so the rendered size matches what the user saw
    const bakedFontSize = Math.round(fontSize * Math.max(scaleX, scaleY));
    if (isNew) {
      if (trimmed) {
        addElement({
          id: id || generateId(),
          type: 'text',
          x, y,
          text: trimmed,
          fontSize: bakedFontSize,
          fontFamily: 'Inter, sans-serif',
          color,
          strokeWidth: 0,
          scaleX: 1,
          scaleY: 1,
        });
        commitHistory();
      }
    } else if (id) {
      if (trimmed) {
        updateElement(id, { text: trimmed, fontSize: bakedFontSize, scaleX: 1, scaleY: 1 });
        commitHistory();
      } else {
        removeElement(id);
        commitHistory();
      }
    }
    setEditingText(null);
  }, [editingText, addElement, updateElement, removeElement, commitHistory]);

  const handlePointerDown = (e: KonvaEventObject<PointerEvent>) => {
    if (activeTool === 'pan' || activeTool === 'select' || activeTool === 'lock') return;
    if (e.evt.button !== 0) return;

    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getRelativePointerPosition();
    if (!pointer) return;

    setSelectedElementId(null);

    // Text tool — place editing textarea at click position
    if (activeTool === 'text') {
      // Prevent the stage from keeping pointer capture / focus
      e.evt.preventDefault();
      e.evt.stopPropagation();
      // If already editing, commit current first
      if (editingText) commitTextEditing();
      setEditingText({
        id: generateId(),
        x: pointer.x,
        y: pointer.y,
        value: '',
        fontSize: Math.max(16, strokeWidth * 5),
        color: strokeColor,
        isNew: true,
        scaleX: 1,
        scaleY: 1,
      });
      return;
    }

    // Path drawing — only after a player target is chosen
    if (activeTool === 'path') {
      if (!pathTargetPlayerId) return; // must select player first
      setIsDrawingPath(true);
      setDraftPath([pointer.x, pointer.y]);
      return;
    }

    // Fight tool: path drawing during drawP1/drawP2 steps
    if (activeTool === 'fight') {
      if (stagedFight.step === 'drawP1' || stagedFight.step === 'drawP2') {
        setIsDrawingFightPath(true);
        setFightDraftPath([pointer.x, pointer.y]);
      }
      return; // fight tool never creates elements
    }

    setIsDrawing(true);
    const id = generateId();
    setCurrentId(id);

    if (activeTool === 'pen' || activeTool === 'laser' || activeTool === 'eraser') {
      addElement({
        id, type: activeTool === 'eraser' ? 'eraser' : 'line',
        points: [pointer.x, pointer.y],
        color: activeTool === 'eraser' ? '#FFFFFF' : strokeColor,
        strokeWidth: activeTool === 'eraser' ? eraserSize : strokeWidth,
        isLaser: activeTool === 'laser'
      });
    } else if (activeTool === 'circle' || activeTool === 'rectangle') {
      addElement({
        id, type: activeTool,
        x: pointer.x, y: pointer.y,
        width: 0, height: 0, radius: 0,
        color: strokeColor, strokeWidth, fillType: shapeFillType
      });
    }
  };

  const handlePointerMove = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getRelativePointerPosition();
    if (!pointer) return;

    if (activeTool === 'eraser' && eraserCursorRef.current) {
      eraserCursorRef.current.position(pointer);
      eraserCursorRef.current.getLayer()?.batchDraw();
    }

    // Path drag
    if (activeTool === 'path' && isDrawingPath) {
      setDraftPath(prev => [...prev, pointer.x, pointer.y]);
      return;
    }

    // Fight path drag
    if (activeTool === 'fight' && isDrawingFightPath) {
      setFightDraftPath(prev => [...prev, pointer.x, pointer.y]);
      return;
    }

    if (!isDrawing || !currentId) return;
    if (activeTool === 'pan' || activeTool === 'select') return;

    const currentElement = elements.find(el => el.id === currentId);
    if (!currentElement) return;

    if (activeTool === 'pen' || activeTool === 'laser' || activeTool === 'eraser') {
      const newPoints = currentElement.points ? [...currentElement.points, pointer.x, pointer.y] : [pointer.x, pointer.y];
      updateElement(currentId, { points: newPoints });
    } else if (activeTool === 'rectangle') {
      updateElement(currentId, {
        width: pointer.x - (currentElement.x || 0),
        height: pointer.y - (currentElement.y || 0)
      });
    } else if (activeTool === 'circle') {
      const dx = pointer.x - (currentElement.x || 0);
      const dy = pointer.y - (currentElement.y || 0);
      updateElement(currentId, { radius: Math.sqrt(dx * dx + dy * dy) });
    }
  };

  const handlePointerUp = () => {
    // Commit path
    if (activeTool === 'path' && isDrawingPath) {
      setIsDrawingPath(false);
      if (pathTargetPlayerId && pathTargetTeamId && draftPath.length >= 4) {
        updatePlayerAnimationPath(pathTargetTeamId, pathTargetPlayerId, draftPath);
      }
      // Reset draft + target selection so new player can be chosen
      setDraftPath([]);
      setPathTargetPlayerId(null);
      setPathTargetTeamId(null);
      return;
    }

    // Fight tool: commit drawn fight path
    if (activeTool === 'fight' && isDrawingFightPath) {
      setIsDrawingFightPath(false);
      const pathData = fightDraftPath.length >= 4 ? fightDraftPath : null;
      if (stagedFight.step === 'drawP1') {
        setStagedFight({ p1Path: pathData, step: 'selectP2' });
      } else if (stagedFight.step === 'drawP2') {
        setStagedFight({ p2Path: pathData, step: 'ready' });
        setShowOutcomePicker(true);
      }
      setFightDraftPath([]);
      return;
    }

    if (!isDrawing || !currentId) return;
    setIsDrawing(false);

    if (activeTool === 'laser') {
      const idToRemove = currentId;
      setTimeout(() => removeElement(idToRemove), 2500);
    } else {
      commitHistory();
    }
    setCurrentId(null);
  };

  // ── GSAP Animation ─────────────────────────────────────────────────────────
  const startAnimation = useCallback(() => {
    if (isAnimating) return;

    const playersWithPaths = teams.flatMap(team =>
      team.players
        .filter(p => p.animationPath && p.animationPath.length >= 4)
        .map(p => ({ player: p, team }))
    );

    if (playersWithPaths.length === 0) return;

    setAnimating(true);
    const tl = gsap.timeline({
      onComplete: () => {
        // Persist final positions to store
        playersWithPaths.forEach(({ player, team }) => {
          const node = stageRef.current?.findOne(`#player-${player.id}`) as Konva.Group | undefined;
          if (node) updatePlayerPosition(team.id, player.id, node.x(), node.y());
        });
        clearAllAnimationPaths();
        setAnimating(false);
      }
    });

    playersWithPaths.forEach(({ player }) => {
      const node = stageRef.current?.findOne(`#player-${player.id}`) as Konva.Group | undefined;
      if (!node || !player.animationPath) return;

      const path = player.animationPath;
      const waypoints: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < path.length - 1; i += 2) {
        waypoints.push({ x: path[i], y: path[i + 1] });
      }
      if (waypoints.length < 2) return;

      // Build tween sequence for this player
      let totalDist = 0;
      for (let i = 1; i < waypoints.length; i++) {
        const dx = waypoints[i].x - waypoints[i - 1].x;
        const dy = waypoints[i].y - waypoints[i - 1].y;
        totalDist += Math.sqrt(dx * dx + dy * dy);
      }

      // 0.6s per 100px, min 0.5s total
      const totalDuration = Math.max(0.5, (totalDist / 100) * 0.6);

      // Tween through waypoints via GSAP timeline, updating the Konva node imperatively
      const subTl = gsap.timeline();
      for (let i = 1; i < waypoints.length; i++) {
        const segDx = waypoints[i].x - waypoints[i - 1].x;
        const segDy = waypoints[i].y - waypoints[i - 1].y;
        const segDist = Math.sqrt(segDx * segDx + segDy * segDy);
        const segDur = (segDist / totalDist) * totalDuration;

        const wp = waypoints[i];
        subTl.to(waypoints[i - 1], {
          duration: segDur,
          ease: 'power1.inOut',
          onUpdate: function () {
            // We tween a proxy and read position from it each frame
          }
        });

        // Use a plain object proxy approach
        const proxy = { x: waypoints[i - 1].x, y: waypoints[i - 1].y };
        subTl.to(proxy, {
          x: wp.x,
          y: wp.y,
          duration: segDur,
          ease: 'power1.inOut',
          onUpdate: () => {
            node.x(proxy.x);
            node.y(proxy.y);
            node.getLayer()?.batchDraw();
          }
        }, '<'); // overlap with the dummy tween above
      }

      tl.add(subTl, 0); // all players animate simultaneously
    });
  }, [isAnimating, teams, setAnimating, updatePlayerPosition, clearAllAnimationPaths]);

  // ── HELPER: animate a Konva node along a waypoint path ────────────────────
  const animateAlongPath = (
    tl: gsap.core.Timeline,
    node: Konva.Group,
    waypoints: Array<{ x: number; y: number }>,
    startTime: number
  ) => {
    if (waypoints.length < 2) return 0;
    let totalDist = 0;
    for (let i = 1; i < waypoints.length; i++) {
      const dx = waypoints[i].x - waypoints[i - 1].x;
      const dy = waypoints[i].y - waypoints[i - 1].y;
      totalDist += Math.sqrt(dx * dx + dy * dy);
    }
    const totalDuration = Math.max(0.4, (totalDist / 100) * 0.5);

    let elapsed = 0;
    for (let i = 1; i < waypoints.length; i++) {
      const segDx = waypoints[i].x - waypoints[i - 1].x;
      const segDy = waypoints[i].y - waypoints[i - 1].y;
      const segDist = Math.sqrt(segDx * segDx + segDy * segDy);
      const segDur = (segDist / totalDist) * totalDuration;
      const proxy = { x: waypoints[i - 1].x, y: waypoints[i - 1].y };
      tl.to(proxy, {
        x: waypoints[i].x,
        y: waypoints[i].y,
        duration: segDur,
        ease: 'power1.inOut',
        onUpdate: () => {
          node.x(proxy.x);
          node.y(proxy.y);
          node.getLayer()?.batchDraw();
        },
      }, startTime + elapsed);
      elapsed += segDur;
    }
    return totalDuration;
  };

  // ── ADVANCED FIGHT ANIMATION ──────────────────────────────────────────────
  const playAdvancedFight = useCallback(() => {
    if (isAnimating) return;
    const { p1Id, p1TeamId, p2Id, p2TeamId, p1Path: rawP1Path, p2Path: rawP2Path, outcome } = stagedFight;
    if (!p1Id || !p2Id || !outcome || !p1TeamId || !p2TeamId) return;

    const stage = stageRef.current;
    const tmpLayer = temporaryLayerRef.current;
    if (!stage || !tmpLayer) return;

    const p1Ref = stage.findOne(`#player-${p1Id}`) as Konva.Group | undefined;
    const p2Ref = stage.findOne(`#player-${p2Id}`) as Konva.Group | undefined;
    if (!p1Ref || !p2Ref) return;

    // Build waypoint arrays from stagedFight paths
    const p1Path: Array<{ x: number; y: number }> = [];
    if (rawP1Path && rawP1Path.length >= 4) {
      for (let i = 0; i < rawP1Path.length - 1; i += 2) {
        p1Path.push({ x: rawP1Path[i], y: rawP1Path[i + 1] });
      }
    }
    const p2Path: Array<{ x: number; y: number }> = [];
    if (rawP2Path && rawP2Path.length >= 4) {
      for (let i = 0; i < rawP2Path.length - 1; i += 2) {
        p2Path.push({ x: rawP2Path[i], y: rawP2Path[i + 1] });
      }
    }

    setAnimating(true);
    setShowOutcomePicker(false);

    // Track imperative Konva nodes for cleanup
    const tempNodes: Konva.Node[] = [];

    const tl = gsap.timeline({
      onComplete: () => {
        // Destroy all temporary Konva elements
        tempNodes.forEach(n => { n.destroy(); });
        tmpLayer.batchDraw();

        // CRITICAL ORDER: Persist final positions FIRST, then apply status.
        // This prevents the re-render from snapping nodes back to old coords.
        updatePlayerPosition(p1TeamId, p1Id, p1Ref.x(), p1Ref.y());
        updatePlayerPosition(p2TeamId, p2Id, p2Ref.x(), p2Ref.y());

        // Now apply outcome to Zustand (triggers re-render with correct coords)
        if (outcome === 'knocked') {
          knockPlayer(p2TeamId, p2Id);
        } else {
          eliminatePlayer(p2TeamId, p2Id);
        }

        clearStagedFight();
        setAnimating(false);
      }
    });

    // ── Phase 1: Movement (0.0s) ──────────────────────────────────────────
    const moveDur1 = p1Path.length >= 2 ? animateAlongPath(tl, p1Ref, p1Path, 0) : 0;
    const moveDur2 = p2Path.length >= 2 ? animateAlongPath(tl, p2Ref, p2Path, 0) : 0;
    const moveEnd = Math.max(moveDur1, moveDur2, 0.1);

    // ── Phase 2: Aiming — small arrows at each player's edge (NO connecting line) ──
    const ARROW_LEN = 30;  // length of aiming arrow in px
    const PLAYER_R = 18;   // slightly outside the player circle radius

    tl.call(() => {
      const ax = p1Ref.x(), ay = p1Ref.y();
      const vx = p2Ref.x(), vy = p2Ref.y();

      // Angle from P1 → P2
      const angle1to2 = Math.atan2(vy - ay, vx - ax);
      // Angle from P2 → P1
      const angle2to1 = Math.atan2(ay - vy, ax - vx);

      // Arrow 1: starts at edge of P1 circle, points toward P2
      const a1StartX = ax + Math.cos(angle1to2) * PLAYER_R;
      const a1StartY = ay + Math.sin(angle1to2) * PLAYER_R;
      const a1EndX   = ax + Math.cos(angle1to2) * (PLAYER_R + ARROW_LEN);
      const a1EndY   = ay + Math.sin(angle1to2) * (PLAYER_R + ARROW_LEN);

      // Arrow 2: starts at edge of P2 circle, points toward P1
      const a2StartX = vx + Math.cos(angle2to1) * PLAYER_R;
      const a2StartY = vy + Math.sin(angle2to1) * PLAYER_R;
      const a2EndX   = vx + Math.cos(angle2to1) * (PLAYER_R + ARROW_LEN);
      const a2EndY   = vy + Math.sin(angle2to1) * (PLAYER_R + ARROW_LEN);

      const arrow1 = new Konva.Arrow({
        points: [a1StartX, a1StartY, a1EndX, a1EndY],
        stroke: '#FF3B30',
        strokeWidth: 2.5,
        fill: '#FF3B30',
        pointerLength: 8,
        pointerWidth: 6,
        opacity: 0,
        listening: false,
        name: 'fight-temp',
      });
      const arrow2 = new Konva.Arrow({
        points: [a2StartX, a2StartY, a2EndX, a2EndY],
        stroke: '#FF6B6B',
        strokeWidth: 2.5,
        fill: '#FF6B6B',
        pointerLength: 8,
        pointerWidth: 6,
        opacity: 0,
        listening: false,
        name: 'fight-temp',
      });

      tmpLayer.add(arrow1);
      tmpLayer.add(arrow2);
      tempNodes.push(arrow1, arrow2);

      // Fade arrows in
      gsap.to([arrow1, arrow2], {
        opacity: 0.9,
        duration: 0.3,
        onUpdate: () => { tmpLayer.batchDraw(); },
      });
    }, [], moveEnd);

    // ── Phase 3: Firing — imperative Konva Line tracers ────────────────────
    const firingStart = moveEnd + 0.3;
    const tracerCount = 8;
    for (let i = 0; i < tracerCount; i++) {
      const t0 = firingStart + i * 0.12;
      const isFromP1 = i % 2 === 0;

      tl.call(() => {
        const ax = p1Ref.x(), ay = p1Ref.y();
        const vx = p2Ref.x(), vy = p2Ref.y();
        const fromX = isFromP1 ? ax : vx;
        const fromY = isFromP1 ? ay : vy;
        const toX = isFromP1 ? vx : ax;
        const toY = isFromP1 ? vy : ay;

        // Slight random spread
        const spread = (Math.random() - 0.5) * 6;

        const bullet = new Konva.Line({
          points: [fromX, fromY + spread, fromX, fromY + spread],
          stroke: '#FFD700',
          strokeWidth: 2,
          lineCap: 'round',
          opacity: 0.95,
          listening: false,
          name: 'fight-temp',
          shadowColor: '#FFD700',
          shadowBlur: 8,
        });
        tmpLayer.add(bullet);
        tempNodes.push(bullet);

        const proxy = { progress: 0 };
        gsap.to(proxy, {
          progress: 1,
          duration: 0.1,
          ease: 'none',
          onUpdate: () => {
            const cx = fromX + (toX - fromX) * proxy.progress;
            const cy = (fromY + spread) + (toY - fromY) * proxy.progress;
            const tailP = Math.max(0, proxy.progress - 0.35);
            const tx = fromX + (toX - fromX) * tailP;
            const ty = (fromY + spread) + (toY - fromY) * tailP;
            bullet.points([tx, ty, cx, cy]);
            tmpLayer.batchDraw();
          },
          onComplete: () => {
            bullet.opacity(0);
            tmpLayer.batchDraw();
          },
        });
      }, [], t0);
    }

    // ── Phase 4: Cleanup & Outcome ────────────────────────────────────────
    const outcomeStart = firingStart + tracerCount * 0.12 + 0.15;

    // Fade out aiming arrows
    tl.call(() => {
      const arrows = tmpLayer.find('.fight-temp');
      gsap.to(arrows.map(a => a), {
        opacity: 0,
        duration: 0.25,
        onUpdate: () => { tmpLayer.batchDraw(); },
      });
    }, [], outcomeStart);

    // Shake + knockback + visual outcome — all wrapped in tl.call() to read
    // positions at RUNTIME (not setup time), preventing snap-back if P2 moved.
    tl.call(() => {
      const curX = p2Ref.x();
      const curY = p2Ref.y();

      // Shake
      const shakeProxy = { offset: 0 };
      gsap.to(shakeProxy, {
        offset: 1,
        duration: 0.35,
        ease: 'none',
        onUpdate: () => {
          const shake = Math.sin(shakeProxy.offset * Math.PI * 8) * 3;
          p2Ref.x(curX + shake);
          p2Ref.getLayer()?.batchDraw();
        },
        onComplete: () => {
          // Minimal knockback: 3px push in attacker → victim direction
          const angle = Math.atan2(curY - p1Ref.y(), curX - p1Ref.x());
          const knockX = curX + Math.cos(angle) * 3;
          const knockY = curY + Math.sin(angle) * 3;

          const knockProxy = { x: curX, y: curY };
          gsap.to(knockProxy, {
            x: knockX,
            y: knockY,
            duration: 0.12,
            ease: 'power2.out',
            onUpdate: () => {
              p2Ref.x(knockProxy.x);
              p2Ref.y(knockProxy.y);
              p2Ref.getLayer()?.batchDraw();
            },
          });
        },
      });

      // Visual transition (slightly delayed)
      if (outcome === 'dead') {
        gsap.to(p2Ref, {
          opacity: 0.4,
          duration: 0.4,
          delay: 0.2,
          onUpdate: () => { p2Ref.getLayer()?.batchDraw(); },
        });
      } else {
        gsap.to(p2Ref, {
          opacity: 0.4,
          duration: 0.12,
          delay: 0.2,
          yoyo: true,
          repeat: 5,
          onUpdate: () => { p2Ref.getLayer()?.batchDraw(); },
          onComplete: () => {
            p2Ref.opacity(1);
            p2Ref.getLayer()?.batchDraw();
          },
        });
      }
    }, [], outcomeStart);
  }, [isAnimating, stagedFight, teams, setAnimating, knockPlayer, eliminatePlayer, clearStagedFight, updatePlayerPosition]);

  // ── ADVANCED REVIVE ANIMATION ─────────────────────────────────────────────
  const playAdvancedRevive = useCallback(() => {
    if (isAnimating) return;
    const { medicId, medicTeamId, targetId, targetTeamId } = stagedRevive;
    if (!medicId || !targetId || !medicTeamId || !targetTeamId) return;

    const stage = stageRef.current;
    const tmpLayer = temporaryLayerRef.current;
    if (!stage || !tmpLayer) return;

    const p3Ref = stage.findOne(`#player-${medicId}`) as Konva.Group | undefined;
    const p4Ref = stage.findOne(`#player-${targetId}`) as Konva.Group | undefined;
    if (!p3Ref || !p4Ref) return;

    // Build path from medic to target
    const PLAYER_RADIUS = 20;
    const DESIRED_GAP = 5;
    const STOP_DIST = 2 * PLAYER_RADIUS + DESIRED_GAP; // center-to-center minimum

    const medicPlayer = teams.flatMap(t => t.players).find(p => p.id === medicId);
    const p3Path: Array<{ x: number; y: number }> = [];
    if (medicPlayer?.animationPath && medicPlayer.animationPath.length >= 4) {
      for (let i = 0; i < medicPlayer.animationPath.length - 1; i += 2) {
        p3Path.push({ x: medicPlayer.animationPath[i], y: medicPlayer.animationPath[i + 1] });
      }
    }

    // Clamp the final waypoint so medic stops STOP_DIST away from P4's center
    const p4x = p4Ref.x(), p4y = p4Ref.y();
    const clampEndpoint = (path: Array<{ x: number; y: number }>) => {
      const last = path[path.length - 1];
      const dx = last.x - p4x, dy = last.y - p4y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < STOP_DIST) {
        // Push the endpoint back along the approach angle
        const angle = Math.atan2(p4y - last.y, p4x - last.x);
        path[path.length - 1] = {
          x: p4x - Math.cos(angle) * STOP_DIST,
          y: p4y - Math.sin(angle) * STOP_DIST,
        };
      }
    };

    // If no drawn path, auto-generate a direct line stopping short of target
    if (p3Path.length < 2) {
      const angle = Math.atan2(p4y - p3Ref.y(), p4x - p3Ref.x());
      p3Path.push({ x: p3Ref.x(), y: p3Ref.y() });
      p3Path.push({
        x: p4x - Math.cos(angle) * STOP_DIST,
        y: p4y - Math.sin(angle) * STOP_DIST,
      });
    } else {
      clampEndpoint(p3Path);
    }

    setAnimating(true);
    const tempNodes: Konva.Node[] = [];

    const tl = gsap.timeline({
      onComplete: () => {
        // Destroy temp nodes
        tempNodes.forEach(n => { n.destroy(); });
        tmpLayer.batchDraw();

        // CRITICAL ORDER: Persist medic's final position FIRST
        updatePlayerPosition(medicTeamId, medicId, p3Ref.x(), p3Ref.y());

        // Then revive the target (triggers re-render with correct coords)
        revivePlayer(targetTeamId, targetId);

        clearStagedRevive();
        setAnimating(false);
      }
    });

    // ── Phase 1: Movement — medic walks to knocked player ──────────────────
    const moveDur = animateAlongPath(tl, p3Ref, p3Path, 0);
    const arrivalTime = moveDur + 0.05;

    // ── Phase 2: Revive loader — 3-second Konva Arc ───────────────────────
    const REVIVE_DURATION = 3;
    const loaderRadius = 20;

    tl.call(() => {
      const tx = p4Ref.x(), ty = p4Ref.y();

      // Background ring (gray track)
      const bgRing = new Konva.Arc({
        x: tx,
        y: ty,
        innerRadius: loaderRadius - 3,
        outerRadius: loaderRadius,
        angle: 360,
        rotation: -90,
        fill: '#2A1F15',
        opacity: 0.6,
        listening: false,
        name: 'revive-temp',
      });

      // Progress arc (green, animates from 0° to 360°)
      const progressArc = new Konva.Arc({
        x: tx,
        y: ty,
        innerRadius: loaderRadius - 3,
        outerRadius: loaderRadius,
        angle: 0,
        rotation: -90,
        fill: '#34C759',
        opacity: 0.95,
        listening: false,
        name: 'revive-temp',
      });

      // Center icon text
      const iconText = new Konva.Text({
        x: tx - 5,
        y: ty - 6,
        text: '✚',
        fontSize: 12,
        fill: '#34C759',
        listening: false,
        name: 'revive-temp',
      });

      tmpLayer.add(bgRing);
      tmpLayer.add(progressArc);
      tmpLayer.add(iconText);
      tempNodes.push(bgRing, progressArc, iconText);

      // Animate the arc angle from 0 to 360 over REVIVE_DURATION
      const arcProxy = { angle: 0 };
      gsap.to(arcProxy, {
        angle: 360,
        duration: REVIVE_DURATION,
        ease: 'none',
        onUpdate: () => {
          progressArc.angle(arcProxy.angle);
          tmpLayer.batchDraw();
        },
      });

      // Medic bobbing animation while reviving
      const medicOrigY = p3Ref.y();
      gsap.to(p3Ref, {
        y: medicOrigY - 3,
        duration: 0.4,
        yoyo: true,
        repeat: Math.floor(REVIVE_DURATION / 0.8),
        ease: 'sine.inOut',
        onUpdate: () => { p3Ref.getLayer()?.batchDraw(); },
        onComplete: () => {
          p3Ref.y(medicOrigY);
          p3Ref.getLayer()?.batchDraw();
        },
      });
    }, [], arrivalTime);

    // ── Phase 3: Revive complete — fade loader, restore victim ─────────────
    tl.call(() => {
      // Fade out the loader
      const reviveNodes = tmpLayer.find('.revive-temp');
      gsap.to(reviveNodes.map(n => n), {
        opacity: 0,
        duration: 0.3,
        onUpdate: () => { tmpLayer.batchDraw(); },
      });

      // Flash the victim back to life, explicitly ending at full opacity
      gsap.fromTo(p4Ref, { opacity: 0.3 }, {
        opacity: 1,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        onUpdate: () => { p4Ref.getLayer()?.batchDraw(); },
        onComplete: () => {
          // Guarantee the Konva node is at full opacity after yoyo
          p4Ref.opacity(1);
          p4Ref.getLayer()?.batchDraw();
        },
      });
    }, [], arrivalTime + REVIVE_DURATION + 0.1);

  }, [isAnimating, stagedRevive, teams, setAnimating, revivePlayer, updatePlayerPosition, clearStagedRevive]);

  // Fight staged check
  const isFightStaged = !!(stagedFight.p1Id && stagedFight.p2Id && stagedFight.outcome);
  const isFightPartial = stagedFight.step !== 'selectP1' && stagedFight.step !== 'ready';

  // Revive staged check
  const isReviveStaged = !!(stagedRevive.medicId && stagedRevive.targetId);

  // Check if any player has a path (for Play button enabled state)
  const hasAnyPath = teams.some(t => t.players.some(p => p.animationPath && p.animationPath.length >= 4));

  if (windowSize.width === 0) return null;

  // ─── Element renderer (shared by locked + drawings layers) ──────────────────
  const renderElementNode = (el: (typeof elements)[0]) => {
    const transformProps = {
      x: el.x || 0, y: el.y || 0,
      scaleX: el.scaleX || 1, scaleY: el.scaleY || 1,
      rotation: el.rotation || 0,
    };
    const isLocked = !!el.isLocked;
    const commonProps = {
      id: el.id,
      ...transformProps,
      draggable: activeTool === 'select' && !isLocked,
      onClick: (e: KonvaEventObject<Event>) => {
        e.cancelBubble = true;
        if (activeTool === 'select') setSelectedElementId(el.id);
      },
      onDblClick: (e: KonvaEventObject<Event>) => {
        e.cancelBubble = true;
        if (activeTool === 'select') setSelectedElementId(el.id);
      },
      onDblTap: (e: KonvaEventObject<Event>) => {
        e.cancelBubble = true;
        if (activeTool === 'select') setSelectedElementId(el.id);
      },
      onDragEnd: (e: KonvaEventObject<DragEvent>) => {
        updateElement(el.id, { x: e.target.x(), y: e.target.y() });
        commitHistory();
      },
      onTransformEnd: (e: KonvaEventObject<Event>) => {
        const node = e.target;
        updateElement(el.id, {
          x: node.x(), y: node.y(),
          scaleX: node.scaleX(), scaleY: node.scaleY(),
          rotation: node.rotation()
        });
        commitHistory();
      }
    };

    // Compact lock badge — positioned in local element coords so it moves/scales with the element
    const LockBadge = ({ bx, by }: { bx: number; by: number }) => (
      <Group
        x={bx} y={by}
        listening={true}
        onClick={(e) => { e.cancelBubble = true; toggleElementLock(el.id); }}
        onTap={(e) => { e.cancelBubble = true; toggleElementLock(el.id); }}
        onMouseEnter={() => { document.body.style.cursor = 'pointer'; }}
        onMouseLeave={() => { document.body.style.cursor = ''; }}
      >
        <Circle radius={7} fill="#1A0F08" stroke="#C47C2B" strokeWidth={1.5} />
        <Text text="🔒" fontSize={9} offsetX={4.5} offsetY={5} listening={false} />
      </Group>
    );

    if (el.type === 'line' || el.type === 'eraser') {
      const pts = el.points || [];
      const mid = Math.max(0, Math.floor(pts.length / 4) * 2);
      const bx = (pts[mid] ?? 0) - (el.x || 0);
      const by = (pts[mid + 1] ?? 0) - (el.y || 0) - 18;
      return (
        <Group key={el.id} {...commonProps}>
          <Line
            x={0} y={0}
            points={el.points || []}
            stroke={isLocked ? '#888' : el.color}
            strokeWidth={el.strokeWidth}
            hitStrokeWidth={Math.max(20, el.strokeWidth || 4)}
            strokeScaleEnabled={false}
            tension={0.5}
            lineCap="round" lineJoin="round"
            globalCompositeOperation={el.type === 'eraser' ? 'destination-out' : 'source-over'}
            shadowColor={el.isLaser ? el.color : 'transparent'}
            shadowBlur={el.isLaser ? 15 : 0}
            opacity={el.isLaser ? 0.9 : 1}
            listening={false}
          />
          {isLocked && <LockBadge bx={bx} by={by} />}
        </Group>
      );
    }
    if (el.type === 'rectangle') {
      const w = el.width || 0;
      const h = el.height || 0;
      const bx = w >= 0 ? Math.max(w - 14, 14) : Math.min(w + 14, -14);
      const by = h >= 0 ? 14 : Math.max(h + 14, -14);
      return (
        <Group key={el.id} {...commonProps}>
          <Rect
            x={0} y={0}
            width={w} height={h}
            stroke={el.color || '#C47C2B'}
            strokeWidth={el.strokeWidth || 4}
            hitStrokeWidth={Math.max(20, el.strokeWidth || 4)}
            strokeScaleEnabled={false}
            fillEnabled={el.fillType === 'solid'}
            fill={el.fillType === 'solid' ? hexToRgba(el.color || '#C47C2B', 0.25) : undefined}
          />
          {isLocked && <LockBadge bx={bx} by={by} />}
        </Group>
      );
    }
    if (el.type === 'circle') {
      const r = el.radius || 0;
      return (
        <Group key={el.id} {...commonProps}>
          <Circle
            x={0} y={0}
            radius={r}
            stroke={el.color || '#C47C2B'}
            strokeWidth={el.strokeWidth || 4}
            hitStrokeWidth={Math.max(20, el.strokeWidth || 4)}
            strokeScaleEnabled={false}
            fillEnabled={el.fillType === 'solid'}
            fill={el.fillType === 'solid' ? hexToRgba(el.color || '#C47C2B', 0.25) : undefined}
          />
          {isLocked && <LockBadge bx={Math.max(r - 10, 10)} by={-r + 10} />}
        </Group>
      );
    }
    if (el.type === 'image' && el.image) {
      const isCropping = croppingElementId === el.id;
      const dispW = el.crop ? el.crop.width  : (el.width  || el.image.width);
      const dispH = el.crop ? el.crop.height : (el.height || el.image.height);
      if (isCropping) {
        const imgX = el.crop ? -el.crop.x : 0;
        const imgY = el.crop ? -el.crop.y : 0;
        return (
          <Group key={el.id} {...commonProps} draggable={false}>
            <KonvaImage image={el.image} x={imgX} y={imgY} width={el.image.width} height={el.image.height} opacity={0.4} />
            <Rect id="cropBox" x={0} y={0}
              width={el.crop ? el.crop.width : el.image.width}
              height={el.crop ? el.crop.height : el.image.height}
              draggable stroke="#FFFFFF" strokeWidth={2} strokeScaleEnabled={false}
            />
          </Group>
        );
      }
      return (
        <Group key={el.id} {...commonProps}>
          <KonvaImage image={el.image} crop={el.crop} width={dispW} height={dispH} />
          {isLocked && <LockBadge bx={Math.max(dispW - 10, 10)} by={10} />}
        </Group>
      );
    }
    if (el.type === 'text') {
      const fontSize = el.fontSize || 20;
      const fontFamily = el.fontFamily || 'Inter, sans-serif';
      const isBeingEdited = editingText?.id === el.id;
      if (isBeingEdited) return null; // hide while editing via textarea overlay

      const enterEditMode = () => {
        setEditingText({
          id: el.id,
          x: el.x || 0,
          y: el.y || 0,
          value: el.text || '',
          fontSize,
          color: el.color || '#F5ECD7',
          isNew: false,
          scaleX: el.scaleX || 1,
          scaleY: el.scaleY || 1,
        });
      };

      return (
        <Group key={el.id} {...commonProps}
          onClick={(e: KonvaEventObject<Event>) => {
            e.cancelBubble = true;
            if (activeTool === 'text') {
              enterEditMode();
            } else if (activeTool === 'select') {
              setSelectedElementId(el.id);
            }
          }}
          onDblClick={(e: KonvaEventObject<Event>) => {
            e.cancelBubble = true;
            enterEditMode();
          }}
          onDblTap={(e: KonvaEventObject<Event>) => {
            e.cancelBubble = true;
            enterEditMode();
          }}
        >
          <Text
            x={0} y={0}
            text={el.text || ''}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fill={isLocked ? '#888888' : (el.color || '#F5ECD7')}
            listening={true}
            shadowColor="#0A0705"
            shadowBlur={4}
            shadowOffset={{ x: 1, y: 1 }}
          />
          {isLocked && <LockBadge bx={-10} by={-14} />}
        </Group>
      );
    }
    return null;
  };

  let cursorClass = 'cursor-crosshair';
  if (activeTool === 'pan') cursorClass = 'cursor-grab';
  if (activeTool === 'select') cursorClass = 'cursor-default';
  if (activeTool === 'eraser') cursorClass = 'cursor-none';
  if (activeTool === 'lock') cursorClass = 'cursor-pointer';
  if (activeTool === 'text') cursorClass = 'cursor-text';
  if (activeTool === 'path') cursorClass = pathTargetPlayerId ? 'cursor-crosshair' : 'cursor-pointer';
  if (activeTool === 'fight') cursorClass = 'cursor-crosshair';
  if (activeTool === 'revive') cursorClass = 'cursor-crosshair';

  return (
    <div
      className={`absolute inset-0 bg-[#0F0A06] overflow-hidden ${cursorClass} outline-none pointer-events-auto`}
      style={{ cursor: cursorClass }}
      tabIndex={0}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();

        // ── Map image drop → add as a movable canvas element ────────────
        const mapRaw = e.dataTransfer.getData('application/albus-map-bg');
        if (mapRaw && stageRef.current) {
          const stage = stageRef.current;
          const scale = stage.scaleX();
          const pos = stage.position();
          const rect = e.currentTarget.getBoundingClientRect();
          const canvasX = (e.clientX - rect.left - pos.x) / scale;
          const canvasY = (e.clientY - rect.top  - pos.y) / scale;

          try {
            const { sourceUrl } = JSON.parse(mapRaw) as { sourceUrl: string };
            const img = new window.Image();
            img.crossOrigin = 'Anonymous';
            img.src = sourceUrl;
            img.onload = () => {
              const maxW  = Math.min(img.width,  stage.width()  / scale * 0.8);
              const maxH  = Math.min(img.height, stage.height() / scale * 0.8);
              const ratio = Math.min(maxW / img.width, maxH / img.height);
              const w = img.width  * ratio;
              const h = img.height * ratio;
              addElement({
                id: Math.random().toString(36).substring(2, 9),
                type: 'image',
                image: img,
                x: canvasX - w / 2,
                y: canvasY - h / 2,
                width: w,
                height: h,
                color: '',
                strokeWidth: 0,
              });
              commitHistory();
            };
          } catch {
            // fallback: treat raw string as image src
            const img = new window.Image();
            img.src = mapRaw;
            img.onload = () => setBackgroundImage(img);
          }
          return;
        }

        // ── Squad drop ───────────────────────────────────────────────────
        const squadData = e.dataTransfer.getData('application/json');
        if (squadData && stageRef.current) {
          try {
            const teamData = JSON.parse(squadData);
            const containerRect = e.currentTarget.getBoundingClientRect();
            const pointerX = e.clientX - containerRect.left;
            const pointerY = e.clientY - containerRect.top;
            const stage = stageRef.current;
            const scale = stage.scaleX();
            const pos = stage.position();
            addTeam(teamData, (pointerX - pos.x) / scale, (pointerY - pos.y) / scale);
            commitHistory();
          } catch (err) {
            console.error('Failed to parse dropped squad', err);
          }
        }
      }}
    >
      <Stage
        width={windowSize.width}
        height={windowSize.height}
        onClick={checkDeselect}
        onTap={checkDeselect}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        draggable={activeTool === 'pan'}
        onDragEnd={(e) => {
          if (e.target === e.currentTarget) {
            setStagePosition({ x: e.target.x(), y: e.target.y() });
          }
        }}
        x={stagePosition.x}
        y={stagePosition.y}
        scaleX={zoom}
        scaleY={zoom}
        ref={stageRef}
      >
        {/* Background */}
        <Layer id="background">
          {backgroundImage && (
            <KonvaImage image={backgroundImage} x={0} y={0} opacity={0.8} />
          )}
        </Layer>

        {/* Locked elements — own canvas, completely immune to eraser destination-out */}
        <Layer id="locked">
          {elements.filter(el => el.isLocked && el.type !== 'eraser').map(renderElementNode)}
        </Layer>

        {/* Drawings + Players — eraser operates only on this layer's canvas */}
        <Layer id="drawings">
          {/* Only unlocked elements (and locked erasers, which are edge-case) */}
          {elements.filter(el => !el.isLocked || el.type === 'eraser').map(renderElementNode)}

          {/* Animation paths (saved per-player) */}
          {teams.map(team =>
            team.players.map(player => {
              if (!player.animationPath || player.animationPath.length < 4) return null;
              return (
                <Line
                  key={`path-${player.id}`}
                  points={player.animationPath}
                  stroke={team.themeColor}
                  strokeWidth={2}
                  opacity={0.4}
                  dash={[8, 5]}
                  lineCap="round"
                  lineJoin="round"
                  listening={false}
                  strokeScaleEnabled={false}
                  tension={0.3}
                />
              );
            })
          )}

          {/* Draft path while drawing */}
          {isDrawingPath && draftPath.length >= 4 && (() => {
            const team = pathTargetTeamId ? teams.find(t => t.id === pathTargetTeamId) : null;
            const color = team?.themeColor || '#C47C2B';
            return (
              <Line
                points={draftPath}
                stroke={color}
                strokeWidth={2}
                opacity={0.6}
                dash={[6, 4]}
                lineCap="round"
                lineJoin="round"
                listening={false}
                strokeScaleEnabled={false}
                tension={0.3}
              />
            );
          })()}

          {/* Players */}
          {teams.map(team => (
            <React.Fragment key={team.id}>
              {team.players.map(player => (
                <PlayerNode
                  key={player.id}
                  player={player}
                  team={team}
                  updatePlayerPosition={updatePlayerPosition}
                  commitHistory={commitHistory}
                  activeTool={activeTool}
                  onSelect={() => setSelectedPlayerId(player.id)}
                  setEditingTeamId={(id) => { setEditingTeamId(id); setAddTeamModalOpen(true); }}
                  onToggleLock={() => togglePlayerLock(team.id, player.id)}
                  onPathClick={() => {
                    if (!isDrawingPath) {
                      setPathTargetPlayerId(player.id);
                      setPathTargetTeamId(team.id);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.evt.preventDefault();
                    e.cancelBubble = true;
                    const stage = stageRef.current;
                    if (!stage) return;
                    const container = stage.container().getBoundingClientRect();
                    const pointerPos = stage.getPointerPosition();
                    if (!pointerPos) return;
                    setContextMenu({
                      playerId: player.id,
                      teamId: team.id,
                      screenX: pointerPos.x + container.left,
                      screenY: pointerPos.y + container.top,
                      status: player.status || 'alive',
                    });
                  }}
                  onFightClick={() => {
                    if (player.status !== 'alive') return; // only alive players
                    if (stagedFight.step === 'selectP1') {
                      setStagedFight({ p1Id: player.id, p1TeamId: team.id, step: 'drawP1' });
                    } else if (stagedFight.step === 'drawP1' && player.id !== stagedFight.p1Id) {
                      // Skip P1 draw, this click selects P2 directly
                      setStagedFight({ p1Path: null, p2Id: player.id, p2TeamId: team.id, step: 'drawP2' });
                    } else if (stagedFight.step === 'selectP2' && player.id !== stagedFight.p1Id) {
                      setStagedFight({ p2Id: player.id, p2TeamId: team.id, step: 'drawP2' });
                    } else if (stagedFight.step === 'drawP2' && player.id !== stagedFight.p1Id && player.id !== stagedFight.p2Id) {
                      // Skip P2 draw, advance to ready
                      setStagedFight({ p2Path: null, step: 'ready' });
                      setShowOutcomePicker(true);
                    }
                  }}
                  onReviveClick={() => {
                    if (!stagedRevive.medicId) {
                      // First click: select an alive teammate as medic
                      if (player.status !== 'alive') return;
                      setStagedRevive({ medicId: player.id, medicTeamId: team.id });
                    } else if (!stagedRevive.targetId) {
                      // Second click: select a knocked teammate on the same team
                      if (player.status !== 'knocked') return;
                      if (team.id !== stagedRevive.medicTeamId) return; // same team only
                      setStagedRevive({ targetId: player.id, targetTeamId: team.id });
                    }
                  }}
                />
              ))}
            </React.Fragment>
          ))}

          {selectedPlayerId && (
            <Transformer ref={playerTrRef}
              boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5 ? oldBox : newBox)}
              borderStroke="#FFFFFF" anchorStroke="#FFFFFF" anchorFill="#C47C2B" anchorSize={8}
            />
          )}

          {selectedElementId && (
            <Transformer ref={trRef}
              boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5 ? oldBox : newBox)}
              borderStroke="#FFFFFF" anchorStroke="#FFFFFF" anchorFill="#C47C2B" anchorSize={8}
            />
          )}
        </Layer>

        {/* Temporary layer for imperative Konva nodes (fight arrows, tracers, revive arcs) */}
        <Layer ref={temporaryLayerRef} id="temporaryEffects" listening={false} />

        {/* Staging arrows at each player's edge (NO connecting line) */}
        {stagedFight.p1Id && stagedFight.p2Id && !isAnimating && (() => {
          const atk = teams.flatMap(t => t.players).find(p => p.id === stagedFight.p1Id);
          const vic = teams.flatMap(t => t.players).find(p => p.id === stagedFight.p2Id);
          if (!atk || !vic) return null;
          const angle1 = Math.atan2(vic.y - atk.y, vic.x - atk.x);
          const angle2 = Math.atan2(atk.y - vic.y, atk.x - vic.x);
          const R = 18, L = 28;
          return (
            <Layer listening={false}>
              <Arrow
                points={[
                  atk.x + Math.cos(angle1) * R, atk.y + Math.sin(angle1) * R,
                  atk.x + Math.cos(angle1) * (R + L), atk.y + Math.sin(angle1) * (R + L),
                ]}
                stroke="#FF3B30" fill="#FF3B30" strokeWidth={2}
                pointerLength={7} pointerWidth={5} opacity={0.65}
                listening={false} strokeScaleEnabled={false}
              />
              <Arrow
                points={[
                  vic.x + Math.cos(angle2) * R, vic.y + Math.sin(angle2) * R,
                  vic.x + Math.cos(angle2) * (R + L), vic.y + Math.sin(angle2) * (R + L),
                ]}
                stroke="#FF6B6B" fill="#FF6B6B" strokeWidth={2}
                pointerLength={7} pointerWidth={5} opacity={0.65}
                listening={false} strokeScaleEnabled={false}
              />
            </Layer>
          );
        })()}

        {/* Fight draft path while drawing */}
        {isDrawingFightPath && fightDraftPath.length >= 4 && (() => {
          const fightTeamId = stagedFight.step === 'drawP1' ? stagedFight.p1TeamId : stagedFight.p2TeamId;
          const team = fightTeamId ? teams.find(t => t.id === fightTeamId) : null;
          const color = team?.themeColor || '#FF3B30';
          return (
            <Layer listening={false}>
              <Line
                points={fightDraftPath}
                stroke={color}
                strokeWidth={2}
                opacity={0.6}
                dash={[6, 4]}
                lineCap="round"
                lineJoin="round"
                listening={false}
                strokeScaleEnabled={false}
                tension={0.3}
              />
            </Layer>
          );
        })()}

        {/* Fight staged paths preview (saved p1Path / p2Path) */}
        {!isAnimating && (() => {
          const nodes: React.ReactNode[] = [];
          if (stagedFight.p1Path && stagedFight.p1Path.length >= 4) {
            const t = stagedFight.p1TeamId ? teams.find(tm => tm.id === stagedFight.p1TeamId) : null;
            nodes.push(
              <Line key="fp1" points={stagedFight.p1Path}
                stroke={t?.themeColor || '#FF3B30'} strokeWidth={2}
                opacity={0.35} dash={[8, 5]} lineCap="round"
                listening={false} strokeScaleEnabled={false} tension={0.3}
              />
            );
          }
          if (stagedFight.p2Path && stagedFight.p2Path.length >= 4) {
            const t = stagedFight.p2TeamId ? teams.find(tm => tm.id === stagedFight.p2TeamId) : null;
            nodes.push(
              <Line key="fp2" points={stagedFight.p2Path}
                stroke={t?.themeColor || '#FF6B6B'} strokeWidth={2}
                opacity={0.35} dash={[8, 5]} lineCap="round"
                listening={false} strokeScaleEnabled={false} tension={0.3}
              />
            );
          }
          if (nodes.length === 0) return null;
          return <Layer listening={false}>{nodes}</Layer>;
        })()}

        {/* Eraser cursor overlay */}
        <Layer id="toolOverlays" listening={false}>
          {activeTool === 'eraser' && (
            <Circle
              ref={eraserCursorRef}
              x={-1000} y={-1000}
              radius={eraserSize / 2}
              stroke="#FFFFFF" strokeWidth={1 / zoom}
              opacity={0.8} dash={[4 / zoom, 4 / zoom]}
            />
          )}
        </Layer>
      </Stage>

      {/* Text editing textarea overlay */}
      {editingText && (() => {
        // Convert canvas coordinates to screen coordinates
        const screenX = editingText.x * zoom + stagePosition.x;
        const screenY = editingText.y * zoom + stagePosition.y;
        // Include element scale so textarea matches the visual size on canvas
        const effectiveScale = Math.max(editingText.scaleX, editingText.scaleY);
        const scaledFontSize = editingText.fontSize * effectiveScale * zoom;
        return (
          <div
            className="absolute z-[100]"
            style={{ left: screenX, top: screenY }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <textarea
              ref={textareaRef}
              value={editingText.value}
              onChange={(e) => setEditingText(prev => prev ? { ...prev, value: e.target.value } : null)}
              onBlur={(e) => {
                // Don't commit if clicking within the text editing wrapper itself
                const related = e.relatedTarget as HTMLElement | null;
                if (related?.closest('[data-text-editor]')) return;
                commitTextEditing();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  commitTextEditing();
                }
                // Block all keyboard events from bubbling to canvas shortcuts
                e.stopPropagation();
              }}
              data-text-editor="true"
              className="outline-none resize-none overflow-hidden"
              style={{
                minWidth: 80,
                minHeight: scaledFontSize + 12,
                fontSize: scaledFontSize,
                fontFamily: 'Inter, sans-serif',
                color: editingText.color,
                background: 'rgba(10, 7, 5, 0.8)',
                border: '2px solid rgba(196, 124, 43, 0.6)',
                borderRadius: 6,
                padding: '4px 8px',
                lineHeight: 1.4,
                letterSpacing: 0,
                caretColor: '#C47C2B',
                boxShadow: '0 0 20px rgba(196, 124, 43, 0.2)',
              }}
            />
          </div>
        );
      })()}

      {/* Path mode: player target hint */}
      {activeTool === 'path' && !isDrawingPath && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-[#0A0705CC] backdrop-blur-md border border-[#C47C2B]/40 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#C47C2B] animate-pulse" />
            {pathTargetPlayerId
              ? <span className="text-[#C47C2B] text-xs font-sora font-semibold">Player selected — drag to draw route</span>
              : <span className="text-[#F5ECD7] text-xs font-sora">Click a player to select them, then drag to draw their route</span>
            }
          </div>
        </div>
      )}

      {/* GSAP Play button */}
      {hasAnyPath && !isAnimating && (
        <button
          onClick={startAnimation}
          className="absolute bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#C47C2B] hover:bg-[#E8A44A] text-[#0A0705] font-sora font-black px-5 py-2.5 rounded-full shadow-[0_0_30px_rgba(196,124,43,0.5)] hover:shadow-[0_0_40px_rgba(196,124,43,0.7)] transition-all hover:scale-105 text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <polygon points="2,1 13,7 2,13" />
          </svg>
          Play Routes
        </button>
      )}

      {isAnimating && (
        <div className="absolute bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0A0705CC] backdrop-blur-md border border-[#C47C2B]/40 text-[#C47C2B] font-sora font-semibold px-5 py-2.5 rounded-full shadow-2xl text-sm">
          <div className="w-3 h-3 rounded-full border-2 border-[#C47C2B] border-t-transparent animate-spin" />
          Animating…
        </div>
      )}

      {/* Fight tool: mode hint */}
      {activeTool === 'fight' && !isAnimating && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-[#0A0705CC] backdrop-blur-md border border-[#FF3B30]/40 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
            {stagedFight.step === 'selectP1'
              ? <span className="text-[#FF6B6B] text-xs font-sora">Fight Tool — Click the <b>Attacker</b></span>
              : stagedFight.step === 'drawP1'
                ? <span className="text-[#FF6B6B] text-xs font-sora font-semibold">Drag to draw P1 path, or click <b>Victim</b> to skip</span>
                : stagedFight.step === 'selectP2'
                  ? <span className="text-[#FF6B6B] text-xs font-sora font-semibold">Now click the <b>Victim</b></span>
                  : stagedFight.step === 'drawP2'
                    ? <span className="text-[#FF6B6B] text-xs font-sora font-semibold">Drag to draw P2 path, or click canvas to skip</span>
                    : stagedFight.outcome
                      ? <span className="text-[#34C759] text-xs font-sora font-semibold">Fight staged! Click Play Fight ▶</span>
                      : <span className="text-[#FFD700] text-xs font-sora font-semibold">Choose the outcome above</span>
            }
            {stagedFight.step !== 'selectP1' && (
              <button
                className="ml-2 text-[#7A6A55] hover:text-[#FF3B30] text-xs pointer-events-auto"
                onClick={() => { clearStagedFight(); setShowOutcomePicker(false); setFightDraftPath([]); setIsDrawingFightPath(false); }}
              >Cancel</button>
            )}
          </div>
        </div>
      )}

      {/* Fight tool: Outcome picker popover */}
      {showOutcomePicker && stagedFight.p1Id && stagedFight.p2Id && !stagedFight.outcome && (() => {
        const vic = teams.flatMap(t => t.players).find(p => p.id === stagedFight.p2Id);
        if (!vic) return null;
        const sx = vic.x * zoom + stagePosition.x;
        const sy = vic.y * zoom + stagePosition.y;
        return (
          <div
            className="absolute z-[90] bg-[#0A0705] border border-[#2A1F15] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.7)] py-1 min-w-[160px]"
            style={{ left: Math.min(sx + 30, window.innerWidth - 180), top: Math.max(sy - 40, 10) }}
          >
            <div className="px-3 py-1.5 border-b border-[#2A1F15]">
              <span className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-inter font-semibold">Fight Outcome</span>
            </div>
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sora text-[#FF6B6B] hover:bg-[#FF3B30]/10 transition-colors"
              onClick={() => { setStagedFight({ outcome: 'knocked' }); setShowOutcomePicker(false); }}
            >
              <span className="text-sm">🔻</span> Knock Victim
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sora text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
              onClick={() => { setStagedFight({ outcome: 'dead' }); setShowOutcomePicker(false); }}
            >
              <span className="text-sm">💀</span> Eliminate Victim
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sora text-[#7A6A55] hover:bg-[#2A1F15] transition-colors"
              onClick={() => { clearStagedFight(); setShowOutcomePicker(false); }}
            >
              Cancel
            </button>
          </div>
        );
      })()}

      {/* Fight tool: Play Fight button */}
      {isFightStaged && !isAnimating && (
        <button
          onClick={playAdvancedFight}
          className="absolute bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#FF3B30] hover:bg-[#FF5545] text-white font-sora font-black px-5 py-2.5 rounded-full shadow-[0_0_30px_rgba(255,59,48,0.5)] hover:shadow-[0_0_40px_rgba(255,59,48,0.7)] transition-all hover:scale-105 text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <polygon points="2,1 13,7 2,13" />
          </svg>
          Play Fight
        </button>
      )}

      {/* Revive tool: Play Revive button */}
      {isReviveStaged && !isAnimating && (
        <button
          onClick={playAdvancedRevive}
          className="absolute bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#34C759] hover:bg-[#40D867] text-[#0A0705] font-sora font-black px-5 py-2.5 rounded-full shadow-[0_0_30px_rgba(52,199,89,0.5)] hover:shadow-[0_0_40px_rgba(52,199,89,0.7)] transition-all hover:scale-105 text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <polygon points="2,1 13,7 2,13" />
          </svg>
          Play Revive
        </button>
      )}

      {/* Revive tool: mode hint */}
      {activeTool === 'revive' && !isAnimating && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-[#0A0705CC] backdrop-blur-md border border-[#34C759]/40 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
            {!stagedRevive.medicId
              ? <span className="text-[#34C759] text-xs font-sora">Revive Tool — Click an <b>alive teammate</b> (medic)</span>
              : !stagedRevive.targetId
                ? <span className="text-[#34C759] text-xs font-sora font-semibold">Medic selected — now click a <b>knocked teammate</b></span>
                : <span className="text-[#34C759] text-xs font-sora font-semibold">Revive staged! Click Play Revive ▶</span>
            }
            {stagedRevive.medicId && (
              <button
                className="ml-2 text-[#7A6A55] hover:text-[#FF3B30] text-xs pointer-events-auto"
                onClick={() => clearStagedRevive()}
              >Cancel</button>
            )}
          </div>
        </div>
      )}

      {/* Floating edit squad button */}
      {selectedPlayerId && (() => {
        const selectedTeam = teams.find(t => t.players.some(p => p.id === selectedPlayerId));
        const player = selectedTeam?.players.find(p => p.id === selectedPlayerId);
        if (!player || !selectedTeam) return null;
        const screenX = player.x * zoom + stagePosition.x;
        const screenY = player.y * zoom + stagePosition.y;
        return (
          <button
            className="absolute bg-[#C47C2B] text-[#0A0705] p-1.5 rounded-full shadow-[0_0_15px_rgba(196,124,43,0.4)] hover:scale-110 transition-transform z-50 flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black"
            style={{
              left: screenX + 25 * (player.scaleX || 1) * zoom,
              top: screenY - 35 * (player.scaleY || 1) * zoom
            }}
            onClick={(e) => {
              e.stopPropagation();
              setEditingTeamId(selectedTeam.id);
              setAddTeamModalOpen(true);
            }}
          >
            <Pen size={12} strokeWidth={3} /> Edit Squad
          </button>
        );
      })()}

      {/* Lock indicator tooltip */}
      {activeTool === 'lock' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-[#0A0705CC] backdrop-blur-md border border-[#888]/30 px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
            <Lock size={13} className="text-[#888]" />
            <span className="text-[#F5ECD7] text-xs font-inter">Lock mode — click any element to lock/unlock</span>
          </div>
        </div>
      )}

      {/* Recall placement hint */}
      {recallingPlayerId && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-[#0A0705CC] backdrop-blur-md border border-[#34C759]/40 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
            <span className="text-[#34C759] text-xs font-sora font-semibold">Click on the map to drop the recalled player</span>
            <button
              className="ml-2 text-[#7A6A55] hover:text-[#FF3B30] text-xs pointer-events-auto"
              onClick={() => setRecallingPlayer(null, null)}
            >Cancel</button>
          </div>
        </div>
      )}

      {/* Right-click context menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-[80]" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-[90] bg-[#0A0705] border border-[#2A1F15] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.7)] py-1 min-w-[160px] animate-in"
            style={{
              left: Math.min(contextMenu.screenX, window.innerWidth - 180),
              top: Math.min(contextMenu.screenY, window.innerHeight - 200),
            }}
          >
            <div className="px-3 py-1.5 border-b border-[#2A1F15]">
              <span className="text-[#7A6A55] text-[10px] uppercase tracking-widest font-inter font-semibold">Player Status</span>
            </div>

            {contextMenu.status === 'alive' && (
              <>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sora text-[#FF6B6B] hover:bg-[#FF3B30]/10 transition-colors"
                  onClick={() => {
                    knockPlayer(contextMenu.teamId, contextMenu.playerId);
                    setContextMenu(null);
                  }}
                >
                  <span className="text-sm">🔻</span> Knock
                </button>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sora text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
                  onClick={() => {
                    eliminatePlayer(contextMenu.teamId, contextMenu.playerId);
                    setContextMenu(null);
                  }}
                >
                  <span className="text-sm">💀</span> Eliminate
                </button>
              </>
            )}

            {contextMenu.status === 'knocked' && (
              <>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sora text-[#34C759] hover:bg-[#34C759]/10 transition-colors"
                  onClick={() => {
                    revivePlayer(contextMenu.teamId, contextMenu.playerId);
                    setContextMenu(null);
                  }}
                >
                  <span className="text-sm">💚</span> Revive
                </button>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sora text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
                  onClick={() => {
                    eliminatePlayer(contextMenu.teamId, contextMenu.playerId);
                    setContextMenu(null);
                  }}
                >
                  <span className="text-sm">💀</span> Eliminate
                </button>
              </>
            )}

            {contextMenu.status === 'dead' && (
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sora text-[#007AFF] hover:bg-[#007AFF]/10 transition-colors"
                onClick={() => {
                  setRecallingPlayer(contextMenu.playerId, contextMenu.teamId);
                  setContextMenu(null);
                }}
              >
                <span className="text-sm">🪂</span> Recall
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
