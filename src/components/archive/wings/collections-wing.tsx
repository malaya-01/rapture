"use client";

import { useState } from "react";
import { ARCHIVE_COLLECTIONS } from "@/lib/archive/collections";
import { ArchiveShell } from "@/components/archive/archive-shell";
import { ArchivePageLayout } from "@/components/archive/archive-page-layout";
import { CollectionHeroCard } from "@/components/archive/collection-hero-card";
import { BookCoverCard } from "@/components/archive/book-cover-card";
import { booksInCollection } from "@/lib/archive/collections";

const SIDEBAR_ITEMS = [
  { id: "all", label: "All Collections" },
  { id: "series", label: "Series" },
  { id: "curated", label: "Curated" },
  { id: "theme", label: "Themes" },
];

export function CollectionsWing() {
  const [filter, setFilter] = useState("all");

  const collections = ARCHIVE_COLLECTIONS.filter((c) => {
    if (filter === "all") return true;
    return c.kind === filter;
  });

  return (
    <ArchiveShell variant="wing">
      <ArchivePageLayout
        sidebarTitle="Collections"
        sidebarItems={SIDEBAR_ITEMS}
        activeSidebarId={filter}
        onSidebarSelect={setFilter}
        pageTitle="COLLECTIONS"
        pageSubtitle="Curated reading experiences and grouped universes."
      >
        <div className="archive-collections-grid archive-collections-grid-page">
          {collections.map((collection) => (
            <div key={collection.id} id={collection.id} className="archive-collection-block">
              <CollectionHeroCard collection={collection} />
              <div className="archive-collection-books">
                {booksInCollection(collection).map((book) => (
                  <BookCoverCard key={book.id} book={book} className="archive-book-card-compact" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ArchivePageLayout>
    </ArchiveShell>
  );
}
