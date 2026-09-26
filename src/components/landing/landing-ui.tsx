"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Library, Sparkles } from "lucide-react";
import { books, libraryName } from "@/data/books-registry";
import { getBookBasePath, getLibraryPath } from "@/lib/books/book-data";
import {
  useLandingStore,
  LANDING_SECTIONS,
  sectionOpacity,
} from "@/store/landing-store";
import { scrollToProgress } from "@/lib/landing/use-scroll-journey";

function scrollToSection(ratio: number) {
  scrollToProgress(ratio);
}

export function LandingUI() {
  const progress = useLandingStore((s) => s.scrollProgress);
  const hoveredUniverse = useLandingStore((s) => s.hoveredUniverse);

  const totalVolumes = books.reduce((s, b) => s + b.totalVolumes, 0);
  const totalChapters = books.reduce((s, b) => s + b.totalChapters, 0);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {/* ── Hero: Arrival ── */}
      <section
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: sectionOpacity(progress, 0, 0.22) }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="max-w-5xl"
        >
          <div className="landing-rune-star mx-auto mb-8" aria-hidden>
            <Sparkles className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <p className="landing-eyebrow">Ancient Magical Archive</p>
          <h1 className="landing-title-main mt-4">
            <span className="landing-gold-text">AETHER VALE</span>
          </h1>
          <p className="landing-title-sub mt-3">Digital Library</p>
          <p className="landing-tagline mx-auto mt-8 max-w-2xl text-[#F5EFE2]/70">
            Every Book Contains A World
          </p>
          <p className="mx-auto mt-4 max-w-xl font-serif text-sm italic text-[#F5EFE2]/45">
            {libraryName} — {books.length} living series, each a doorway to its own reality.
          </p>
          <button
            type="button"
            onClick={() => scrollToSection(LANDING_SECTIONS.universes)}
            className="landing-cta pointer-events-auto mt-12"
          >
            Explore Collections
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </motion.div>
        <div className="landing-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2">
          <span className="landing-eyebrow text-[0.55rem]">Scroll wheel to travel</span>
          <div className="landing-scroll-mouse mt-2" />
        </div>
      </section>

      {/* ── Choose a series ── */}
      <section
        className="absolute inset-0 flex items-center overflow-y-auto px-6 py-24"
        style={{ opacity: sectionOpacity(progress, 0.14, 0.48) }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <p className="landing-eyebrow text-center">Featured Series</p>
          <h2 className="landing-section-title text-center">Living Tomes</h2>
          <p className="landing-tagline mx-auto mt-4 max-w-xl text-center text-base">
            Each volume rests on its own pedestal — glowing, turning, waiting. Scroll deeper
            to walk the hall.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {books.map((book) => {
              const active = hoveredUniverse === book.slug;
              return (
                <Link
                  key={book.id}
                  href={getBookBasePath(book.slug)}
                  className={`landing-universe-panel pointer-events-auto ${active ? "is-active" : ""}`}
                  style={
                    {
                      "--book-accent": book.accentColor,
                    } as CSSProperties
                  }
                  onMouseEnter={() => {
                    useLandingStore.getState().setHoveredUniverse(book.slug);
                    useLandingStore.getState().setAccentTint(book.accentColor);
                  }}
                  onMouseLeave={() => {
                    useLandingStore.getState().setHoveredUniverse(null);
                    useLandingStore.getState().setAccentTint(null);
                  }}
                >
                  {book.coverImage && (
                    <div className="landing-universe-cover">
                      <Image
                        src={book.coverImage}
                        alt=""
                        width={120}
                        height={180}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    className="landing-universe-glow"
                    style={{ background: book.accentColor }}
                  />
                  <p className="landing-eyebrow">{book.totalVolumes} volumes</p>
                  <h3 className="landing-universe-name mt-2">{book.title.toUpperCase()}</h3>
                  <p className="mt-1 font-serif text-lg italic text-[#F5EFE2]/70">
                    {book.subtitle}
                  </p>
                  <p className="mt-4 line-clamp-3 font-serif text-sm leading-relaxed text-[#F5EFE2]/55">
                    {book.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <span className="flex items-center gap-2 text-[#D4AF37]">
                      <span className="landing-eyebrow text-[0.6rem]">Series Home</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Library overview ── */}
      <section
        className="absolute inset-0 flex items-center px-6 py-24"
        style={{ opacity: sectionOpacity(progress, 0.42, 0.68) }}
      >
        <div className="mx-auto w-full max-w-5xl text-center">
          <p className="landing-eyebrow">The Observatory</p>
          <h2 className="landing-section-title">One Library, Many Worlds</h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <ObservatoryDevice label="Series" value={String(books.length)} type="ring" />
            <ObservatoryDevice label="Volumes" value={String(totalVolumes)} type="crystal" />
            <ObservatoryDevice label="Chapters" value={String(totalChapters)} type="rune" />
          </div>
          <p className="landing-tagline mx-auto mt-12 max-w-lg">
            Progress, codexes, and volume libraries are kept separate per series — nothing
            assumes you are reading a single book.
          </p>
          <Link
            href="/library"
            className="landing-cta pointer-events-auto mt-10 inline-flex"
          >
            <Library className="mr-2 h-4 w-4" />
            Open Full Shelf
          </Link>
        </div>
      </section>

      {/* ── Enter ── */}
      <section
        className="absolute inset-0 flex flex-col items-center justify-center px-6 py-24 text-center"
        style={{ opacity: sectionOpacity(progress, 0.72, 1) }}
      >
        <p className="landing-eyebrow">Final Threshold</p>
        <h2 className="landing-section-title">Where Will You Go?</h2>
        <p className="landing-tagline mx-auto mt-6 max-w-lg">
          Pick any series to begin — or open the full shelf to compare worlds side by side.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/library" className="landing-cta pointer-events-auto">
            <BookOpen className="mr-2 h-4 w-4" />
            Enter Library
          </Link>
          {books.map((book) => (
            <Link
              key={book.slug}
              href={getLibraryPath(book.slug)}
              className="landing-cta-secondary pointer-events-auto"
              style={{ borderColor: `${book.accentColor}55`, color: book.accentColor }}
            >
              {book.title} Volumes
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function ObservatoryDevice({
  label,
  value,
  type,
}: {
  label: string;
  value: string;
  type: "ring" | "crystal" | "rune" | "constellation";
}) {
  return (
    <div className="landing-observatory-device">
      <div className={`landing-observatory-visual landing-observatory-${type}`} aria-hidden>
        <span className="landing-observatory-value">{value}</span>
      </div>
      <p className="landing-eyebrow mt-4">{label}</p>
    </div>
  );
}
