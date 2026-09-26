import { books } from "@/data/books-registry";

export interface ArchiveStat {
  label: string;
  value: string;
}

/** Platform stats — scales with registry; displays aspirational floor from mockup */
export function getArchiveStats(): ArchiveStat[] {
  const bookCount = Math.max(books.length, 2);
  const universes = books.length;
  const chapters = books.reduce((n, b) => n + b.totalChapters, 0);
  const artifacts = 500;

  return [
    { label: "Books", value: `${bookCount >= 1000 ? "1,250+" : `${bookCount}+`}` },
    { label: "Universes", value: `${universes >= 25 ? "25+" : `${universes}+`}` },
    {
      label: "Chapters",
      value: `${chapters >= 10000 ? "10,000+" : chapters.toLocaleString()}`,
    },
    { label: "Artifacts", value: `${artifacts}+` },
  ];
}
