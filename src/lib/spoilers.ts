import type { ReadingProgress } from "@/types";
import type { Relationship } from "@/types";

const CHAPTER_NUM_RE = /ch-(\d+)/i;

export function chapterIdToNumber(chapterId: string): number {
  const match = CHAPTER_NUM_RE.exec(chapterId);
  return match ? parseInt(match[1], 10) : 0;
}

/** Highest chapter number the reader has meaningfully engaged with. */
export function getMaxReadChapterNumber(
  progress: Record<string, ReadingProgress>
): number {
  let max = 0;
  for (const [chapterId, entry] of Object.entries(progress)) {
    if (!entry || (entry.scrollPercent <= 0 && !entry.completed)) continue;
    max = Math.max(max, chapterIdToNumber(chapterId));
  }
  return max;
}

export function isSpoilerUnlocked(
  minChapter: number,
  progress: Record<string, ReadingProgress>
): boolean {
  if (minChapter <= 1) return true;
  return getMaxReadChapterNumber(progress) >= minChapter;
}

export function isFirstAppearanceUnlocked(
  firstAppearance: string | undefined,
  progress: Record<string, ReadingProgress>
): boolean {
  if (!firstAppearance) return true;
  const min = chapterIdToNumber(firstAppearance);
  if (min <= 1) return true;
  return getMaxReadChapterNumber(progress) >= min;
}

export function filterRelationshipsByProgress(
  relationships: Relationship[],
  progress: Record<string, ReadingProgress>
): Relationship[] {
  const max = getMaxReadChapterNumber(progress);
  return relationships.filter((r) => {
    if (r.minChapter <= max) return true;
    return false;
  });
}

export function relationshipLabelForProgress(
  relationship: Relationship,
  progress: Record<string, ReadingProgress>
): string {
  const max = getMaxReadChapterNumber(progress);
  if (!relationship.stages?.length) return relationship.label;
  const stage = relationship.stages.find((s) => max <= s.untilChapter);
  if (!stage) return relationship.label;
  return stage.stage.replace(/-/g, " ");
}
