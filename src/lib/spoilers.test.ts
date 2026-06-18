import { describe, expect, it } from "vitest";
import {
  chapterIdToNumber,
  getMaxReadChapterNumber,
  filterRelationshipsByProgress,
  isSpoilerUnlocked,
} from "@/lib/spoilers";
import { relationships } from "@/data/relationships";

describe("spoilers", () => {
  it("parses chapter ids", () => {
    expect(chapterIdToNumber("ch-0001")).toBe(1);
    expect(chapterIdToNumber("ch-0042")).toBe(42);
  });

  it("computes max read chapter", () => {
    const progress = {
      "ch-0001": {
        chapterId: "ch-0001",
        scrollPercent: 50,
        completed: false,
        lastReadAt: "",
      },
      "ch-0003": {
        chapterId: "ch-0003",
        scrollPercent: 10,
        completed: false,
        lastReadAt: "",
      },
    };
    expect(getMaxReadChapterNumber(progress)).toBe(3);
  });

  it("filters relationships by minChapter", () => {
    const progress = {
      "ch-0001": {
        chapterId: "ch-0001",
        scrollPercent: 100,
        completed: true,
        lastReadAt: "",
      },
    };
    const visible = filterRelationshipsByProgress(relationships, progress);
    expect(visible.every((r) => r.minChapter <= 1)).toBe(true);
    expect(visible.length).toBeLessThan(relationships.length);
  });

  it("unlocks chapter 1 spoilers by default", () => {
    expect(isSpoilerUnlocked(1, {})).toBe(true);
    expect(isSpoilerUnlocked(500, {})).toBe(false);
  });
});
