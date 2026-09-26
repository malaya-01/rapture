"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Library } from "lucide-react";
import { books } from "@/data/books-registry";
import { getBookBasePath, getLibraryPath, getReadPath } from "@/lib/books/book-data";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { cn } from "@/lib/utils";

export function LibraryHub() {
  const hydrated = useStoreHydration();

  return (
    <Atmosphere particles={false}>
      <section className="relative min-h-[85vh] overflow-hidden">
        <div className="absolute inset-0 z-0 min-h-[70vh]">
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, #2a1f18 0%, #090807 55%, #050504 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,5,5,0.05) 0%, rgba(5,5,5,0.35) 50%, rgba(9,8,7,0.88) 85%, #090807 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 vignette opacity-50" />
        </div>

        <div className="pointer-events-none relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-4xl"
          >
            <p className="label-volume text-gold/60">Digital Library</p>
            <h1 className="title-legend embossed-gold mt-6">AETHER VALE</h1>
            <p className="landing-title-sub mt-3 text-[#F5EFE2]/80">Digital Library</p>
            <p className="mx-auto mt-6 max-w-2xl font-serif text-xl italic text-[#F5EFE2]/60">
              Every Book Contains A World
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-gold/10 px-6 pb-32 pt-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="label-volume text-center text-gold/50">Your Shelf</h2>
          <p className="mt-3 text-center font-display text-2xl tracking-wide text-text">
            {books.length} {books.length === 1 ? "Series" : "Series"}
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {books.map((book, i) => (
              <BookShelfCard key={book.id} book={book} index={i} hydrated={hydrated} />
            ))}
          </div>
        </div>
      </section>
    </Atmosphere>
  );
}

function BookShelfCard({
  book,
  index,
  hydrated,
}: {
  book: (typeof books)[0];
  index: number;
  hydrated: boolean;
}) {
  const progress = useReadingStore((s) =>
    hydrated ? s.getBookOverallProgress(book.slug) : 0
  );
  const currentChapterId = useReadingStore((s) =>
    hydrated ? s.getBookCurrentChapterId(book.slug) : ""
  );
  const readHref = currentChapterId
    ? getReadPath(book.slug, currentChapterId)
    : getReadPath(book.slug, "ch-0001");

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7 }}
      className="codex-panel overflow-hidden rounded-sm"
    >
      <div
        className="artwork-frame mb-4 overflow-hidden rounded-sm"
        style={{ aspectRatio: "2/3" }}
      >
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={`${book.title} cover`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-end p-4 text-center"
            style={{
              background: `linear-gradient(160deg, ${book.accentColor}44, #090807)`,
            }}
          >
            <span className="label-volume text-[0.6rem]">{book.subtitle}</span>
          </div>
        )}
      </div>
      <div className="p-6 md:p-8">
        <p className="label-volume text-[0.6rem] text-gold/50">
          {book.totalVolumes} volumes · {book.totalChapters} chapters
        </p>
        <h3 className="mt-2 font-display text-2xl tracking-wide text-gold">
          {book.title}
        </h3>
        <p className="mt-1 font-serif text-lg italic text-text-muted">
          {book.subtitle}
        </p>
        <p className="mt-4 font-serif text-sm leading-relaxed text-text-muted">
          {book.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {book.genre.slice(0, 4).map((g) => (
            <span
              key={g}
              className="text-ui rounded-full border border-gold/15 px-2.5 py-0.5 text-[0.6rem] tracking-wider text-text-muted uppercase"
            >
              {g}
            </span>
          ))}
        </div>

        {hydrated && progress > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-[0.65rem] text-text-muted">
              <span>Reading progress</span>
              <span className="text-gold/70">{progress}%</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg-elevated">
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${book.accentColor}, ${book.accentColor}aa)`,
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={getBookBasePath(book.slug)}
            className="text-ui inline-flex items-center gap-2 rounded-sm border border-gold/30 bg-gold/10 px-5 py-2.5 text-sm text-gold hover:bg-gold/20"
          >
            <BookOpen className="h-4 w-4" />
            Series Home
          </Link>
          <Link
            href={readHref}
            className="text-ui inline-flex items-center gap-2 rounded-sm border border-gold/20 px-5 py-2.5 text-sm text-text hover:border-gold/40 hover:text-gold"
          >
            {progress > 0 ? "Continue" : "Begin"}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={getLibraryPath(book.slug)}
            className={cn(
              "text-ui inline-flex items-center gap-2 rounded-sm border border-gold/15 px-5 py-2.5 text-sm text-text-muted hover:text-text"
            )}
          >
            <Library className="h-4 w-4" />
            Volumes
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
