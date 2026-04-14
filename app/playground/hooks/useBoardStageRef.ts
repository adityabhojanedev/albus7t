/**
 * Shared Konva Stage ref — allows non-canvas components (e.g. Toolbar export)
 * to access the stage without prop-drilling.
 *
 * Pattern: module-level ref, read/write via exported functions.
 */
import Konva from 'konva';
import { MutableRefObject, createRef } from 'react';

const stageRef: MutableRefObject<Konva.Stage | null> = createRef<Konva.Stage>();

export function setBoardStageRef(stage: Konva.Stage | null) {
  (stageRef as MutableRefObject<Konva.Stage | null>).current = stage;
}

export function useBoardStageRef() {
  return stageRef;
}
