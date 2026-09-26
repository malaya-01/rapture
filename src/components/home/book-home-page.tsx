"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getBookData,
  getReadPath,
  getLibraryPath,
} from "@/lib/books/book-data";
import { getCodexBasePath } from "@/lib/books/book-codex-data";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";
import { ArchiveShell } from "@/components/archive/archive-shell";

const TABS = ["About", "Volumes", "Characters", "Chronicles"] as const;

function toRoman(n: number): string {
  const vals = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ] as const;
  let num = n;
  let out = "";
  for (const [v, s] of vals) {
    while (num >= v) {
      out += s;
      num -= v;
    }
  }
  return out;
}

interface BookHomePageProps {
  bookSlug: string;
}

export function BookHomePage({ bookSlug }: BookHomePageProps) {
  const router = useRouter();
  const hydrated = useStoreHydration();
  const data = getBookData(bookSlug);
  const { book, manifestVolumes, firstReadableChapterId } = data;
  const [tab, setTab] = useState<(typeof TABS)[number]>("About");
  const [activeVolume, setActiveVolume] = useState(0);

  const currentChapterId = useReadingStore((s) =>
    hydrated ? s.getBookCurrentChapterId(bookSlug) : firstReadableChapterId ?? ""
  );
  const overallProgress = useReadingStore((s) =>
    hydrated ? s.getBookOverallProgress(bookSlug) : 0
  );

  const hasProgress = overallProgress > 0;
  const startId = firstReadableChapterId ?? currentChapterId ?? "ch-0001";
  const beginReading = () => router.push(getReadPath(bookSlug, startId));

  const volume = manifestVolumes[activeVolume];

  return (
    <ArchiveShell variant="wing">
      <div
        className="archive-book-detail"
        style={{ "--book-accent": book.accentColor } as CSSProperties}
      >
        <Link href="/library" className="archive-link mb-6 inline-flex items-center gap-2">
          <ArrowLeft className="h-3.5 w-3.5" />
          Library
        </Link>

        <div className="archive-book-detail-grid">
          <div className="archive-book-detail-cover">
            {book.coverImage ? (
              <Image src={book.coverImage} alt="" fill className="object-cover" sizes="380px" />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: `linear-gradient(160deg, ${book.accentColor}, #0a0908)` }}
              />
            )}
          </div>

          <div>
            <p className="label-volume text-gold/50">Series</p>
            <h1 className="archive-page-title mt-2">{book.title}</h1>
            <p className="archive-page-subtitle">{book.subtitle}</p>

            <div className="archive-book-detail-tags">
              {book.genre.map((g) => (
                <span key={g} className="archive-book-detail-tag">
                  {g}
                </span>
              ))}
            </div>

            <p className="mt-4 max-w-xl font-serif text-base leading-relaxed text-text-muted">
              {book.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-ui text-sm text-text-muted">
              <span>{book.totalVolumes} Volumes</span>
              <span>{book.totalChapters.toLocaleString()} Chapters</span>
              {hasProgress && <span>{overallProgress}% Read</span>}
            </div>

            <div className="archive-book-detail-actions">
              <button type="button" onClick={beginReading} className="archive-cta-primary">
                {hasProgress ? "Continue Reading" : "Begin Reading"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <Link href={getLibraryPath(bookSlug)} className="archive-cta-secondary">
                Volume Library
              </Link>
            </div>
          </div>
        </div>

        <div className="archive-book-detail-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={`archive-book-detail-tab ${tab === t ? "is-active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "About" && (
          <p className="mt-6 max-w-3xl font-serif leading-relaxed text-text-muted">
            {book.description}
          </p>
        )}

        {tab === "Volumes" && (
          <>
            <div className="archive-volume-roman">
              {manifestVolumes.map((vol, i) => (
                <button
                  key={vol.id}
                  type="button"
                  className={`archive-volume-roman-btn ${activeVolume === i ? "is-active" : ""}`}
                  onClick={() => setActiveVolume(i)}
                  title={vol.title}
                >
                  {toRoman(vol.number)}
                </button>
              ))}
            </div>
            {volume && (
              <div className="mt-6 max-w-2xl">
                <h3 className="font-display text-lg text-gold">{volume.title}</h3>
                <p className="mt-2 font-serif italic text-text-muted">{volume.purpose}</p>
                <Link href={getLibraryPath(bookSlug)} className="archive-link mt-4 inline-block">
                  Open volume library
                </Link>
              </div>
            )}
          </>
        )}

        {tab === "Characters" && book.features.codex && (
          <Link href={`${getCodexBasePath(bookSlug)}/characters`} className="archive-link mt-6 inline-block">
            Open character chronicles
          </Link>
        )}

        {tab === "Chronicles" && book.features.codex && (
          <Link href={getCodexBasePath(bookSlug)} className="archive-link mt-6 inline-block">
            Open full codex
          </Link>
        )}
      </div>
    </ArchiveShell>
  );
}
