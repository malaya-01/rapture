"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Library, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStoreHydration } from "@/lib/use-hydration";
import { useReadingStore } from "@/store/reading-store";
import { isArchiveRoute } from "@/lib/archive/navigation";
import {
  parseBookSlugFromPath,
  getBookBasePath,
  getReadPath,
  getLibraryPath,
} from "@/lib/books/book-data";
import { getBookBySlug } from "@/data/books-registry";

/** Bottom nav for in-book reading context only — wings use ArchiveNav */
export function Navigation() {
  const pathname = usePathname();
  const hydrated = useStoreHydration();
  const bookSlug = parseBookSlugFromPath(pathname);
  const book = bookSlug ? getBookBySlug(bookSlug) : undefined;
  const inBookContext = Boolean(bookSlug && book);
  const progress = useReadingStore((s) =>
    hydrated && bookSlug ? s.getBookOverallProgress(bookSlug) : 0
  );
  const chromeVisible = useReadingStore((s) => s.chromeVisible);

  const isReading =
    pathname.startsWith("/read") || /^\/books\/[^/]+\/read/.test(pathname);

  if (isArchiveRoute(pathname)) return null;
  if (/^\/books\/[^/]+$/.test(pathname)) return null;
  if (isReading && !chromeVisible) return null;
  if (!inBookContext) return null;

  const navItems = [
    { href: "/", label: "Home", icon: ArrowLeft },
    { href: "/library", label: "Library", icon: Library },
    { href: getBookBasePath(book!.slug), label: "Series", icon: BookOpen },
    {
      href: getReadPath(book!.slug, "ch-0001"),
      label: "Read",
      icon: BookOpen,
    },
    {
      href: getLibraryPath(book!.slug),
      label: "Volumes",
      icon: Library,
    },
    {
      href: `${getBookBasePath(book!.slug)}/encyclopedia`,
      label: "Chronicles",
      icon: BookOpen,
      show: book!.features.codex,
    },
  ].filter((item) => item.show !== false);

  return (
    <nav className="text-ui fixed bottom-0 left-0 right-0 z-50 border-t border-gold/10 bg-bg/95 backdrop-blur-lg md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3">
        <Link
          href="/library"
          className="hidden font-display text-sm tracking-[0.25em] text-gold md:block"
        >
          AETHER VALE
        </Link>

        <div className="flex flex-1 items-center justify-around gap-0.5 py-2 md:flex-none md:justify-end">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-sm bg-gold/10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 px-2 py-2 text-[0.6rem] md:flex-row md:gap-1.5 md:text-xs",
                    isActive ? "text-gold" : "text-text-muted hover:text-text"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>

        {book && (
          <div className="hidden items-center gap-2 md:flex">
            <span className="max-w-[8rem] truncate text-[0.6rem] tracking-wider text-text-muted uppercase">
              {book.title}
            </span>
            <div className="h-1 w-16 overflow-hidden rounded-full bg-bg-elevated">
              <div
                className="h-full bg-gradient-to-r from-gold-dim to-gold transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
