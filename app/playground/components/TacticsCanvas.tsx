"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Line, Circle, Rect, Image as KonvaImage, Transformer, Group, Text } from 'react-konva';
import { useBoardStore, Player, Team } from '../store/useBoardStore';
import { Pen, Lock } from 'lucide-react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import gsap from 'gsap';

// ─── Player Node ──────────────────────────────────────────────────────────────
const PlayerNode = React.memo(function PlayerNode({
  player, team, updatePlayerPosition, commitHistory,
  activeTool, onSelect, setEditingTeamId, onToggleLock, onPathClick
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
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

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

  const isDraggable = activeTool === 'select' && !player.isLocked;

  const handleClick = (e: KonvaEventObject<Event>) => {
    e.cancelBubble = true;
    if (activeTool === 'select') { onSelect(); return; }
    if (activeTool === 'lock') { onToggleLock(); return; }
    if (activeTool === 'path') { onPathClick(); return; }
  };

  return (
    <Group
      id={`player-${player.id}`}
      x={player.x}
      y={player.y}
      scaleX={player.scaleX || 1}
      scaleY={player.scaleY || 1}
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
    >
      <Circle
        radius={16}
        fillPatternImage={img || undefined}
        fillPatternOffset={img ? { x: img.width / 2, y: img.height / 2 } : undefined}
        fillPatternScale={img ? {
          x: Math.max(32 / img.width, 32 / img.height),
          y: Math.max(32 / img.width, 32 / img.height)
        } : undefined}
        stroke={player.isLocked ? '#888888' : team.themeColor}
        strokeWidth={player.isLocked ? 2 : 3}
        strokeDashArray={player.isLocked ? [4, 3] : undefined}
        hitStrokeWidth={20}
        fill={img ? undefined : '#1A0F08'}
        opacity={player.isLocked ? 0.75 : 1}
      />
      <Text
        text={player.name}
        y={22}
        fill={player.isLocked ? '#888888' : '#FFFFFF'}
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
      {player.isLocked && (
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
  } = useBoardStore();

  const stageRef = useRef<Konva.Stage>(null);
  const eraserCursorRef = useRef<Konva.Circle>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const playerTrRef = useRef<Konva.Transformer>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Path tool local state
  const [pathTargetPlayerId, setPathTargetPlayerId] = useState<string | null>(null);
  const [pathTargetTeamId, setPathTargetTeamId] = useState<string | null>(null);
  const [draftPath, setDraftPath] = useState<number[]>([]);
  const [isDrawingPath, setIsDrawingPath] = useState(false);

  // Resize canvas
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
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
      if (e.key === 'Escape') {
        setCroppingElementId(null);
        setSelectedElementId(null);
        setPathTargetPlayerId(null);
        setPathTargetTeamId(null);
        setDraftPath([]);
        setIsDrawingPath(false);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !croppingElementId) {
        if (selectedElementId) {
          const el = elements.find(e => e.id === selectedElementId);
          if (el?.isLocked) return;
          removeElement(selectedElementId);
          commitHistory();
          setSelectedElementId(null);
        } else if (selectedPlayerId) {
          const team = teams.find(t => t.players.some(p => p.id === selectedPlayerId));
          const player = team?.players.find(p => p.id === selectedPlayerId);
          if (player?.isLocked) return;
          if (team) removeTeam(team.id);
          setSelectedPlayerId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, croppingElementId, elements, removeElement, commitHistory,
    setSelectedElementId, setCroppingElementId, updateElement, selectedPlayerId,
    teams, removeTeam, setSelectedPlayerId,]);

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
      setSelectedElementId(null);
      setSelectedPlayerId(null);
      if (croppingElementId) setCroppingElementId(null);
      // If in path mode and no target yet, clicking empty cancels path
      if (activeTool === 'path' && !isDrawingPath) {
        setPathTargetPlayerId(null);
        setPathTargetTeamId(null);
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
  const handlePointerDown = (e: KonvaEventObject<PointerEvent>) => {
    if (activeTool === 'pan' || activeTool === 'select' || activeTool === 'lock') return;
    if (e.evt.button !== 0) return;

    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getRelativePointerPosition();
    if (!pointer) return;

    setSelectedElementId(null);

    // Path drawing — only after a player target is chosen
    if (activeTool === 'path') {
      if (!pathTargetPlayerId) return; // must select player first
      setIsDrawingPath(true);
      setDraftPath([pointer.x, pointer.y]);
      return;
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
    return null;
  };

  let cursorClass = 'cursor-crosshair';
  if (activeTool === 'pan') cursorClass = 'cursor-grab';
  if (activeTool === 'select') cursorClass = 'cursor-default';
  if (activeTool === 'eraser') cursorClass = 'cursor-none';
  if (activeTool === 'lock') cursorClass = 'cursor-pointer';
  if (activeTool === 'path') cursorClass = pathTargetPlayerId ? 'cursor-crosshair' : 'cursor-pointer';

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
    </div>
  );
}
