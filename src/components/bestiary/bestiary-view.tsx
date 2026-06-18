"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Skull } from "lucide-react";
import { monsters, getMonsterById } from "@/data/monsters";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { Artwork } from "@/components/reader/reader-primitives";
import { PortraitPlaceholder } from "@/components/ui/image-prompt-modal";
import {
  DataTable,
  EncyclopediaSection,
  LinkTagList,
  StatGrid,
  TagList,
} from "@/components/encyclopedia/encyclopedia-sections";
import {
  formatChapterRef,
  formatPercent,
  formatSlugId,
  tierLabel,
} from "@/lib/format-encyclopedia";

const THREAT_COLORS = {
  low: "#4f8b5a",
  moderate: "#8b6b2e",
  high: "#c45c6a",
  extreme: "#8b2e2e",
};

export function BestiaryIndex() {
  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-5xl px-5">
        <header className="mb-14 text-center">
          <p className="label-volume text-danger/80">Hunter&apos;s Archive</p>
          <h1 className="title-legend embossed-gold mt-4">Bestiary</h1>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-text-muted">
            Creatures of the fractured world — classifications, threats, and weaknesses
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {monsters.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
            >
              <Link
                href={`/bestiary/${m.id}`}
                className="codex-panel group block rounded-sm p-5"
              >
                <div className="flex gap-4">
                  <PortraitPlaceholder
                    promptId={m.id}
                    color={m.imageColor}
                    size="md"
                    className="flex h-20 w-16 items-center justify-center"
                  >
                    <span className="flex h-full w-full items-center justify-center">
                      <Skull className="h-6 w-6 text-text/60" />
                    </span>
                  </PortraitPlaceholder>
                  <div>
                    <h3 className="font-display text-base text-gold group-hover:text-gold/90">
                      {m.name}
                    </h3>
                    <p className="text-ui text-[0.65rem] tracking-wider text-text-muted uppercase">
                      {m.classification}
                    </p>
                    <p className="text-ui mt-2 text-xs font-medium uppercase">
                      <span style={{ color: THREAT_COLORS[m.threat] }}>
                        Rank {m.threatRank}
                      </span>
                      <span className="text-text-muted"> · {tierLabel(m.tier)}</span>
                    </p>
                    <p className="mt-2 line-clamp-2 font-serif text-sm text-text-muted">
                      {m.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Atmosphere>
  );
}

export function MonsterProfile({ id }: { id: string }) {
  const monster = getMonsterById(id);
  if (!monster) notFound();

  const evolutionLinks = monster.evolutionChain
    .filter((eid) => eid !== monster.id)
    .map((eid) => {
      const m = monsters.find((x) => x.id === eid);
      return { label: m?.name ?? formatSlugId(eid), href: `/bestiary/${eid}` };
    });

  const priorForm = monster.evolutionOf
    ? monsters.find((m) => m.id === monster.evolutionOf)
    : null;

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-4xl px-5">
        <Link
          href="/bestiary"
          className="text-ui mb-10 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Bestiary
        </Link>

        <Artwork
          title={monster.name}
          aspectRatio="21/9"
          promptId={monster.id}
          illustration={{
            type: "monster",
            title: monster.name,
            subtitle: monster.classification,
            color: monster.imageColor,
          }}
        />

        <header className="mt-12">
          <p className="label-volume text-danger/70">Bestiary Entry</p>
          <h1 className="title-chapter mt-3 text-gold">{monster.name}</h1>
          <p className="text-ui mt-2 text-sm tracking-widest text-text-muted uppercase">
            {monster.classification}
            {monster.named ? " · Named entity" : ""}
            {monster.dungeonExclusive ? " · Dungeon exclusive" : ""}
          </p>
          <span
            className="text-ui mt-3 inline-block rounded-full px-3 py-1 text-xs uppercase tracking-wider"
            style={{
              color: THREAT_COLORS[monster.threat],
              backgroundColor: `${THREAT_COLORS[monster.threat]}18`,
            }}
          >
            Threat rank {monster.threatRank} · {tierLabel(monster.tier)}
          </span>
        </header>

        <EncyclopediaSection title="Combat Profile">
          <StatGrid
            items={[
              { label: "Threat rank", value: monster.threatRank },
              { label: "Growth tier", value: String(monster.tier) },
              { label: "Category", value: formatSlugId(monster.classification) },
              { label: "Scale", value: monster.scale || "—" },
              { label: "First appearance", value: formatChapterRef(monster.firstAppearance) },
            ]}
          />
        </EncyclopediaSection>

        {monster.appearance && (
          <EncyclopediaSection title="Appearance">
            <p className="reader-prose !text-xl">{monster.appearance}</p>
          </EncyclopediaSection>
        )}

        {monster.behavior && (
          <EncyclopediaSection title="Behavior">
            <p className="reader-prose !text-xl">{monster.behavior}</p>
          </EncyclopediaSection>
        )}

        {monster.habitats.length > 0 && (
          <EncyclopediaSection title="Natural habitat & range">
            <TagList tags={monster.habitats.map(formatSlugId)} />
          </EncyclopediaSection>
        )}

        {monster.traits.length > 0 && (
          <EncyclopediaSection title="Combat traits & skills">
            <TagList tags={monster.traits.map(formatSlugId)} />
          </EncyclopediaSection>
        )}

        {monster.vulnerabilities.length > 0 && (
          <EncyclopediaSection title="Weaknesses & vulnerabilities">
            <TagList tags={monster.vulnerabilities.map(formatSlugId)} />
          </EncyclopediaSection>
        )}

        {monster.drops.length > 0 && (
          <EncyclopediaSection title="Loot drops">
            <DataTable
              headers={["Material", "Rank", "Drop chance"]}
              rows={monster.drops.map((d) => [
                formatSlugId(d.item),
                d.rank,
                formatPercent(d.chance),
              ])}
            />
          </EncyclopediaSection>
        )}

        {priorForm && (
          <EncyclopediaSection title="Evolution">
            <p className="mb-3 font-serif text-text-muted">
              Evolved from{" "}
              <Link href={`/bestiary/${priorForm.id}`} className="text-gold hover:underline">
                {priorForm.name}
              </Link>
            </p>
          </EncyclopediaSection>
        )}

        {evolutionLinks.length > 0 && (
          <EncyclopediaSection title="Evolution chain">
            <LinkTagList items={evolutionLinks} />
          </EncyclopediaSection>
        )}
      </div>
    </Atmosphere>
  );
}
