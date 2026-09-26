"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArchiveCollection } from "@/lib/archive/collections";
import { booksInCollection } from "@/lib/archive/collections";
import { BookSpine } from "./book-spine";

const DISPLAY_CLASS = {
  bookshelf: "archive-collection-bookshelf",
  cabinet: "archive-collection-cabinet",
  "display-case": "archive-collection-case",
} as const;

export function CollectionDisplay({ collection }: { collection: ArchiveCollection }) {
  const volumes = booksInCollection(collection);

  return (
    <Link
      href={`/collections#${collection.id}`}
      className={`archive-collection group block ${DISPLAY_CLASS[collection.display]}`}
      style={{ "--collection-accent": collection.accentColor } as CSSProperties}
    >
      <div className="archive-collection-inner p-6 md:p-8">
        <p className="label-volume text-[0.55rem] text-gold/45">
          {collection.kind === "series" ? "Series" : collection.kind === "theme" ? "Theme" : "Curated"}
        </p>
        <h3 className="mt-2 font-display text-xl tracking-wide text-gold group-hover:text-[#f6e7b0]">
          {collection.title}
        </h3>
        <p className="mt-1 font-serif italic text-text-muted">{collection.subtitle}</p>
        <p className="mt-3 line-clamp-2 font-serif text-sm text-text-muted/80">
          {collection.description}
        </p>

        <div className="mt-6 flex items-end gap-3 overflow-x-auto pb-2">
          {volumes.slice(0, 4).map((book) => (
            <BookSpine key={book.id} book={book} height={8} decorative />
          ))}
        </div>

        <span className="mt-4 inline-flex items-center gap-2 text-[0.65rem] tracking-widest text-gold/70 uppercase">
          {volumes.length} {volumes.length === 1 ? "volume" : "volumes"}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
