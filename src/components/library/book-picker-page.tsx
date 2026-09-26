"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { books, libraryName } from "@/data/books-registry";
import { getBookBasePath } from "@/lib/books/book-data";
import { getCodexBasePath } from "@/lib/books/book-codex-data";
import { Atmosphere } from "@/components/atmosphere/atmosphere";

interface BookPickerPageProps {
  title: string;
  subtitle: string;
  /** Build the primary link for each book (codex, library, etc.) */
  hrefForBook: (slug: string) => string;
  linkLabel: string;
}

export function BookPickerPage({
  title,
  subtitle,
  hrefForBook,
  linkLabel,
}: BookPickerPageProps) {
  return (
    <Atmosphere particles={false}>
      <div className="mx-auto min-h-screen max-w-5xl px-6 py-24">
        <Link
          href="/library"
          className="text-ui mb-10 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold"
        >
          <BookOpen className="h-4 w-4" />
          {libraryName}
        </Link>
        <p className="label-volume text-gold/60">{libraryName}</p>
        <h1 className="title-legend embossed-gold mt-4">{title}</h1>
        <p className="mt-4 max-w-2xl font-serif text-lg italic text-text-muted">
          {subtitle}
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {books.map((book) => (
            <article
              key={book.id}
              className="codex-panel overflow-hidden rounded-sm"
            >
              <div
                className="artwork-frame overflow-hidden rounded-sm"
                style={{ aspectRatio: "2/3", maxHeight: "14rem" }}
              >
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{
                      background: `linear-gradient(160deg, ${book.accentColor}55, #090807)`,
                    }}
                  />
                )}
              </div>
              <div className="p-6">
                <h2 className="font-display text-xl tracking-wide text-gold">
                  {book.title}
                </h2>
                <p className="mt-1 font-serif italic text-text-muted">
                  {book.subtitle}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={hrefForBook(book.slug)}
                    className="text-ui inline-flex items-center gap-2 rounded-sm border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold hover:bg-gold/20"
                  >
                    {linkLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={getBookBasePath(book.slug)}
                    className="text-ui inline-flex items-center gap-2 rounded-sm border border-gold/15 px-4 py-2 text-sm text-text-muted hover:text-text"
                  >
                    Series Home
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Atmosphere>
  );
}

/** Codex picker — choose which series encyclopedia to open */
export function CodexPickerPage() {
  return (
    <BookPickerPage
      title="Choose a Codex"
      subtitle="Each series has its own living encyclopedia. Select a world to explore characters, lore, and magic."
      hrefForBook={(slug) => getCodexBasePath(slug)}
      linkLabel="Open Codex"
    />
  );
}
