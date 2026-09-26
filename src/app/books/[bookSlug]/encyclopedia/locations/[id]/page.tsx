import { CodexDetailProfile } from "@/components/codex/codex-detail-profile";
import { BookCodexDetailProfile } from "@/components/codex/book-codex-detail-profile";
import { locationDetailConfig } from "@/lib/codex-details";
import { bookLocationDetailConfig } from "@/lib/books/book-codex-details";
import { getBookBySlug } from "@/data/books-registry";
import { notFound } from "next/navigation";

export default async function BookLocationPage({
  params,
}: {
  params: Promise<{ bookSlug: string; id: string }>;
}) {
  const { bookSlug, id } = await params;
  if (!getBookBySlug(bookSlug)) notFound();

  if (bookSlug === "rapture") {
    return <CodexDetailProfile config={locationDetailConfig(id)} bookSlug="rapture" />;
  }

  return (
    <BookCodexDetailProfile
      bookSlug={bookSlug}
      config={bookLocationDetailConfig(bookSlug, id)}
    />
  );
}
