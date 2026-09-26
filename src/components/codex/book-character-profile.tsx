"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getBookBySlug } from "@/data/books-registry";
import { getBookCodexData, getCodexBasePath } from "@/lib/books/book-codex-data";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";
import { isFirstAppearanceUnlocked } from "@/lib/spoilers";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { PortraitPlaceholder } from "@/components/ui/image-prompt-modal";
import { EncyclopediaSection } from "@/components/encyclopedia/encyclopedia-sections";
import { formatChapterRef } from "@/lib/format-encyclopedia";

export function BookCharacterProfile({
  bookSlug,
  id,
}: {
  bookSlug: string;
  id: string;
}) {
  const book = getBookBySlug(bookSlug);
  const codex = getBookCodexData(bookSlug);
  const character = codex.characters.find((c) => c.id === id);
  const hydrated = useStoreHydration();
  const progress = useReadingStore((s) => s.byBook[bookSlug]?.progress ?? {});

  if (!book || !character) notFound();

  if (
    hydrated &&
    !isFirstAppearanceUnlocked(character.firstAppearance, progress)
  ) {
    notFound();
  }

  const bonds = codex.getRelationshipsForCharacter(id).filter((r) => {
    const min = r.minChapter ?? 1;
    if (min <= 1) return true;
    if (!hydrated) return min <= 1;
    const max = Object.keys(progress).reduce((m, chId) => {
      const n = parseInt(chId.replace(/\D/g, ""), 10);
      return Math.max(m, n);
    }, 0);
    return max >= min;
  });

  const base = getCodexBasePath(bookSlug);

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-4xl px-5">
        <Link
          href={base}
          className="text-ui mb-10 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Codex
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-center md:justify-start">
            <PortraitPlaceholder
              promptId={character.id}
              bookSlug={bookSlug}
              label={character.name.slice(0, 2)}
              color={character.imageColor ?? book.accentColor}
              size="lg"
            />
          </div>

          <header className="mt-10 text-center md:text-left">
            <p className="label-volume">Character Archive</p>
            <h1 className="title-chapter mt-3 text-gold">{character.name}</h1>
            <p className="text-ui mt-2 text-sm tracking-widest text-text-muted uppercase">
              {character.faction ?? character.role}
            </p>
            {character.firstAppearance && (
              <p className="text-ui mt-3 text-sm text-text-muted">
                First seen: {formatChapterRef(character.firstAppearance)}
              </p>
            )}
          </header>

          <EncyclopediaSection title="Profile" className="mt-12">
            <p className="reader-prose !text-xl leading-relaxed text-text/90">
              {character.description}
            </p>
          </EncyclopediaSection>

          {character.traits && character.traits.length > 0 && (
            <EncyclopediaSection title="Traits">
              <div className="flex flex-wrap gap-2">
                {character.traits.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-gold/15 bg-gold/5 px-3 py-1 text-sm text-gold/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </EncyclopediaSection>
          )}

          {bonds.length > 0 && (
            <EncyclopediaSection title="Relationships">
              <div className="space-y-2">
                {bonds.map((r) => {
                  const otherId =
                    "from" in r && "to" in r
                      ? r.from === id
                        ? r.to
                        : r.from
                      : (r as { sourceId?: string; targetId?: string }).sourceId === id
                        ? (r as { targetId: string }).targetId
                        : (r as { sourceId: string }).sourceId;
                  const other = codex.characters.find((c) => c.id === otherId);
                  return (
                    <div
                      key={r.id}
                      className="codex-panel flex items-center justify-between rounded-sm px-4 py-3"
                    >
                      <Link
                        href={`${base}/characters/${otherId}`}
                        className="text-text hover:text-gold"
                      >
                        {other?.name ?? otherId}
                      </Link>
                      <span className="text-ui text-xs tracking-wider text-text-muted uppercase">
                        {"type" in r ? r.type : "bond"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </EncyclopediaSection>
          )}
        </motion.div>
      </div>
    </Atmosphere>
  );
}
