"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/types/book";
import { getBookBasePath, getReadPath } from "@/lib/books/book-data";
import { cn } from "@/lib/utils";

interface BookCoverCardProps {
  book: Book;
  continueChapterId?: string;
  className?: string;
}

/** Glowing cover card for library grids — mockup style */
export function BookCoverCard({ book, continueChapterId, className }: BookCoverCardProps) {
  const href = continueChapterId
    ? getReadPath(book.slug, continueChapterId)
    : getBookBasePath(book.slug);

  return (
    <Link
      href={href}
      className={cn("archive-book-card group", className)}
      style={{ "--book-accent": book.accentColor } as CSSProperties}
    >
      <div className="archive-book-card-cover">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt=""
            width={200}
            height={300}
            className="archive-book-card-image"
          />
        ) : (
          <div
            className="archive-book-card-fallback"
            style={{ background: `linear-gradient(160deg, ${book.accentColor}, #0a0908)` }}
          />
        )}
        <div className="archive-book-card-glow" aria-hidden />
        <div className="archive-book-card-shine" aria-hidden />
      </div>
      <div className="archive-book-card-meta">
        <h3 className="archive-book-card-title">{book.title}</h3>
        <p className="archive-book-card-subtitle">{book.subtitle}</p>
        <p className="archive-book-card-stats">
          {book.totalVolumes} {book.totalVolumes === 1 ? "Volume" : "Volumes"} ·{" "}
          {book.totalChapters.toLocaleString()} Chapters
        </p>
      </div>
    </Link>
  );
}
