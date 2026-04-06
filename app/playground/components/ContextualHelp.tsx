"use client";

import { useBoardStore } from '../store/useBoardStore';

export default function ContextualHelp() {
  const activeTool = useBoardStore(s => s.activeTool);
  const stagedFight = useBoardStore(s => s.stagedFight);

  let content: React.ReactNode = null;
  let borderColor = '#C47C2B';

  switch (activeTool) {
    case 'path':
      content = (
        <>
          <span className="text-base mr-1">📍</span>
          <div>
            <span className="text-[#F5ECD7] text-xs font-sora font-bold">Path Tool</span>
            <p className="text-[#A89A85] text-[11px] font-inter leading-snug mt-0.5">
              Click a player, then click and drag on the map to draw their rotation path.
            </p>
          </div>
        </>
      );
      borderColor = '#C47C2B';
      break;

    case 'fight':
      content = (
        <>
          <span className="text-base mr-1">⚔️</span>
          <div>
            <span className="text-[#F5ECD7] text-xs font-sora font-bold">Fight Tool Sequence</span>
            <ol className="text-[#A89A85] text-[11px] font-inter leading-snug mt-1 list-decimal list-inside space-y-0.5">
              <li className={stagedFight.step === 'selectP1' ? 'text-[#FF6B6B] font-semibold' : ''}>
                Click Attacker (P1)
              </li>
              <li className={stagedFight.step === 'drawP1' ? 'text-[#FF6B6B] font-semibold' : ''}>
                <span className="text-[#7A6A55] text-[10px]">(Optional)</span> Drag from P1 to draw movement path
              </li>
              <li className={stagedFight.step === 'selectP2' ? 'text-[#FF6B6B] font-semibold' : ''}>
                Click Victim (P2)
              </li>
              <li className={stagedFight.step === 'drawP2' ? 'text-[#FF6B6B] font-semibold' : ''}>
                <span className="text-[#7A6A55] text-[10px]">(Optional)</span> Drag from P2 to draw movement path
              </li>
              <li className={stagedFight.step === 'ready' ? 'text-[#34C759] font-semibold' : ''}>
                Select outcome and click Play
              </li>
            </ol>
          </div>
        </>
      );
      borderColor = '#FF3B30';
      break;

    case 'revive':
      content = (
        <>
          <span className="text-base mr-1">⚕️</span>
          <div>
            <span className="text-[#F5ECD7] text-xs font-sora font-bold">Revive Tool</span>
            <ol className="text-[#A89A85] text-[11px] font-inter leading-snug mt-1 list-decimal list-inside space-y-0.5">
              <li>Click alive teammate (medic)</li>
              <li>Drag path towards knocked teammate</li>
              <li>Click knocked teammate to initiate revive sequence</li>
            </ol>
          </div>
        </>
      );
      borderColor = '#34C759';
      break;

    default:
      return null;
  }

  return (
    <div className="absolute bottom-4 left-4 z-40 max-w-[280px] animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div
        className="bg-[#0A0705E6] backdrop-blur-xl rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-3 flex items-start gap-2"
        style={{ borderLeft: `3px solid ${borderColor}` }}
      >
        {content}
      </div>
    </div>
  );
}
