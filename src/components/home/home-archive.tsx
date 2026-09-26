"use client";

import { useMemo } from "react";
import Link from "next/link";
import { books } from "@/data/books-registry";
import { ArchiveShell } from "@/components/archive/archive-shell";
import { HomeHero } from "@/components/archive/home-hero";
import { ArchiveStatsBar } from "@/components/archive/archive-stats-bar";
import { BookCoverCard } from "@/components/archive/book-cover-card";
import { CollectionHeroCard } from "@/components/archive/collection-hero-card";
import { CategoryBannerCard } from "@/components/archive/category-banner-card";
import { ARCHIVE_COLLECTIONS } from "@/lib/archive/collections";
import { getArchiveCategories } from "@/lib/archive/categories";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";

export function HomeArchive() {
  const hydrated = useStoreHydration();
  const byBook = useReadingStore((s) => s.byBook);
  const categories = getArchiveCategories().slice(0, 4);
  const featuredCollections = ARCHIVE_COLLECTIONS.filter((c) => c.kind !== "series").slice(0, 4);

  const continueBySlug = useMemo(() => {
    if (!hydrated) return {} as Record<string, string>;
    const store = useReadingStore.getState();
    const bySlug: Record<string, string> = {};
    books.forEach((b) => {
      const ch = store.getBookCurrentChapterId(b.slug);
      if (store.getBookOverallProgress(b.slug) > 0 && ch) bySlug[b.slug] = ch;
    });
    return bySlug;
  }, [hydrated, byBook]);

  return (
    <ArchiveShell>
      <HomeHero />

      <section className="archive-home-section">
        <div className="archive-home-section-head">
          <h2 className="archive-section-title">Featured Series</h2>
          <Link href="/library" className="archive-link">
            View all
          </Link>
        </div>
        <div className="archive-home-books-row">
          {books.map((book) => (
            <BookCoverCard
              key={book.id}
              book={book}
              continueChapterId={continueBySlug[book.slug]}
              className="archive-home-book-item"
            />
          ))}
        </div>
      </section>

      <section className="archive-home-section">
        <div className="archive-home-section-head">
          <h2 className="archive-section-title">Collections</h2>
          <Link href="/collections" className="archive-link">
            Explore
          </Link>
        </div>
        <div className="archive-collections-grid">
          {featuredCollections.map((c) => (
            <CollectionHeroCard key={c.id} collection={c} />
          ))}
        </div>
      </section>

      <section className="archive-home-section">
        <div className="archive-home-section-head">
          <h2 className="archive-section-title">Categories</h2>
          <Link href="/categories" className="archive-link">
            All wings
          </Link>
        </div>
        <div className="archive-categories-stack">
          {categories.map((cat) => (
            <CategoryBannerCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      <ArchiveStatsBar />
    </ArchiveShell>
  );
}
