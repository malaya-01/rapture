#!/usr/bin/env node
/**
 * Generates chapter-manifest.json per book from seed/<book>/arcs.json
 * Run: node seed/scripts/generate-manifest.mjs [--book <slug>]
 */
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { booksToProcess, resolveBookPaths } from "./book-config.mjs";

const SEGMENT_LABELS = [
  "Setup",
  "First Impact",
  "Systems Response",
  "Personal Climax",
  "Volume Bridge",
];

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

function loadOutlineChapters(outlinesDir) {
  const byId = new Map();
  if (!existsSync(outlinesDir)) return byId;

  for (const file of readdirSync(outlinesDir)) {
    if (!/^vol-\d+\.json$/i.test(file)) continue;
    const volOutline = JSON.parse(readFileSync(join(outlinesDir, file), "utf8"));
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

const POV_ROTATIONS = {
  rapture: [
    "Cassian Reed",
    "Rowan Hale",
    "Adrian Hale",
    "Marcus Vale",
    "Nora Winters",
    "Selene Arkwright",
  ],
  "echoes-of-the-void": [
    "Elarion Voss",
    "Lirien Thorne",
    "Seraphiel Kane",
    "Vesper Quill",
    "Aurelius Dawn",
    "Draven Valerius",
    "Kael Valerius",
    "Thorne Valerius",
    "Riven Valerius",
    "Soren Valerius",
  ],
  "the-hollow-canopy": [
    "Calder Rhys",
    "Ivo Maren",
    "Nia Okonkwo",
    "Mateo Solano",
    "Jun Park",
    "Sable Venn",
    "Priya Raman",
    "Ellis Ward",
  ],
};

function povFor(slug, local) {
  const rotation = POV_ROTATIONS[slug] ?? ["Unknown"];
  return rotation[(local - 1) % rotation.length];
}

function synopsisFor(vol, segment, local) {
  return `Vol ${vol.number} "${vol.title}" (${segment.label}): ${vol.purpose} [local ch ${local}]`;
}

function inWorldDayRapture(globalNum) {
  if (globalNum <= 10) return globalNum - 1;
  if (globalNum <= 30) return 10 + (globalNum - 10);
  if (globalNum <= 40) return 30 + (globalNum - 30);
  return 40 + Math.floor((globalNum - 40) * 2.5);
}

function inWorldDayEchoes(globalNum) {
  return Math.floor((globalNum - 1) * 3.5);
}

function inWorldDayCanopy(globalNum) {
  if (globalNum <= 9) return globalNum - 1;
  if (globalNum <= 18) return 8 + (globalNum - 9);
  if (globalNum <= 36) return 17 + Math.floor((globalNum - 18) * 1.2);
  return 40 + (globalNum - 36);
}

function statusFor(slug, globalNum, outlineStatus) {
  if (outlineStatus) return outlineStatus;
  if (slug === "rapture") {
    if (globalNum === 1) return "published";
    if (globalNum <= 30) return "outlined";
    return "seed";
  }
  if (slug === "echoes-of-the-void") {
    if (globalNum === 1) return "published";
    if (globalNum <= 45) return "outlined";
    return "seed";
  }
  if (slug === "the-hollow-canopy") {
    if (globalNum <= 9) return "published";
    return "outlined";
  }
  return "seed";
}

function generateForBook(book) {
  const paths = resolveBookPaths(book);
  const arcsPath = join(paths.seedDir, "arcs.json");
  const bookMetaPath = join(paths.seedDir, "book.json");
  if (!existsSync(arcsPath)) {
    console.warn(`Skip ${book.slug}: no arcs.json`);
    return;
  }

  const arcs = JSON.parse(readFileSync(arcsPath, "utf8"));
  const bookMeta = existsSync(bookMetaPath)
    ? JSON.parse(readFileSync(bookMetaPath, "utf8"))
    : { id: book.id };
  const { volumes } = arcs;
  const outlineById = loadOutlineChapters(paths.outlinesDir);
  const inWorldDay =
    book.slug === "echoes-of-the-void"
      ? inWorldDayEchoes
      : book.slug === "the-hollow-canopy"
        ? inWorldDayCanopy
        : inWorldDayRapture;

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
        ageId: vol.ageId ?? vol.actId ?? "act-1",
        localChapter: local,
        segment: outline?.segment ?? segment.key,
        segmentLabel: segment.label,
        title: outline?.title ?? titleFor(vol, local),
        pov: outline?.pov ?? povFor(book.slug, local),
        synopsis: outline?.synopsis ?? synopsisFor(vol, segment, local),
        status: statusFor(book.slug, n, outline?.status),
        inWorldDay: outline?.inWorldDay ?? inWorldDay(n),
        wordTarget:
          outline?.wordTarget ??
          (book.slug === "echoes-of-the-void"
            ? 5000
            : book.slug === "the-hollow-canopy"
              ? 2800
              : 2100),
        outlineFile: vol.outlineFile,
      });
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    seriesId: bookMeta.id ?? book.id,
    totalChapters: chapters.length,
    totalVolumes: volumes.length,
    chapters,
  };

  mkdirSync(paths.seedDir, { recursive: true });
  writeFileSync(paths.manifestOut, JSON.stringify(manifest, null, 2));
  console.log(
    `[${book.slug}] Generated ${chapters.length} chapters across ${volumes.length} volumes → ${paths.manifestOut}`
  );
}

for (const book of booksToProcess(process.argv)) {
  generateForBook(book);
}
