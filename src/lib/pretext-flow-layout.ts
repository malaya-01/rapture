import {
  layoutNextLine,
  prepareWithSegments,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";
import {
  carveTextLineSlots,
  getRectIntervalsForBand,
  type Interval,
  type Rect,
} from "./text-wrap-geometry";

export type PositionedLine = {
  x: number;
  y: number;
  width: number;
  slotWidth: number;
  text: string;
};

export function figureWidthPct(orientation: "landscape" | "portrait" | "square") {
  if (orientation === "portrait") return 0.38;
  if (orientation === "square") return 0.34;
  return 0.48;
}

export function figureAspect(orientation: "landscape" | "portrait" | "square") {
  if (orientation === "portrait") return 3 / 4;
  if (orientation === "square") return 1;
  return 16 / 9;
}

function pickWidestSlot(slots: Interval[]): Interval {
  return slots.reduce((best, slot) => {
    const bestWidth = best.right - best.left;
    const slotWidth = slot.right - slot.left;
    if (slotWidth > bestWidth) return slot;
    if (slotWidth < bestWidth) return best;
    return slot.left < best.left ? slot : best;
  });
}

/**
 * Layout body copy around a rectangular figure using Pretext's per-line API
 * and band-based obstacle carving (see @chenglou/pretext editorial-engine demo).
 */
export function layoutTextAroundFigure(
  prepared: PreparedTextWithSegments,
  columnWidth: number,
  figureRect: Rect,
  lineHeight: number,
  gap: number
): { lines: PositionedLine[]; height: number; cursor: LayoutCursor } {
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  const lines: PositionedLine[] = [];
  let lineTop = 0;
  let textExhausted = false;

  const obstacle: Rect = {
    x: figureRect.x,
    y: figureRect.y,
    width: figureRect.width,
    height: figureRect.height,
  };

  while (!textExhausted) {
    const bandTop = lineTop;
    const bandBottom = lineTop + lineHeight;
    const blocked = getRectIntervalsForBand(
      [obstacle],
      bandTop,
      bandBottom,
      gap,
      0
    );

    const slots = carveTextLineSlots({ left: 0, right: columnWidth }, blocked);
    if (slots.length === 0) {
      lineTop += lineHeight;
      if (lineTop > 200_000) break;
      continue;
    }

    const slot = pickWidestSlot(slots);
    const slotWidth = slot.right - slot.left;
    const line = layoutNextLine(prepared, cursor, slotWidth);
    if (line === null) {
      textExhausted = true;
      break;
    }

    lines.push({
      x: Math.round(slot.left),
      y: Math.round(lineTop),
      width: line.width,
      slotWidth,
      text: line.text,
    });
    cursor = line.end;
    lineTop += lineHeight;
  }

  const height = Math.max(lineTop, figureRect.y + figureRect.height);
  return { lines, height, cursor };
}

export function prepareFlowText(plainText: string, font: string) {
  return prepareWithSegments(plainText, font);
}
