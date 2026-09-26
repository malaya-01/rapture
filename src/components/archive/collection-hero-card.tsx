"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import type { ArchiveCollection } from "@/lib/archive/collections";
import { booksInCollection } from "@/lib/archive/collections";

interface CollectionHeroCardProps {
  collection: ArchiveCollection;
}

export function CollectionHeroCard({ collection }: CollectionHeroCardProps) {
  const count = booksInCollection(collection).length;

  return (
    <Link
      href={`/collections#${collection.id}`}
      className="archive-collection-hero group"
      style={{ "--collection-accent": collection.accentColor } as CSSProperties}
    >
      <div className="archive-collection-hero-bg" aria-hidden />
      <div className="archive-collection-hero-vignette" aria-hidden />
      <div className="archive-collection-hero-content">
        <p className="archive-collection-hero-kind">
          {collection.kind === "series" ? "Series" : collection.kind === "theme" ? "Theme" : "Curated"}
        </p>
        <h3 className="archive-collection-hero-title">{collection.title}</h3>
        <p className="archive-collection-hero-subtitle">{collection.subtitle}</p>
        <p className="archive-collection-hero-count">
          {count} {count === 1 ? "series" : "series"}
        </p>
      </div>
    </Link>
  );
}
