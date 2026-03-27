"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Circle, Rect, Image as KonvaImage, Transformer, Group, Text } from 'react-konva';
import { useBoardStore, Player, Team } from '../store/useBoardStore';
import { Pen } from 'lucide-react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

const PlayerNode = ({ player, team, updatePlayerPosition, commitHistory, activeTool, onSelect, setEditingTeamId }: { player: Player, team: Team, updatePlayerPosition: any, commitHistory: any, activeTool: string, onSelect: () => void, setEditingTeamId: any }) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!team.logoUrl) return;
    const image = new window.Image();
    image.crossOrigin = "Anonymous";
    if (team.logoUrl.startsWith('http') && !team.logoUrl.includes('ui-avatars')) {
       image.src = `/api/proxy-image?url=${encodeURIComponent(team.logoUrl)}`;
    } else {
       image.src = team.logoUrl;
    }
    image.onload = () => setImg(image);
  }, [team.logoUrl]);

  return (
    <Group 
      id={`player-${player.id}`}
      x={player.x} 
      y={player.y} 
      scaleX={player.scaleX || 1}
      scaleY={player.scaleY || 1}
      draggable={activeTool === 'select'}
      onClick={(e) => {
        if (activeTool === 'select') {
          e.cancelBubble = true;
          onSelect();
        }
      }}
      onTap={(e) => {
        if (activeTool === 'select') {
          e.cancelBubble = true;
          onSelect();
        }
      }}
      onDblClick={(e) => {
        e.cancelBubble = true;
        onSelect();
        setEditingTeamId(team.id);
      }}
      onDblTap={(e) => {
        e.cancelBubble = true;
        onSelect();
        setEditingTeamId(team.id);
      }}
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
        stroke={team.themeColor}
        strokeWidth={3}
        hitStrokeWidth={20}
        fill={img ? undefined : '#1A0F08'}
      />
      <Text 
        text={player.name}
        y={22}
        fill="#FFFFFF"
        align="center"
        width={100}
        offsetX={50} // Centered text under circle
        fontSize={12}
        fontFamily="Inter, sans-serif"
        fontStyle="bold"
        shadowColor="#0A0705"
        shadowBlur={4}
        shadowOffset={{ x: 1, y: 1 }}
      />
    </Group>
  );
};

export default function TacticsCanvas() {
  const { 
    activeTool, zoom, stagePosition, setZoomByWheel, setStagePosition,
    elements, addElement, updateElement, removeElement, backgroundImage,
    commitHistory, eraserSize, shapeFillType, strokeColor, strokeWidth,
    selectedElementId, setSelectedElementId, croppingElementId, setCroppingElementId,
    teams, updatePlayerPosition, addTeam,
    selectedPlayerId, setSelectedPlayerId,
    editingTeamId, setEditingTeamId, setAddTeamModalOpen,
    removeTeam
  } = useBoardStore();

  const stageRef = useRef<Konva.Stage>(null);
  const eraserCursorRef = useRef<Konva.Circle>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const playerTrRef = useRef<Konva.Transformer>(null);
  
  // Local state for current drawing action before committing to store (improves performance during fast drags)
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Resize canvas to window
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global Keyboard Actions (Delete / Enter / Crop)
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
                width: newCropW,
                height: newCropH,
                x: localPos.x,
                y: localPos.y
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
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !croppingElementId) {
        if (selectedElementId) {
          removeElement(selectedElementId);
          commitHistory();
          setSelectedElementId(null);
        } else if (selectedPlayerId) {
          const teamId = teams.find(t => t.players.some(p => p.id === selectedPlayerId))?.id;
          if (teamId) {
            removeTeam(teamId);
          }
          setSelectedPlayerId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, croppingElementId, elements, removeElement, commitHistory, setSelectedElementId, setCroppingElementId, updateElement, selectedPlayerId, teams, removeTeam, setSelectedPlayerId]);

  // Hook transformer to selected element or cropBox
  useEffect(() => {
    if (trRef.current) {
      if (croppingElementId) {
        const node = stageRef.current?.findOne('#cropBox');
        if (node) {
          trRef.current.nodes([node]);
          trRef.current.getLayer()?.batchDraw();
        }
      } else if (selectedElementId) {
        const node = stageRef.current?.findOne(`#${selectedElementId}`);
        if (node) {
          trRef.current.nodes([node]);
          trRef.current.getLayer()?.batchDraw();
        }
      } else {
        trRef.current.nodes([]);
      }
    }
  }, [selectedElementId, croppingElementId, elements]);

  const handleDblClick = (id: string, e: KonvaEventObject<Event>) => {
    e.cancelBubble = true;
    if (activeTool === 'select') {
      setSelectedElementId(id);
    }
  };

  useEffect(() => {
    if (selectedPlayerId && playerTrRef.current) {
      const node = stageRef.current?.findOne(`#player-${selectedPlayerId}`);
      if (node) {
        playerTrRef.current.nodes([node]);
        playerTrRef.current.getLayer()?.batchDraw();
      }
    }
  }, [selectedPlayerId, teams]);

  // Handle stage clicks
  const checkDeselect = (e: KonvaEventObject<Event>) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedElementId(null);
      setSelectedPlayerId(null);
      if (croppingElementId) {
        setCroppingElementId(null);
      }
    }
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    
    // Zoom by 5% per wheel click
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

  const handlePointerDown = (e: KonvaEventObject<PointerEvent>) => {
    // If panning tool or middle mouse button, we allow native konva draggable
    if (activeTool === 'pan' || activeTool === 'select') return;
    if (e.evt.button !== 0) return; // Only left click

    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getRelativePointerPosition();
    if (!pointer) return;

    // If clicking on empty canvas, deselect
    setSelectedElementId(null);

    setIsDrawing(true);
    const id = generateId();
    setCurrentId(id);

    if (activeTool === 'pen' || activeTool === 'laser' || activeTool === 'eraser') {
      addElement({
        id,
        type: activeTool === 'eraser' ? 'eraser' : 'line',
        points: [pointer.x, pointer.y],
        color: activeTool === 'eraser' ? '#FFFFFF' : strokeColor,
        strokeWidth: activeTool === 'eraser' ? eraserSize : strokeWidth,
        isLaser: activeTool === 'laser'
      });
    } else if (activeTool === 'circle' || activeTool === 'rectangle') {
      addElement({
        id,
        type: activeTool,
        x: pointer.x,
        y: pointer.y,
        width: 0,
        height: 0,
        radius: 0,
        color: strokeColor, 
        strokeWidth: strokeWidth,
        fillType: shapeFillType
      });
    }
  };

  const handlePointerMove = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getRelativePointerPosition();
    if (!pointer) return;

    // Fast-path for Eraser Cursor Tracking without heavy react state re-renders
    if (activeTool === 'eraser' && eraserCursorRef.current) {
      eraserCursorRef.current.position(pointer);
      eraserCursorRef.current.getLayer()?.batchDraw();
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
      const radius = Math.sqrt(dx * dx + dy * dy);
      updateElement(currentId, { radius });
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing || !currentId) return;
    setIsDrawing(false);

    // If it was a laser, trigger timeout to remove it, but don't commit to history
    if (activeTool === 'laser') {
      const idToRemove = currentId;
      setTimeout(() => {
        removeElement(idToRemove);
      }, 2500); 
    } else {
      // Commit action to history for Undo/Redo (lasers are excluded internally but safe)
      commitHistory();
    }
    setCurrentId(null);
  };

  if (windowSize.width === 0) return null; // Avoid render before client size known

  // Determine active cursor dynamically
  let cursorClass = 'cursor-crosshair';
  if (activeTool === 'pan') cursorClass = 'cursor-grab';
  if (activeTool === 'select') cursorClass = 'cursor-default';
  if (activeTool === 'eraser') cursorClass = 'cursor-none'; // Hides native pointer to strictly show Konva dot

  return (
    <div 
      className={`absolute inset-0 bg-[#0F0A06] overflow-hidden ${cursorClass} outline-none pointer-events-auto filter-none`}
      tabIndex={0} 
      style={{ cursor: cursorClass }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('application/json');
        if (data && stageRef.current) {
          try {
            const teamData = JSON.parse(data);
            
            // Getting absolute physical drop coords relative to the container
            const containerRect = e.currentTarget.getBoundingClientRect();
            const pointerX = e.clientX - containerRect.left;
            const pointerY = e.clientY - containerRect.top;

            // Convert to Konva virtual space accounting for zoom and pan
            const stage = stageRef.current;
            const scale = stage.scaleX();
            const pos = stage.position();
            
            const dropX = (pointerX - pos.x) / scale;
            const dropY = (pointerY - pos.y) / scale;
            
            // Pass the extracted DropX/DropY straight into addTeam
            addTeam(teamData, dropX, dropY);
            commitHistory();
          } catch(err) {
            console.error("Failed to parse dropped squad", err);
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
        // Pan tool logic
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
        <Layer id="background">
          {backgroundImage && (
            <KonvaImage 
              image={backgroundImage} 
              // Center image optionally if you want, or just let it be at 0,0
              x={0} 
              y={0} 
              opacity={0.8}
            />
          )}
        </Layer>
        
        <Layer id="drawings">
          {elements.map((el) => {
            const transformProps = {
              x: el.x || 0,
              y: el.y || 0,
              scaleX: el.scaleX || 1,
              scaleY: el.scaleY || 1,
              rotation: el.rotation || 0,
            };

            const commonProps = {
              id: el.id,
              ...transformProps,
              draggable: activeTool === 'select',
              onDblClick: (e: KonvaEventObject<Event>) => handleDblClick(el.id, e),
              onDblTap: (e: KonvaEventObject<Event>) => handleDblClick(el.id, e),
              onDragEnd: (e: KonvaEventObject<DragEvent>) => {
                updateElement(el.id, { x: e.target.x(), y: e.target.y() });
                commitHistory();
              },
              onTransformEnd: (e: KonvaEventObject<Event>) => {
                const node = e.target;
                updateElement(el.id, {
                  x: node.x(),
                  y: node.y(),
                  scaleX: node.scaleX(),
                  scaleY: node.scaleY(),
                  rotation: node.rotation()
                });
                commitHistory();
              }
            };

            if (el.type === 'line' || el.type === 'eraser') {
              return (
                <Line
                  key={el.id}
                  {...commonProps}
                  points={el.points || []}
                  stroke={el.color}
                  strokeWidth={el.strokeWidth}
                  hitStrokeWidth={Math.max(20, el.strokeWidth || 4)}
                  strokeScaleEnabled={false} // Keeps stroke independent of zoom/scale
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={el.type === 'eraser' ? 'destination-out' : 'source-over'}
                  shadowColor={el.isLaser ? el.color : 'transparent'}
                  shadowBlur={el.isLaser ? 15 : 0}
                  opacity={el.isLaser ? 0.9 : 1}
                />
              );
            }
            if (el.type === 'rectangle') {
              return (
                <Rect
                  key={el.id}
                  {...commonProps}
                  width={el.width || 0}
                  height={el.height || 0}
                  stroke={el.color || "#C47C2B"}
                  strokeWidth={el.strokeWidth || 4}
                  hitStrokeWidth={Math.max(20, el.strokeWidth || 4)}
                  strokeScaleEnabled={false}
                  fillEnabled={el.fillType === 'solid'}
                  fill={el.fillType === 'solid' ? hexToRgba(el.color || "#C47C2B", 0.25) : undefined}
                />
              );
            }
            if (el.type === 'circle') {
              return (
                <Circle
                  key={el.id}
                  {...commonProps}
                  radius={el.radius || 0}
                  stroke={el.color || "#C47C2B"}
                  strokeWidth={el.strokeWidth || 4}
                  hitStrokeWidth={Math.max(20, el.strokeWidth || 4)}
                  strokeScaleEnabled={false}
                  fillEnabled={el.fillType === 'solid'}
                  fill={el.fillType === 'solid' ? hexToRgba(el.color || "#C47C2B", 0.25) : undefined}
                />
              );
            }
            if (el.type === 'image' && el.image) {
              const isCropping = croppingElementId === el.id;
              
              if (isCropping) {
                // Determine the offset of the full image relative to the group's 0,0 locally
                const imgX = el.crop ? -el.crop.x : 0;
                const imgY = el.crop ? -el.crop.y : 0;

                return (
                  <Group key={el.id} {...commonProps} draggable={false}>
                    {/* Faded full image background entirely ignoring crop bounds to show full canvas context */}
                    <KonvaImage image={el.image} x={imgX} y={imgY} width={el.image.width} height={el.image.height} opacity={0.4} />
                    
                    {/* The Crop Box Overlay */}
                    <Rect 
                      id="cropBox"
                      x={0} 
                      y={0} 
                      width={el.crop ? el.crop.width : el.image.width} 
                      height={el.crop ? el.crop.height : el.image.height} 
                      draggable 
                      stroke="#FFFFFF" 
                      strokeWidth={2}
                      strokeScaleEnabled={false}
                    />
                  </Group>
                );
              } else {
                return (
                  <Group key={el.id} {...commonProps}>
                    <KonvaImage
                      image={el.image}
                      crop={el.crop}
                      width={el.crop ? el.crop.width : el.width || el.image.width}
                      height={el.crop ? el.crop.height : el.height || el.image.height}
                    />
                  </Group>
                );
              }
            }
            return null;
          })}

          {/* Teams / Players Layer */}
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
                  setEditingTeamId={(id: string) => {
                    setEditingTeamId(id);
                    setAddTeamModalOpen(true);
                  }}
                />
              ))}
            </React.Fragment>
          ))}
          
          {selectedPlayerId && (
            <Transformer 
              ref={playerTrRef} 
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) return oldBox;
                return newBox;
              }}
              borderStroke="#FFFFFF"
              anchorStroke="#FFFFFF"
              anchorFill="#C47C2B"
              anchorSize={8}
            />
          )}

          {selectedElementId && (
            <Transformer 
              ref={trRef} 
              boundBoxFunc={(oldBox, newBox) => {
                // limit resize bounds optionally
                if (newBox.width < 5 || newBox.height < 5) return oldBox;
                return newBox;
              }}
              borderStroke="#FFFFFF"
              anchorStroke="#FFFFFF"
              anchorFill="#C47C2B"
              anchorSize={8}
            />
          )}
        </Layer>

        {/* Dynamic Tool Overlays (Unscaled locally, inherits Stage zoom purely) */}
        <Layer id="toolOverlays" listening={false}>
          {activeTool === 'eraser' && (
            <Circle
              ref={eraserCursorRef}
              x={-1000} 
              y={-1000}
              radius={eraserSize / 2}
              stroke="#FFFFFF"
              strokeWidth={1 / zoom} 
              opacity={0.8}
              dash={[4 / zoom, 4 / zoom]}
            />
          )}
        </Layer>
      </Stage>

      {/* Floating Edit Team HTML Button Over the Canvas */}
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
    </div>
  );
}
