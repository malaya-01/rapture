import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import type PDFKit from "pdfkit";
import { chapters, getChapterById } from "@/data/chapters";
import {
  getChaptersByVolume,
  getManifestChapter,
  manifestVolumes,
  type ManifestVolume,
} from "@/data/chapter-manifest";
import { bookMeta } from "@/data/book";
import { getImageEntry } from "@/lib/images";
import type { ChapterBlock, CompiledChapter } from "@/types";

const COMPILED_IDS = new Set(chapters.map((c) => c.id));

const MARGIN = 72;
const BODY_SIZE = 11;
const BODY_LEADING = 1.45;

export class VolumeExportError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "VolumeExportError";
  }
}

export function getExportableVolumeChapters(volumeId: string): {
  volume: ManifestVolume;
  chapters: CompiledChapter[];
} {
  const volume = manifestVolumes.find((v) => v.id === volumeId);
  if (!volume) {
    throw new VolumeExportError("Volume not found.", 404);
  }

  const manifestChapters = getChaptersByVolume(volumeId).filter(
    (ch) => ch.status === "published" && COMPILED_IDS.has(ch.id)
  );

  if (manifestChapters.length === 0) {
    throw new VolumeExportError(
      "No published chapters are available to export for this volume yet.",
      404
    );
  }

  const compiled = manifestChapters
    .map((m) => getChapterById(m.id))
    .filter((c): c is CompiledChapter => Boolean(c))
    .sort((a, b) => a.number - b.number);

  return { volume, chapters: compiled };
}

export function volumePdfFilename(volume: ManifestVolume): string {
  const slug = volume.title
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  return `Rapture_Vol${String(volume.number).padStart(2, "0")}_${slug}.pdf`;
}

/** Decode a minimal subset of HTML produced by compile-chapters.mjs. */
export function htmlToPlainText(html: string): string {
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<em>(.*?)<\/em>/gi, "_$1_")
    .replace(/<strong>(.*?)<\/strong>/gi, "$1")
    .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
    .replace(/<[^>]+>/g, "");

  text = text
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&hellip;/g, "\u2026")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  return text.replace(/\s+\n/g, "\n").trim();
}

function imagePathForId(id: string): string | null {
  const entry = getImageEntry(id);
  if (!entry || entry.status !== "present") return null;
  const filePath = path.join(process.cwd(), "public", entry.relativePath);
  return fs.existsSync(filePath) ? filePath : null;
}

function ensureSpace(doc: PDFKit.PDFDocument, minHeight: number) {
  const bottom = doc.page.height - MARGIN;
  if (doc.y + minHeight > bottom) {
    doc.addPage();
  }
}

function writeParagraph(doc: PDFKit.PDFDocument, text: string, opts?: { indent?: boolean }) {
  const plain = htmlToPlainText(text);
  if (!plain) return;
  ensureSpace(doc, BODY_SIZE * BODY_LEADING * 3);
  doc.font("Times-Roman").fontSize(BODY_SIZE).fillColor("#1a1a1a");
  const x = MARGIN + (opts?.indent ? 18 : 0);
  const width = doc.page.width - MARGIN * 2 - (opts?.indent ? 18 : 0);
  doc.text(plain, x, doc.y, {
    width,
    align: "justify",
    lineGap: BODY_SIZE * (BODY_LEADING - 1),
    paragraphGap: BODY_SIZE * 0.6,
  });
}

function writeSceneBreak(doc: PDFKit.PDFDocument) {
  ensureSpace(doc, 40);
  doc.moveDown(0.8);
  doc.font("Times-Roman").fontSize(BODY_SIZE).fillColor("#666666");
  doc.text("*  *  *", MARGIN, doc.y, {
    width: doc.page.width - MARGIN * 2,
    align: "center",
  });
  doc.moveDown(0.8);
}

function writeHeading(doc: PDFKit.PDFDocument, text: string) {
  ensureSpace(doc, 48);
  doc.moveDown(0.6);
  doc.font("Times-Bold").fontSize(12).fillColor("#333333");
  doc.text(text.toUpperCase(), MARGIN, doc.y, {
    width: doc.page.width - MARGIN * 2,
    align: "center",
    characterSpacing: 0.8,
  });
  doc.moveDown(0.5);
}

/** PDF export is text-first: captions are kept, images are omitted to avoid layout overlap and huge file sizes. */
const EMBED_IMAGES = false;

function writeFigure(
  doc: PDFKit.PDFDocument,
  figure: NonNullable<Extract<ChapterBlock, { type: "figure" }>["figure"]>
) {
  const imgPath = EMBED_IMAGES ? imagePathForId(figure.id) : null;
  const caption = [figure.title, figure.subtitle, figure.caption].filter(Boolean).join(" — ");

  if (imgPath) {
    ensureSpace(doc, 220);
    try {
      const maxWidth = doc.page.width - MARGIN * 2;
      const yBefore = doc.y;
      doc.image(imgPath, {
        fit: [maxWidth, 180],
        align: "center",
      });
      // pdfkit may not advance doc.y when fit scales oddly — always move past the image box
      if (doc.y <= yBefore + 4) {
        doc.y = yBefore + 180 + 10;
      }
      doc.moveDown(0.4);
    } catch {
      // Fall through to caption-only if image decode fails
    }
  }

  if (caption) {
    ensureSpace(doc, 36);
    doc.font("Times-Italic").fontSize(9).fillColor("#555555");
    const label = imgPath ? caption : `[Illustration: ${caption}]`;
    doc.text(label, MARGIN, doc.y, {
      width: doc.page.width - MARGIN * 2,
      align: "center",
    });
    doc.moveDown(0.6);
  }
}

function writeChapterOpening(doc: PDFKit.PDFDocument, chapter: CompiledChapter) {
  const opening = chapter.opening;
  if (!opening) return;
  writeFigure(doc, opening);
}

function writeBlock(doc: PDFKit.PDFDocument, block: ChapterBlock) {
  switch (block.type) {
    case "paragraph":
      writeParagraph(doc, block.html, { indent: !block.dropCap });
      break;
    case "heading":
      writeHeading(doc, block.text);
      break;
    case "break":
      writeSceneBreak(doc);
      break;
    case "figure":
      writeFigure(doc, block.figure);
      break;
    default:
      break;
  }
}

function writeChapter(doc: PDFKit.PDFDocument, chapter: CompiledChapter) {
  doc.addPage();

  const manifest = getManifestChapter(chapter.id);

  doc.font("Times-Roman").fontSize(10).fillColor("#888888");
  doc.text(chapter.volumeTitle ?? `Volume ${chapter.arcId.replace("arc-", "")}`, MARGIN, doc.y, {
    width: doc.page.width - MARGIN * 2,
    align: "center",
  });
  doc.moveDown(0.3);

  doc.font("Times-Bold").fontSize(20).fillColor("#1a1a1a");
  doc.text(`Chapter ${chapter.number}`, MARGIN, doc.y, {
    width: doc.page.width - MARGIN * 2,
    align: "center",
  });
  doc.moveDown(0.2);

  doc.font("Times-Bold").fontSize(16).fillColor("#1a1a1a");
  doc.text(chapter.title, MARGIN, doc.y, {
    width: doc.page.width - MARGIN * 2,
    align: "center",
  });
  doc.moveDown(0.5);

  if (manifest?.pov) {
    doc.font("Times-Italic").fontSize(10).fillColor("#666666");
    doc.text(`POV: ${manifest.pov}`, MARGIN, doc.y, {
      width: doc.page.width - MARGIN * 2,
      align: "center",
    });
    doc.moveDown(0.4);
  }

  if (chapter.epigraph) {
    doc.font("Times-Italic").fontSize(11).fillColor("#444444");
    doc.text(`\u201C${chapter.epigraph}\u201D`, MARGIN + 24, doc.y, {
      width: doc.page.width - MARGIN * 2 - 48,
      align: "center",
      lineGap: 2,
    });
    if (chapter.epigraphAttribution) {
      doc.moveDown(0.3);
      doc.fontSize(9).fillColor("#777777");
      doc.text(chapter.epigraphAttribution, MARGIN, doc.y, {
        width: doc.page.width - MARGIN * 2,
        align: "center",
      });
    }
    doc.moveDown(0.8);
  }

  if (chapter.summary) {
    doc.font("Times-Italic").fontSize(10).fillColor("#666666");
    doc.text(chapter.summary, MARGIN, doc.y, {
      width: doc.page.width - MARGIN * 2,
      align: "justify",
      lineGap: 1,
    });
    doc.moveDown(0.8);
  }

  doc.moveTo(MARGIN, doc.y).lineTo(doc.page.width - MARGIN, doc.y).strokeColor("#cccccc").stroke();
  doc.moveDown(0.8);

  writeChapterOpening(doc, chapter);

  for (const block of chapter.blocks) {
    writeBlock(doc, block);
  }
}

export function buildVolumePdfBuffer(volumeId: string): Promise<Buffer> {
  const { volume, chapters: volumeChapters } = getExportableVolumeChapters(volumeId);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margin: MARGIN,
      info: {
        Title: `${bookMeta.title}: Volume ${volume.number} — ${volume.title}`,
        Author: bookMeta.author,
        Subject: bookMeta.subtitle,
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Title page
    doc.font("Times-Roman").fontSize(11).fillColor("#888888");
    doc.text(bookMeta.title.toUpperCase(), MARGIN, doc.page.height * 0.32, {
      width: doc.page.width - MARGIN * 2,
      align: "center",
      characterSpacing: 2,
    });

    doc.font("Times-Bold").fontSize(28).fillColor("#1a1a1a");
    doc.text(`Volume ${volume.number}`, MARGIN, doc.y + 16, {
      width: doc.page.width - MARGIN * 2,
      align: "center",
    });

    doc.font("Times-Bold").fontSize(22).fillColor("#1a1a1a");
    doc.text(volume.title, MARGIN, doc.y + 8, {
      width: doc.page.width - MARGIN * 2,
      align: "center",
    });

    doc.font("Times-Italic").fontSize(12).fillColor("#555555");
    doc.text(bookMeta.subtitle, MARGIN, doc.y + 12, {
      width: doc.page.width - MARGIN * 2,
      align: "center",
    });

    doc.font("Times-Roman").fontSize(10).fillColor("#777777");
    doc.text(
      `Chapters ${volume.chapterStart}\u2013${volume.chapterEnd} \u00B7 ${volumeChapters.length} chapters in this export`,
      MARGIN,
      doc.y + 20,
      { width: doc.page.width - MARGIN * 2, align: "center" }
    );

    doc.fontSize(9).fillColor("#999999");
    doc.text(`By ${bookMeta.author}`, MARGIN, doc.page.height - MARGIN - 24, {
      width: doc.page.width - MARGIN * 2,
      align: "center",
    });

    volumeChapters.forEach((chapter) => {
      writeChapter(doc, chapter);
    });

    doc.end();
  });
}
