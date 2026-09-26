"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getBookData } from "@/lib/books/book-data";
import { getDefaultBook } from "@/data/books-registry";
import type {
  AmbientTrack,
  ReaderSettings,
  ReadingProgress,
} from "@/types";

interface BookReadingSlice {
  currentChapterId: string;
  progress: Record<string, ReadingProgress>;
  bookmarks: Record<string, number>;
}

interface ReadingState extends ReaderSettings {
  activeBookSlug: string;
  byBook: Record<string, BookReadingSlice>;
  ambientTrack: AmbientTrack;
  chromeVisible: boolean;

  setActiveBook: (bookSlug: string) => void;
  setChapter: (bookSlug: string, chapterId: string) => void;
  setScrollProgress: (
    bookSlug: string,
    chapterId: string,
    percent: number
  ) => void;
  markChapterComplete: (bookSlug: string, chapterId: string) => void;
  getBookOverallProgress: (bookSlug: string) => number;
  getOverallProgress: () => number;
  getChapterProgress: (bookSlug: string, chapterId: string) => number;
  isChapterComplete: (bookSlug: string, chapterId: string) => boolean;
  getBookmark: (bookSlug: string, chapterId: string) => number | null;
  setBookmark: (
    bookSlug: string,
    chapterId: string,
    scrollPercent: number
  ) => void;
  clearBookmark: (bookSlug: string, chapterId: string) => void;
  toggleBookmark: (
    bookSlug: string,
    chapterId: string,
    scrollPercent: number
  ) => void;
  getBookCurrentChapterId: (bookSlug: string) => string;
  /** @deprecated use getBookCurrentChapterId(activeBookSlug) */
  currentChapterId: string;
  setAmbientTrack: (track: AmbientTrack) => void;
  toggleChrome: () => void;
  setReaderSettings: (patch: Partial<ReaderSettings>) => void;
  exportProgress: () => string;
  importProgress: (json: string) => boolean;
}

function clampPercent(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

const defaultSettings: ReaderSettings = {
  fontSize: "md",
  lineWidth: "default",
  theme: "dark",
  reducedMotion: false,
};

function defaultSlice(bookSlug: string): BookReadingSlice {
  const data = getBookData(bookSlug);
  const first = data.firstReadableChapterId ?? data.chapters[0]?.id ?? "";
  return {
    currentChapterId: first,
    progress: {},
    bookmarks: {},
  };
}

function ensureSlice(
  byBook: Record<string, BookReadingSlice>,
  bookSlug: string
): BookReadingSlice {
  return byBook[bookSlug] ?? defaultSlice(bookSlug);
}

export const useReadingStore = create<ReadingState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      activeBookSlug: getDefaultBook().slug,
      byBook: {
        [getDefaultBook().slug]: defaultSlice(getDefaultBook().slug),
      },
      currentChapterId: defaultSlice(getDefaultBook().slug).currentChapterId,
      ambientTrack: "none",
      chromeVisible: true,

      setActiveBook: (bookSlug) => {
        set((state) => {
          const slice = ensureSlice(state.byBook, bookSlug);
          return {
            activeBookSlug: bookSlug,
            currentChapterId: slice.currentChapterId,
            byBook: { ...state.byBook, [bookSlug]: slice },
          };
        });
      },

      setChapter: (bookSlug, chapterId) => {
        const data = getBookData(bookSlug);
        const chapter = data.resolveChapter(chapterId);
        if (!chapter) return;
        set((state) => {
          const slice = ensureSlice(state.byBook, bookSlug);
          const next = {
            ...slice,
            currentChapterId: chapter.id,
          };
          return {
            activeBookSlug: bookSlug,
            currentChapterId: chapter.id,
            byBook: { ...state.byBook, [bookSlug]: next },
          };
        });
      },

      setScrollProgress: (bookSlug, chapterId, percent) => {
        const data = getBookData(bookSlug);
        const chapter = data.resolveChapter(chapterId);
        if (!chapter) return;

        const scrollPercent = clampPercent(percent);
        const completed = scrollPercent >= 98;

        set((state) => {
          const slice = ensureSlice(state.byBook, bookSlug);
          const next: BookReadingSlice = {
            ...slice,
            currentChapterId: chapter.id,
            progress: {
              ...slice.progress,
              [chapter.id]: {
                chapterId: chapter.id,
                scrollPercent,
                completed:
                  completed || slice.progress[chapter.id]?.completed === true,
                lastReadAt: new Date().toISOString(),
              },
            },
            bookmarks: {
              ...slice.bookmarks,
              [chapter.id]: scrollPercent,
            },
          };
          return {
            activeBookSlug: bookSlug,
            currentChapterId: chapter.id,
            byBook: { ...state.byBook, [bookSlug]: next },
          };
        });
      },

      markChapterComplete: (bookSlug, chapterId) => {
        const data = getBookData(bookSlug);
        const chapter = data.resolveChapter(chapterId);
        if (!chapter) return;
        set((state) => {
          const slice = ensureSlice(state.byBook, bookSlug);
          return {
            byBook: {
              ...state.byBook,
              [bookSlug]: {
                ...slice,
                progress: {
                  ...slice.progress,
                  [chapter.id]: {
                    chapterId: chapter.id,
                    scrollPercent: 100,
                    completed: true,
                    lastReadAt: new Date().toISOString(),
                  },
                },
              },
            },
          };
        });
      },

      getBookOverallProgress: (bookSlug) => {
        const data = getBookData(bookSlug);
        const total = data.manifestChapters.length || data.chapters.length;
        if (total === 0) return 0;
        const slice = ensureSlice(get().byBook, bookSlug);
        let sum = 0;
        for (const ch of data.manifestChapters) {
          const cp = slice.progress[ch.id];
          sum += cp?.completed ? 100 : cp?.scrollPercent ?? 0;
        }
        return Math.round(sum / total);
      },

      getOverallProgress: () => get().getBookOverallProgress(get().activeBookSlug),

      getChapterProgress: (bookSlug, chapterId) => {
        const data = getBookData(bookSlug);
        const chapter = data.resolveChapter(chapterId);
        const id = chapter?.id ?? chapterId;
        const slice = ensureSlice(get().byBook, bookSlug);
        const cp = slice.progress[id];
        if (cp?.completed) return 100;
        return cp?.scrollPercent ?? 0;
      },

      isChapterComplete: (bookSlug, chapterId) => {
        const data = getBookData(bookSlug);
        const chapter = data.resolveChapter(chapterId);
        const id = chapter?.id ?? chapterId;
        const slice = ensureSlice(get().byBook, bookSlug);
        return slice.progress[id]?.completed ?? false;
      },

      getBookmark: (bookSlug, chapterId) => {
        const data = getBookData(bookSlug);
        const chapter = data.resolveChapter(chapterId);
        const id = chapter?.id ?? chapterId;
        const slice = ensureSlice(get().byBook, bookSlug);
        const pct = slice.bookmarks[id];
        return pct === undefined ? null : pct;
      },

      setBookmark: (bookSlug, chapterId, scrollPercent) => {
        const data = getBookData(bookSlug);
        const chapter = data.resolveChapter(chapterId);
        const id = chapter?.id ?? chapterId;
        set((state) => {
          const slice = ensureSlice(state.byBook, bookSlug);
          return {
            byBook: {
              ...state.byBook,
              [bookSlug]: {
                ...slice,
                bookmarks: {
                  ...slice.bookmarks,
                  [id]: clampPercent(scrollPercent),
                },
              },
            },
          };
        });
      },

      clearBookmark: (bookSlug, chapterId) => {
        const data = getBookData(bookSlug);
        const chapter = data.resolveChapter(chapterId);
        const id = chapter?.id ?? chapterId;
        set((state) => {
          const slice = ensureSlice(state.byBook, bookSlug);
          const next = { ...slice.bookmarks };
          delete next[id];
          return {
            byBook: {
              ...state.byBook,
              [bookSlug]: { ...slice, bookmarks: next },
            },
          };
        });
      },

      toggleBookmark: (bookSlug, chapterId, scrollPercent) => {
        const existing = get().getBookmark(bookSlug, chapterId);
        if (existing !== null && Math.abs(existing - scrollPercent) < 3) {
          get().clearBookmark(bookSlug, chapterId);
        } else {
          get().setBookmark(bookSlug, chapterId, scrollPercent);
        }
      },

      getBookCurrentChapterId: (bookSlug) => {
        const slice = ensureSlice(get().byBook, bookSlug);
        const data = getBookData(bookSlug);
        const chapter = data.resolveChapter(slice.currentChapterId);
        if (chapter) return chapter.id;
        return data.firstReadableChapterId ?? slice.currentChapterId;
      },

      setAmbientTrack: (track) => set({ ambientTrack: track }),
      toggleChrome: () => set((s) => ({ chromeVisible: !s.chromeVisible })),

      setReaderSettings: (patch) => set((s) => ({ ...s, ...patch })),

      exportProgress: () => {
        const state = get();
        return JSON.stringify(
          {
            version: 3,
            exportedAt: new Date().toISOString(),
            activeBookSlug: state.activeBookSlug,
            byBook: state.byBook,
            ambientTrack: state.ambientTrack,
            fontSize: state.fontSize,
            lineWidth: state.lineWidth,
            theme: state.theme,
            reducedMotion: state.reducedMotion,
          },
          null,
          2
        );
      },

      importProgress: (json) => {
        try {
          const data = JSON.parse(json) as {
            version?: number;
            activeBookSlug?: string;
            byBook?: Record<string, BookReadingSlice>;
            currentChapterId?: string;
            progress?: Record<string, ReadingProgress>;
            bookmarks?: Record<string, number>;
            ambientTrack?: AmbientTrack;
            fontSize?: ReaderSettings["fontSize"];
            lineWidth?: ReaderSettings["lineWidth"];
            theme?: ReaderSettings["theme"];
            reducedMotion?: boolean;
          };

          if (data.version === 3 && data.byBook) {
            set({
              activeBookSlug: data.activeBookSlug ?? get().activeBookSlug,
              byBook: data.byBook,
              currentChapterId:
                data.byBook[data.activeBookSlug ?? get().activeBookSlug]
                  ?.currentChapterId ?? get().currentChapterId,
              ambientTrack: data.ambientTrack ?? get().ambientTrack,
              fontSize: data.fontSize ?? get().fontSize,
              lineWidth: data.lineWidth ?? get().lineWidth,
              theme: data.theme ?? get().theme,
              reducedMotion: data.reducedMotion ?? get().reducedMotion,
            });
            return true;
          }

          if (data.progress) {
            const slug = getDefaultBook().slug;
            set({
              byBook: {
                [slug]: {
                  currentChapterId: data.currentChapterId ?? "",
                  progress: data.progress,
                  bookmarks: data.bookmarks ?? {},
                },
              },
              currentChapterId: data.currentChapterId ?? "",
              ambientTrack: data.ambientTrack ?? get().ambientTrack,
              fontSize: data.fontSize ?? get().fontSize,
              lineWidth: data.lineWidth ?? get().lineWidth,
              theme: data.theme ?? get().theme,
              reducedMotion: data.reducedMotion ?? get().reducedMotion,
            });
            return true;
          }

          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "aether-library-reading-v3",
      partialize: (state) => ({
        activeBookSlug: state.activeBookSlug,
        byBook: state.byBook,
        ambientTrack: state.ambientTrack,
        fontSize: state.fontSize,
        lineWidth: state.lineWidth,
        theme: state.theme,
        reducedMotion: state.reducedMotion,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const slug = state.activeBookSlug || getDefaultBook().slug;
        const slice = ensureSlice(state.byBook ?? {}, slug);
        const data = getBookData(slug);
        const chapter = data.resolveChapter(slice.currentChapterId);
        if (!chapter && data.firstReadableChapterId) {
          slice.currentChapterId = data.firstReadableChapterId;
        } else if (chapter) {
          slice.currentChapterId = chapter.id;
        }
        state.byBook = { ...state.byBook, [slug]: slice };
        state.currentChapterId = slice.currentChapterId;
      },
      migrate: (persisted, version) => {
        const p = persisted as Record<string, unknown>;
        if (version < 3) {
          const slug = getDefaultBook().slug;
          const legacyProgress = (p.progress as Record<string, ReadingProgress>) ?? {};
          const legacyBookmarks = (p.bookmarks as Record<string, number>) ?? {};
          const legacyChapter =
            (p.currentChapterId as string) ??
            defaultSlice(slug).currentChapterId;
          return {
            ...p,
            version: 3,
            activeBookSlug: slug,
            byBook: {
              [slug]: {
                currentChapterId: legacyChapter,
                progress: legacyProgress,
                bookmarks: legacyBookmarks,
              },
            },
            currentChapterId: legacyChapter,
          };
        }
        return p;
      },
      version: 3,
    }
  )
);
