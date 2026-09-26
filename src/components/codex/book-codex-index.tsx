"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";
import { getBookBySlug } from "@/data/books-registry";
import {
  getBookCodexData,
  getCodexBasePath,
} from "@/lib/books/book-codex-data";
import { getBookBasePath } from "@/lib/books/book-data";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { PortraitPlaceholder } from "@/components/ui/image-prompt-modal";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";
import { isFirstAppearanceUnlocked } from "@/lib/spoilers";
import { cn } from "@/lib/utils";

type Section = "characters" | "locations" | "magic" | "events";

const SECTION_META: Record<Section, { label: string; accent: string }> = {
  characters: { label: "Characters", accent: "#d4af37" },
  locations: { label: "Locations", accent: "#4f8b5a" },
  magic: { label: "Magic & Skills", accent: "#553c9a" },
  events: { label: "Timeline", accent: "#8b6b2e" },
};

export function BookCodexIndex({ bookSlug }: { bookSlug: string }) {
  const book = getBookBySlug(bookSlug)!;
  const codex = getBookCodexData(bookSlug);
  const base = getCodexBasePath(bookSlug);
  const [section, setSection] = useState<Section>("characters");
  const [search, setSearch] = useState("");
  const hydrated = useStoreHydration();
  const progress = useReadingStore((s) => s.byBook[bookSlug]?.progress ?? {});

  const availableSections = useMemo(() => {
    const s: Section[] = ["characters"];
    if (codex.locations.length > 0) s.push("locations");
    if (codex.magicSkills.length > 0) s.push("magic");
    if (codex.timelineEvents.length > 0 && book.features.timeline) s.push("events");
    return s;
  }, [codex, book.features.timeline]);

  const entries = useMemo(() => {
    const q = search.toLowerCase();
    const match = (s: string) => !q || s.toLowerCase().includes(q);
    const ok = (first?: string) =>
      !hydrated || isFirstAppearanceUnlocked(first, progress);

    if (section === "characters") {
      return codex.characters
        .filter(
          (c) =>
            ok(c.firstAppearance) &&
            (match(c.name) || match(c.description))
        )
        .map((c) => ({
          id: c.id,
          name: c.name,
          subtitle: c.faction ?? c.role,
          description: c.description,
          color: c.imageColor ?? book.accentColor,
          href: `${base}/characters/${c.id}`,
          promptId: c.id,
        }));
    }
    if (section === "locations") {
      return codex.locations
        .filter(
          (l) =>
            ok(l.firstAppearance) &&
            (match(l.name) || match(l.description))
        )
        .map((l) => ({
          id: l.id,
          name: l.name,
          subtitle: l.region ?? "Location",
          description: l.description,
          color: l.color ?? book.accentColor,
          href: `${base}/locations/${l.id}`,
          promptId: l.id,
        }));
    }
    if (section === "magic") {
      return codex.magicSkills
        .filter((m) => match(m.name) || match(m.description ?? ""))
        .map((m) => ({
          id: m.id,
          name: m.name,
          subtitle: String(m.type ?? "magic"),
          description: m.description ?? "",
          color: (m.color as string) ?? book.accentColor,
          href: `${base}/magic/${m.id}`,
          promptId: m.id,
        }));
    }
    return codex.timelineEvents
      .filter((e) => ok(e.chapter) && (match(e.title) || match(e.description)))
      .map((e) => ({
        id: e.id,
        name: e.title,
        subtitle: e.era ?? "Event",
        description: e.description,
        color: e.color ?? book.accentColor,
        href: `${base}/events/${e.id}`,
        promptId: e.id,
      }));
  }, [section, search, codex, hydrated, progress, base, book.accentColor]);

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-6xl px-5">
        <header className="mb-14 text-center">
          <Link
            href={getBookBasePath(bookSlug)}
            className="text-ui mb-6 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            {book.title}
          </Link>
          <p className="label-volume text-gold/50">World Codex</p>
          <h1 className="title-legend embossed-gold mt-4">{book.title}</h1>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-text-muted">
            {book.subtitle}
          </p>
        </header>

        <div className="relative mx-auto mb-10 max-w-lg">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the archives..."
            className="text-ui w-full rounded-sm border border-gold/12 bg-bg-elevated py-3 pl-11 pr-4 text-sm text-text placeholder:text-text-muted/40 focus:border-gold/30 focus:outline-none"
          />
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {availableSections.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={cn(
                "text-ui rounded-full border px-4 py-1.5 text-xs tracking-wide transition-all",
                section === id
                  ? "border-gold/35 text-gold"
                  : "border-transparent text-text-muted hover:text-text"
              )}
              style={
                section === id
                  ? {
                      backgroundColor: `${SECTION_META[id].accent}15`,
                      borderColor: `${SECTION_META[id].accent}44`,
                    }
                  : undefined
              }
            >
              {SECTION_META[id].label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
            >
              <Link href={entry.href} className="codex-panel block rounded-sm p-5">
                <div className="flex gap-4">
                  <PortraitPlaceholder
                    promptId={entry.promptId}
                    bookSlug={bookSlug}
                    label={entry.name.slice(0, 2).toUpperCase()}
                    color={entry.color}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base tracking-wide text-gold">
                      {entry.name}
                    </h3>
                    <p className="text-ui mt-0.5 text-[0.65rem] tracking-wider text-text-muted uppercase">
                      {entry.subtitle}
                    </p>
                    <p className="mt-2 line-clamp-3 font-serif text-sm leading-relaxed text-text-muted">
                      {entry.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {entries.length === 0 && (
          <p className="text-center font-serif italic text-text-muted">
            No entries found in this archive.
          </p>
        )}
      </div>
    </Atmosphere>
  );
}
