#!/usr/bin/env node
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");

export function getBooksRegistry() {
  return JSON.parse(readFileSync(join(root, "seed", "books.json"), "utf8"));
}

export function getBook(slugOrId) {
  const { books } = getBooksRegistry();
  return (
    books.find((b) => b.slug === slugOrId || b.id === slugOrId) ?? null
  );
}

export function resolveBookPaths(book) {
  return {
    root,
    bookDir: join(root, book.bookDir ?? `books/${book.slug}`),
    seedDir: join(root, book.seedDir),
    contentDir: join(root, book.contentDir),
    knowledgebaseDir: join(root, book.knowledgebaseDir),
    outlinesDir: join(root, book.outlinesDir),
    imagesDir: join(root, book.imagesDir ?? `public/assets/images/${book.slug}`),
    dataDir: join(root, "src", "data", "books", book.slug),
    manifestOut: join(root, book.seedDir, "chapter-manifest.json"),
    scenesOut: join(root, book.seedDir, "chapter-scenes.json"),
    chaptersTsOut: join(root, "src", "data", "books", book.slug, "chapters.ts"),
    manifestTsOut: join(
      root,
      "src",
      "data",
      "books",
      book.slug,
      "chapter-manifest.ts"
    ),
    codexDataDir: join(root, "src", "data", "books", book.slug),
  };
}

export function parseBookArg(argv) {
  const idx = argv.indexOf("--book");
  if (idx !== -1 && argv[idx + 1]) return argv[idx + 1];
  return null;
}

export function booksToProcess(argv) {
  const only = parseBookArg(argv);
  const { books } = getBooksRegistry();
  if (only) {
    const book = getBook(only);
    if (!book) {
      console.error(`Unknown book: ${only}`);
      process.exit(1);
    }
    return [book];
  }
  return books;
}
