import { getArtifactById } from "@/data/artifacts";
import { getEquipmentById } from "@/data/equipment";
import { dungeons, getDungeonById } from "@/data/dungeons-data";
import { factions } from "@/data/factions-data";
import { companions, getCompanionById } from "@/data/companions";
import { magicSkills } from "@/data/magic-skills";
import { getLocationById } from "@/data/locations";
import { monsters } from "@/data/monsters";
import { characters } from "@/data/characters";
import type { CodexDetailConfig } from "@/components/codex/codex-detail-profile";
import {
  formatChapterRef,
  formatSlugId,
} from "@/lib/format-encyclopedia";

function chapterSpoiler(ch?: string, fallback = 1): number {
  if (!ch) return fallback;
  const n = parseInt(ch.replace(/\D/g, ""), 10);
  return n || fallback;
}

function monsterLink(id: string) {
  const m = monsters.find((x) => x.id === id);
  return { label: m?.name ?? formatSlugId(id), href: `/bestiary/${id}` };
}

function characterLink(id: string) {
  const c = characters.find((x) => x.id === id);
  return { label: c?.name ?? formatSlugId(id), href: `/encyclopedia/characters/${id}` };
}

export function artifactDetailConfig(id: string): CodexDetailConfig | null {
  const a = getArtifactById(id);
  if (!a) return null;

  const effect = [a.function, a.ability].filter(Boolean).join("\n\n");
  const rules = [a.limitation, a.rules].filter(Boolean).join("\n");

  return {
    category: "artifacts",
    categoryLabel: "Artifacts & Relics",
    indexHref: "/encyclopedia?section=artifacts",
    title: a.name,
    subtitle: `${formatSlugId(a.grade)} · ${formatSlugId(a.type)}${a.subtype ? ` (${formatSlugId(a.subtype)})` : ""}`,
    description: a.appearance,
    promptId: a.id,
    imageColor: a.imageColor,
    fields: [
      { label: "Grade", value: formatSlugId(a.grade) },
      { label: "Type", value: formatSlugId(a.type) },
      ...(a.subtype ? [{ label: "Subtype", value: formatSlugId(a.subtype) }] : []),
      ...(a.creator ? [{ label: "Creator / origin", value: a.creator }] : []),
      ...(a.age ? [{ label: "Age", value: a.age }] : []),
      ...(a.storyImportance
        ? [{ label: "Story importance", value: formatSlugId(a.storyImportance) }]
        : []),
      ...(a.firstAppearance
        ? [{ label: "First appearance", value: formatChapterRef(a.firstAppearance) }]
        : []),
    ],
    proseSections: [
      ...(effect ? [{ title: "Effects & abilities", body: effect }] : []),
      ...(rules ? [{ title: "Rules & limitations", body: rules }] : []),
      ...(a.history ? [{ title: "History", body: a.history }] : []),
    ],
    tags: [
      a.theme ? formatSlugId(a.theme) : "",
      ...(a.affinity ?? []).map(formatSlugId),
    ].filter(Boolean),
    linkTags: a.intendedUser ? [characterLink(a.intendedUser)] : [],
    spoilerChapter: chapterSpoiler(a.firstAppearance, 50),
  };
}

export function equipmentDetailConfig(id: string): CodexDetailConfig | null {
  const e = getEquipmentById(id);
  if (!e) return null;

  return {
    category: "equipment",
    categoryLabel: "Equipment",
    indexHref: "/encyclopedia?section=equipment",
    title: e.name,
    subtitle: `Rank ${e.rank} · ${formatSlugId(e.gearGrade)}`,
    description: e.description,
    promptId: e.id,
    imageColor: e.imageColor,
    fields: [
      { label: "Threat / gear rank", value: e.rank },
      { label: "Gear grade", value: formatSlugId(e.gearGrade) },
      { label: "Category", value: `${formatSlugId(e.type)} / ${formatSlugId(e.subtype)}` },
      { label: "Source", value: formatSlugId(e.source) },
      ...Object.entries(e.stats).map(([k, v]) => ({
        label: formatSlugId(k),
        value: String(v),
      })),
    ],
    tags: [formatSlugId(e.type), formatSlugId(e.subtype)],
    linkTags: e.intendedUser ? [characterLink(e.intendedUser)] : [],
  };
}

export function dungeonDetailConfig(id: string): CodexDetailConfig | null {
  const d = getDungeonById?.(id) ?? dungeons.find((x) => x.id === id);
  if (!d) return null;

  const floorRows = (d.floorTable ?? []).map((f) => [
    f.floors,
    f.rank,
    f.monsters.map((m) => monsters.find((x) => x.id === m)?.name ?? formatSlugId(m)).join(", "),
    f.loot.map(formatSlugId).join(", "),
    f.boss ? "Boss floor" : "—",
  ]);

  return {
    category: "dungeons",
    categoryLabel: "Dungeons",
    indexHref: "/encyclopedia?section=dungeons",
    title: d.name,
    subtitle: `${formatSlugId(d.classification)} · ${formatSlugId(d.theme)}`,
    description: d.appearance,
    promptId: d.id,
    imageColor: d.imageColor,
    fields: [
      { label: "Classification", value: formatSlugId(d.classification) },
      { label: "Grade / scale", value: `${d.floors} floors` },
      { label: "Theme", value: formatSlugId(d.theme) },
      ...(d.entrance ? [{ label: "Entrance", value: d.entrance }] : []),
      ...(d.sovereign ? [{ label: "Sovereign", value: formatSlugId(d.sovereign) }] : []),
      ...(d.storySignificance
        ? [{ label: "Story significance", value: formatSlugId(d.storySignificance) }]
        : []),
      ...(d.firstAppearance
        ? [{ label: "Discovered", value: formatChapterRef(d.firstAppearance) }]
        : []),
      ...(d.clearedChapter
        ? [{ label: "Cleared", value: formatChapterRef(d.clearedChapter) }]
        : []),
    ],
    proseSections: [
      ...(d.rule ? [{ title: "Dungeon rules", body: d.rule }] : []),
      ...(d.rewards?.length
        ? [{ title: "Clear rewards", body: d.rewards.join(" · ") }]
        : []),
    ],
    tables: floorRows.length
      ? [
          {
            title: "Floor guide",
            headers: ["Floors", "Rank band", "Monsters", "Loot", "Notes"],
            rows: floorRows,
          },
        ]
      : [],
    linkTags: (d.dominantMonsters ?? []).map(monsterLink),
    spoilerChapter: chapterSpoiler(d.firstAppearance, 30),
  };
}

export function factionDetailConfig(id: string): CodexDetailConfig | null {
  const f = factions.find((x) => x.id === id);
  if (!f) return null;
  return {
    category: "factions",
    categoryLabel: "Factions",
    indexHref: "/encyclopedia?section=factions",
    title: f.name,
    subtitle: `${f.type} · ${f.alignment}`,
    description: f.description,
    promptId: f.id,
    imageColor: f.imageColor,
    fields: [
      { label: "Philosophy", value: f.philosophy },
      { label: "Type", value: f.type },
      { label: "Alignment", value: f.alignment },
    ],
    tags: [f.alignment],
  };
}

export function companionDetailConfig(id: string): CodexDetailConfig | null {
  const c = getCompanionById(id);
  if (!c) return null;
  return {
    category: "companions",
    categoryLabel: "Companions",
    indexHref: "/encyclopedia?section=companions",
    title: c.name,
    subtitle: c.species,
    description: c.description,
    promptId: c.id,
    imageColor: c.imageColor,
    fields: [
      { label: "Bonded to", value: c.bondedTo ?? "Unknown" },
      { label: "Role", value: c.role },
      ...(c.firstAppearance
        ? [{ label: "First appearance", value: formatChapterRef(c.firstAppearance) }]
        : []),
    ],
    tags: c.traits,
    spoilerChapter: chapterSpoiler(c.firstAppearance, 30),
  };
}

export function magicDetailConfig(id: string): CodexDetailConfig | null {
  const s = magicSkills.find((x) => x.id === id);
  if (!s) return null;
  return {
    category: "magic",
    categoryLabel: "Magic System",
    indexHref: "/encyclopedia?section=magic",
    title: s.name,
    subtitle: `${s.type} · ${s.affinity}`,
    description: s.description,
    promptId: s.id,
    imageColor: "#553c9a",
    fields: [
      { label: "Type", value: s.type },
      { label: "Affinity", value: s.affinity },
      { label: "Rank", value: s.rank },
      ...(s.manaCost ? [{ label: "Mana cost", value: s.manaCost }] : []),
    ],
    tags: [s.type, s.affinity, s.rank],
    spoilerChapter: chapterSpoiler(s.unlockChapter, 1),
  };
}

export function locationDetailConfig(id: string): CodexDetailConfig | null {
  const l = getLocationById(id);
  if (!l) return null;
  return {
    category: "locations",
    categoryLabel: "Locations",
    indexHref: "/encyclopedia?section=locations",
    title: l.name,
    subtitle: `${l.type} · ${l.region}`,
    description: l.description,
    promptId: l.id,
    imageColor: l.imageColor,
    fields: [
      { label: "Region", value: l.region },
      { label: "Type", value: l.type },
    ],
    proseSections: l.significance
      ? [{ title: "Significance", body: l.significance }]
      : [],
    tags: [l.region],
  };
}
