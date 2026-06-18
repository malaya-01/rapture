#!/usr/bin/env node
/**
 * Syncs seed/ + knowledgebase MD → src/data/ for the Rapture app.
 * Run: npm run seed:sync
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";
import {
  parseMdEncyclopediaSync,
  buildCharacterPrompts,
  buildMonsterPrompts,
  buildArtifactPrompts,
  buildDungeonPrompts,
  buildLocationPrompts,
  buildCompanionPrompts,
  buildFactionPrompts,
  buildMagicPrompts,
  buildTimelinePrompts,
  buildScenePrompts,
  buildGenericPrompts,
  buildWorldMapPrompt,
} from "./prompt-builder.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");
const seed = join(root, "seed");
const kb = join(root, "knowledgebase");
const dataDir = join(root, "src", "data");
const publicImages = join(root, "public", "assets", "images");

const IMAGE_EXT = [".png", ".webp", ".jpg", ".jpeg"];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeTs(filename, content) {
  writeFileSync(join(dataDir, filename), content, "utf8");
}

function esc(s) {
  return String(s ?? "").replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

/** @deprecated — use parseMdEncyclopediaSync via prompt-builder */
function parseMdPrompts(...files) {
  return parseMdEncyclopediaSync(readFileSync, existsSync, kb, ...files);
}

function threatFromRank(rank) {
  const r = String(rank ?? "D").toUpperCase();
  if (r === "F" || r === "E") return "low";
  if (r === "D" || r === "C") return "moderate";
  if (r === "B") return "high";
  return "extreme";
}

function monsterColor(rank) {
  const r = String(rank ?? "D").toUpperCase();
  if (r === "F" || r === "E") return "#4f8b5a";
  if (r === "D" || r === "C") return "#8b6b2e";
  if (r === "B") return "#c45c6a";
  if (r === "A") return "#d4af37";
  return "#8b2e2e";
}

/** Split seed traits into combat traits vs tactical vulnerabilities */
function traitSplit(traits = []) {
  const vulnerabilities = traits.filter((t) =>
    /weak|vulnerable|fragile|slow|blind|brittle|exposed|fear|panic/i.test(t)
  );
  const combatTraits = traits.filter((t) => !vulnerabilities.includes(t));
  return { vulnerabilities, combatTraits };
}

function mapRole(role) {
  const r = String(role ?? "ally");
  if (r.includes("protagonist")) return "protagonist";
  if (r.includes("antagonist")) return "antagonist";
  if (r === "disciple") return "ally";
  if (r === "neutral") return "neutral";
  return "ally";
}

function factionLabel(id) {
  if (!id) return "Unknown";
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function imageExists(category, id) {
  const dir = join(publicImages, category);
  if (!existsSync(dir)) return false;
  return IMAGE_EXT.some((ext) => existsSync(join(dir, `${id}${ext}`)));
}

function scanCategory(category) {
  const dir = join(publicImages, category);
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir)
      .filter((f) => IMAGE_EXT.includes(extname(f).toLowerCase()))
      .map((f) => f.replace(/\.[^.]+$/, ""))
  );
}

/** Parse chapter + inline illustration scene IDs from src/data/chapters.ts */
function parseChapterScenes(chaptersTs) {
  const scenes = [];
  const seen = new Set();

  const chapterRe =
    /id:\s*"(ch-\d+)",\s*number:\s*\d+,\s*title:\s*"([^"]+)"(?:[\s\S]*?summary:\s*\n?\s*"([^"]*)")?/g;
  let ch;
  while ((ch = chapterRe.exec(chaptersTs))) {
    const chapterId = ch[1];
    const chapterTitle = ch[2];
    const summary = ch[3]?.trim() || "";
    const openingId = `${chapterId}-opening`;
    if (!seen.has(openingId)) {
      seen.add(openingId);
      scenes.push({
        id: openingId,
        chapterId,
        chapterTitle,
        title: `${chapterTitle} — Chapter Opening`,
        sceneType: "opening",
        description:
          summary ||
          `Opening illustration for Chapter ${chapterId.replace("ch-", "")}: ${chapterTitle}.`,
      });
    }
  }

  const illRe = /illustration:\s*\{([\s\S]*?)\n\s*\}/g;
  let ill;
  while ((ill = illRe.exec(chaptersTs))) {
    const block = ill[1];
    const promptId = block.match(/promptId:\s*"([^"]+)"/)?.[1];
    if (!promptId || seen.has(promptId)) continue;
    seen.add(promptId);
    const title = block.match(/title:\s*"([^"]+)"/)?.[1] ?? promptId;
    const subtitle = block.match(/subtitle:\s*"([^"]+)"/)?.[1];
    const caption = block.match(/caption:\s*"([^"]+)"/)?.[1];
    const chapterId = promptId.match(/^(ch-\d+)/)?.[1] ?? "unknown";
    scenes.push({
      id: promptId,
      chapterId,
      title,
      sceneType: "scene",
      subtitle,
      caption,
      description: caption || subtitle || title,
    });
  }

  return scenes;
}

function buildImagePrompt(subject, details, framing = "cinematic illustration") {
  return `Premium illustrated fantasy novel art for "Rapture: The Fractured Sky" (Cycle Seven). Collector's edition quality — painterly oil-and-gouache hybrid, cinematic chiaroscuro, palette #090807 / #D4AF37 / #E7E0D0. NOT photorealistic, NOT anime.

SUBJECT: ${subject}
DETAILS: ${details}
FRAMING: ${framing}

Generate a single cohesive illustration. No text or watermarks.`;
}

// ── Load seed data ──
const charactersSeed = readJson(join(seed, "characters.json")).characters;
const monstersSeed = readJson(join(seed, "monsters.json")).monsters;
const locationsSeed = readJson(join(seed, "locations.json")).locations;
const worldMapSeed = readJson(join(seed, "world-map.json"));
const artifactsSeed = readJson(join(seed, "artifacts.json")).artifacts;
const dungeonsSeed = readJson(join(seed, "dungeons.json")).dungeons;
const skillsSeed = readJson(join(seed, "skills.json")).skills;
const factionsSeed = readJson(join(seed, "factions.json")).factions;
const timelineSeed = readJson(join(seed, "timeline.json"));
const companionsSeed = readJson(join(seed, "companions.json")).companions;
const disciplesSeed = readJson(join(seed, "disciples.json")).disciples;
const equipmentSeed = readJson(join(seed, "equipment.json")).equipment;
const relationshipsSeed = readJson(join(seed, "relationships.json")).relationships;
const chapterProgressSeed = readJson(join(seed, "chapter-progress.json"));
const chapterManifestSeed = readJson(join(seed, "chapter-manifest.json"));
const arcsSeed = readJson(join(seed, "arcs.json"));

const mdEncyclopedia = parseMdEncyclopediaSync(
  readFileSync,
  existsSync,
  kb,
  "02-main-cast.md",
  "02b-supporting-cast.md",
  "03-antagonists.md"
);

// Merge disciples into character list for codex
const allCharacters = [...charactersSeed, ...disciplesSeed];

// ── characters.ts ──
const charactersTs = `import type { Character } from "@/types";

/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs — do not edit manually */
export const characters: Character[] = [
${allCharacters
  .map(
    (c) => `  {
    id: ${JSON.stringify(c.id)},
    name: ${JSON.stringify(c.name)},
    title: ${JSON.stringify(c.title ?? "")},
    role: ${JSON.stringify(mapRole(c.role))},
    storyRole: ${JSON.stringify(c.role ?? "")},
    faction: ${JSON.stringify(factionLabel(c.faction))},
    factionId: ${JSON.stringify(c.faction ?? "")},
    description: ${JSON.stringify(c.description ?? "")},
    traits: ${JSON.stringify(c.traits ?? [])},
    secondaryGender: ${JSON.stringify(c.secondaryGender ?? null)},
    affinity: ${JSON.stringify(c.affinity ?? null)},
    ageAtRapture: ${JSON.stringify(c.ageAtRapture ?? null)},
    romanceRelevant: ${JSON.stringify(Boolean(c.romanceRelevant))},
    firstAppearance: ${JSON.stringify(c.firstAppearance ?? "")},
    imageColor: ${JSON.stringify(c.imageColor ?? "#8b6b2e")},
    povTier: ${JSON.stringify(c.povTier ?? "")},
    appearance: ${JSON.stringify(c.appearance ?? "")},
    personality: ${JSON.stringify(c.personality ?? "")},
    preRaptureLife: ${JSON.stringify(c.preRaptureLife ?? "")},
    arc: ${JSON.stringify(c.arc ?? "")},
  }`
  )
  .join(",\n")}
];

export function getCharacterById(id: string) {
  return characters.find((c) => c.id === id);
}
`;
writeTs("characters.ts", charactersTs);

// ── monsters.ts ──
const monstersTs = `import type { Monster } from "@/types";

/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export const monsters: Monster[] = [
${monstersSeed
  .map((m) => {
    const habitats = Array.isArray(m.habitat)
      ? m.habitat
      : m.habitat
        ? [m.habitat]
        : [];
    const { vulnerabilities, combatTraits } = traitSplit(m.traits ?? []);
    const desc = [m.appearance, m.behavior].filter(Boolean).join(" ");
    const relatedIds = [
      ...(m.evolutionOf ? [m.evolutionOf] : []),
      ...(m.evolutionChain ?? []).filter((id) => id !== m.id),
    ];
  return `  {
    id: ${JSON.stringify(m.id)},
    name: ${JSON.stringify(m.name)},
    classification: ${JSON.stringify(m.category ?? "Unknown")},
    threatRank: ${JSON.stringify(m.threatRank ?? "D")},
    tier: ${JSON.stringify(m.tier ?? 1)},
    threat: ${JSON.stringify(threatFromRank(m.threatRank))},
    scale: ${JSON.stringify(m.scale ?? "")},
    habitats: ${JSON.stringify(habitats)},
    appearance: ${JSON.stringify(m.appearance ?? "")},
    behavior: ${JSON.stringify(m.behavior ?? "")},
    traits: ${JSON.stringify(combatTraits)},
    vulnerabilities: ${JSON.stringify(vulnerabilities)},
    drops: ${JSON.stringify(m.drops ?? [])},
    evolutionChain: ${JSON.stringify(m.evolutionChain ?? [])},
    evolutionOf: ${JSON.stringify(m.evolutionOf ?? "")},
    dungeonExclusive: ${JSON.stringify(Boolean(m.dungeonExclusive))},
    named: ${JSON.stringify(Boolean(m.named))},
    firstAppearance: ${JSON.stringify(m.firstAppearance ?? "")},
    description: ${JSON.stringify(desc || m.name)},
    imageColor: ${JSON.stringify(monsterColor(m.threatRank))},
    relatedIds: ${JSON.stringify(relatedIds)},
  }`;
  })
  .join(",\n")}
];

export function getMonsterById(id: string) {
  return monsters.find((m) => m.id === id);
}
`;
writeTs("monsters.ts", monstersTs);

// ── locations.ts ──
const typeMap = {
  "Fractured City": "ruins",
  "Fractured City Outskirts": "ruins",
  "Central Wilds": "wilderness",
  "Eastern Wilds": "wilderness",
  "Eastern Reaches": "wilderness",
  "Northern Reaches": "wilderness",
  "Dragon Territory": "wilderness",
  "Iron Dominion": "fortress",
  "Dimensional": "realm",
  "Aetherian Territory": "ruins",
};

const locationsTs = `import type { Location } from "@/types";

/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export const locations: Location[] = [
${locationsSeed
  .map((l) => {
    const region = l.region ?? "Unknown";
    let type = "wilderness";
    if (l.id.includes("harbor") || l.id === "ashford") type = "ruins";
    else if (l.id === "sanctuary") type = "city";
    else if (l.id === "limbo") type = "realm";
    else if (region.includes("Dominion")) type = "fortress";
    else if (typeMap[region]) type = typeMap[region];
    return `  {
    id: ${JSON.stringify(l.id)},
    name: ${JSON.stringify(l.name)},
    region: ${JSON.stringify(region)},
    type: ${JSON.stringify(type)},
    description: ${JSON.stringify(l.description ?? "")},
    significance: ${JSON.stringify(`Danger: ${l.dangerLevel ?? "unknown"}. ${l.storyImportance ? `Story importance: ${l.storyImportance}` : ""}`.trim())},
    imageColor: ${JSON.stringify("#8b6b2e")},${l.aliases?.length ? `\n    aliases: ${JSON.stringify(l.aliases)},` : ""}
  }`;
  })
  .join(",\n")}
];

export function getLocationById(id: string) {
  return locations.find((l) => l.id === id);
}
`;
writeTs("locations.ts", locationsTs);

// ── world-map.ts ──
const mapNodeTypes = [
  "city",
  "fortress",
  "ruins",
  "community",
  "safe-zone",
  "danger-zone",
  "wilderness",
  "dungeon",
  "realm",
  "network",
];

const worldMapTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs — edit seed/world-map.json */
export type MapNodeType =
${mapNodeTypes.map((t) => `  | ${JSON.stringify(t)}`).join("\n")};

export type MapNodeTier = "major" | "minor";

export interface MapNode {
  id: string;
  name: string;
  type: MapNodeType;
  tier: MapNodeTier;
  x: number;
  y: number;
  description: string;
  significance: string;
  color: string;
  locationId?: string;
  mapLabel?: string;
}

export const mapContinent = {
  name: ${JSON.stringify(worldMapSeed.continent)},
  subtitle: ${JSON.stringify(worldMapSeed.subtitle)},
  ocean: ${JSON.stringify(worldMapSeed.ocean)},
};

/** Cartography rectangle inside world-map.png (percent of full image). */
export const mapInset = {
  left: ${worldMapSeed.mapInset.left},
  top: ${worldMapSeed.mapInset.top},
  right: ${worldMapSeed.mapInset.right},
  bottom: ${worldMapSeed.mapInset.bottom},
};

/** Convert node coords (0–100 within cartography) to full-image SVG coords. */
export function mapCoordToImage(x: number, y: number) {
  const w = mapInset.right - mapInset.left;
  const h = mapInset.bottom - mapInset.top;
  return {
    x: mapInset.left + (x / 100) * w,
    y: mapInset.top + (y / 100) * h,
  };
}

export const mapNodes: MapNode[] = [
${worldMapSeed.nodes
  .map((n) => {
    const fields = [
      `id: ${JSON.stringify(n.id)}`,
      `name: ${JSON.stringify(n.name)}`,
      `type: ${JSON.stringify(n.type)}`,
      `tier: ${JSON.stringify(n.tier)}`,
      `x: ${n.x}`,
      `y: ${n.y}`,
      `description: ${JSON.stringify(n.description)}`,
      `significance: ${JSON.stringify(n.significance)}`,
      `color: ${JSON.stringify(n.color)}`,
    ];
    if (n.locationId) fields.push(`locationId: ${JSON.stringify(n.locationId)}`);
    if (n.mapLabel) fields.push(`mapLabel: ${JSON.stringify(n.mapLabel)}`);
    return `  {\n    ${fields.join(",\n    ")}\n  }`;
  })
  .join(",\n")}
];

export function getMapNodeById(id: string) {
  return mapNodes.find((n) => n.id === id);
}

export function getMapNodesByTier(tier: MapNodeTier) {
  return mapNodes.filter((n) => n.tier === tier);
}
`;
writeTs("world-map.ts", worldMapTs);

// ── artifacts.ts ──
const artifactsTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export interface Artifact {
  id: string;
  name: string;
  grade: string;
  type: string;
  subtype?: string;
  appearance: string;
  function: string;
  ability?: string;
  limitation?: string;
  rules?: string;
  theme?: string;
  creator?: string;
  age?: string;
  history?: string;
  storyImportance?: string;
  affinity?: string[];
  intendedUser?: string;
  imageColor: string;
  firstAppearance?: string;
}

export const artifacts: Artifact[] = [
${artifactsSeed
  .map(
    (a) => `  {
    id: ${JSON.stringify(a.id)},
    name: ${JSON.stringify(a.name)},
    grade: ${JSON.stringify(a.grade ?? "unknown")},
    type: ${JSON.stringify(a.type ?? "relic")},
    subtype: ${JSON.stringify(a.subtype ?? "")},
    appearance: ${JSON.stringify(a.appearance ?? a.description ?? "")},
    function: ${JSON.stringify(a.function ?? "")},
    ability: ${JSON.stringify(a.ability ?? "")},
    limitation: ${JSON.stringify(a.limitation ?? "")},
    rules: ${JSON.stringify(a.rules ?? a.rule ?? "")},
    theme: ${JSON.stringify(a.theme ?? "")},
    creator: ${JSON.stringify(a.creator ?? "")},
    age: ${JSON.stringify(a.age ?? "")},
    history: ${JSON.stringify(a.history ?? "")},
    storyImportance: ${JSON.stringify(a.storyImportance ?? "")},
    affinity: ${JSON.stringify(a.affinity ?? [])},
    intendedUser: ${JSON.stringify(a.intendedUser ?? "")},
    imageColor: ${JSON.stringify("#d4af37")},
    firstAppearance: ${JSON.stringify(a.firstAppearance ?? "")},
  }`
  )
  .join(",\n")}
];

export function getArtifactById(id: string) {
  return artifacts.find((a) => a.id === id);
}
`;
writeTs("artifacts.ts", artifactsTs);

// ── dungeons-data.ts ──
const dungeonsTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export interface DungeonFloor {
  floors: string;
  rank: string;
  monsters: string[];
  loot: string[];
  boss?: boolean;
}

export interface Dungeon {
  id: string;
  name: string;
  classification: string;
  theme: string;
  floors: string | number;
  entrance: string;
  appearance: string;
  rule?: string;
  sovereign?: string | null;
  dominantMonsters: string[];
  floorTable: DungeonFloor[];
  rewards: string[];
  storySignificance?: string;
  clearedChapter?: string;
  imageColor: string;
  firstAppearance?: string;
}

export const dungeons: Dungeon[] = [
${dungeonsSeed
  .map(
    (d) => `  {
    id: ${JSON.stringify(d.id)},
    name: ${JSON.stringify(d.name)},
    classification: ${JSON.stringify(d.classification ?? "dungeon")},
    theme: ${JSON.stringify(d.theme ?? "")},
    floors: ${JSON.stringify(d.floors ?? "unknown")},
    entrance: ${JSON.stringify(d.entrance ?? "")},
    appearance: ${JSON.stringify(d.appearance ?? "")},
    rule: ${JSON.stringify(d.rule ?? "")},
    sovereign: ${JSON.stringify(d.sovereign ?? null)},
    dominantMonsters: ${JSON.stringify(d.dominantMonsters ?? [])},
    floorTable: ${JSON.stringify(d.floorTable ?? [])},
    rewards: ${JSON.stringify(d.rewards ?? [])},
    storySignificance: ${JSON.stringify(d.storySignificance ?? "")},
    clearedChapter: ${JSON.stringify(d.clearedChapter ?? "")},
    imageColor: ${JSON.stringify("#3d4f5f")},
    firstAppearance: ${JSON.stringify(d.firstAppearance ?? "")},
  }`
  )
  .join(",\n")}
];

export function getDungeonById(id: string) {
  return dungeons.find((d) => d.id === id);
}
`;
writeTs("dungeons-data.ts", dungeonsTs);

// ── magic-skills.ts ──
const magicTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs — from seed/skills.json + knowledgebase/10-magic-and-mana-system.md */
export interface MagicSkill {
  id: string;
  name: string;
  type: string;
  affinity: string;
  rank: string;
  description: string;
  manaCost?: string;
  user?: string;
  unlockChapter?: string;
}

export const manaLaws = [
  "Mana cannot be created or destroyed — only transformed.",
  "Power without understanding is unstable — smarter beats stronger.",
  "Every use creates consequences — exhaustion, corruption, instability, environmental impact.",
];

export const manaZones = [
  { id: "low", name: "Low Density", description: "Pre-Rapture baseline — rare after Day 0" },
  { id: "moderate", name: "Moderate", description: "Settlement-safe with precautions — Sanctuary core" },
  { id: "high", name: "High", description: "Accelerated mutation — monster lands, dungeon entrances" },
  { id: "extreme", name: "Extreme", description: "Reality strain — titan territories, rift cores, Limbo" },
];

export const magicSkills: MagicSkill[] = [
${skillsSeed
  .map(
    (s) => `  {
    id: ${JSON.stringify(s.id)},
    name: ${JSON.stringify(s.name)},
    type: ${JSON.stringify(s.type)},
    affinity: ${JSON.stringify(s.affinity)},
    rank: ${JSON.stringify(s.rank)},
    description: ${JSON.stringify(s.description)},
    manaCost: ${JSON.stringify(s.manaCost ?? "")},
    user: ${JSON.stringify(s.user ?? "")},
    unlockChapter: ${JSON.stringify(s.unlockChapter ?? "")},
  }`
  )
  .join(",\n")}
];
`;
writeTs("magic-skills.ts", magicTs);

// ── companions.ts ──
const companionsTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export interface Companion {
  id: string;
  name: string;
  species: string;
  bondedTo: string | null;
  role: string;
  description: string;
  traits: string[];
  firstAppearance: string;
  imageColor: string;
}

export const companions: Companion[] = [
${companionsSeed
  .map(
    (c) => `  {
    id: ${JSON.stringify(c.id)},
    name: ${JSON.stringify(c.name)},
    species: ${JSON.stringify(c.species)},
    bondedTo: ${JSON.stringify(c.bondedTo)},
    role: ${JSON.stringify(c.role)},
    description: ${JSON.stringify(c.description)},
    traits: ${JSON.stringify(c.traits)},
    firstAppearance: ${JSON.stringify(c.firstAppearance)},
    imageColor: ${JSON.stringify(c.imageColor)},
  }`
  )
  .join(",\n")}
];

export function getCompanionById(id: string) {
  return companions.find((c) => c.id === id);
}
`;
writeTs("companions.ts", companionsTs);

// ── disciples.ts ──
const disciplesTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export { characters as disciples } from "./characters";

export function getDisciples() {
  return import("./characters").then((m) => m.characters.filter((c) => c.id.startsWith("disciple-")));
}
`;
writeTs("disciples.ts", disciplesTs);

// ── factions-data.ts ──
const factionsTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export interface Faction {
  id: string;
  name: string;
  type: string;
  alignment: string;
  philosophy: string;
  description: string;
  leaderIds: string[];
  imageColor: string;
  firstAppearance?: string;
}

export const factions: Faction[] = [
${factionsSeed
  .map(
    (f) => `  {
    id: ${JSON.stringify(f.id)},
    name: ${JSON.stringify(f.name)},
    type: ${JSON.stringify(f.type)},
    alignment: ${JSON.stringify(f.alignment)},
    philosophy: ${JSON.stringify(f.philosophy ?? "")},
    description: ${JSON.stringify(`${f.philosophy ?? ""} ${f.question ? `— ${f.question}` : ""}`.trim())},
    leaderIds: ${JSON.stringify(f.leaderIds ?? [])},
    imageColor: ${JSON.stringify("#5a6bcf")},
    firstAppearance: ${JSON.stringify(f.firstAppearance ?? "")},
  }`
  )
  .join(",\n")}
];
`;
writeTs("factions-data.ts", factionsTs);

// ── timeline.ts (merged) ──
const narrativeEvents = [
  {
    id: "t-1",
    title: "The Last Ordinary Morning",
    description: "Cassian Reed wakes in Ashford on an ordinary Tuesday. By afternoon the sky fractures over the harbor.",
    arcId: "arc-1",
    chapterId: "ch-0001",
    year: 0,
    era: "The Rapture",
    type: "story",
    characterIds: ["cassian-reed"],
    locationIds: ["ashford"],
    importance: "monumental",
  },
];

const seedTimelineEvents = timelineSeed.events.map((e) => ({
  id: e.id,
  title: e.name,
  description: e.description ?? e.name,
  arcId: "arc-1",
  chapterId: e.chapter ? `ch-${String(e.chapter).padStart(4, "0")}` : undefined,
  year: Math.floor((e.inWorldDay ?? e.chapter ?? 0) / 30),
  era: e.age === "rapture-era" ? "The Rapture" : "Age of Sanctuary",
  type: e.id.includes("founded") || e.id.includes("declares") ? "milestone" : "story",
  characterIds: e.id.includes("cassian")
    ? ["cassian-reed"]
    : e.id.includes("adrian")
      ? ["adrian-hale"]
      : e.id.includes("viktor")
        ? ["viktor-drake"]
        : undefined,
  importance:
    e.id.includes("day-zero") || e.id.includes("sanctuary") || e.id.includes("seventh")
      ? "monumental"
      : e.id.includes("founder") || e.id.includes("dragon")
        ? "major"
        : "minor",
}));

const allTimeline = [...narrativeEvents, ...seedTimelineEvents];

const timelineTs = `import type { TimelineEvent } from "@/types";

/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export const timelineEvents: TimelineEvent[] = [
${allTimeline
  .map(
    (e) => `  {
    id: ${JSON.stringify(e.id)},
    title: ${JSON.stringify(e.title)},
    description: ${JSON.stringify(e.description)},
    arcId: ${JSON.stringify(e.arcId)},
    ${e.chapterId ? `chapterId: ${JSON.stringify(e.chapterId)},` : ""}
    year: ${e.year},
    era: ${JSON.stringify(e.era)},
    type: ${JSON.stringify(e.type)},
    ${e.characterIds ? `characterIds: ${JSON.stringify(e.characterIds)},` : ""}
    ${e.locationIds ? `locationIds: ${JSON.stringify(e.locationIds)},` : ""}
    importance: ${JSON.stringify(e.importance)},
  }`
  )
  .join(",\n")}
];
`;
writeTs("timeline.ts", timelineTs);

// ── image prompts registry ──
const promptMap = new Map();

function addPrompt(id, title, contentPrompt, imagePrompt, category) {
  if (!id || !contentPrompt || !imagePrompt) return;
  const prefer = ["characters", "disciples", "companions"];
  if (promptMap.has(id)) {
    const existing = promptMap.get(id);
    if (prefer.includes(existing.category) && !prefer.includes(category)) return;
  }
  promptMap.set(id, { id, title, contentPrompt, imagePrompt, category });
}

for (const c of allCharacters) {
  const cat = c.id.startsWith("disciple-") ? "disciples" : "characters";
  const { contentPrompt, imagePrompt } = buildCharacterPrompts(
    c,
    mdEncyclopedia[c.id] ?? {},
    cat
  );
  addPrompt(c.id, `${c.name} — Portrait`, contentPrompt, imagePrompt, cat);
}

for (const m of monstersSeed) {
  const { contentPrompt, imagePrompt } = buildMonsterPrompts(m);
  addPrompt(m.id, `${m.name} — Bestiary`, contentPrompt, imagePrompt, "monsters");
}

for (const a of artifactsSeed) {
  const { contentPrompt, imagePrompt } = buildArtifactPrompts(a);
  addPrompt(a.id, a.name, contentPrompt, imagePrompt, "artifacts");
}

for (const d of dungeonsSeed) {
  const { contentPrompt, imagePrompt } = buildDungeonPrompts(d);
  addPrompt(d.id, d.name, contentPrompt, imagePrompt, "dungeons");
}

for (const l of locationsSeed) {
  const { contentPrompt, imagePrompt } = buildLocationPrompts(l);
  addPrompt(l.id, l.name, contentPrompt, imagePrompt, "locations");
}

for (const s of skillsSeed) {
  const { contentPrompt, imagePrompt } = buildMagicPrompts(s);
  addPrompt(s.id, s.name, contentPrompt, imagePrompt, "magic");
}

[
  "Mana cannot be created or destroyed — only transformed.",
  "Power without understanding is unstable — smarter beats stronger.",
  "Every use creates consequences — exhaustion, corruption, instability, environmental impact.",
].forEach((law, i) => {
  const { contentPrompt, imagePrompt } = buildGenericPrompts(
    `mana-law-${i + 1}`,
    `Mana Law ${i + 1}`,
    "Fundamental mana law",
    law,
    "Symbolic allegorical illustration, abstract mana visualization",
    "magic"
  );
  addPrompt(`mana-law-${i + 1}`, `Mana Law ${i + 1}`, contentPrompt, imagePrompt, "magic");
});

for (const c of companionsSeed) {
  const { contentPrompt, imagePrompt } = buildCompanionPrompts(c);
  addPrompt(c.id, c.name, contentPrompt, imagePrompt, "companions");
}

for (const f of factionsSeed) {
  const { contentPrompt, imagePrompt } = buildFactionPrompts(f);
  addPrompt(f.id, f.name, contentPrompt, imagePrompt, "factions");
}

{
  const { contentPrompt, imagePrompt } = buildWorldMapPrompt(worldMapSeed);
  addPrompt("world-map", `Rapture World Map — ${worldMapSeed.continent}`, contentPrompt, imagePrompt, "locations");
}

{
  const { contentPrompt, imagePrompt } = buildGenericPrompts(
    "lore-network",
    "Lore Network",
    "Relationship web visualization",
    "Golden threads connecting Sanctuary cast silhouettes — family, romance, rivalry, alliance bonds as light.",
    "Abstract network illustration on dark parchment",
    "characters"
  );
  addPrompt("lore-network", "Lore Network", contentPrompt, imagePrompt, "characters");
}

for (const e of allTimeline) {
  const { contentPrompt, imagePrompt } = buildTimelinePrompts(e);
  addPrompt(e.id, e.title, contentPrompt, imagePrompt, "timeline");
}

const chaptersTsPath = join(dataDir, "chapters.ts");
let chapterScenes = [];
const scenesJsonPath = join(seed, "chapter-scenes.json");
if (existsSync(scenesJsonPath)) {
  chapterScenes = readJson(scenesJsonPath).scenes ?? [];
} else if (existsSync(chaptersTsPath)) {
  chapterScenes = parseChapterScenes(readFileSync(chaptersTsPath, "utf8"));
}
for (const scene of chapterScenes) {
  const { contentPrompt, imagePrompt } = buildScenePrompts(scene);
  addPrompt(scene.id, scene.title, contentPrompt, imagePrompt, "scenes");
}

const promptEntries = [...promptMap.values()];

const imagePromptsTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export interface ImagePromptEntry {
  title: string;
  contentPrompt: string;
  imagePrompt: string;
  category: string;
  /** @deprecated Use imagePrompt */
  prompt: string;
}

export const imagePrompts: Record<string, ImagePromptEntry> = {
${promptEntries
  .map(
    (p) =>
      `  ${JSON.stringify(p.id)}: { title: ${JSON.stringify(p.title)}, contentPrompt: ${JSON.stringify(p.contentPrompt)}, imagePrompt: ${JSON.stringify(p.imagePrompt)}, category: ${JSON.stringify(p.category)}, prompt: ${JSON.stringify(p.imagePrompt)} }`
  )
  .join(",\n")}
};

export function getImagePrompt(id: string) {
  const entry = imagePrompts[id];
  if (!entry) return null;
  return {
    title: entry.title,
    contentPrompt: entry.contentPrompt,
    imagePrompt: entry.imagePrompt,
    prompt: entry.imagePrompt,
  };
}

export function getPromptsByCategory(category: string) {
  return Object.entries(imagePrompts)
    .filter(([, v]) => v.category === category)
    .map(([id, v]) => ({ id, ...v }));
}
`;
writeTs("image-prompts.ts", imagePromptsTs);

// ── image manifest ──
const categories = [
  "characters",
  "monsters",
  "artifacts",
  "equipment",
  "dungeons",
  "locations",
  "companions",
  "disciples",
  "magic",
  "factions",
  "timeline",
  "scenes",
];

for (const cat of categories) {
  mkdirSync(join(publicImages, cat), { recursive: true });
}

const manifestEntries = [];

function imageFilePath(category, id) {
  const dir = join(publicImages, category);
  for (const ext of IMAGE_EXT) {
    const path = join(dir, `${id}${ext}`);
    if (existsSync(path)) return path;
  }
  return null;
}

function manifestRow(category, id, title) {
  const filePath = imageFilePath(category, id);
  const present = filePath !== null;
  const ext = present ? extname(filePath) : ".png";
  const version = present ? statSync(filePath).mtimeMs : undefined;
  manifestEntries.push({
    id,
    category,
    title,
    filename: `${id}${ext}`,
    relativePath: `assets/images/${category}/${id}${ext}`,
    publicPath: `/assets/images/${category}/${id}${ext}`,
    status: present ? "present" : "missing",
    ...(version !== undefined ? { version } : {}),
  });
}

for (const c of allCharacters) {
  const cat = c.id.startsWith("disciple-") ? "disciples" : "characters";
  manifestRow(cat, c.id, c.name, `${c.id}.png`);
}
for (const m of monstersSeed) manifestRow("monsters", m.id, m.name);
for (const a of artifactsSeed) manifestRow("artifacts", a.id, a.name);
for (const e of equipmentSeed) manifestRow("equipment", e.id, e.name);
for (const d of dungeonsSeed) manifestRow("dungeons", d.id, d.name);
for (const l of locationsSeed) manifestRow("locations", l.id, l.name);
manifestRow("locations", "world-map", "Rapture World Map");
for (const c of companionsSeed) manifestRow("companions", c.id, c.name);
for (const s of skillsSeed) manifestRow("magic", s.id, s.name);
for (const f of factionsSeed) manifestRow("factions", f.id, f.name);
for (const e of allTimeline) manifestRow("timeline", e.id, e.title);
for (const scene of chapterScenes) manifestRow("scenes", scene.id, scene.title);

const present = manifestEntries.filter((e) => e.status === "present").length;
const missing = manifestEntries.length - present;

const manifestTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs — re-run after adding images to public/assets/images/ */
export type ImageCategory = ${categories.map((c) => JSON.stringify(c)).join(" | ")};
export type ImageStatus = "present" | "missing";

export interface ImageManifestEntry {
  id: string;
  category: ImageCategory;
  title: string;
  filename: string;
  relativePath: string;
  publicPath: string;
  status: ImageStatus;
  /** File mtime (ms) — cache-bust when image is replaced */
  version?: number;
}

export const imageManifest = {
  generatedAt: ${JSON.stringify(new Date().toISOString())},
  summary: { total: ${manifestEntries.length}, present: ${present}, missing: ${missing} },
  categories: {
${categories.map((cat) => `    ${JSON.stringify(cat)}: { folder: "public/assets/images/${cat}/", naming: "{id}.png" }`).join(",\n")}
  },
  entries: ${JSON.stringify(manifestEntries, null, 2)} as ImageManifestEntry[],
};

export function getManifestByCategory(category: ImageCategory) {
  return imageManifest.entries.filter((e) => e.category === category);
}

export function getMissingImages() {
  return imageManifest.entries.filter((e) => e.status === "missing");
}
`;
writeTs("image-manifest.ts", manifestTs);

// ── IMAGE-REPOSITORY.md ──
const repoDoc = `# Rapture Image Repository

**Generated:** ${new Date().toISOString()}

## Folder structure

\`\`\`
public/assets/images/
├── characters/     # Main, supporting, antagonist portraits — {id}.png
├── disciples/      # Limbo disciples — disciple-{name}.png
├── companions/     # Beast contracts — {id}.png
├── monsters/       # Bestiary — {id}.png
├── artifacts/      # Relics and legendary items — {id}.png
├── dungeons/       # Dungeon establishing shots — {id}.png
├── locations/      # World locations — {id}.png
├── factions/       # Faction banners/strongholds — {id}.png
├── magic/          # Spell/skill illustrations — {id}.png
├── timeline/       # Chronicle event art — {id}.png
└── scenes/         # Chapter scene art — ch-{number}-{slug}.png
\`\`\`

## Naming convention

| Category | Pattern | Example |
|----------|---------|---------|
| Character | \`{character-id}.png\` | \`cassian-reed.png\` |
| Monster | \`{monster-id}.png\` | \`grave-walker.png\` |
| Artifact | \`{artifact-id}.png\` | \`skybreaker.png\` |
| Dungeon | \`{dungeon-id}.png\` | \`forgotten-palace.png\` |
| Scene | \`ch-{####}-{slug}.png\` | \`ch-0001-harbor.png\` |

## Image format (mandatory)

- **Orientation:** Landscape only — **16:9** (characters, artifacts, monsters, magic) or **21:9** (locations, dungeons, timeline).
- **Never** portrait/vertical or square.
- **Characters:** Front-facing toward viewer — not side profile.
- **Monsters & artifacts:** Multi-view reference sheet layout on one horizontal canvas (front, side, three-quarter, detail).

## Workflow

1. Open any Codex/Bestiary card and click the **ℹ** icon for the full generation prompt.
2. Generate image (external tool).
3. Save to the folder above using the exact filename from the **Image Repository** page (\`/images\`).
4. Run \`npm run seed:sync\` — manifest auto-updates \`present\` / \`missing\` status.

## Stats

- **Total entries:** ${manifestEntries.length}
- **Present:** ${present}
- **Missing:** ${missing}
`;
writeFileSync(join(root, "public", "assets", "images", "IMAGE-REPOSITORY.md"), repoDoc);

// ── equipment.ts ──
function gearColor(rank) {
  const r = String(rank ?? "F").toUpperCase();
  if (r === "F" || r === "E") return "#718096";
  if (r === "D" || r === "C") return "#8b6b2e";
  if (r === "B") return "#5a6bcf";
  if (r === "A") return "#d4af37";
  return "#c45c6a";
}

const equipmentTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export interface Equipment {
  id: string;
  name: string;
  type: string;
  subtype: string;
  rank: string;
  gearGrade: string;
  stats: Record<string, string | boolean | number>;
  source: string;
  intendedUser?: string;
  description: string;
  imageColor: string;
}

export const equipment: Equipment[] = [
${equipmentSeed
  .map((e) => {
    const statLines = Object.entries(e.stats ?? {})
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");
    const desc = `${e.type}${e.subtype ? ` (${e.subtype})` : ""} — rank ${e.rank ?? "F"}, ${e.gearGrade ?? "scrap"} grade.${statLines ? ` ${statLines}.` : ""}`;
    return `  {
    id: ${JSON.stringify(e.id)},
    name: ${JSON.stringify(e.name)},
    type: ${JSON.stringify(e.type)},
    subtype: ${JSON.stringify(e.subtype ?? "")},
    rank: ${JSON.stringify(e.rank ?? "F")},
    gearGrade: ${JSON.stringify(e.gearGrade ?? "scrap")},
    stats: ${JSON.stringify(e.stats ?? {})},
    source: ${JSON.stringify(e.source ?? "")},
    intendedUser: ${JSON.stringify(e.intendedUser ?? "")},
    description: ${JSON.stringify(desc)},
    imageColor: ${JSON.stringify(gearColor(e.rank))},
  }`;
  })
  .join(",\n")}
];

export function getEquipmentById(id: string) {
  return equipment.find((e) => e.id === id);
}
`;
writeTs("equipment.ts", equipmentTs);

// ── relationships.ts (with spoiler gates) ──
function mapRelationshipType(type) {
  const t = String(type ?? "");
  if (t.includes("romance")) return "romance";
  if (t === "rival") return "rivalry";
  if (t === "family") return "family";
  if (t === "mentor") return "mentor";
  if (t === "enemy") return "enemy";
  return "alliance";
}

function relationshipStrength(type) {
  const t = String(type ?? "");
  if (t.includes("romance") || t === "enemy") return 5;
  if (t === "rival" || t === "family") return 4;
  return 3;
}

const relationshipsTs = `import type { Relationship } from "@/types";

/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export const relationships: Relationship[] = [
${relationshipsSeed
  .map((r, i) => {
    const lines = [
      `    id: ${JSON.stringify(`r-${i + 1}`)}`,
      `    sourceId: ${JSON.stringify(r.from)}`,
      `    targetId: ${JSON.stringify(r.to)}`,
      `    type: ${JSON.stringify(mapRelationshipType(r.type))}`,
      `    label: ${JSON.stringify(r.label)}`,
      `    strength: ${relationshipStrength(r.type)}`,
      `    minChapter: ${r.minChapter ?? 1}`,
    ];
    if (r.endsChapter != null) lines.push(`    endsChapter: ${r.endsChapter}`);
    if (r.revealedChapter != null) lines.push(`    revealedChapter: ${r.revealedChapter}`);
    if (r.stages) lines.push(`    stages: ${JSON.stringify(r.stages)}`);
    return `  {\n${lines.join(",\n")}\n  }`;
  })
  .join(",\n")}
];

export function getRelationshipsForCharacter(characterId: string) {
  return relationships.filter(
    (r) => r.sourceId === characterId || r.targetId === characterId
  );
}
`;
writeTs("relationships.ts", relationshipsTs);

// ── chapter-progress.ts ──
const chapterProgressTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export interface ForeshadowingEntry {
  id: string;
  planted: string | null;
  paidOff: string | null;
  description: string;
}

export interface ChapterContinuityLock {
  status: string;
  title: string;
  pov: string;
  inWorldDay: number;
  wordCount?: number;
  lockedFacts: string[];
}

export interface HistoryLogEntry {
  chapter: number;
  inWorldDay: number;
  delta: string;
}

export const chapterProgress = ${JSON.stringify(
  {
    lastUpdated: chapterProgressSeed.lastUpdated,
    publishedChapters: chapterProgressSeed.publishedChapters,
    foreshadowing: chapterProgressSeed.foreshadowing,
    historyLog: chapterProgressSeed.historyLog,
    chapters: chapterProgressSeed.chapters,
  },
  null,
  2
)} as const;

export type ChapterProgressData = typeof chapterProgress;
`;
writeTs("chapter-progress.ts", chapterProgressTs);

// ── chapter-manifest.ts ──
const manifestChapters = chapterManifestSeed.chapters.map((c) => ({
  id: c.id,
  number: c.number,
  title: c.title,
  volumeId: c.volumeId,
  volumeNumber: c.volumeNumber,
  volumeTitle: c.volumeTitle,
  status: c.status,
  pov: c.pov,
  synopsis: c.synopsis,
}));

const manifestVolumes = arcsSeed.volumes.map((v) => ({
  id: v.id,
  number: v.number,
  title: v.title,
  chapterStart: v.chapterStart,
  chapterEnd: v.chapterEnd,
  ageId: v.ageId,
  purpose: v.purpose,
}));

const chapterManifestTs = `/** AUTO-GENERATED by seed/scripts/sync-app-data.mjs */
export interface ManifestChapter {
  id: string;
  number: number;
  title: string;
  volumeId: string;
  volumeNumber: number;
  volumeTitle: string;
  status: string;
  pov?: string;
  synopsis?: string;
}

export interface ManifestVolume {
  id: string;
  number: number;
  title: string;
  chapterStart: number;
  chapterEnd: number;
  ageId: string;
  purpose: string;
}

export const manifestVolumes: ManifestVolume[] = ${JSON.stringify(manifestVolumes, null, 2)};

export const manifestChapters: ManifestChapter[] = ${JSON.stringify(manifestChapters, null, 2)};

export function getManifestChapter(id: string) {
  return manifestChapters.find((c) => c.id === id);
}

export function getChaptersByVolume(volumeId: string) {
  return manifestChapters.filter((c) => c.volumeId === volumeId);
}

export function isChapterReadable(id: string, compiledIds: Set<string>) {
  const entry = getManifestChapter(id);
  if (!entry) return false;
  return entry.status === "published" && compiledIds.has(id);
}
`;
writeTs("chapter-manifest.ts", chapterManifestTs);

console.log(`Synced app data:
  ${allCharacters.length} characters (+ disciples)
  ${monstersSeed.length} monsters
  ${artifactsSeed.length} artifacts
  ${dungeonsSeed.length} dungeons
  ${locationsSeed.length} locations
  ${skillsSeed.length} magic skills
  ${companionsSeed.length} companions
  ${factionsSeed.length} factions
  ${allTimeline.length} timeline events
  ${equipmentSeed.length} equipment
  ${relationshipsSeed.length} relationships (gated)
  ${manifestChapters.length} manifest chapters
  ${promptEntries.length} image prompts
  Images: ${present}/${manifestEntries.length} present`);
