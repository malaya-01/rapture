"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ImageIcon } from "lucide-react";
import { characters } from "@/data/characters";
import { locations } from "@/data/locations";
import { monsters } from "@/data/monsters";
import { artifacts } from "@/data/artifacts";
import { equipment } from "@/data/equipment";
import { dungeons } from "@/data/dungeons-data";
import { factions } from "@/data/factions-data";
import { companions } from "@/data/companions";
import { magicSkills, manaLaws } from "@/data/magic-skills";
import { timelineEvents } from "@/data/timeline";
import { getRelationshipsForCharacter } from "@/data/relationships";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { PortraitPlaceholder } from "@/components/ui/image-prompt-modal";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";
import { isFirstAppearanceUnlocked } from "@/lib/spoilers";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

type Section =
  | "characters"
  | "antagonists"
  | "disciples"
  | "companions"
  | "locations"
  | "monsters"
  | "factions"
  | "artifacts"
  | "equipment"
  | "dungeons"
  | "magic"
  | "events";

const SECTIONS: { id: Section; label: string; accent: string }[] = [
  { id: "characters", label: "Characters", accent: "#d4af37" },
  { id: "antagonists", label: "Antagonists", accent: "#8b2e2e" },
  { id: "disciples", label: "Limbo Disciples", accent: "#805ad5" },
  { id: "companions", label: "Companions", accent: "#4f8b5a" },
  { id: "locations", label: "Locations", accent: "#4f8b5a" },
  { id: "monsters", label: "Monsters", accent: "#8b2e2e" },
  { id: "factions", label: "Factions", accent: "#5a6bcf" },
  { id: "artifacts", label: "Artifacts", accent: "#b8860b" },
  { id: "equipment", label: "Equipment", accent: "#718096" },
  { id: "dungeons", label: "Dungeons", accent: "#3d4f5f" },
  { id: "magic", label: "Magic System", accent: "#553c9a" },
  { id: "events", label: "Historical Events", accent: "#8b6b2e" },
];

const MAIN_CAST = new Set([
  "cassian-reed",
  "adrian-hale",
  "rowan-hale",
  "elena-hale",
  "selene-arkwright",
  "nora-winters",
  "marcus-vale",
]);

interface CodexCard {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  color: string;
  href: string;
  meta: string;
  promptId: string;
}

export function CodexIndex() {
  const searchParams = useSearchParams();
  const initialSection = (searchParams.get("section") as Section | null) ?? "characters";
  const [section, setSection] = useState<Section>(initialSection);
  const [search, setSearch] = useState("");
  const hydrated = useStoreHydration();
  const progress = useReadingStore((s) => s.progress);

  const spoilerOk = (firstAppearance?: string) =>
    !hydrated || isFirstAppearanceUnlocked(firstAppearance, progress);

  const entries = useMemo(() => {
    const q = search.toLowerCase();
    const match = (s: string) => !q || s.toLowerCase().includes(q);

    if (section === "characters") {
      return characters
        .filter(
          (c) =>
            !c.id.startsWith("disciple-") &&
            c.role !== "antagonist" &&
            spoilerOk(c.firstAppearance) &&
            (match(c.name) || match(c.description))
        )
        .map((c) => ({
          id: c.id,
          name: c.name,
          subtitle: `${c.title ?? ""} · ${c.faction}`,
          description: c.description,
          tags: [
            MAIN_CAST.has(c.id) ? "Main Cast" : "Supporting",
            ...(c.affinity ? [c.affinity.replace(/-/g, " ")] : []),
            ...c.traits.slice(0, 2),
          ],
          color: c.imageColor,
          href: `/encyclopedia/characters/${c.id}`,
          meta: c.secondaryGender
            ? `${c.secondaryGender} · ${getRelationshipsForCharacter(c.id).length} bonds`
            : `${getRelationshipsForCharacter(c.id).length} relationships`,
          promptId: c.id,
        }));
    }

    if (section === "antagonists") {
      return characters
        .filter((c) => c.role === "antagonist" && spoilerOk(c.firstAppearance) && match(c.name))
        .map((c) => ({
          id: c.id,
          name: c.name,
          subtitle: `${c.title ?? ""} · ${c.faction}`,
          description: c.description,
          tags: c.traits,
          color: c.imageColor,
          href: `/encyclopedia/characters/${c.id}`,
          meta: c.faction,
          promptId: c.id,
        }));
    }

    if (section === "disciples") {
      return characters
        .filter((c) => c.id.startsWith("disciple-") && match(c.name))
        .map((c) => ({
          id: c.id,
          name: c.name,
          subtitle: c.title ?? "Limbo Disciple",
          description: c.description,
          tags: c.traits,
          color: c.imageColor,
          href: `/encyclopedia/characters/${c.id}`,
          meta: "Limbo · Cycle Seven",
          promptId: c.id,
        }));
    }

    if (section === "companions") {
      return companions
        .filter((c) => match(c.name))
        .map((c) => ({
          id: c.id,
          name: c.name,
          subtitle: `${c.species} · ${c.role}`,
          description: c.description,
          tags: c.traits,
          color: c.imageColor,
          href: `/encyclopedia/companions/${c.id}`,
          meta: c.bondedTo ? `Bonded to ${c.bondedTo}` : "Mythic",
          promptId: c.id,
        }));
    }

    if (section === "locations") {
      return locations
        .filter((l) => match(l.name))
        .map((l) => ({
          id: l.id,
          name: l.name,
          subtitle: `${l.type} · ${l.region}`,
          description: l.description,
          tags: [l.significance],
          color: l.imageColor,
          href: `/encyclopedia/locations/${l.id}`,
          meta: l.region,
          promptId: l.id,
        }));
    }

    if (section === "monsters") {
      return monsters
        .filter((m) => match(m.name))
        .map((m) => ({
          id: m.id,
          name: m.name,
          subtitle: `${m.classification} · Rank ${m.threatRank}`,
          description: m.appearance || m.description,
          tags: m.traits.slice(0, 3).map((t) => t.replace(/-/g, " ")),
          color: m.imageColor,
          href: `/bestiary/${m.id}`,
          meta: m.habitats.map((h) => h.replace(/-/g, " ")).join(", ") || "Unknown",
          promptId: m.id,
        }));
    }

    if (section === "factions") {
      return factions
        .filter((f) => match(f.name) && spoilerOk(f.firstAppearance))
        .map((f) => ({
          id: f.id,
          name: f.name,
          subtitle: `${f.type} · ${f.alignment}`,
          description: f.description,
          tags: [f.philosophy],
          color: f.imageColor,
          href: `/encyclopedia/factions/${f.id}`,
          meta: f.type,
          promptId: f.id,
        }));
    }

    if (section === "artifacts") {
      return artifacts
        .filter((a) => match(a.name) && spoilerOk(a.firstAppearance))
        .map((a) => ({
          id: a.id,
          name: a.name,
          subtitle: `${a.grade} · ${a.type}`,
          description: a.appearance,
          tags: [a.theme, a.function || a.ability].filter(Boolean) as string[],
          color: a.imageColor,
          href: `/encyclopedia/artifacts/${a.id}`,
          meta: a.intendedUser ? `For ${a.intendedUser}` : a.grade,
          promptId: a.id,
        }));
    }

    if (section === "equipment") {
      return equipment
        .filter((e) => match(e.name))
        .map((e) => ({
          id: e.id,
          name: e.name,
          subtitle: `Rank ${e.rank} · ${e.gearGrade}`,
          description: e.description,
          tags: [e.type, e.rank],
          color: e.imageColor,
          href: `/encyclopedia/equipment/${e.id}`,
          meta: e.source,
          promptId: e.id,
        }));
    }

    if (section === "dungeons") {
      return dungeons
        .filter((d) => match(d.name) && spoilerOk(d.firstAppearance))
        .map((d) => ({
          id: d.id,
          name: d.name,
          subtitle: `${d.classification} · ${d.theme}`,
          description: d.appearance || d.entrance,
          tags: d.dominantMonsters.slice(0, 3),
          color: d.imageColor,
          href: `/encyclopedia/dungeons/${d.id}`,
          meta: `${d.floors} floors`,
          promptId: d.id,
        }));
    }

    if (section === "magic") {
      const lawCards: CodexCard[] = manaLaws.map((law, i) => ({
        id: `mana-law-${i + 1}`,
        name: `Law ${i + 1}`,
        subtitle: "Fundamental Mana Law",
        description: law,
        tags: ["Canon", "Mana System"],
        color: "#553c9a",
        href: "/encyclopedia",
        meta: "10-magic-and-mana-system.md",
        promptId: `mana-law-${i + 1}`,
      }));

      const skillCards: CodexCard[] = magicSkills
        .filter((s) => match(s.name))
        .map((s) => ({
          id: s.id,
          name: s.name,
          subtitle: `${s.type} · ${s.affinity} · Rank ${s.rank}`,
          description: s.description,
          tags: [s.manaCost, s.user].filter(Boolean) as string[],
          color: "#553c9a",
          href: `/encyclopedia/magic/${s.id}`,
          meta: s.unlockChapter || "Core system",
          promptId: s.id,
        }));

      return [...lawCards, ...skillCards].filter(
        (e) => match(e.name) || match(e.description)
      );
    }

    if (section === "events") {
      return timelineEvents
        .filter((e) => match(e.title))
        .map((e) => ({
          id: e.id,
          name: e.title,
          subtitle: `${e.era} · Year ${e.year}`,
          description: e.description,
          tags: [e.importance],
          color: "#8b6b2e",
          href: "/timeline",
          meta: e.era,
          promptId: e.id,
        }));
    }

    return [];
  }, [section, search, hydrated, progress]);

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-6xl px-5">
        <header className="mb-14 text-center">
          <p className="label-volume text-gold/50">The Dominion Archives</p>
          <h1 className="title-legend embossed-gold mt-4">World Codex</h1>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-text-muted">
            Illustrated entries from the shattered age
          </p>
          <Link
            href="/images"
            className="text-ui mt-6 inline-flex items-center gap-2 text-sm text-gold/70 hover:text-gold"
          >
            <ImageIcon className="h-4 w-4" />
            Image Repository &amp; manifest
          </Link>
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
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={cn(
                "text-ui rounded-full border px-4 py-1.5 text-xs tracking-wide transition-all duration-500",
                section === s.id
                  ? "border-gold/35 text-gold"
                  : "border-transparent text-text-muted hover:text-text"
              )}
              style={
                section === s.id
                  ? {
                      backgroundColor: `${s.accent}15`,
                      borderColor: `${s.accent}44`,
                    }
                  : undefined
              }
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4), duration: 0.6 }}
            >
              <Link href={entry.href} className="codex-panel block rounded-sm p-5">
                <div className="flex gap-4">
                  <PortraitPlaceholder
                    promptId={entry.promptId}
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
                    <p className="mt-2 line-clamp-2 font-serif text-sm leading-relaxed text-text-muted">
                      {entry.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {entry.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-gold/10 px-2 py-0.5 text-[0.6rem] text-text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-ui mt-2 text-[0.6rem] text-text-muted/50">
                      {entry.meta}
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
