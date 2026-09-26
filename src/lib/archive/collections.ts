import { books } from "@/data/books-registry";
import type { Book } from "@/types/book";

export type CollectionKind = "series" | "curated" | "theme";

export interface ArchiveCollection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  kind: CollectionKind;
  /** Visual metaphor in the UI */
  display: "bookshelf" | "cabinet" | "display-case";
  accentColor: string;
  bookSlugs: string[];
}

function seriesCollection(book: Book): ArchiveCollection {
  return {
    id: `series-${book.slug}`,
    title: book.title,
    subtitle: book.subtitle,
    description: book.description,
    kind: "series",
    display: "bookshelf",
    accentColor: book.accentColor,
    bookSlugs: [book.slug],
  };
}

const CURATED_COLLECTIONS: ArchiveCollection[] = [
  {
    id: "founders-collection",
    title: "Founders Collection",
    subtitle: "Worlds that built the archive",
    description:
      "The founding sagas of Aether Vale — epics where civilizations rise from ruin and choice shapes destiny.",
    kind: "curated",
    display: "cabinet",
    accentColor: "#d4af37",
    bookSlugs: books.map((b) => b.slug),
  },
  {
    id: "dark-fantasy",
    title: "Dark Fantasy",
    subtitle: "Shadows and consequence",
    description:
      "Stories where hope is earned through loss, and power always demands a price.",
    kind: "theme",
    display: "display-case",
    accentColor: "#4a3f6b",
    bookSlugs: books
      .filter((b) => b.genre.some((g) => /dark/i.test(g)))
      .map((b) => b.slug),
  },
  {
    id: "long-epics",
    title: "Long Epics",
    subtitle: "Thousand-chapter journeys",
    description: "Sprawling multi-volume sagas for readers who want to live inside a world.",
    kind: "theme",
    display: "bookshelf",
    accentColor: "#8b6b2e",
    bookSlugs: books.filter((b) => b.totalChapters >= 300).map((b) => b.slug),
  },
  {
    id: "beginner-reads",
    title: "Beginner Reads",
    subtitle: "Enter gently",
    description: "Accessible entry points — start here if you are new to the archive.",
    kind: "curated",
    display: "display-case",
    accentColor: "#5fa8ff",
    bookSlugs: books
      .slice()
      .sort((a, b) => a.totalChapters - b.totalChapters)
      .slice(0, 2)
      .map((b) => b.slug),
  },
];

/** Curated + per-series collections — scales as books are added to registry */
export const ARCHIVE_COLLECTIONS: ArchiveCollection[] = [
  ...books.map(seriesCollection),
  ...CURATED_COLLECTIONS,
].filter((c) => c.bookSlugs.length > 0);

export function getCollection(id: string): ArchiveCollection | undefined {
  return ARCHIVE_COLLECTIONS.find((c) => c.id === id);
}

export function booksInCollection(collection: ArchiveCollection): Book[] {
  return collection.bookSlugs
    .map((slug) => books.find((b) => b.slug === slug))
    .filter((b): b is Book => Boolean(b));
}
