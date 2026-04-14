/**
 * Export hook — computes content bounding box and exports the Konva stage
 * as PNG, JPG, or PDF (via jspdf).
 *
 * Key behavior:
 * - Only exports the CONTENT area, not the full empty canvas
 * - Adds a small padding/border around the content (20px)
 * - Exports at 2× pixel ratio for high-quality output
 */
import { useBoardStore } from '../store/useBoardStore';
import { useBoardStageRef } from './useBoardStageRef';

const EXPORT_PADDING = 20; // px border around content
const PIXEL_RATIO = 2;     // 2× resolution

interface Bounds {
  minX: number; minY: number; maxX: number; maxY: number;
}

function getContentBounds(): Bounds | null {
  const { elements, teams, backgroundImage } = useBoardStore.getState();

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let hasContent = false;

  // Background image
  if (backgroundImage) {
    hasContent = true;
    minX = Math.min(minX, 0);
    minY = Math.min(minY, 0);
    maxX = Math.max(maxX, backgroundImage.width);
    maxY = Math.max(maxY, backgroundImage.height);
  }

  // Drawing elements
  for (const el of elements) {
    if (el.isLaser) continue; // skip ephemeral laser strokes

    const ex = el.x || 0;
    const ey = el.y || 0;
    const sx = el.scaleX || 1;
    const sy = el.scaleY || 1;

    if (el.type === 'line' || el.type === 'eraser') {
      const pts = el.points || [];
      for (let i = 0; i < pts.length - 1; i += 2) {
        hasContent = true;
        minX = Math.min(minX, pts[i]);
        minY = Math.min(minY, pts[i + 1]);
        maxX = Math.max(maxX, pts[i]);
        maxY = Math.max(maxY, pts[i + 1]);
      }
    } else if (el.type === 'rectangle') {
      hasContent = true;
      const w = (el.width || 0) * sx;
      const h = (el.height || 0) * sy;
      minX = Math.min(minX, ex, ex + w);
      minY = Math.min(minY, ey, ey + h);
      maxX = Math.max(maxX, ex, ex + w);
      maxY = Math.max(maxY, ey, ey + h);
    } else if (el.type === 'circle') {
      const r = (el.radius || 0) * Math.max(sx, sy);
      hasContent = true;
      minX = Math.min(minX, ex - r);
      minY = Math.min(minY, ey - r);
      maxX = Math.max(maxX, ex + r);
      maxY = Math.max(maxY, ey + r);
    } else if (el.type === 'image') {
      const w = (el.crop?.width || el.width || 0) * sx;
      const h = (el.crop?.height || el.height || 0) * sy;
      hasContent = true;
      minX = Math.min(minX, ex);
      minY = Math.min(minY, ey);
      maxX = Math.max(maxX, ex + w);
      maxY = Math.max(maxY, ey + h);
    } else if (el.type === 'text') {
      hasContent = true;
      const fontSize = el.fontSize || 20;
      const textLen = (el.text || '').length;
      // Rough estimate of text bounding box
      const estW = textLen * fontSize * 0.6 * sx;
      const estH = fontSize * 1.4 * sy;
      minX = Math.min(minX, ex);
      minY = Math.min(minY, ey);
      maxX = Math.max(maxX, ex + estW);
      maxY = Math.max(maxY, ey + estH);
    }
  }

  // Players
  for (const team of teams) {
    for (const player of team.players) {
      hasContent = true;
      const r = 20; // player node radius + name area
      minX = Math.min(minX, player.x - r);
      minY = Math.min(minY, player.y - r);
      maxX = Math.max(maxX, player.x + r);
      maxY = Math.max(maxY, player.y + 40); // account for name label below

      // Player animation paths
      if (player.animationPath) {
        for (let i = 0; i < player.animationPath.length - 1; i += 2) {
          minX = Math.min(minX, player.animationPath[i]);
          minY = Math.min(minY, player.animationPath[i + 1]);
          maxX = Math.max(maxX, player.animationPath[i]);
          maxY = Math.max(maxY, player.animationPath[i + 1]);
        }
      }
    }
  }

  if (!hasContent) return null;

  return {
    minX: minX - EXPORT_PADDING,
    minY: minY - EXPORT_PADDING,
    maxX: maxX + EXPORT_PADDING,
    maxY: maxY + EXPORT_PADDING,
  };
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAsPNG(stageRef: React.MutableRefObject<any>) {
  const stage = stageRef.current;
  if (!stage) return;

  const bounds = getContentBounds();
  if (!bounds) {
    alert('Nothing to export — add some content first!');
    return;
  }

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;

  const dataUrl = stage.toDataURL({
    x: bounds.minX,
    y: bounds.minY,
    width,
    height,
    pixelRatio: PIXEL_RATIO,
    mimeType: 'image/png',
  });

  triggerDownload(dataUrl, 'albus-board-export.png');
}

export function exportAsJPG(stageRef: React.MutableRefObject<any>) {
  const stage = stageRef.current;
  if (!stage) return;

  const bounds = getContentBounds();
  if (!bounds) {
    alert('Nothing to export — add some content first!');
    return;
  }

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;

  // For JPG, we need to draw on a white background canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width * PIXEL_RATIO;
  tempCanvas.height = height * PIXEL_RATIO;
  const ctx = tempCanvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#0F0A06'; // dark background matching the app
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Get the Konva export canvas
  const konvaCanvas = stage.toCanvas({
    x: bounds.minX,
    y: bounds.minY,
    width,
    height,
    pixelRatio: PIXEL_RATIO,
  });
  ctx.drawImage(konvaCanvas, 0, 0);

  const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
  triggerDownload(dataUrl, 'albus-board-export.jpg');
}

export async function exportAsPDF(stageRef: React.MutableRefObject<any>) {
  const stage = stageRef.current;
  if (!stage) return;

  const bounds = getContentBounds();
  if (!bounds) {
    alert('Nothing to export — add some content first!');
    return;
  }

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;

  // Generate high-res PNG for embedding in PDF
  const dataUrl = stage.toDataURL({
    x: bounds.minX,
    y: bounds.minY,
    width,
    height,
    pixelRatio: PIXEL_RATIO,
    mimeType: 'image/png',
  });

  // Dynamic import jsPDF to keep bundle sizes manageable
  const { jsPDF } = await import('jspdf');

  // Create PDF sized to content (in mm, 1px ≈ 0.264583mm)
  const pxToMm = 0.264583;
  const pdfWidth = width * pxToMm;
  const pdfHeight = height * pxToMm;

  const orientation = pdfWidth > pdfHeight ? 'landscape' : 'portrait';
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: [
      orientation === 'landscape' ? pdfHeight : pdfWidth,
      orientation === 'landscape' ? pdfWidth : pdfHeight,
    ],
  });

  doc.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
  doc.save('albus-board-export.pdf');
}
