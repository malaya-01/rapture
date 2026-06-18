"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getCharacterById, characters } from "@/data/characters";
import { getRelationshipsForCharacter } from "@/data/relationships";
import { timelineEvents } from "@/data/timeline";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";
import {
  filterRelationshipsByProgress,
  relationshipLabelForProgress,
  isFirstAppearanceUnlocked,
} from "@/lib/spoilers";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { Artwork } from "@/components/reader/reader-primitives";
import { PortraitPlaceholder } from "@/components/ui/image-prompt-modal";
import {
  EncyclopediaSection,
  StatGrid,
} from "@/components/encyclopedia/encyclopedia-sections";
import {
  formatAffinity,
  formatChapterRef,
  formatSecondaryGender,
  formatStoryRole,
  formatSlugId,
} from "@/lib/format-encyclopedia";

export function CharacterProfile({ id }: { id: string }) {
  const character = getCharacterById(id);
  const hydrated = useStoreHydration();
  const progress = useReadingStore((s) => s.progress);
  if (!character) notFound();

  if (
    hydrated &&
    !isFirstAppearanceUnlocked(character.firstAppearance, progress)
  ) {
    notFound();
  }

  const allBonds = getRelationshipsForCharacter(id);
  const bonds = hydrated
    ? filterRelationshipsByProgress(allBonds, progress)
    : allBonds.filter((r) => r.minChapter <= 1);
  const appearances = timelineEvents.filter((e) =>
    e.characterIds?.includes(id)
  );

  const related = Array.from(
    new Map(
      bonds
        .map((r) => {
          const otherId = r.sourceId === id ? r.targetId : r.sourceId;
          return characters.find((c) => c.id === otherId);
        })
        .filter(Boolean)
        .map((c) => [c!.id, c!])
    ).values()
  );

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-4xl px-5">
        <Link
          href="/encyclopedia"
          className="text-ui mb-10 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Codex
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Artwork
            title={character.name}
            aspectRatio="16/7"
            promptId={character.id}
            illustration={{
              type: "character",
              title: character.name,
              subtitle: character.title,
              color: character.imageColor,
            }}
          />

          <header className="mt-12 text-center md:text-left">
            <p className="label-volume">Character Archive</p>
            <h1 className="title-chapter mt-3 text-gold">{character.name}</h1>
            <p className="text-ui mt-2 text-sm tracking-widest text-text-muted uppercase">
              {character.title} · {character.faction}
            </p>
            <div className="text-ui mt-4 flex flex-wrap justify-center gap-4 text-sm text-text-muted md:justify-start">
              <span>Role: {formatStoryRole(character.storyRole) || character.role}</span>
              <span>First seen: {formatChapterRef(character.firstAppearance)}</span>
              {character.romanceRelevant && <span>Romance arc</span>}
            </div>
          </header>

          <EncyclopediaSection title="Profile" className="mt-12">
            <StatGrid
              items={[
                { label: "Title", value: character.title ?? "—" },
                { label: "Faction", value: character.faction },
                { label: "Story role", value: formatStoryRole(character.storyRole) || character.role },
                { label: "Secondary gender", value: formatSecondaryGender(character.secondaryGender) },
                { label: "Magic affinity", value: formatAffinity(character.affinity) },
                ...(character.ageAtRapture != null
                  ? [{ label: "Age at Rapture", value: String(character.ageAtRapture) }]
                  : []),
                ...(character.povTier
                  ? [{ label: "POV tier", value: formatSlugId(character.povTier) }]
                  : []),
                { label: "First appearance", value: formatChapterRef(character.firstAppearance) },
              ]}
            />
          </EncyclopediaSection>

          <EncyclopediaSection title="Description">
            <p className="reader-prose !text-xl !leading-[1.9] text-text/90">
              {character.description}
            </p>
          </EncyclopediaSection>

          {character.appearance && (
            <EncyclopediaSection title="Appearance">
              <p className="reader-prose !text-lg text-text/90">{character.appearance}</p>
            </EncyclopediaSection>
          )}

          {character.personality && (
            <EncyclopediaSection title="Personality">
              <p className="reader-prose !text-lg text-text/90">{character.personality}</p>
            </EncyclopediaSection>
          )}

          {character.preRaptureLife && (
            <EncyclopediaSection title="Before Rapture">
              <p className="reader-prose !text-lg text-text/90">{character.preRaptureLife}</p>
            </EncyclopediaSection>
          )}

          {character.arc && (
            <EncyclopediaSection title="Character arc">
              <p className="reader-prose !text-lg text-text/90">{character.arc}</p>
            </EncyclopediaSection>
          )}

          <EncyclopediaSection title="Personality traits">
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

          <EncyclopediaSection title="Relationships">
            <div className="space-y-2">
              {bonds.map((r) => {
                const otherId = r.sourceId === id ? r.targetId : r.sourceId;
                const other = characters.find((c) => c.id === otherId);
                return (
                  <div
                    key={r.id}
                    className="codex-panel flex items-center justify-between rounded-sm px-4 py-3"
                  >
                    <Link
                      href={`/encyclopedia/characters/${otherId}`}
                      className="text-text hover:text-gold"
                    >
                      {other?.name}
                    </Link>
                    <span className="text-ui text-xs tracking-wider text-text-muted uppercase">
                      {relationshipLabelForProgress(r, progress)}
                    </span>
                  </div>
                );
              })}
            </div>
          </EncyclopediaSection>

          {appearances.length > 0 && (
            <EncyclopediaSection title="Timeline Appearances">
              <div className="space-y-3">
                {appearances.map((e) => (
                  <Link
                    key={e.id}
                    href="/timeline"
                    className="codex-panel block rounded-sm p-4 transition-colors hover:border-gold/25"
                  >
                    <p className="text-ui text-xs text-gold/70">
                      Year {e.year} · {e.era}
                    </p>
                    <p className="mt-1 font-display text-text">{e.title}</p>
                  </Link>
                ))}
              </div>
            </EncyclopediaSection>
          )}

          {related.length > 0 && (
            <EncyclopediaSection title="Related Characters">
              <div className="grid gap-3 sm:grid-cols-2">
                {related.map(
                  (c) =>
                    c && (
                      <Link
                        key={c.id}
                        href={`/encyclopedia/characters/${c.id}`}
                        className="codex-panel flex items-center gap-3 rounded-sm p-3"
                      >
                        <PortraitPlaceholder
                          promptId={c.id}
                          label={c.name.slice(0, 2)}
                          color={c.imageColor}
                          size="sm"
                          className="h-10 w-10"
                        />
                        <span className="text-text">{c.name}</span>
                      </Link>
                    )
                )}
              </div>
            </EncyclopediaSection>
          )}
        </motion.div>
      </div>
    </Atmosphere>
  );
}
