import { BookCharacterProfile } from "@/components/codex/book-character-profile";
import { CharacterProfile } from "@/components/codex/character-profile";
import { getBookBySlug } from "@/data/books-registry";
import { notFound } from "next/navigation";

export default async function BookCharacterPage({
  params,
}: {
  params: Promise<{ bookSlug: string; id: string }>;
}) {
  const { bookSlug, id } = await params;
  if (!getBookBySlug(bookSlug)) notFound();

  if (bookSlug === "rapture") {
    return <CharacterProfile id={id} />;
  }

  return <BookCharacterProfile bookSlug={bookSlug} id={id} />;
}
