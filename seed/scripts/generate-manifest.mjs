#!/usr/bin/env node
/**
 * Generates seed/chapter-manifest.json — metadata for all 1200 chapters.
 * Merges hand-written beats from seed/outlines/vol-XX.json when present.
 * Run: npm run seed:manifest
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const { volumes } = JSON.parse(readFileSync(join(root, "arcs.json"), "utf-8"));

const SEGMENT_LABELS = ["Setup", "First Impact", "Systems Response", "Personal Climax", "Volume Bridge"];

function segmentForLocalChapter(local, volumeLength) {
  const p20 = Math.ceil(volumeLength * 0.22);
  const p45 = Math.ceil(volumeLength * 0.5);
  const p70 = Math.ceil(volumeLength * 0.78);
  const p90 = Math.ceil(volumeLength * 0.92);
  if (local <= p20) return { key: "A", label: SEGMENT_LABELS[0] };
  if (local <= p45) return { key: "B", label: SEGMENT_LABELS[1] };
  if (local <= p70) return { key: "C", label: SEGMENT_LABELS[2] };
  if (local <= p90) return { key: "D", label: SEGMENT_LABELS[3] };
  return { key: "E", label: SEGMENT_LABELS[4] };
}

function pad(n, w = 4) {
  return String(n).padStart(w, "0");
}

/** Load all seed/outlines/vol-XX.json into a map keyed by chapter id */
function loadOutlineChapters() {
  const byId = new Map();
  const dir = join(root, "outlines");
  if (!existsSync(dir)) return byId;

  for (const file of readdirSync(dir)) {
    if (!/^vol-\d+\.json$/i.test(file)) continue;
    const volOutline = JSON.parse(readFileSync(join(dir, file), "utf8"));
    for (const ch of volOutline.chapters ?? []) {
      byId.set(ch.id, { ...ch, outlineVolumeId: volOutline.volumeId });
    }
  }
  return byId;
}

function titleFor(vol, local) {
  if (local === vol.chapterEnd - vol.chapterStart + 1) {
    return `${vol.title} — Finale`;
  }
  return `${vol.title} — ${local}`;
}

function povFor(local) {
  const rotation = [
    "Cassian Reed",
    "Rowan Hale",
    "Adrian Hale",
    "Marcus Vale",
    "Nora Winters",
    "Selene Arkwright",
  ];
  return rotation[(local - 1) % rotation.length];
}

function synopsisFor(vol, segment, local) {
  return `Vol ${vol.number} "${vol.title}" (${segment.label}): ${vol.purpose} [local ch ${local}]`;
}

/**
 * Canonical in-world day calendar (global chapter number).
 * Vol 1 detailed calendar lives in seed/outlines/vol-01.json and overrides this.
 *
 * Vol 1: Ch1=day0 … Ch10=day9; day10 skipped; Ch11=day11 … Ch30=day30
 * Vol 2 early: continues +1/day through ~ch40
 */
function inWorldDayFor(globalNum) {
  if (globalNum <= 10) return globalNum - 1;
  if (globalNum <= 30) return 10 + (globalNum - 10);
  if (globalNum <= 40) return 30 + (globalNum - 30);
  return 40 + Math.floor((globalNum - 40) * 2.5);
}

function statusFor(globalNum, outlineStatus) {
  if (outlineStatus) return outlineStatus;
  if (globalNum === 1) return "published";
  if (globalNum <= 30) return "outlined";
  return "seed";
}

const outlineById = loadOutlineChapters();
const chapters = [];

for (const vol of volumes) {
  const volumeLength = vol.chapterEnd - vol.chapterStart + 1;
  for (let n = vol.chapterStart; n <= vol.chapterEnd; n++) {
    const local = n - vol.chapterStart + 1;
    const segment = segmentForLocalChapter(local, volumeLength);
    const id = `ch-${pad(n)}`;
    const outline = outlineById.get(id);

    chapters.push({
      id,
      number: n,
      volumeId: vol.id,
      volumeNumber: vol.number,
      volumeTitle: vol.title,
      ageId: vol.ageId,
      localChapter: local,
      segment: outline?.segment ?? segment.key,
      segmentLabel: segment.label,
      title: outline?.title ?? titleFor(vol, local),
      pov: outline?.pov ?? povFor(local),
      synopsis: outline?.synopsis ?? synopsisFor(vol, segment, local),
      status: statusFor(n, outline?.status),
      inWorldDay: outline?.inWorldDay ?? inWorldDayFor(n),
      wordTarget: outline?.wordTarget ?? 2100,
      outlineFile: vol.outlineFile,
    });
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  seriesId: "rapture-cycle",
  totalChapters: chapters.length,
  totalVolumes: volumes.length,
  calendarNotes:
    "In-world days: Vol1 Ch1=day0 (Rapture morning). Ch2–10=days1–9. Day10 intentionally unused (arc break). Ch11–30=days11–30. See seed/outlines/vol-01.json.",
  chapters,
};

writeFileSync(join(root, "chapter-manifest.json"), JSON.stringify(manifest, null, 2));
const outlined = chapters.filter((c) => c.synopsis && !c.synopsis.startsWith("Vol ")).length;
console.log(
  `Generated ${chapters.length} chapters across ${volumes.length} volumes → seed/chapter-manifest.json`
);
console.log(`  ${outlined} chapters with hand-written synopses from seed/outlines/`);
