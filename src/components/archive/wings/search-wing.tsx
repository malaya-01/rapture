"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { books } from "@/data/books-registry";
import { getBookBasePath } from "@/lib/books/book-data";
import { ArchiveShell } from "@/components/archive/archive-shell";
import { ArchiveSearchBar } from "@/components/archive/search-bar";
import { BookCoverCard } from "@/components/archive/book-cover-card";

const RECENT_SEARCHES = ["Rapture", "Dark Fantasy", "Omegaverse", "Time Loop"];
const POPULAR_SEARCHES = ["Epic Fantasy", "Post-Apocalyptic", "Romance", "Survival"];

const SCOPE_CHIPS = ["Books", "Characters", "Artifacts", "Locations", "Series"] as const;

export function SearchWing() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim().toLowerCase();
  const [scope, setScope] = useState<typeof SCOPE_CHIPS[number]>("Books");

  const results = useMemo(() => {
    if (!q || scope !== "Books") return [];
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.genre.some((g) => g.toLowerCase().includes(q))
    );
  }, [q, scope]);

  return (
    <ArchiveShell variant="wing">
      <div className="archive-search-page">
        <div className="archive-search-page-main">
          <h1 className="archive-page-title text-center">SEARCH</h1>
          <p className="archive-page-subtitle text-center">
            Discover books, characters, and lore across every wing.
          </p>

          <div className="archive-search-page-form">
            <ArchiveSearchBar defaultQuery={q} large />
          </div>

          <div className="archive-toolbar-chips archive-search-scopes">
            {SCOPE_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className={`archive-filter-chip ${scope === chip ? "is-active" : ""}`}
                onClick={() => setScope(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {!q && (
            <div className="archive-search-lists">
              <div>
                <h2 className="archive-search-list-title">Recent Searches</h2>
                <ul className="archive-search-list">
                  {RECENT_SEARCHES.map((term) => (
                    <li key={term}>
                      <Link href={`/search?q=${encodeURIComponent(term)}`}>{term}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="archive-search-list-title">Popular Searches</h2>
                <ul className="archive-search-list">
                  {POPULAR_SEARCHES.map((term) => (
                    <li key={term}>
                      <Link href={`/search?q=${encodeURIComponent(term)}`}>{term}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {q && scope !== "Books" && (
            <p className="archive-empty-state">
              {scope} search expands as the codex grows. Try Books for now.
            </p>
          )}

          {q && results.length === 0 && scope === "Books" && (
            <p className="archive-empty-state">No volumes matched &ldquo;{q}&rdquo;.</p>
          )}

          {results.length > 0 && (
            <div className="archive-book-grid archive-book-grid-search">
              {results.map((book) => (
                <div key={book.id}>
                  <BookCoverCard book={book} />
                  <Link href={getBookBasePath(book.slug)} className="archive-search-result-link">
                    Open series
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="archive-search-page-art" aria-hidden>
          <div className="archive-search-art-desk" />
        </div>
      </div>
    </ArchiveShell>
  );
}
