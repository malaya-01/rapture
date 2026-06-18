"use client";

import { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { chapters, resolveChapter } from "@/data/chapters";
import { bookMeta } from "@/data/book";
import { useReadingStore } from "@/store/reading-store";
import { useReadingSession } from "@/hooks/use-reading-session";
import { useAmbientSound } from "@/lib/ambient-sound";
import { scrollWindowToPercent } from "@/lib/reading-scroll";
import { useGuardedReaderNavigation } from "@/lib/reading-navigation";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { ScrollProgressBar } from "./reader-primitives";
import { ChapterRenderer, ChapterHeader } from "./chapter-renderer";
import { ReaderToolbar } from "./reader-toolbar";
import {
  ReaderSettingsPanel,
  readerSettingsClassName,
} from "./reader-settings";
import { LeaveChapterConfirm } from "./leave-chapter-confirm";
import { cn } from "@/lib/utils";

interface ImmersiveReaderProps {
  chapterId: string;
}

export function ImmersiveReader({ chapterId }: ImmersiveReaderProps) {
  const {
    setChapter,
    ambientTrack,
    setAmbientTrack,
    chromeVisible,
    toggleChrome,
    progress,
    getBookmark,
    fontSize,
    lineWidth,
    theme,
    reducedMotion,
  } = useReadingStore();

  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setChapter(chapterId);
  }, [chapterId, setChapter]);

  useAmbientSound(ambientTrack);

  const chapter = resolveChapter(chapterId) ?? chapters[0];
  const chapterIndex = chapters.findIndex((c) => c.id === chapter?.id);
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  const savedScroll = chapter ? (progress[chapter.id]?.scrollPercent ?? 0) : 0;
  const bookmarkPercent = chapter ? getBookmark(chapter.id) : null;

  const { flushSave } = useReadingSession({
    chapterId: chapter?.id ?? "",
    chapterTitle: chapter?.title ?? "",
    enabled: !!chapter,
  });

  const { push } = useGuardedReaderNavigation(
    chapter?.title ?? "",
    !!chapter,
    flushSave
  );

  const goToChapter = useCallback(
    (id: string) => {
      if (!chapter || id === chapter.id) return;
      flushSave();
      setChapter(id);
      push(`/read/${id}`);
    },
    [chapter, flushSave, setChapter, push]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "ArrowLeft" && prevChapter) goToChapter(prevChapter.id);
      if (e.key === "ArrowRight" && nextChapter) goToChapter(nextChapter.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToChapter, prevChapter, nextChapter]);

  if (!chapter) {
    return (
      <Atmosphere>
        <div className="flex min-h-screen items-center justify-center text-text-muted">
          No chapters available. Add markdown to content/chapters/ and run npm
          run seed:chapters
        </div>
      </Atmosphere>
    );
  }

  const settingsClass = readerSettingsClassName({
    fontSize,
    lineWidth,
    theme,
    reducedMotion,
  });

  return (
    <Atmosphere particles={ambientTrack === "none"}>
      <LeaveChapterConfirm />
      <ScrollProgressBar />

      <button
        type="button"
        onClick={toggleChrome}
        className={cn(
          "text-ui fixed right-4 top-4 z-50 rounded-md border border-gold/15 bg-bg-elevated/80 px-3 py-1.5 text-xs text-text-muted backdrop-blur-md transition-opacity",
          chromeVisible ? "opacity-100" : "opacity-0 hover:opacity-100"
        )}
      >
        {chromeVisible ? "Hide controls" : "Show controls"}
      </button>

      <article
        className={cn(
          "page-shell reader-shell mx-auto w-full px-5 md:px-8",
          settingsClass,
          lineWidth === "narrow" && "max-w-[720px]",
          lineWidth === "default" && "max-w-[1000px]",
          lineWidth === "wide" && "max-w-[1200px]"
        )}
      >
        <header className="mb-16">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.9, delay: 0.15 }}
          >
            <ChapterHeader
              chapter={chapter}
              bookTitle={bookMeta.title.toUpperCase()}
            />
          </motion.div>
        </header>

        <ChapterRenderer chapter={chapter} />
      </article>

      <ReaderToolbar
        chapter={chapter}
        chapterIndex={chapterIndex}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        scrollPercent={savedScroll}
        bookmarkPercent={bookmarkPercent}
        ambientTrack={ambientTrack}
        visible={chromeVisible}
        onChapterChange={goToChapter}
        onJumpToBookmark={() => {
          const pct = bookmarkPercent ?? savedScroll;
          if (pct > 0) scrollWindowToPercent(pct, "smooth");
        }}
        onAmbientChange={setAmbientTrack}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <ReaderSettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </Atmosphere>
  );
}
