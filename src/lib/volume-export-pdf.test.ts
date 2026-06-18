import { describe, expect, it } from "vitest";
import {
  buildVolumePdfBuffer,
  getExportableVolumeChapters,
  htmlToPlainText,
  volumePdfFilename,
} from "@/lib/volume-export-pdf";
import { getChaptersByVolume } from "@/data/chapter-manifest";
import { chapters } from "@/data/chapters";

describe("volume-export-pdf", () => {
  it("decodes compiled HTML to plain text", () => {
    const text = htmlToPlainText(
      '<em>Call me</em> when you can. &mdash; <a href="/codex/x">Ashford</a>'
    );
    expect(text).toContain("_Call me_");
    expect(text).toContain("Ashford");
    expect(text).toContain("\u2014");
  });

  it("includes every published compiled chapter for vol-01", () => {
    const manifestPublished = getChaptersByVolume("vol-01").filter(
      (ch) => ch.status === "published"
    );
    const compiledIds = new Set(chapters.map((c) => c.id));
    const expected = manifestPublished.filter((ch) => compiledIds.has(ch.id));

    const { chapters: exported } = getExportableVolumeChapters("vol-01");
    expect(exported).toHaveLength(expected.length);
    expect(exported.map((c) => c.number)).toEqual(
      expected.map((c) => c.number).sort((a, b) => a - b)
    );
  });

  it("builds a non-empty PDF for vol-01", async () => {
    const pdf = await buildVolumePdfBuffer("vol-01");
    expect(pdf.length).toBeGreaterThan(50_000);
    expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  }, 60_000);

  it("names export files predictably", () => {
    const { volume } = getExportableVolumeChapters("vol-01");
    expect(volumePdfFilename(volume)).toMatch(/^Rapture_Vol01_.+\.pdf$/);
  });
});
