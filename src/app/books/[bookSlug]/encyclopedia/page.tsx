import { notFound } from "next/navigation";
import { CodexIndex } from "@/components/codex/codex-index";
import { BookCodexIndex } from "@/components/codex/book-codex-index";
import { getBookBySlug } from "@/data/books-registry";

export default async function BookEncyclopediaPage({
  params,
}: {
  params: Promise<{ bookSlug: string }>;
}) {
  const { bookSlug } = await params;
  const book = getBookBySlug(bookSlug);
  if (!book || !book.features.codex) notFound();

  if (bookSlug === "rapture") {
    return <CodexIndex />;
  }

  return <BookCodexIndex bookSlug={bookSlug} />;
}
