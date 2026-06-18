"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, BookOpen, Lock, ChevronDown, ChevronRight } from "lucide-react";
import { chapters } from "@/data/chapters";
import {
  manifestVolumes,
  getChaptersByVolume,
  type ManifestChapter,
} from "@/data/chapter-manifest";
import { chapterProgress } from "@/data/chapter-progress";
import { useReadingStore } from "@/store/reading-store";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { VolumeExportButton } from "@/components/library/volume-export-button";
import { cn } from "@/lib/utils";

const compiledIds = new Set(chapters.map((c) => c.id));

function isReadable(ch: ManifestChapter) {
  return ch.status === "published" && compiledIds.has(ch.id);
}

export function LibraryView() {
  const router = useRouter();
  const { getChapterProgress, isChapterComplete, setChapter, currentChapterId } =
    useReadingStore();
  const overallProgress = useReadingStore((s) => s.getOverallProgress());
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "vol-01": true,
  });

  const handleChapterClick = (ch: ManifestChapter) => {
    if (!isReadable(ch)) return;
    setChapter(ch.id);
    router.push(`/read/${ch.id}`);
  };

  const continueId = currentChapterId;

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-4xl px-5">
        <header className="mb-14 text-center">
          <p className="label-volume text-gold/50">All Chapters</p>
          <h1 className="title-legend embossed-gold mt-4">The Library</h1>
          <p className="mx-auto mt-4 max-w-lg font-serif text-lg italic text-text-muted">
            The full saga — {manifestVolumes.length} volumes, 1,200 chapters
          </p>
          <p className="text-ui mt-6 text-sm text-gold/60">
            {overallProgress}% of saga explored
          </p>
          {continueId && compiledIds.has(continueId) && (
            <button
              type="button"
              onClick={() => router.push(`/read/${continueId}`)}
              className="text-ui mt-6 rounded-sm border border-gold/30 bg-gold/10 px-6 py-2.5 text-sm text-gold hover:bg-gold/20"
            >
              Continue reading
            </button>
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
                          : "Forthcoming"}
                      </p>
                    </div>
                  </button>
                  <VolumeExportButton
                    volumeId={vol.id}
                    volumeTitle={vol.title}
                    publishedCount={publishedCount}
                    className="shrink-0"
                  />
                </div>

                {open && (
                  <div className="space-y-2 border-t border-gold/10 px-4 pb-4 pt-3">
                    {volChapters.map((chapter) => {
                      const readable = isReadable(chapter);
                      const progress = readable
                        ? getChapterProgress(chapter.id)
                        : 0;
                      const complete = readable && isChapterComplete(chapter.id);

                      return (
                        <button
                          key={chapter.id}
                          type="button"
                          disabled={!readable}
                          onClick={() => handleChapterClick(chapter)}
                          className={cn(
                            "group w-full text-left",
                            !readable && "cursor-not-allowed opacity-55"
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-4 rounded-sm border border-transparent p-3 transition-colors",
                              readable && "hover:border-gold/15 hover:bg-gold/5",
                              complete && "border-gold/15"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-sm font-display text-sm",
                                complete
                                  ? "bg-gold/15 text-gold"
                                  : readable
                                    ? "bg-bg-surface text-text-muted"
                                    : "bg-bg-surface/50 text-text-muted/40"
                              )}
                            >
                              {complete ? (
                                <Check className="h-4 w-4" />
                              ) : !readable ? (
                                <Lock className="h-3.5 w-3.5" />
                              ) : (
                                chapter.number
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3
                                className={cn(
                                  "font-display text-sm transition-colors",
                                  readable
                                    ? "text-text group-hover:text-gold"
                                    : "text-text-muted"
                                )}
                              >
                                {chapter.title}
                              </h3>
                              <p className="text-ui mt-0.5 text-[0.65rem] text-text-muted/60">
                                {readable
                                  ? chapter.pov
                                  : chapter.status === "published"
                                    ? "Drafting in progress"
                                    : "Forthcoming"}
                              </p>
                              {readable && (
                                <div className="text-ui mt-2 flex items-center gap-2 text-xs text-text-muted/50">
                                  <div className="h-1 w-20 overflow-hidden rounded-full bg-bg-surface">
                                    <div
                                      className="h-full bg-gold/60"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <span>{progress}%</span>
                                </div>
                              )}
                            </div>

                            {readable && (
                              <BookOpen className="h-4 w-4 shrink-0 text-text-muted/30 group-hover:text-gold/60" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.section>
            );
          })}
        </div>

        <section className="mt-16 border-t border-gold/10 pt-10">
          <h2 className="label-volume text-gold/50">Continuity Log</h2>
          <p className="mt-2 font-serif text-sm text-text-muted">
            Canon locks and story beats from published chapters
          </p>
          <div className="mt-6 space-y-4">
            {chapterProgress.historyLog.map((entry) => (
              <div
                key={entry.chapter}
                className="rounded-sm border border-gold/10 bg-bg-elevated/40 px-4 py-3"
              >
                <p className="text-ui text-xs text-gold/70">
                  Chapter {entry.chapter} · Day {entry.inWorldDay}
                </p>
                <p className="mt-1 font-serif text-sm text-text-muted">{entry.delta}</p>
              </div>
            ))}
          </div>
          {chapterProgress.foreshadowing.length > 0 && (
            <div className="mt-8">
              <h3 className="text-ui text-xs tracking-widest text-text-muted uppercase">
                Foreshadowing tracker
              </h3>
              <ul className="mt-3 space-y-2">
                {chapterProgress.foreshadowing.map((f) => (
                  <li
                    key={f.id}
                    className="text-ui rounded-sm border border-gold/10 px-3 py-2 text-xs text-text-muted"
                  >
                    <span className="text-text">{f.description}</span>
                    {f.paidOff && (
                      <span className="ml-2 text-gold/60">→ pays off {f.paidOff}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </Atmosphere>
  );
}
