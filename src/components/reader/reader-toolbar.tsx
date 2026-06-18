"use client";

import { useCallback, useState } from "react";
import {
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  List,
  Settings,
  Volume2,
} from "lucide-react";
import { chapters } from "@/data/chapters";
import type { CompiledChapter } from "@/types";
import type { AmbientTrack } from "@/types";
import { cn } from "@/lib/utils";

const AMBIENT_OPTIONS: { id: AmbientTrack; label: string }[] = [
  { id: "none", label: "Off" },
  { id: "library", label: "Library" },
  { id: "rain", label: "Rain" },
  { id: "wind", label: "Wind" },
  { id: "fireplace", label: "Fireplace" },
  { id: "music", label: "Music" },
];

interface ReaderToolbarProps {
  chapter: CompiledChapter;
  chapterIndex: number;
  prevChapter: CompiledChapter | null;
  nextChapter: CompiledChapter | null;
  scrollPercent: number;
  bookmarkPercent: number | null;
  ambientTrack: AmbientTrack;
  visible: boolean;
  onChapterChange: (id: string) => void;
  onJumpToBookmark: () => void;
  onAmbientChange: (track: AmbientTrack) => void;
  onOpenSettings: () => void;
}

export function ReaderToolbar({
  chapter,
  chapterIndex,
  prevChapter,
  nextChapter,
  scrollPercent,
  bookmarkPercent,
  ambientTrack,
  visible,
  onChapterChange,
  onJumpToBookmark,
  onAmbientChange,
  onOpenSettings,
}: ReaderToolbarProps) {
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const [ambienceOpen, setAmbienceOpen] = useState(false);
  const savedAt = bookmarkPercent ?? scrollPercent;
  const hasSavedPlace = savedAt > 0;

  const goChapter = useCallback(
    (id: string) => {
      onChapterChange(id);
      setChaptersOpen(false);
    },
    [onChapterChange]
  );

  return (
    <div
      className={cn(
        "text-ui fixed inset-x-0 bottom-14 z-[55] border-t border-gold/10 bg-bg/95 px-3 py-2 backdrop-blur-md transition-transform duration-300 md:bottom-0 md:px-4",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="mx-auto flex max-w-4xl items-center gap-2">
        <button
          type="button"
          disabled={!prevChapter}
          onClick={() => prevChapter && goChapter(prevChapter.id)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gold/15 text-text-muted transition-colors hover:text-gold disabled:opacity-30"
          aria-label="Previous chapter"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="relative min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setChaptersOpen((o) => !o)}
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-gold/15 px-3 py-2 text-xs text-text hover:border-gold/30"
          >
            <List className="h-3.5 w-3.5 shrink-0 text-gold/70" />
            <span className="truncate">
              Ch. {chapter.number} — {chapter.title}
            </span>
            <span className="shrink-0 text-text-muted/60">
              {chapterIndex + 1}/{chapters.length}
            </span>
          </button>

          {chaptersOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40"
                aria-label="Close chapter list"
                onClick={() => setChaptersOpen(false)}
              />
              <div className="absolute bottom-full left-0 right-0 z-50 mb-2 max-h-52 overflow-y-auto rounded-sm border border-gold/15 bg-bg-elevated py-1 shadow-xl md:max-h-64">
                {chapters.map((ch, i) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => goChapter(ch.id)}
                    className={cn(
                      "block w-full px-4 py-2 text-left text-xs transition-colors hover:bg-gold/10",
                      ch.id === chapter.id ? "text-gold" : "text-text-muted"
                    )}
                  >
                    <span className="text-text-muted/50">{i + 1}. </span>
                    {ch.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onJumpToBookmark}
          disabled={!hasSavedPlace}
          title={
            hasSavedPlace
              ? `Jump to saved place (${Math.round(savedAt)}%) — updates automatically as you read`
              : "Start reading to save your place"
          }
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border transition-colors",
            hasSavedPlace
              ? "border-gold/40 bg-gold/15 text-gold hover:bg-gold/20"
              : "border-gold/15 text-text-muted/40"
          )}
          aria-label="Jump to saved reading place"
        >
          <BookmarkCheck className="h-4 w-4" />
        </button>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setAmbienceOpen((o) => !o)}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-sm border border-gold/15 px-2.5 text-xs transition-colors",
              ambientTrack !== "none" ? "text-gold" : "text-text-muted hover:text-gold"
            )}
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ambience</span>
          </button>
          {ambienceOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40"
                aria-label="Close ambience menu"
                onClick={() => setAmbienceOpen(false)}
              />
              <div className="absolute bottom-full right-0 z-50 mb-2 min-w-[140px] rounded-sm border border-gold/15 bg-bg-elevated py-1 shadow-xl">
                {AMBIENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onAmbientChange(opt.id);
                      setAmbienceOpen(false);
                    }}
                    className={cn(
                      "block w-full px-4 py-2 text-left text-xs transition-colors hover:bg-gold/10",
                      ambientTrack === opt.id ? "text-gold" : "text-text-muted"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gold/15 text-text-muted transition-colors hover:text-gold"
          aria-label="Reader settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        <button
          type="button"
          disabled={!nextChapter}
          onClick={() => nextChapter && goChapter(nextChapter.id)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gold/15 text-text-muted transition-colors hover:text-gold disabled:opacity-30"
          aria-label="Next chapter"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
