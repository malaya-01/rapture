import { BookCodexDetailProfile } from "@/components/codex/book-codex-detail-profile";
import { bookEventDetailConfig } from "@/lib/books/book-codex-details";
import { getBookBySlug } from "@/data/books-registry";
import { notFound } from "next/navigation";

export default async function BookEventPage({
  params,
}: {
  params: Promise<{ bookSlug: string; id: string }>;
}) {
  const { bookSlug, id } = await params;
  if (!getBookBySlug(bookSlug)) notFound();

  return (
    <BookCodexDetailProfile
      bookSlug={bookSlug}
      config={bookEventDetailConfig(bookSlug, id)}
    />
  );
}
