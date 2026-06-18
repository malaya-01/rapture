"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { chapters, resolveChapter } from "@/data/chapters";
import { manifestChapters } from "@/data/chapter-manifest";
import type {
  AmbientTrack,
  ReaderSettings,
  ReadingProgress,
} from "@/types";

interface ReadingState extends ReaderSettings {
  currentChapterId: string;
  progress: Record<string, ReadingProgress>;
  bookmarks: Record<string, number>;
  ambientTrack: AmbientTrack;
  chromeVisible: boolean;

  setChapter: (chapterId: string) => void;
  setScrollProgress: (chapterId: string, percent: number) => void;
  markChapterComplete: (chapterId: string) => void;
  getOverallProgress: () => number;
  getChapterProgress: (chapterId: string) => number;
  isChapterComplete: (chapterId: string) => boolean;
  getBookmark: (chapterId: string) => number | null;
  setBookmark: (chapterId: string, scrollPercent: number) => void;
  clearBookmark: (chapterId: string) => void;
  toggleBookmark: (chapterId: string, scrollPercent: number) => void;
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

export const useReadingStore = create<ReadingState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      currentChapterId: chapters[0]?.id ?? "",
      progress: {},
      bookmarks: {},
      ambientTrack: "none",
      chromeVisible: true,

      setChapter: (chapterId) => {
        const chapter = resolveChapter(chapterId);
        if (!chapter) return;
        set({ currentChapterId: chapter.id });
      },

      setScrollProgress: (chapterId, percent) => {
        const chapter = resolveChapter(chapterId);
        if (!chapter) return;

        const scrollPercent = clampPercent(percent);
        const completed = scrollPercent >= 98;

        set((state) => ({
          currentChapterId: chapter.id,
          progress: {
            ...state.progress,
            [chapter.id]: {
              chapterId: chapter.id,
              scrollPercent,
              completed:
                completed || state.progress[chapter.id]?.completed === true,
              lastReadAt: new Date().toISOString(),
            },
          },
          bookmarks: {
            ...state.bookmarks,
            [chapter.id]: scrollPercent,
          },
        }));
      },

      markChapterComplete: (chapterId) => {
        const chapter = resolveChapter(chapterId);
        if (!chapter) return;
        set((state) => ({
          progress: {
            ...state.progress,
            [chapter.id]: {
              chapterId: chapter.id,
              scrollPercent: 100,
              completed: true,
              lastReadAt: new Date().toISOString(),
            },
          },
        }));
      },

      getOverallProgress: () => {
        const total = manifestChapters.length || chapters.length;
        if (total === 0) return 0;
        const { progress } = get();
        let sum = 0;
        for (const ch of manifestChapters) {
          const cp = progress[ch.id];
          sum += cp?.completed ? 100 : cp?.scrollPercent ?? 0;
        }
        return Math.round(sum / total);
      },

      getChapterProgress: (chapterId) => {
        const chapter = resolveChapter(chapterId);
        const id = chapter?.id ?? chapterId;
        const cp = get().progress[id];
        if (cp?.completed) return 100;
        return cp?.scrollPercent ?? 0;
      },

      isChapterComplete: (chapterId) => {
        const chapter = resolveChapter(chapterId);
        const id = chapter?.id ?? chapterId;
        return get().progress[id]?.completed ?? false;
      },

      getBookmark: (chapterId) => {
        const chapter = resolveChapter(chapterId);
        const id = chapter?.id ?? chapterId;
        const pct = get().bookmarks[id];
        return pct === undefined ? null : pct;
      },

      setBookmark: (chapterId, scrollPercent) => {
        const chapter = resolveChapter(chapterId);
        const id = chapter?.id ?? chapterId;
        set((state) => ({
          bookmarks: {
            ...state.bookmarks,
            [id]: clampPercent(scrollPercent),
          },
        }));
      },

      clearBookmark: (chapterId) => {
        const chapter = resolveChapter(chapterId);
        const id = chapter?.id ?? chapterId;
        set((state) => {
          const next = { ...state.bookmarks };
          delete next[id];
          return { bookmarks: next };
        });
      },

      toggleBookmark: (chapterId, scrollPercent) => {
        const existing = get().getBookmark(chapterId);
        if (existing !== null && Math.abs(existing - scrollPercent) < 3) {
          get().clearBookmark(chapterId);
        } else {
          get().setBookmark(chapterId, scrollPercent);
        }
      },

      setAmbientTrack: (track) => set({ ambientTrack: track }),
      toggleChrome: () => set((s) => ({ chromeVisible: !s.chromeVisible })),

      setReaderSettings: (patch) => set((s) => ({ ...s, ...patch })),

      exportProgress: () => {
        const state = get();
        return JSON.stringify(
          {
            version: 2,
            exportedAt: new Date().toISOString(),
            currentChapterId: state.currentChapterId,
            progress: state.progress,
            bookmarks: state.bookmarks,
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
          const data = JSON.parse(json) as Partial<ReadingState> & {
            version?: number;
          };
          if (!data.progress) return false;
          set({
            currentChapterId: data.currentChapterId ?? get().currentChapterId,
            progress: data.progress,
            bookmarks: data.bookmarks ?? get().bookmarks,
            ambientTrack: data.ambientTrack ?? get().ambientTrack,
            fontSize: data.fontSize ?? get().fontSize,
            lineWidth: data.lineWidth ?? get().lineWidth,
            theme: data.theme ?? get().theme,
            reducedMotion: data.reducedMotion ?? get().reducedMotion,
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "rapture-reading-v2",
      partialize: (state) => ({
        currentChapterId: state.currentChapterId,
        progress: state.progress,
        bookmarks: state.bookmarks,
        ambientTrack: state.ambientTrack,
        fontSize: state.fontSize,
        lineWidth: state.lineWidth,
        theme: state.theme,
        reducedMotion: state.reducedMotion,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state || chapters.length === 0) return;
        const chapter = resolveChapter(state.currentChapterId);
        if (!chapter) state.currentChapterId = chapters[0].id;
        else state.currentChapterId = chapter.id;
      },
    }
  )
);
