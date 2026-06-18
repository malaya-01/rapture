"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { characters } from "@/data/characters";
import { companions } from "@/data/companions";
import {
  relationships,
  getRelationshipsForCharacter,
} from "@/data/relationships";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { PortraitPlaceholder } from "@/components/ui/image-prompt-modal";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";
import {
  filterRelationshipsByProgress,
  relationshipLabelForProgress,
  isFirstAppearanceUnlocked,
  getMaxReadChapterNumber,
} from "@/lib/spoilers";
import type { Relationship, RelationshipType } from "@/types";
import { cn } from "@/lib/utils";

const COLORS: Record<RelationshipType, string> = {
  family: "#d4af37",
  romance: "#c45c6a",
  alliance: "#4f8b5a",
  mentor: "#5a6bcf",
  rivalry: "#8b6b95",
  enemy: "#8b2e2e",
};

const LABELS: Record<RelationshipType | "all", string> = {
  all: "All bonds",
  family: "Family",
  alliance: "Alliance",
  mentor: "Mentor",
  romance: "Romance",
  enemy: "Conflict",
  rivalry: "Rivalry",
};

interface BondEntity {
  id: string;
  name: string;
  subtitle: string;
  href: string;
  imageColor: string;
  imageId: string;
  kind: "character" | "companion";
}

function resolveEntity(id: string): BondEntity | null {
  const c = characters.find((x) => x.id === id);
  if (c) {
    return {
      id: c.id,
      name: c.name,
      subtitle: c.title ?? c.role,
      href: `/encyclopedia/characters/${c.id}`,
      imageColor: c.imageColor,
      imageId: c.id,
      kind: "character",
    };
  }
  const comp = companions.find((x) => x.id === id);
  if (comp) {
    return {
      id: comp.id,
      name: comp.name,
      subtitle: comp.species,
      href: `/encyclopedia/companions/${comp.id}`,
      imageColor: comp.imageColor,
      imageId: comp.id,
      kind: "companion",
    };
  }
  return null;
}

function chapterNum(ref?: string) {
  if (!ref) return 9999;
  const m = /ch-(\d+)/i.exec(ref);
  return m ? parseInt(m[1], 10) : 9999;
}

export function LoreNetwork() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<RelationshipType | "all">("all");
  const hydrated = useStoreHydration();
  const progress = useReadingStore((s) => s.progress);
  const maxChapter = hydrated ? getMaxReadChapterNumber(progress) : 1;

  const visibleRelationships = useMemo(
    () =>
      hydrated
        ? filterRelationshipsByProgress(relationships, progress)
        : relationships.filter((r) => r.minChapter <= 1),
    [hydrated, progress]
  );

  const roster = useMemo(() => {
    const linked = new Set<string>();
    for (const r of visibleRelationships) {
      linked.add(r.sourceId);
      linked.add(r.targetId);
    }
    return characters
      .filter((c) => {
        if (!linked.has(c.id)) return false;
        if (!hydrated) return chapterNum(c.firstAppearance) <= 30;
        return isFirstAppearanceUnlocked(c.firstAppearance, progress);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [visibleRelationships, hydrated, progress]);

  const selectedChar = selected
    ? characters.find((c) => c.id === selected)
    : null;

  const bonds = useMemo(() => {
    if (!selected) return [];
    const all = getRelationshipsForCharacter(selected);
    const unlocked = hydrated
      ? filterRelationshipsByProgress(all, progress)
      : all.filter((r) => r.minChapter <= 1);
    return filter === "all" ? unlocked : unlocked.filter((r) => r.type === filter);
  }, [selected, filter, hydrated, progress]);

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-6xl px-5 pb-16">
        <header className="mb-10 text-center">
          <p className="label-volume text-gold/50">The Web of Fate</p>
          <h1 className="title-legend embossed-gold mt-4">Bonds &amp; Alliances</h1>
          <p className="mx-auto mt-4 max-w-lg font-serif text-lg italic text-text-muted">
            Select a soul to see who they trust, love, or oppose — as your reading unlocks it
          </p>
          {hydrated && maxChapter > 0 && (
            <p className="text-ui mt-2 text-xs text-text-muted/60">
              Revealed through Chapter {maxChapter}
            </p>
          )}
        </header>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {(
            ["all", "family", "alliance", "mentor", "romance", "rivalry", "enemy"] as const
          ).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={cn(
                "text-ui rounded-full border px-3 py-1.5 text-xs transition-all duration-300",
                filter === t
                  ? "border-gold/35 bg-gold/10 text-gold"
                  : "border-transparent text-text-muted hover:text-text"
              )}
            >
              {LABELS[t]}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <section>
            <p className="label-volume mb-4">Cast</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {roster.map((c) => {
                const count = getRelationshipsForCharacter(c.id).filter((r) =>
                  visibleRelationships.some((vr) => vr.id === r.id)
                ).length;
                const isSel = selected === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelected(isSel ? null : c.id)}
                    className={cn(
                      "codex-panel flex flex-col items-center rounded-sm p-4 text-center transition-all duration-300",
                      isSel
                        ? "border-gold/40 ring-1 ring-gold/25"
                        : "hover:border-gold/20"
                    )}
                  >
                    <PortraitPlaceholder
                      promptId={c.id}
                      label={c.name.slice(0, 2)}
                      color={c.imageColor}
                      size="md"
                      showPrompt={false}
                    />
                    <p className="mt-3 font-display text-sm text-text">{c.name}</p>
                    <p className="text-ui mt-0.5 text-[0.65rem] text-text-muted">
                      {count} bond{count === 1 ? "" : "s"}
                    </p>
                  </button>
                );
              })}
            </div>
            {roster.length === 0 && (
              <p className="font-serif text-text-muted">
                Read further to reveal characters and their connections.
              </p>
            )}
          </section>

          <section className="codex-panel min-h-[320px] rounded-sm p-6">
            {!selectedChar ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
                <p className="font-display text-gold/70">Choose a portrait</p>
                <p className="mt-2 max-w-xs font-serif text-sm text-text-muted">
                  Relationships appear here with portraits, bond type, and how the story names
                  that connection at your current chapter.
                </p>
              </div>
            ) : (
              <motion.div
                key={selectedChar.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex gap-4 border-b border-gold/10 pb-5">
                  <PortraitPlaceholder
                    promptId={selectedChar.id}
                    label={selectedChar.name.slice(0, 2)}
                    color={selectedChar.imageColor}
                    size="lg"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl text-gold">{selectedChar.name}</h2>
                    <p className="text-ui text-xs tracking-widest text-text-muted uppercase">
                      {selectedChar.title}
                    </p>
                    <p className="mt-2 line-clamp-3 font-serif text-sm text-text-muted">
                      {selectedChar.description}
                    </p>
                    <Link
                      href={`/encyclopedia/characters/${selectedChar.id}`}
                      className="text-ui mt-3 inline-block text-sm text-gold hover:underline"
                    >
                      Full archive entry →
                    </Link>
                  </div>
                </div>

                <p className="label-volume mb-3 mt-6">Bonds</p>
                {bonds.length === 0 ? (
                  <p className="font-serif text-sm text-text-muted">
                    No bonds of this type revealed yet at your reading progress.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {bonds.map((r) => (
                      <BondRow
                        key={r.id}
                        relationship={r}
                        perspectiveId={selectedChar.id}
                        progress={progress}
                        hydrated={hydrated}
                      />
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </Atmosphere>
  );
}

function BondRow({
  relationship,
  perspectiveId,
  progress,
  hydrated,
}: {
  relationship: Relationship;
  perspectiveId: string;
  progress: Record<string, import("@/types").ReadingProgress>;
  hydrated: boolean;
}) {
  const otherId =
    relationship.sourceId === perspectiveId
      ? relationship.targetId
      : relationship.sourceId;
  const other = resolveEntity(otherId);
  if (!other) return null;

  const label = hydrated
    ? relationshipLabelForProgress(relationship, progress)
    : relationship.label;

  return (
    <li>
      <Link
        href={other.href}
        className="flex items-center gap-3 rounded-sm border border-gold/10 bg-bg/40 px-3 py-2.5 transition-colors hover:border-gold/25 hover:bg-gold/5"
      >
        <PortraitPlaceholder
          promptId={other.imageId}
          label={other.name.slice(0, 2)}
          color={other.imageColor}
          size="sm"
          showPrompt={false}
        />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm text-text">{other.name}</p>
          <p className="text-ui text-[0.65rem] text-text-muted">{other.subtitle}</p>
        </div>
        <div className="text-right">
          <span
            className="text-ui inline-block rounded-full px-2 py-0.5 text-[0.6rem] tracking-wider uppercase"
            style={{
              color: COLORS[relationship.type],
              border: `1px solid ${COLORS[relationship.type]}44`,
            }}
          >
            {LABELS[relationship.type]}
          </span>
          <p className="text-ui mt-1 text-[0.65rem] text-text-muted capitalize">{label}</p>
        </div>
      </Link>
    </li>
  );
}
