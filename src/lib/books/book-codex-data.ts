import type { Character } from "@/types";

export interface BookCodexData {
  bookSlug: string;
  characters: Character[];
  locations: { id: string; name: string; region?: string; description: string; firstAppearance?: string; minChapter?: number; color?: string; promptId?: string }[];
  monsters: { id: string; name: string }[];
  artifacts: { id: string; name: string }[];
  equipment: { id: string; name: string }[];
  dungeons: { id: string; name: string }[];
  factions: { id: string; name: string }[];
  companions: { id: string; name: string }[];
  disciples: Character[];
  magicSkills: { id: string; name: string; description?: string; type?: string; path?: string; color?: string; minChapter?: number; promptId?: string }[];
  manaLaws: string[];
  magicMaterials: { id: string; name: string; description: string }[];
  magicRecipes: { id: string; name: string; description: string }[];
  timelineEvents: { id: string; title: string; era?: string; description: string; chapter?: string; minChapter?: number; color?: string; promptId?: string }[];
  relationships: { id: string; from: string; to: string; type: string; description?: string; minChapter?: number }[];
  imageManifest: {
    entries: { id: string; category: string; bookSlug?: string; publicPath: string; status: string; version?: number }[];
  };
  getRelationshipsForCharacter: (id: string) => BookCodexData["relationships"];
}

import * as raptureCharacters from "@/data/characters";
import * as raptureLocations from "@/data/locations";
import * as raptureMonsters from "@/data/monsters";
import * as raptureArtifacts from "@/data/artifacts";
import * as raptureEquipment from "@/data/equipment";
import * as raptureDungeons from "@/data/dungeons-data";
import * as raptureFactions from "@/data/factions-data";
import * as raptureCompanions from "@/data/companions";
import * as raptureDisciples from "@/data/disciples";
import * as raptureMagic from "@/data/magic-skills";
import * as raptureTimeline from "@/data/timeline";
import * as raptureRelationships from "@/data/relationships";
import { imageManifest as raptureImageManifest } from "@/data/image-manifest";

import * as echoesCharacters from "@/data/books/echoes-of-the-void/characters";
import * as echoesLocations from "@/data/books/echoes-of-the-void/locations";
import * as echoesMonsters from "@/data/books/echoes-of-the-void/monsters";
import * as echoesArtifacts from "@/data/books/echoes-of-the-void/artifacts";
import * as echoesEquipment from "@/data/books/echoes-of-the-void/equipment";
import * as echoesDungeons from "@/data/books/echoes-of-the-void/dungeons-data";
import * as echoesFactions from "@/data/books/echoes-of-the-void/factions-data";
import * as echoesCompanions from "@/data/books/echoes-of-the-void/companions";
import * as echoesDisciples from "@/data/books/echoes-of-the-void/disciples";
import * as echoesMagic from "@/data/books/echoes-of-the-void/magic-skills";
import * as echoesTimeline from "@/data/books/echoes-of-the-void/timeline";
import * as echoesRelationships from "@/data/books/echoes-of-the-void/relationships";
import { imageManifest as echoesImageManifest } from "@/data/books/echoes-of-the-void/image-manifest";

import * as canopyCharacters from "@/data/books/the-hollow-canopy/characters";
import * as canopyLocations from "@/data/books/the-hollow-canopy/locations";
import * as canopyMonsters from "@/data/books/the-hollow-canopy/monsters";
import * as canopyArtifacts from "@/data/books/the-hollow-canopy/artifacts";
import * as canopyEquipment from "@/data/books/the-hollow-canopy/equipment";
import * as canopyDungeons from "@/data/books/the-hollow-canopy/dungeons-data";
import * as canopyFactions from "@/data/books/the-hollow-canopy/factions-data";
import * as canopyCompanions from "@/data/books/the-hollow-canopy/companions";
import * as canopyDisciples from "@/data/books/the-hollow-canopy/disciples";
import * as canopyMagic from "@/data/books/the-hollow-canopy/magic-skills";
import * as canopyTimeline from "@/data/books/the-hollow-canopy/timeline";
import * as canopyRelationships from "@/data/books/the-hollow-canopy/relationships";
import { imageManifest as canopyImageManifest } from "@/data/books/the-hollow-canopy/image-manifest";

interface CodexModules {
  characters: { characters: Character[] };
  locations: { locations: BookCodexData["locations"] };
  monsters: { monsters: BookCodexData["monsters"] };
  artifacts: { artifacts: BookCodexData["artifacts"] };
  equipment: { equipment: BookCodexData["equipment"] };
  dungeons: { dungeons: BookCodexData["dungeons"] };
  factions: { factions: BookCodexData["factions"] };
  companions: { companions: BookCodexData["companions"] };
  disciples: { disciples?: Character[] };
  magic: {
    magicSkills: BookCodexData["magicSkills"];
    manaLaws?: string[];
    magicMaterials?: BookCodexData["magicMaterials"];
    magicRecipes?: BookCodexData["magicRecipes"];
  };
  timeline: { timelineEvents: BookCodexData["timelineEvents"] };
  relationships: {
    relationships: BookCodexData["relationships"];
    getRelationshipsForCharacter: (id: string) => unknown;
  };
  imageManifest: BookCodexData["imageManifest"] & { entries: BookCodexData["imageManifest"]["entries"] };
}

function pack(bookSlug: string, mods: CodexModules): BookCodexData {
  const disciples = (mods.disciples.disciples ?? []) as Character[];
  return {
    bookSlug,
    characters: mods.characters.characters,
    locations: mods.locations.locations,
    monsters: mods.monsters.monsters,
    artifacts: mods.artifacts.artifacts,
    equipment: mods.equipment.equipment,
    dungeons: mods.dungeons.dungeons,
    factions: mods.factions.factions,
    companions: mods.companions.companions,
    disciples,
    magicSkills: mods.magic.magicSkills,
    manaLaws: mods.magic.manaLaws ?? [],
    magicMaterials: mods.magic.magicMaterials ?? [],
    magicRecipes: mods.magic.magicRecipes ?? [],
    timelineEvents: mods.timeline.timelineEvents,
    relationships: mods.relationships.relationships,
    imageManifest: mods.imageManifest,
    getRelationshipsForCharacter: (id: string) =>
      mods.relationships.getRelationshipsForCharacter(id) as BookCodexData["relationships"],
  };
}

const registry: Record<string, BookCodexData> = {
  rapture: pack("rapture", {
    characters: raptureCharacters,
    locations: raptureLocations,
    monsters: raptureMonsters,
    artifacts: raptureArtifacts,
    equipment: raptureEquipment,
    dungeons: raptureDungeons,
    factions: raptureFactions,
    companions: raptureCompanions,
    disciples: raptureDisciples,
    magic: raptureMagic,
    timeline: raptureTimeline,
    relationships: raptureRelationships,
    imageManifest: raptureImageManifest,
  } as unknown as CodexModules),
  "echoes-of-the-void": pack("echoes-of-the-void", {
    characters: echoesCharacters,
    locations: echoesLocations,
    monsters: echoesMonsters,
    artifacts: echoesArtifacts,
    equipment: echoesEquipment,
    dungeons: echoesDungeons,
    factions: echoesFactions,
    companions: echoesCompanions,
    disciples: echoesDisciples,
    magic: echoesMagic,
    timeline: echoesTimeline,
    relationships: echoesRelationships,
    imageManifest: echoesImageManifest,
  } as unknown as CodexModules),
  "the-hollow-canopy": pack("the-hollow-canopy", {
    characters: canopyCharacters,
    locations: canopyLocations,
    monsters: canopyMonsters,
    artifacts: canopyArtifacts,
    equipment: canopyEquipment,
    dungeons: canopyDungeons,
    factions: canopyFactions,
    companions: canopyCompanions,
    disciples: canopyDisciples,
    magic: canopyMagic,
    timeline: canopyTimeline,
    relationships: canopyRelationships,
    imageManifest: canopyImageManifest,
  } as unknown as CodexModules),
};

export function getBookCodexData(bookSlug: string): BookCodexData {
  const data = registry[bookSlug];
  if (!data) throw new Error(`No codex data for book: ${bookSlug}`);
  return data;
}

export function getCodexBasePath(bookSlug: string): string {
  return `/books/${bookSlug}/encyclopedia`;
}
