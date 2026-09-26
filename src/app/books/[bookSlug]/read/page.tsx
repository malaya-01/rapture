import { redirect } from "next/navigation";
import { getBookData } from "@/lib/books/book-data";
import { getReadPath } from "@/lib/books/book-data";
import { getBookBySlug } from "@/data/books-registry";
import { notFound } from "next/navigation";

export default async function BookReadIndexPage({
  params,
}: {
  params: Promise<{ bookSlug: string }>;
}) {
  const { bookSlug } = await params;
  if (!getBookBySlug(bookSlug)) notFound();
  const data = getBookData(bookSlug);
  const first = data.firstReadableChapterId ?? "ch-0001";
  redirect(getReadPath(bookSlug, first));
}
