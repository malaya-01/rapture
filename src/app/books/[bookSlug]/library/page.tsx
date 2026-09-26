import { notFound } from "next/navigation";
import { BookLibraryView } from "@/components/library/book-library-view";
import { getBookBySlug } from "@/data/books-registry";

export default async function BookLibraryPage({
  params,
}: {
  params: Promise<{ bookSlug: string }>;
}) {
  const { bookSlug } = await params;
  if (!getBookBySlug(bookSlug)) notFound();
  return <BookLibraryView bookSlug={bookSlug} />;
}
