"use client";

import { useMemo, useState } from "react";
import { books } from "@/data/books-registry";
import { ArchiveShell } from "@/components/archive/archive-shell";
import { ArchivePageLayout } from "@/components/archive/archive-page-layout";
import { BookCoverCard } from "@/components/archive/book-cover-card";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";

type FilterKey = "all" | "featured" | "continue" | "recent" | "popular" | "complete";
type SortKey = "default" | "az" | "length" | "recent" | "popular";

const SIDEBAR_ITEMS = [
  { id: "featured", label: "Featured" },
  { id: "recent", label: "Recently Updated" },
  { id: "continue", label: "Continue Reading" },
  { id: "popular", label: "Popular" },
  { id: "complete", label: "Complete Collection" },
] as const;

const FILTER_CHIPS: { id: SortKey | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "recent", label: "Recently Added" },
  { id: "popular", label: "Popular" },
  { id: "az", label: "A–Z" },
];

export function LibraryWing() {
  const hydrated = useStoreHydration();
  const byBook = useReadingStore((s) => s.byBook);
  const [section, setSection] = useState<FilterKey>("featured");
  const [sort, setSort] = useState<SortKey>("default");
  const [query, setQuery] = useState("");

  const { continueBySlug, displayBooks } = useMemo(() => {
    const store = useReadingStore.getState();
    const bySlug: Record<string, string> = {};
    const continuing = hydrated
      ? books.filter((b) => {
          const p = store.getBookOverallProgress(b.slug);
          const ch = store.getBookCurrentChapterId(b.slug);
          if (p > 0 && ch) {
            bySlug[b.slug] = ch;
            return true;
          }
          return false;
        })
      : [];

    let list = [...books];
    if (section === "continue") list = continuing;
    if (section === "popular") list = [...books].sort((a, b) => b.totalChapters - a.totalChapters);
    if (section === "recent") list = [...books].reverse();
    if (section === "complete") list = [...books];

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.subtitle.toLowerCase().includes(q) ||
          b.genre.some((g) => g.toLowerCase().includes(q))
      );
    }

    if (sort === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "length" || sort === "popular")
      list.sort((a, b) => b.totalChapters - a.totalChapters);
    if (sort === "recent") list.reverse();

    return { continueBySlug: bySlug, displayBooks: list };
  }, [hydrated, byBook, section, sort, query]);

  return (
    <ArchiveShell variant="wing">
      <ArchivePageLayout
        sidebarTitle="Browse"
        sidebarItems={[...SIDEBAR_ITEMS]}
        activeSidebarId={section}
        onSidebarSelect={(id) => setSection(id as FilterKey)}
        pageTitle="LIBRARY"
        pageSubtitle="Browse, filter, and read every series in the archive."
      >
        <div className="archive-toolbar">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the shelves…"
            className="archive-toolbar-search"
            aria-label="Search books"
          />
          <div className="archive-toolbar-chips">
            {FILTER_CHIPS.map((chip) => {
              const active =
                chip.id === "all"
                  ? sort === "default" && !query
                  : chip.id === sort;
              return (
                <button
                  key={chip.id}
                  type="button"
                  className={`archive-filter-chip ${active ? "is-active" : ""}`}
                  onClick={() => {
                    if (chip.id === "all") setSort("default");
                    else if (chip.id === "az") setSort("az");
                    else if (chip.id === "popular") setSort("popular");
                    else if (chip.id === "recent") setSort("recent");
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="archive-book-grid">
          {displayBooks.map((book) => (
            <BookCoverCard
              key={book.id}
              book={book}
              continueChapterId={continueBySlug[book.slug]}
            />
          ))}
        </div>

        {displayBooks.length === 0 && (
          <p className="archive-empty-state">No volumes match your search.</p>
        )}
      </ArchivePageLayout>
    </ArchiveShell>
  );
}
