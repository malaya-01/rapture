#!/usr/bin/env node
/**
 * Compiles content/chapters/*.md → src/data/chapters.ts
 * Run: node seed/scripts/compile-chapters.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");
const chaptersDir = join(root, "content", "chapters");
const outFile = join(root, "src", "data", "chapters.ts");

const FIGURE_RE = /^@figure\{([^}]+)\}\s*$/;
const FIGURE_KV_RE = /(\w+)=("([^"]*)"|([^\s]+))/g;

function parseFigureAttrs(raw) {
  const attrs = {};
  let m;
  while ((m = FIGURE_KV_RE.exec(raw))) {
    attrs[m[1]] = m[3] ?? m[4];
  }
  const id = attrs.id;
  if (!id) throw new Error(`Figure missing id: @figure{${raw}}`);
  return {
    id,
    promptId: id,
    placement: attrs.placement ?? "wide",
    orientation: attrs.orientation ?? "landscape",
    title: attrs.title,
    subtitle: attrs.subtitle,
    caption: attrs.caption,
    color: attrs.color ?? "#8b6b2e",
  };
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: text.trim() };

  const meta = {};
  let currentKey = null;
  let indent = 0;

  for (const line of match[1].split("\n")) {
    const top = line.match(/^(\w+):\s*(.*)$/);
    if (top && !line.startsWith("  ")) {
      currentKey = top[1];
      const val = top[2].replace(/^["']|["']$/g, "").trim();
      meta[currentKey] = val;
      indent = 0;
      continue;
    }
    const nested = line.match(/^\s{2}(\w+):\s*(.*)$/);
    if (nested && currentKey) {
      if (!meta[currentKey] || typeof meta[currentKey] !== "object") {
        meta[currentKey] = {};
      }
      meta[currentKey][nested[1]] = nested[2].replace(/^["']|["']$/g, "").trim();
    }
  }

  return { meta, body: match[2].trim() };
}

const SCENE_BREAK_RE = /^\*\s*\*\s*\*$/;
const HEADING_RE = /^#{1,3}\s+(.+)$/;

function proseToHtml(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function parseBody(body, chapterId) {
  const blocks = [];
  const sections = body.split(/\n---\n/);

  for (const section of sections) {
    const lines = section.trim().split("\n");
    let paragraphLines = [];

    const flushParagraph = (dropCap = false) => {
      const text = paragraphLines.join("\n").trim();
      paragraphLines = [];
      if (!text) return;
      blocks.push({
        type: "paragraph",
        html: proseToHtml(text),
        dropCap,
      });
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        flushParagraph();
        continue;
      }

      if (SCENE_BREAK_RE.test(trimmed)) {
        flushParagraph();
        blocks.push({ type: "break" });
        continue;
      }

      const headingMatch = HEADING_RE.exec(trimmed);
      if (headingMatch) {
        flushParagraph();
        blocks.push({ type: "heading", text: headingMatch[1].trim() });
        continue;
      }

      const figMatch = FIGURE_RE.exec(trimmed);
      if (figMatch) {
        flushParagraph();
        blocks.push({ type: "figure", figure: parseFigureAttrs(figMatch[1]) });
        continue;
      }

      paragraphLines.push(line);
    }

    flushParagraph();
    if (sections.indexOf(section) < sections.length - 1) {
      blocks.push({ type: "break" });
    }
  }

  // Drop cap on first paragraph only
  const firstPara = blocks.find((b) => b.type === "paragraph");
  if (firstPara) firstPara.dropCap = true;

  return blocks;
}

function buildOpeningFigure(meta, chapterId, title) {
  const opening = meta.opening;
  if (typeof opening === "object" && opening.id) {
    return {
      id: opening.id,
      promptId: opening.id,
      placement: opening.placement ?? "wide",
      orientation: opening.orientation ?? "landscape",
      title: opening.title ?? title,
      subtitle: opening.subtitle,
      caption: opening.caption,
      color: opening.color ?? "#8b6b2e",
    };
  }
  if (meta.opening_id) {
    return {
      id: meta.opening_id,
      promptId: meta.opening_id,
      placement: meta.opening_placement ?? "wide",
      orientation: meta.opening_orientation ?? "landscape",
      title: meta.opening_title ?? title,
      subtitle: meta.opening_subtitle,
      caption: meta.opening_caption,
      color: meta.opening_color ?? "#8b6b2e",
    };
  }
  return {
    id: `${chapterId}-opening`,
    promptId: `${chapterId}-opening`,
    placement: "wide",
    orientation: "landscape",
    title,
    color: "#8b6b2e",
  };
}

function compileChapterFile(filename) {
  const raw = readFileSync(join(chaptersDir, filename), "utf8");
  const { meta, body } = parseFrontmatter(raw);
  const num = parseInt(meta.chapter ?? filename.match(/(\d+)/)?.[1] ?? "0", 10);
  const id = `ch-${String(num).padStart(4, "0")}`;
  const title = meta.title ?? `Chapter ${num}`;
  const arcNum = parseInt(meta.volume ?? "1", 10);

  return {
    id,
    number: num,
    title,
    arcId: `arc-${meta.volume ?? 1}`,
    volumeTitle: meta.volume_title ?? `Volume ${meta.volume ?? arcNum} — The Fractured Sky`,
    epigraph: meta.epigraph,
    epigraphAttribution: meta.epigraph_attribution ?? meta.epigraphAttribution,
    summary: meta.summary ?? "",
    opening: buildOpeningFigure(meta, id, title),
    blocks: parseBody(body, id),
  };
}

function collectScenes(chapters) {
  const scenes = [];
  const seen = new Set();
  for (const ch of chapters) {
    if (ch.opening?.id && !seen.has(ch.opening.id)) {
      seen.add(ch.opening.id);
      scenes.push({
        id: ch.opening.id,
        chapterId: ch.id,
        chapterTitle: ch.title,
        title: `${ch.title} — Chapter Opening`,
        sceneType: "opening",
        description: ch.summary || ch.opening.caption || ch.opening.title,
        subtitle: ch.opening.subtitle,
        caption: ch.opening.caption,
        orientation: ch.opening.orientation,
        placement: ch.opening.placement,
      });
    }
    for (const block of ch.blocks) {
      if (block.type !== "figure") continue;
      const f = block.figure;
      if (seen.has(f.id)) continue;
      seen.add(f.id);
      scenes.push({
        id: f.id,
        chapterId: ch.id,
        chapterTitle: ch.title,
        title: f.title ?? f.id,
        sceneType: "scene",
        description: f.caption || f.subtitle || f.title || f.id,
        subtitle: f.subtitle,
        caption: f.caption,
        orientation: f.orientation,
        placement: f.placement,
      });
    }
  }
  return scenes;
}

if (!existsSync(chaptersDir)) {
  console.error("No content/chapters directory");
  process.exit(1);
}

const files = readdirSync(chaptersDir)
  .filter((f) => f.endsWith(".md"))
  .sort();

const chapters = files.map(compileChapterFile);
const scenes = collectScenes(chapters);

const ts = `/** AUTO-GENERATED by seed/scripts/compile-chapters.mjs — edit content/chapters/*.md instead */
import type { CompiledChapter } from "@/types";

const CHAPTER_ID_RE = /^ch-(\\d+)$/;

export function normalizeChapterId(chapterId: string): string {
  const match = CHAPTER_ID_RE.exec(chapterId);
  if (!match) return chapterId;
  return \`ch-\${match[1].padStart(4, "0")}\`;
}

export const chapters: CompiledChapter[] = ${JSON.stringify(chapters, null, 2)} as CompiledChapter[];

export function resolveChapter(chapterId: string): CompiledChapter | undefined {
  return (
    getChapterById(chapterId) ?? getChapterById(normalizeChapterId(chapterId))
  );
}

export function getChapterById(id: string) {
  return chapters.find((ch) => ch.id === id);
}

export function getChaptersByArc(arcId: string) {
  return chapters.filter((ch) => ch.arcId === arcId);
}

export function getTotalBlocks() {
  return chapters.reduce((sum, ch) => sum + ch.blocks.length, 0);
}

export function getChapterIndex(chapterId: string) {
  const chapter = resolveChapter(chapterId);
  if (!chapter) return -1;
  return chapters.findIndex((ch) => ch.id === chapter.id);
}

/** @deprecated use getTotalBlocks */
export function getTotalPages() {
  return getTotalBlocks();
}

/** @deprecated legacy page index */
export function getGlobalPageIndex(chapterId: string, pageIndex: number) {
  let index = 0;
  for (const chapter of chapters) {
    if (chapter.id === chapterId) return index + pageIndex;
    index += chapter.blocks.length;
  }
  return index;
}

export const chapterSceneRegistry = ${JSON.stringify(scenes, null, 2)} as const;
`;

writeFileSync(outFile, ts, "utf8");
writeFileSync(
  join(root, "seed", "chapter-scenes.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), scenes }, null, 2),
  "utf8"
);
console.log(`Compiled ${chapters.length} chapter(s), ${scenes.length} scene(s) → src/data/chapters.ts`);
