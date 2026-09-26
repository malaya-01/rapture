import type { Book } from "@/types/book";
import { BookSpine } from "./book-spine";

interface BookShelfRowProps {
  label: string;
  books: Book[];
  /** chapter id per slug for continue reading */
  continueBySlug?: Record<string, string>;
}

export function BookShelfRow({ label, books, continueBySlug }: BookShelfRowProps) {
  if (books.length === 0) return null;

  return (
    <section className="archive-shelf-row mx-auto max-w-6xl px-6 py-8">
      <h2 className="label-volume mb-6 text-gold/50">{label}</h2>
      <div className="archive-shelf-plank">
        <div className="archive-shelf-books">
          {books.map((book) => (
            <BookSpine
              key={book.id}
              book={book}
              continueChapterId={continueBySlug?.[book.slug]}
            />
          ))}
        </div>
        <div className="archive-shelf-board" />
      </div>
    </section>
  );
}
