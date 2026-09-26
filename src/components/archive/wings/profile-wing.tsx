"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { books } from "@/data/books-registry";
import { getBookBasePath, getReadPath } from "@/lib/books/book-data";
import { ArchiveShell } from "@/components/archive/archive-shell";
import { ArchivePageLayout } from "@/components/archive/archive-page-layout";
import { BookCoverCard } from "@/components/archive/book-cover-card";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";

const SIDEBAR_ITEMS = [
  { id: "progress", label: "Reading Progress" },
  { id: "library", label: "My Library" },
  { id: "bookmarks", label: "Bookmarks" },
  { id: "collections", label: "Collections" },
];

export function ProfileWing() {
  const hydrated = useStoreHydration();
  const byBook = useReadingStore((s) => s.byBook);
  const [section, setSection] = useState("progress");

  const { inProgress, continueBySlug, progressBySlug, currentBook } = useMemo(() => {
    if (!hydrated) {
      return {
        inProgress: [],
        continueBySlug: {} as Record<string, string>,
        progressBySlug: {} as Record<string, number>,
        currentBook: null as (typeof books)[0] | null,
      };
    }
    const store = useReadingStore.getState();
    const bySlug: Record<string, string> = {};
    const progress: Record<string, number> = {};
    const list = books.filter((b) => {
      const p = store.getBookOverallProgress(b.slug);
      const ch = store.getBookCurrentChapterId(b.slug);
      progress[b.slug] = p;
      if (p > 0) {
        if (ch) bySlug[b.slug] = ch;
        return true;
      }
      return false;
    });
    books.forEach((b) => {
      if (progress[b.slug] === undefined) {
        progress[b.slug] = store.getBookOverallProgress(b.slug);
      }
    });
    const current = list[0] ?? null;
    return { inProgress: list, continueBySlug: bySlug, progressBySlug: progress, currentBook: current };
  }, [hydrated, byBook]);

  const maxProgress = Math.max(...Object.values(progressBySlug), 1);

  return (
    <ArchiveShell variant="wing">
      <ArchivePageLayout
        sidebarTitle="Profile"
        sidebarItems={SIDEBAR_ITEMS}
        activeSidebarId={section}
        onSidebarSelect={setSection}
        pageTitle="PROFILE"
        pageSubtitle="Your reading history, progress, and personal shelf."
      >
        <div className="archive-profile-header">
          <div className="archive-profile-avatar" aria-hidden>
            C
          </div>
          <div>
            <h2 className="archive-profile-name">Cassian</h2>
            <p className="archive-profile-title">Seeker of Stories</p>
            <div className="archive-profile-stats">
              <span>{inProgress.length} in progress</span>
              <span>{books.length} series available</span>
            </div>
          </div>
        </div>

        {section === "progress" && (
          <>
            {currentBook ? (
              <div className="archive-profile-reading">
                <p className="archive-profile-section-label">Currently Reading</p>
                <BookCoverCard
                  book={currentBook}
                  continueChapterId={continueBySlug[currentBook.slug]}
                  className="archive-book-card-compact"
                />
              </div>
            ) : (
              <p className="archive-empty-state">
                No reading progress yet.{" "}
                <Link href="/library" className="text-gold hover:underline">
                  Visit the Library
                </Link>
              </p>
            )}

            <div className="archive-profile-chart">
              <p className="archive-profile-section-label">Reading Progress</p>
              <div className="archive-profile-bars">
                {books.map((book) => {
                  const prog = progressBySlug[book.slug] ?? 0;
                  const height = Math.max(8, (prog / maxProgress) * 100);
                  return (
                    <div key={book.id} className="archive-profile-bar-col">
                      <div
                        className="archive-profile-bar"
                        style={
                          { height: `${height}%`, "--bar-accent": book.accentColor } as CSSProperties
                        }
                      />
                      <span className="archive-profile-bar-label">{book.title.split(" ")[0]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {section === "library" && (
          <div className="archive-book-grid">
            {inProgress.length > 0 ? (
              inProgress.map((book) => (
                <BookCoverCard
                  key={book.id}
                  book={book}
                  continueChapterId={continueBySlug[book.slug]}
                />
              ))
            ) : (
              <p className="archive-empty-state">Your library is empty.</p>
            )}
          </div>
        )}

        {(section === "bookmarks" || section === "collections") && (
          <p className="archive-empty-state">
            {section === "bookmarks" ? "Bookmarks" : "Collections"} sync with your reading session as
            you explore the archive.
          </p>
        )}

        <section className="archive-profile-series-list">
          {books.map((book) => {
            const prog = progressBySlug[book.slug] ?? 0;
            const ch = continueBySlug[book.slug];
            const href = prog > 0 && ch ? getReadPath(book.slug, ch) : getBookBasePath(book.slug);
            return (
              <Link key={book.id} href={href} className="archive-profile-series-row">
                <span>{book.title}</span>
                <span>{prog}%</span>
              </Link>
            );
          })}
        </section>
      </ArchivePageLayout>
    </ArchiveShell>
  );
}
