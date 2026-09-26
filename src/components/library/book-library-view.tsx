"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, BookOpen, Lock, ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import { getCodexBasePath } from "@/lib/books/book-codex-data";
import {
  getBookData,
  getReadPath,
  getBookBasePath,
} from "@/lib/books/book-data";
import type { ManifestChapter } from "@/data/chapter-manifest";
import { useReadingStore } from "@/store/reading-store";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { VolumeExportButton } from "@/components/library/volume-export-button";
import { cn } from "@/lib/utils";

interface BookLibraryViewProps {
  bookSlug: string;
}

export function BookLibraryView({ bookSlug }: BookLibraryViewProps) {
  const router = useRouter();
  const data = getBookData(bookSlug);
  const { book, chapters, manifestVolumes, getChaptersByVolume } = data;
  const compiledIds = new Set(chapters.map((c) => c.id));

  const {
    getChapterProgress,
    isChapterComplete,
    setChapter,
    getBookCurrentChapterId,
    getBookOverallProgress,
  } = useReadingStore();

  const overallProgress = getBookOverallProgress(bookSlug);
  const continueId = getBookCurrentChapterId(bookSlug);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    [manifestVolumes[0]?.id ?? "vol-01"]: true,
  });

  const isReadable = (ch: ManifestChapter) =>
    data.isChapterReadable(ch.id, compiledIds);

  const handleChapterClick = (ch: ManifestChapter) => {
    if (!isReadable(ch)) return;
    setChapter(bookSlug, ch.id);
    router.push(getReadPath(bookSlug, ch.id));
  };

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-4xl px-5">
        <header className="mb-14 text-center">
          <Link
            href={getBookBasePath(bookSlug)}
            className="text-ui mb-6 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            {book.title}
          </Link>
          <p className="label-volume text-gold/50">All Chapters</p>
          <h1 className="title-legend embossed-gold mt-4">Volume Library</h1>
          <p className="mx-auto mt-4 max-w-lg font-serif text-lg italic text-text-muted">
            {book.subtitle} — {manifestVolumes.length} volumes,{" "}
            {book.totalChapters} chapters
          </p>
          <p className="text-ui mt-6 text-sm text-gold/60">
            {overallProgress}% of series explored
          </p>
          {continueId && compiledIds.has(continueId) && (
            <button
              type="button"
              onClick={() => router.push(getReadPath(bookSlug, continueId))}
              className="text-ui mt-6 rounded-sm border border-gold/30 bg-gold/10 px-6 py-2.5 text-sm text-gold hover:bg-gold/20"
            >
              Continue reading
            </button>
          )}
          {book.features.codex && (
            <Link
              href={getCodexBasePath(bookSlug)}
              className="text-ui mt-4 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold"
            >
              <BookOpen className="h-4 w-4" />
              Open Codex
            </Link>
          )}
        </header>

        <div className="space-y-6">
          {manifestVolumes.map((vol, volIndex) => {
            const volChapters = getChaptersByVolume(vol.id);
            const open = expanded[vol.id] ?? false;
            const publishedCount = volChapters.filter((c) => isReadable(c)).length;

            return (
              <motion.section
                key={vol.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(volIndex * 0.03, 0.3) }}
                className="codex-panel rounded-sm"
              >
                <div className="flex w-full items-center gap-4 p-5">
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((e) => ({ ...e, [vol.id]: !open }))
                    }
                    className="flex min-w-0 flex-1 items-center gap-4 text-left"
                  >
                    {open ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-gold/70" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-gold/70" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="label-volume text-[0.6rem]">
                        Volume {vol.number}
                      </p>
                      <h2 className="font-display text-lg text-gold">{vol.title}</h2>
                      <p className="mt-1 font-serif text-sm text-text-muted">
                        Chapters {vol.chapterStart}–{vol.chapterEnd} ·{" "}
                        {publishedCount > 0
                          ? `${publishedCount} available`
                          : "forthcoming"}
                      </p>
                    </div>
                  </button>
                  <VolumeExportButton
                    bookSlug={bookSlug}
                    volumeId={vol.id}
                    volumeTitle={vol.title}
                    publishedCount={publishedCount}
                    className="shrink-0"
                  />
                </div>

                {open && (
                  <ul className="border-t border-gold/10 px-3 py-2">
                    {volChapters.map((ch) => {
                      const readable = isReadable(ch);
                      const progress = getChapterProgress(bookSlug, ch.id);
                      const complete = isChapterComplete(bookSlug, ch.id);

                      return (
                        <li key={ch.id}>
                          <button
                            type="button"
                            disabled={!readable}
                            onClick={() => handleChapterClick(ch)}
                            className={cn(
                              "text-ui flex w-full items-center gap-3 rounded-sm px-4 py-3 text-left text-sm transition-colors",
                              readable
                                ? "hover:bg-gold/5"
                                : "cursor-not-allowed opacity-50"
                            )}
                          >
                            {complete ? (
                              <Check className="h-4 w-4 shrink-0 text-success" />
                            ) : readable ? (
                              <BookOpen className="h-4 w-4 shrink-0 text-gold/60" />
                            ) : (
                              <Lock className="h-4 w-4 shrink-0 text-text-muted" />
                            )}
                            <span className="w-14 shrink-0 text-text-muted">
                              {ch.number}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-text">
                              {ch.title}
                            </span>
                            {readable && progress > 0 && (
                              <span className="text-gold/50">{progress}%</span>
                            )}
                            {!readable && (
                              <span className="text-[0.6rem] tracking-wider text-text-muted uppercase">
                                {ch.status}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </motion.section>
            );
          })}
        </div>
      </div>
    </Atmosphere>
  );
}
