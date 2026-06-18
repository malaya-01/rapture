/** Interval helpers for Pretext band-based text routing (from @chenglou/pretext demos). */

export type Interval = {
  left: number;
  right: number;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function getRectIntervalsForBand(
  rects: Rect[],
  bandTop: number,
  bandBottom: number,
  horizontalPadding: number,
  verticalPadding: number
): Interval[] {
  const intervals: Interval[] = [];
  for (const rect of rects) {
    if (
      bandBottom <= rect.y - verticalPadding ||
      bandTop >= rect.y + rect.height + verticalPadding
    ) {
      continue;
    }
    intervals.push({
      left: rect.x - horizontalPadding,
      right: rect.x + rect.width + horizontalPadding,
    });
  }
  return intervals;
}

export function carveTextLineSlots(
  base: Interval,
  blocked: Interval[]
): Interval[] {
  let slots: Interval[] = [base];

  for (const interval of blocked) {
    const next: Interval[] = [];
    for (const slot of slots) {
      if (interval.right <= slot.left || interval.left >= slot.right) {
        next.push(slot);
        continue;
      }
      if (interval.left > slot.left) {
        next.push({ left: slot.left, right: interval.left });
      }
      if (interval.right < slot.right) {
        next.push({ left: interval.right, right: slot.right });
      }
    }
    slots = next;
  }

  return slots.filter((slot) => slot.right - slot.left >= 24);
}
