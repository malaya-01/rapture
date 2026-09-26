"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/types/book";
import { getBookBasePath, getReadPath } from "@/lib/books/book-data";
import { cn } from "@/lib/utils";

interface BookSpineProps {
  book: Book;
  /** Spine height in rem */
  height?: number;
  continueChapterId?: string;
  className?: string;
  /** Non-interactive preview — use inside another link or button */
  decorative?: boolean;
}

/** Physical book on a shelf — not a SaaS card */
export function BookSpine({
  book,
  height = 11,
  continueChapterId,
  className,
  decorative = false,
}: BookSpineProps) {
  const href = continueChapterId
    ? getReadPath(book.slug, continueChapterId)
    : getBookBasePath(book.slug);

  const spineClass = cn("archive-book-spine group block shrink-0", className);
  const spineStyle = {
    "--spine-accent": book.accentColor,
    "--spine-h": `${height}rem`,
  } as CSSProperties;

  const body = (
    <>
      <div className="archive-book-spine-body">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt=""
            width={80}
            height={120}
            className="archive-book-spine-cover"
          />
        ) : (
          <div
            className="archive-book-spine-cover archive-book-spine-cover-fallback"
            style={{ background: `linear-gradient(180deg, ${book.accentColor}88, #0a0908)` }}
          />
        )}
        <div className="archive-book-spine-edge" />
        <div className="archive-book-spine-glow" />
      </div>
      <div className="archive-book-spine-label mt-3 text-center">
        <p className="font-display text-[0.65rem] tracking-widest text-gold">{book.title}</p>
        <p className="mt-0.5 font-serif text-[0.6rem] italic text-text-muted line-clamp-1">
          {book.subtitle}
        </p>
      </div>
    </>
  );

  if (decorative) {
    return (
      <div className={spineClass} style={spineStyle} aria-hidden>
        {body}
      </div>
    );
  }

  return (
    <Link href={href} className={spineClass} style={spineStyle}>
      {body}
    </Link>
  );
}
