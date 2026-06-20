"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Stage, Layer, Circle, Group, Image as KonvaImage, Line, Text } from 'react-konva';
import gsap from 'gsap';
import Konva from 'konva';

export default function TeaserCanvas() {
  const [size, setSize] = useState({ width: 800, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Images
  const [erangelImg, setErangelImg] = useState<HTMLImageElement | null>(null);
  const [soulImg, setSoulImg] = useState<HTMLImageElement | null>(null);
  const [godlikeImg, setGodlikeImg] = useState<HTMLImageElement | null>(null);

  // Refs for animation
  const soulGroupRefs = useRef<(Konva.Group | null)[]>([]);
  const godlikeGroupRefs = useRef<(Konva.Group | null)[]>([]);
  const knockRefs = useRef<(Konva.Text | null)[]>([]); // To show red crosses
  const pathLayerRef = useRef<Konva.Layer>(null);
  const fightLaserRef = useRef<Konva.Line>(null);

  // Path lines
  const mortalPathRef = useRef<Konva.Line>(null);
  const neyoPathRef = useRef<Konva.Line>(null);
  const jonathanPathRef = useRef<Konva.Line>(null);
  const viperPathRef = useRef<Konva.Line>(null);
  const regaltosPathRef = useRef<Konva.Line>(null);
  const shadowPathRef = useRef<Konva.Line>(null);
  const owaisPathRef = useRef<Konva.Line>(null);

  const soulPlayers = useMemo(() => [
    { name: 'Mortal', x: 200, y: 180 },
    { name: 'Viper', x: 180, y: 240 },
    { name: 'Regaltos', x: 220, y: 120 },
    { name: 'Owais', x: 150, y: 280 }
  ], []);

  const godlikePlayers = useMemo(() => [
    { name: 'Jonathan', x: 600, y: 180 },
    { name: 'Zgod', x: 620, y: 240 },
    { name: 'Neyo', x: 580, y: 120 },
    { name: 'Shadow', x: 650, y: 280 }
  ], []);

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
      }
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Load images
  useEffect(() => {
    const loadImg = (url: string, setter: (img: HTMLImageElement) => void) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = url.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(url)}` : url;
      img.onload = () => setter(img);
      img.onerror = () => {
        console.warn('Failed to load image:', url);
        // We still want the animation to run even if an image fails
      };
    };

    loadImg('/erangel-map.jpg', setErangelImg);
    loadImg('https://liquipedia.net/commons/images/5/57/Team_Soul_2019_allmode.png', setSoulImg);
    loadImg('https://liquipedia.net/commons/images/thumb/2/24/GodLike_2021_allmode.png/900px-GodLike_2021_allmode.png', setGodlikeImg);
  }, []);

  // Draw Path Helper
  const animatePath = (lineRef: Konva.Line | null, points: number[], duration: number) => {
    if (!lineRef) return null;
    return gsap.to({ p: 0 }, {
      p: 1,
      duration,
      ease: 'power1.inOut',
      onStart: () => { lineRef.points([points[0], points[1]]); lineRef.opacity(1); },
      onUpdate: function() {
        const p = this.targets()[0].p;
        // Simple linear interpolation for multi-point paths
        // We accumulate total length to find exact segment, but for simplicity here we assume 2 or 3 points max
        if (points.length === 4) { // 1 segment
          const cx = points[0] + (points[2] - points[0]) * p;
          const cy = points[1] + (points[3] - points[1]) * p;
          lineRef.points([points[0], points[1], cx, cy]);
        } else if (points.length === 6) { // 2 segments
          if (p < 0.5) {
            const p1 = p * 2;
            const cx = points[0] + (points[2] - points[0]) * p1;
            const cy = points[1] + (points[3] - points[1]) * p1;
            lineRef.points([points[0], points[1], cx, cy]);
          } else {
            const p2 = (p - 0.5) * 2;
            const cx = points[2] + (points[4] - points[2]) * p2;
            const cy = points[3] + (points[5] - points[3]) * p2;
            lineRef.points([points[0], points[1], points[2], points[3], cx, cy]);
          }
        }
      }
    });
  };

  const animateMove = (nodeRef: Konva.Group | null, toX: number, toY: number, duration: number) => {
    if (!nodeRef) return null;
    return gsap.to(nodeRef, { x: toX, y: toY, duration, ease: 'power2.inOut' });
  };

  const animateLaser = (from: {x:number, y:number}, to: {x:number, y:number}) => {
    const laser = fightLaserRef.current;
    if (!laser) return null;
    return gsap.timeline()
      .set(laser, { points: [from.x, from.y, to.x, to.y], opacity: 1, strokeWidth: 4 })
      .to(laser, { opacity: 0, duration: 0.1, repeat: 5, yoyo: true })
      .set(laser, { opacity: 0 });
  };

  const setKnock = (knockRef: Konva.Text | null, groupRef: Konva.Group | null) => {
    if (!knockRef || !groupRef) return null;
    return gsap.timeline()
      .to(knockRef, { opacity: 1, duration: 0.2 })
      .to(groupRef, { opacity: 0.4, duration: 0.2 }, "<");
  };

  // Run GSAP Animation Sequence
  useEffect(() => {
    // Make sure we have the groups before running
    const hasSoulGroups = soulGroupRefs.current.filter(Boolean).length === 4;
    const hasGodlikeGroups = godlikeGroupRefs.current.filter(Boolean).length === 4;
    
    if (!hasSoulGroups || !hasGodlikeGroups) {
      // If refs aren't populated yet, we'll wait for a short tick
      const timer = setTimeout(() => {
        setSize(s => ({...s})); // Force re-trigger
      }, 100);
      return () => clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
      
      const reset = () => {
        // Reset player positions and opacity
        soulGroupRefs.current.forEach((node, i) => {
          if (!node) return;
          gsap.set(node, { x: soulPlayers[i].x, y: soulPlayers[i].y, opacity: 0 });
          node.scaleX(0.5);
          node.scaleY(0.5);
        });
        godlikeGroupRefs.current.forEach((node, i) => {
          if (!node) return;
          gsap.set(node, { x: godlikePlayers[i].x, y: godlikePlayers[i].y, opacity: 0 });
          node.scaleX(0.5);
          node.scaleY(0.5);
        });
        
        // Reset knocks
        knockRefs.current.forEach(node => { if (node) gsap.set(node, { opacity: 0 }); });

        // Reset paths and lasers — set points via Konva method to avoid GSAP coercing [] → 0
        [mortalPathRef, neyoPathRef, jonathanPathRef, viperPathRef, regaltosPathRef, shadowPathRef, owaisPathRef].forEach(ref => {
          if (ref.current) { ref.current.opacity(0); ref.current.points([]); }
        });
        if (fightLaserRef.current) fightLaserRef.current.opacity(0);
      };
      
      reset();

      // 1. Spawn in — animate scale via proxy to avoid Konva's composite 'scale' validator
      const allGroups = [...soulGroupRefs.current, ...godlikeGroupRefs.current].filter(Boolean) as Konva.Group[];
      allGroups.forEach((node, idx) => {
        const proxy = { val: 0.5 };
        tl.to(proxy, {
          val: 1,
          duration: 0.8,
          delay: idx * 0.05,
          ease: 'back.out(1.5)',
          onUpdate: () => { node.scaleX(proxy.val); node.scaleY(proxy.val); },
        }, 0); // all start at the current tl position (0 = start of this block)
      });
      tl.to(allGroups, { opacity: 1, duration: 0.8, stagger: 0.05, ease: 'back.out(1.5)' }, 0);

      tl.to({}, { duration: 0.5 });

      // 2. The First Knock
      // Mortal draws path and moves
      tl.add(animatePath(mortalPathRef.current, [200, 180, 400, 150], 0.6)!, "firstPush")
        .add(animatePath(neyoPathRef.current, [580, 120, 500, 150], 0.6)!, "firstPush")
        .add(animateMove(soulGroupRefs.current[0], 400, 150, 1)!, "firstPush+=0.7")
        .add(animateMove(godlikeGroupRefs.current[2], 500, 150, 1)!, "firstPush+=0.7");

      // Laser flash and knock Neyo
      tl.add(animateLaser({x:400, y:150}, {x:500, y:150})!, "firstKnock")
        .add(setKnock(knockRefs.current[6], godlikeGroupRefs.current[2])!, "firstKnock+=0.2");

      tl.to({}, { duration: 0.3 });

      // 3. The Trade
      // Jonathan rotates
      tl.add(animatePath(jonathanPathRef.current, [600, 180, 450, 200], 0.5)!, "trade")
        .add(animateMove(godlikeGroupRefs.current[0], 450, 200, 0.8)!, "trade+=0.6")
        .add(animateLaser({x:450, y:200}, {x:400, y:150})!, "trade+=1.5")
        .add(setKnock(knockRefs.current[0], soulGroupRefs.current[0])!, "trade+=1.7");

      tl.to({}, { duration: 0.3 });

      // 4. The Flank
      // Viper and Regaltos push from sides
      tl.add(animatePath(viperPathRef.current, [180, 240, 350, 280, 480, 250], 0.8)!, "flank")
        .add(animatePath(regaltosPathRef.current, [220, 120, 400, 80, 480, 120], 0.8)!, "flank")
        .add(animateMove(soulGroupRefs.current[1], 480, 250, 1.2)!, "flank+=0.9")
        .add(animateMove(soulGroupRefs.current[2], 480, 120, 1.2)!, "flank+=0.9");

      // Wipe front liners
      tl.add(animateLaser({x:480, y:250}, {x:620, y:240})!, "wipe1") // Viper to Zgod
        .add(animateLaser({x:480, y:120}, {x:450, y:200})!, "wipe1") // Regaltos to Jonathan
        .add(setKnock(knockRefs.current[5], godlikeGroupRefs.current[1])!, "wipe1+=0.2") // Zgod knocked
        .add(setKnock(knockRefs.current[4], godlikeGroupRefs.current[0])!, "wipe1+=0.2"); // Jonathan knocked

      tl.to({}, { duration: 0.3 });

      // 5. Hunt the straggler
      // Shadow retreats
      tl.add(animatePath(shadowPathRef.current, [650, 280, 750, 350], 0.4)!, "hunt")
        .add(animateMove(godlikeGroupRefs.current[3], 750, 350, 0.7)!, "hunt+=0.5")
      // Owais chases
        .add(animatePath(owaisPathRef.current, [150, 280, 500, 350, 650, 350], 0.8)!, "hunt+=0.2")
        .add(animateMove(soulGroupRefs.current[3], 650, 350, 1.2)!, "hunt+=1")
        .add(animateLaser({x:650, y:350}, {x:750, y:350})!, "hunt+=2.3")
        .add(setKnock(knockRefs.current[7], godlikeGroupRefs.current[3])!, "hunt+=2.5"); // Wipe

      // 6. Fade Out — same proxy approach for scale
      const fadeOutStart = "+=1.5";
      allGroups.forEach((node) => {
        const proxy = { val: 1 };
        tl.to(proxy, {
          val: 1.5,
          duration: 0.5,
          ease: 'power2.in',
          onUpdate: () => { node.scaleX(proxy.val); node.scaleY(proxy.val); },
        }, fadeOutStart);
      });
      tl.to(allGroups, { opacity: 0, duration: 0.5, ease: 'power2.in' }, fadeOutStart);
      
    });

    return () => ctx.revert();
  }, [size]); // Removed image dependencies so it runs regardless of image loading

  // Ensure Konva redraws during GSAP ticks
  useEffect(() => {
    const handleTicker = () => { pathLayerRef.current?.batchDraw(); };
    gsap.ticker.add(handleTicker);
    return () => gsap.ticker.remove(handleTicker);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#1A0F08] border border-white/5 rounded-[12px] overflow-hidden relative shadow-[0_0_30px_rgba(196,124,43,0.15)] pointer-events-none select-none">
      <Stage width={size.width} height={size.height}>
        <Layer>
          {/* Map Background */}
          {erangelImg && (
            <KonvaImage 
              image={erangelImg} 
              x={size.width / 2} 
              y={size.height / 2} 
              offsetX={erangelImg.width / 2}
              offsetY={erangelImg.height / 2}
              scaleX={size.width / erangelImg.width * 2} 
              scaleY={size.width / erangelImg.width * 2}
              opacity={0.65}
            />
          )}
        </Layer>
        
        <Layer ref={pathLayerRef}>
          {/* Path Lines */}
          <Line ref={mortalPathRef} stroke="#228B22" strokeWidth={2} dash={[5, 5]} opacity={0} />
          <Line ref={neyoPathRef} stroke="#FFD700" strokeWidth={2} dash={[5, 5]} opacity={0} />
          <Line ref={jonathanPathRef} stroke="#FFD700" strokeWidth={2} dash={[5, 5]} opacity={0} />
          <Line ref={viperPathRef} stroke="#228B22" strokeWidth={2} dash={[5, 5]} opacity={0} />
          <Line ref={regaltosPathRef} stroke="#228B22" strokeWidth={2} dash={[5, 5]} opacity={0} />
          <Line ref={shadowPathRef} stroke="#FFD700" strokeWidth={2} dash={[5, 5]} opacity={0} />
          <Line ref={owaisPathRef} stroke="#228B22" strokeWidth={2} dash={[5, 5]} opacity={0} />

          {/* Fight Laser */}
          <Line ref={fightLaserRef} stroke="#FF0000" strokeWidth={4} dash={[10, 5]} opacity={0} />

          {/* SouL Squad */}
          {soulPlayers.map((player, i) => (
            <Group 
              key={`soul-${i}`} 
              ref={(el) => { soulGroupRefs.current[i] = el; }}
              opacity={0}
            >
              <Circle radius={16} fill="#1A0F08" stroke="#228B22" strokeWidth={2} />
              {soulImg && (
                <KonvaImage 
                  image={soulImg} 
                  x={-10} y={-10} 
                  width={20} height={20} 
                />
              )}
              {/* Player Name */}
              <Text 
                text={player.name} 
                y={20} 
                offsetX={25} 
                width={50} 
                align="center" 
                fill="#FFFFFF" 
                fontSize={10} 
                fontFamily="Inter" 
                fontStyle="bold" 
                shadowColor="#000" 
                shadowBlur={4} 
              />
              {/* Knock Indicator */}
              <Text 
                ref={(el) => { knockRefs.current[i] = el; }}
                text="✚" 
                x={14} y={-22} 
                fontSize={14} 
                fill="#FF0000" 
                opacity={0} 
                shadowColor="#000" 
                shadowBlur={3} 
              />
            </Group>
          ))}

          {/* GodLike Squad */}
          {godlikePlayers.map((player, i) => (
            <Group 
              key={`godlike-${i}`} 
              ref={(el) => { godlikeGroupRefs.current[i] = el; }}
              opacity={0}
            >
              <Circle radius={16} fill="#1A0F08" stroke="#FFD700" strokeWidth={2} />
              {godlikeImg && (
                <KonvaImage 
                  image={godlikeImg} 
                  x={-10} y={-10} 
                  width={20} height={20} 
                />
              )}
              {/* Player Name */}
              <Text 
                text={player.name} 
                y={20} 
                offsetX={25} 
                width={50} 
                align="center" 
                fill="#FFFFFF" 
                fontSize={10} 
                fontFamily="Inter" 
                fontStyle="bold" 
                shadowColor="#000" 
                shadowBlur={4} 
              />
              {/* Knock Indicator */}
              <Text 
                ref={(el) => { knockRefs.current[i + 4] = el; }}
                text="✚" 
                x={14} y={-22} 
                fontSize={14} 
                fill="#FF0000" 
                opacity={0} 
                shadowColor="#000" 
                shadowBlur={3} 
              />
            </Group>
          ))}
        </Layer>
      </Stage>
      
      {/* Overlay Title */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
        <span className="font-bebas text-3xl tracking-widest text-[#F5ECD7] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] flex items-center gap-3">
          <span className="text-[#228B22]">SOUL</span> 
          <span className="text-[#7A6A55] text-xl">VS</span> 
          <span className="text-[#FFD700]">GODLIKE</span>
        </span>
        <span className="font-sora text-[10px] uppercase text-[#C47C2B] tracking-widest bg-[#0A0705CC] px-2 py-0.5 rounded border border-white/5 w-fit flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse" /> Live tactical simulation
        </span>
      </div>
    </div>
  );
}
