import { notFound } from "next/navigation";
import { BookHomePage } from "@/components/home/book-home-page";
import { getBookBySlug } from "@/data/books-registry";

export default async function BookPage({
  params,
}: {
  params: Promise<{ bookSlug: string }>;
}) {
  const { bookSlug } = await params;
  if (!getBookBySlug(bookSlug)) notFound();
  return <BookHomePage bookSlug={bookSlug} />;
}
