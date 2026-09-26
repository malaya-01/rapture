import { CodexDetailProfile } from "@/components/codex/codex-detail-profile";
import { BookCodexDetailProfile } from "@/components/codex/book-codex-detail-profile";
import { magicDetailConfig } from "@/lib/codex-details";
import { bookMagicDetailConfig } from "@/lib/books/book-codex-details";
import { getBookBySlug } from "@/data/books-registry";
import { notFound } from "next/navigation";

export default async function BookMagicPage({
  params,
}: {
  params: Promise<{ bookSlug: string; id: string }>;
}) {
  const { bookSlug, id } = await params;
  if (!getBookBySlug(bookSlug)) notFound();

  if (bookSlug === "rapture") {
    return <CodexDetailProfile config={magicDetailConfig(id)} bookSlug="rapture" />;
  }

  return (
    <BookCodexDetailProfile
      bookSlug={bookSlug}
      config={bookMagicDetailConfig(bookSlug, id)}
    />
  );
}
