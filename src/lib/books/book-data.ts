import type { CompiledChapter } from "@/types";
import type {
  ManifestChapter,
  ManifestVolume,
} from "@/data/chapter-manifest";
import type { Book } from "@/types/book";
import { getBookBySlug } from "@/data/books-registry";
import * as raptureChapters from "@/data/chapters";
import * as raptureManifest from "@/data/chapter-manifest";
import * as echoesChapters from "@/data/books/echoes-of-the-void/chapters";
import * as echoesManifest from "@/data/books/echoes-of-the-void/chapter-manifest";

export interface BookChapterData {
  chapters: CompiledChapter[];
  resolveChapter: (chapterId: string) => CompiledChapter | undefined;
  normalizeChapterId: (chapterId: string) => string;
}

export interface BookManifestData {
  manifestChapters: ManifestChapter[];
  manifestVolumes: ManifestVolume[];
  getManifestChapter: (chapterId: string) => ManifestChapter | undefined;
  getChaptersByVolume: (volumeId: string) => ManifestChapter[];
  isChapterReadable: (
    chapterId: string,
    compiledIds: Set<string>
  ) => boolean;
}

export interface BookData extends BookChapterData, BookManifestData {
  book: Book;
  firstReadableChapterId: string | null;
}

const CHAPTER_ID_RE = /^ch-(\d+)$/;

function normalizeId(chapterId: string): string {
  const match = CHAPTER_ID_RE.exec(chapterId);
  if (!match) return chapterId;
  return `ch-${match[1].padStart(4, "0")}`;
}

function wrapManifest(
  manifestChapters: ManifestChapter[],
  manifestVolumes: ManifestVolume[]
): Pick<
  BookManifestData,
  | "manifestChapters"
  | "manifestVolumes"
  | "getManifestChapter"
  | "getChaptersByVolume"
  | "isChapterReadable"
> {
  return {
    manifestChapters,
    manifestVolumes,
    getManifestChapter: (chapterId: string) => {
      const id = normalizeId(chapterId);
      return manifestChapters.find((c) => c.id === id);
    },
    getChaptersByVolume: (volumeId: string) =>
      manifestChapters.filter((c) => c.volumeId === volumeId),
    isChapterReadable: (chapterId: string, compiledIds: Set<string>) => {
      const id = normalizeId(chapterId);
      const manifest = manifestChapters.find((c) => c.id === id);
      return manifest?.status === "published" && compiledIds.has(id);
    },
  };
}

function firstReadable(
  chapters: CompiledChapter[],
  manifestChapters: ManifestChapter[]
): string | null {
  const compiled = new Set(chapters.map((c) => c.id));
  const readable = manifestChapters.filter(
    (c) => c.status === "published" && compiled.has(c.id)
  );
  if (readable.length > 0) return readable[0].id;
  return chapters[0]?.id ?? null;
}

function buildBookData(
  book: Book,
  chaptersMod: BookChapterData,
  manifestMod: BookManifestData
): BookData {
  const manifest = wrapManifest(
    manifestMod.manifestChapters,
    manifestMod.manifestVolumes
  );
  return {
    book,
    chapters: chaptersMod.chapters,
    resolveChapter: chaptersMod.resolveChapter,
    normalizeChapterId: chaptersMod.normalizeChapterId,
    ...manifest,
    firstReadableChapterId: firstReadable(
      chaptersMod.chapters,
      manifestMod.manifestChapters
    ),
  };
}

const registry: Record<string, BookData> = {
  rapture: buildBookData(
    getBookBySlug("rapture")!,
    raptureChapters,
    raptureManifest
  ),
  "echoes-of-the-void": buildBookData(
    getBookBySlug("echoes-of-the-void")!,
    echoesChapters,
    echoesManifest
  ),
};

export function getBookData(slug: string): BookData {
  const data = registry[slug];
  if (!data) throw new Error(`Unknown book slug: ${slug}`);
  return data;
}

export function getBookBasePath(slug: string): string {
  return `/books/${slug}`;
}

export function getReadPath(slug: string, chapterId: string): string {
  return `${getBookBasePath(slug)}/read/${chapterId}`;
}

export function getLibraryPath(slug: string): string {
  return `${getBookBasePath(slug)}/library`;
}

export function parseBookSlugFromPath(pathname: string): string | null {
  const match = /^\/books\/([^/]+)/.exec(pathname);
  return match?.[1] ?? null;
}
