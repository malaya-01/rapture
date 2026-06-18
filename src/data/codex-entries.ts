import { buildImagePrompt } from "./image-style";

export interface CodexEntry {
  id: string;
  name: string;
  category: "organization" | "artifact" | "dungeon";
  role: string;
  faction: string;
  description: string;
  significance: string;
  traits: string[];
  imageColor: string;
  relatedIds?: string[];
  appearances?: string[];
  href: string;
  imagePrompt: string;
}

export const organizations: CodexEntry[] = [
  {
    id: "sanctuary",
    name: "Sanctuary",
    category: "organization",
    role: "Founding Nation",
    faction: "Sanctuary",
    description:
      "The first enduring settlement after the Rapture — walled city-state founded by Cassian Reed and Adrian Hale. Healers, runesmiths, and explorers united under a charter of voluntary cooperation.",
    significance: "Heart of the saga; model for post-collapse civilization.",
    traits: ["Founding", "Defensive", "Idealistic", "Democratic"],
    imageColor: "#4f8b5a",
    relatedIds: ["cassian-reed", "adrian-hale", "founder-council"],
    appearances: ["ch-0001", "Year 40 — Founding"],
    href: "/encyclopedia",
    imagePrompt: buildImagePrompt(
      "Sanctuary — the first walled settlement after the Rapture",
      "Aerial view of a fortified settlement at dusk. Timber and stone walls encircle clustered buildings with healing gardens and a central mana-lit beacon. Survivors with packs approach the gate. Silver rift scars visible on the distant horizon. Warm gold lantern light against cold blue twilight. Founded by omega leader Cassian Reed and alpha guardian Adrian Hale.",
      "wide cinematic establishing shot, 21:9"
    ),
  },
  {
    id: "iron-dominion",
    name: "Iron Dominion",
    category: "organization",
    role: "Rival Nation",
    faction: "Iron Dominion",
    description:
      "Viktor Drake's authoritarian order — iron discipline, conscript armies, and the conviction that only strength prevents extinction. Charismatic, never self-identifying as villain.",
    significance: "Primary political antagonist civilization.",
    traits: ["Militaristic", "Authoritarian", "Charismatic", "Expansionist"],
    imageColor: "#8b2e2e",
    relatedIds: ["viktor-drake"],
    appearances: ["Year 120 — Dominion Declares"],
    href: "/encyclopedia",
    imagePrompt: buildImagePrompt(
      "Iron Dominion fortress-state",
      "Brutalist iron fortifications on a raised plateau. Banners of black and rust-red. Soldiers in disciplined formation. Smoke from forges. Oppressive overcast sky. Viktor Drake's philosophy made architecture — order through force.",
      "wide cinematic establishing shot, 21:9"
    ),
  },
  {
    id: "crimson-faith",
    name: "Crimson Ascension",
    category: "organization",
    role: "Cult",
    faction: "Crimson Faith",
    description:
      "A messianic cult offering false hope through blood ritual and spectacle. Mother Seraphine preaches that the Rapture was divine judgment and only the faithful will transcend.",
    significance: "Religious antagonist faction; exploits despair.",
    traits: ["Fanatical", "Manipulative", "Charismatic"],
    imageColor: "#e53e3e",
    href: "/encyclopedia",
    imagePrompt: buildImagePrompt(
      "Crimson Ascension cult gathering",
      "Candlelit cathedral ruins converted to crimson altar. Robed faithful with raised hands. Blood-red banners and fractured sky visible through broken stained glass. False hope made visual — beautiful and horrifying.",
      "dramatic interior wide shot"
    ),
  },
  {
    id: "dragon-conclave",
    name: "Dragon Conclave",
    category: "organization",
    role: "Ancient Witnesses",
    faction: "Dragon Conclave",
    description:
      "Ancient obsidian dragons who survived previous cycles. They do not rule — they witness. Velkarion speaks for those who remember what Earth was before the fracture.",
    significance: "Connects current cycle to ancient history.",
    traits: ["Ancient", "Proud", "Wise", "Neutral"],
    imageColor: "#5a6bcf",
    href: "/encyclopedia",
    imagePrompt: buildImagePrompt(
      "Dragon Conclave at the Obsidian Peaks",
      "Massive obsidian dragon perched on a mountain precipice overlooking fractured valleys. Smaller dragons in distant thermals. Starlight and mana aurora. Scale and patience — beings who have seen cycles end before.",
      "epic wide landscape, dragon silhouette"
    ),
  },
  {
    id: "founder-council",
    name: "Founder Council",
    category: "organization",
    role: "Governing Body",
    faction: "Sanctuary",
    description:
      "Sanctuary's leadership council — Cassian, Adrian, Rowan, Elena, Marcus, Nora, and key department heads. Decisions by debate, not decree.",
    significance: "Political heart of Sanctuary's charter.",
    traits: ["Democratic", "Burdened", "Pragmatic"],
    imageColor: "#d4af37",
    relatedIds: ["cassian-reed", "adrian-hale", "rowan-hale"],
    href: "/encyclopedia/characters/cassian-reed",
    imagePrompt: buildImagePrompt(
      "Sanctuary Founder Council in session",
      "Round stone table in a torchlit chamber. Diverse survivors in worn practical clothing — omega scholar, alpha guardian, healer, soldier, explorer. Maps and rune diagrams spread across table. Gravity of founding decisions.",
      "group portrait, painterly, warm interior lighting"
    ),
  },
];

export const artifacts: CodexEntry[] = [
  {
    id: "fracture-compass",
    name: "Fracture Compass",
    category: "artifact",
    role: "Navigational Relic",
    faction: "Unknown",
    description:
      "A pre-Rapture instrument that spins toward spatial tears rather than magnetic north. Marcus Vale's team reverse-engineered copies for explorers.",
    significance: "Essential for navigating rift zones safely.",
    traits: ["Spatial", "Ancient", "Rare"],
    imageColor: "#553c9a",
    href: "/encyclopedia",
    imagePrompt: buildImagePrompt(
      "Fracture Compass artifact",
      "Antique brass compass with a needle of crystallized mana that glows silver-blue. Engraved with cycle symbols. Resting on weathered map of fractured Ashford. Soft gold candlelight, dark walnut surface.",
      "still life object study, macro detail"
    ),
  },
  {
    id: "founders-seal",
    name: "Founder's Seal",
    category: "artifact",
    role: "Political Symbol",
    faction: "Sanctuary",
    description:
      "Wax seal of Sanctuary's first charter — broken once during civil crisis, remade twice. Isabella Voss designed the sigil: an open hand above a wall.",
    significance: "Symbol of voluntary governance.",
    traits: ["Political", "Sacred", "Historical"],
    imageColor: "#d4af37",
    href: "/encyclopedia",
    imagePrompt: buildImagePrompt(
      "Founder's Seal of Sanctuary",
      "Gold signet ring pressing into warm wax on parchment charter. Sigil: open hand above stone wall. Ink quill and dried blood spot on corner — the cost of founding. Parchment texture, intimate still life.",
      "macro still life, top-down"
    ),
  },
  {
    id: "rift-shard",
    name: "Rift Shard",
    category: "artifact",
    role: "Mana Crystal",
    faction: "Various",
    description:
      "Crystallized mana from sky fractures. Unstable alone, invaluable when rune-bound. Marcus Vale's mana-tech foundation depends on harvested shards.",
    significance: "Core resource of post-Rapture technology.",
    traits: ["Mana", "Volatile", "Valuable"],
    imageColor: "#5a6bcf",
    href: "/encyclopedia",
    imagePrompt: buildImagePrompt(
      "Rift Shard crystal",
      "Jagged translucent crystal pulsing silver-blue inner light. Hairline fractures of gold mana within. Held in gloved runesmith hand. Dark background with faint rift glow.",
      "object portrait, dramatic rim lighting"
    ),
  },
  {
    id: "lifefire-vial",
    name: "Lifefire Vial",
    category: "artifact",
    role: "Healing Focus",
    faction: "Sanctuary",
    description:
      "Elena Hale's healing manifests as golden Lifefire — costly to the healer. Vials capture residual essence for emergency field medicine.",
    significance: "Elena's healing magic made tangible.",
    traits: ["Healing", "Costly", "Golden"],
    imageColor: "#276749",
    relatedIds: ["elena-hale"],
    href: "/encyclopedia/characters/elena-hale",
    imagePrompt: buildImagePrompt(
      "Lifefire healing vial",
      "Small glass vial containing swirling golden-green luminescent liquid. Healer's trembling hands nearby. Medical supplies in Sanctuary tent background. Warm healing glow vs cold world outside.",
      "intimate still life, shallow depth of field"
    ),
  },
  {
    id: "spatial-lens",
    name: "Cassian's Spatial Lens",
    category: "artifact",
    role: "Study Focus",
    faction: "Sanctuary",
    description:
      "Ground glass lens Cassian Reed ground by hand to study spatial distortion. Not powerful — a tool of understanding. Magic through study, not destiny.",
    significance: "Embodies Cassian's approach to spatial affinity.",
    traits: ["Spatial", "Scholarly", "Humble"],
    imageColor: "#4a5568",
    relatedIds: ["cassian-reed"],
    href: "/encyclopedia/characters/cassian-reed",
    imagePrompt: buildImagePrompt(
      "Spatial study lens on desk",
      "Hand-ground glass lens bending light into impossible angles. Cassian's notes and city map beneath. Omega scholar's modest studio apartment. Quiet competence — magic learned, not granted.",
      "desk still life, warm lamplight"
    ),
  },
];

export const dungeons: CodexEntry[] = [
  {
    id: "harbor-rift",
    name: "Harbor Rift Dungeon",
    category: "dungeon",
    role: "Sovereign Territory",
    faction: "Monsters",
    description:
      "Where the first fracture opened over Ashford Harbor. A sovereign dungeon zone — unstable geometry, rift-born creatures, and the memory of Day Zero frozen in silver light.",
    significance: "First dungeon; ground zero of the Rapture.",
    traits: ["Rift", "Day Zero", "Sovereign"],
    imageColor: "#4a5568",
    relatedIds: ["ashford", "rift-hound"],
    appearances: ["ch-0001"],
    href: "/encyclopedia",
    imagePrompt: buildImagePrompt(
      "Harbor Rift Dungeon — Ashford ground zero",
      "Ashford harbor at twilight with massive silver rift scar across the sky. Sunken ships, mutated creatures on wet stone. First dragon silhouette descending through the fracture. Apocalyptic beauty — Day Zero.",
      "epic wide cinematic, 21:9"
    ),
  },
  {
    id: "underpass-warren",
    name: "Underpass Warren",
    category: "dungeon",
    role: "Urban Dungeon",
    faction: "Monsters",
    description:
      "Collapsed transit tunnels beneath ruined cities. Scavengers learn the cost of greed here — tight corridors, ambush predators, and mana pockets that distort time.",
    significance: "Early survival dungeon for Highway Camp arc.",
    traits: ["Urban", "High Threat", "Maze"],
    imageColor: "#2d3748",
    href: "/encyclopedia",
    imagePrompt: buildImagePrompt(
      "Underpass Warren dungeon",
      "Collapsed subway tunnel with bioluminescent fungi. Mutated creatures eyes in darkness. Abandoned survival gear scattered. Claustrophobic perspective with distant mana glow.",
      "interior dungeon scene, horror atmosphere"
    ),
  },
  {
    id: "ashford-dead-zone",
    name: "Ashford Dead Zone",
    category: "dungeon",
    role: "Dead Zone",
    faction: "Monsters",
    description:
      "The scarred core of Cassian's former city — Rapture energy so concentrated that almost nothing normal survives. Geography unreliable; spatial distortion extreme.",
    significance: "Cassian's origin; emotional anchor.",
    traits: ["Dead Zone", "Spatial", "Haunted"],
    imageColor: "#8b6b2e",
    relatedIds: ["cassian-reed", "ashford"],
    href: "/encyclopedia",
    imagePrompt: buildImagePrompt(
      "Ashford Dead Zone",
      "Ruined city skyline with grey silence. No birds, no color — only silver mist and twisted architecture. Cassian's apartment building barely recognizable. Grief made landscape.",
      "wide desolate panorama"
    ),
  },
  {
    id: "seventh-gate-threshold",
    name: "Seventh Gate Threshold",
    category: "dungeon",
    role: "Ancient Failsafe",
    faction: "Unknown",
    description:
      "A pre-cycle failsafe buried deep in the world network. Not a weapon — a choice. The saga's final mysteries converge here across hundreds of chapters.",
    significance: "Endgame mystery; cycle lore.",
    traits: ["Ancient", "Failsafe", "Cosmic"],
    imageColor: "#5a6bcf",
    href: "/timeline",
    imagePrompt: buildImagePrompt(
      "Seventh Gate Threshold",
      "Vast underground chamber with seven concentric gates of living stone. Mana rivers flow between them. Tiny human silhouette for scale. Ancient beyond measure — neither good nor evil, only a choice.",
      "epic underground vista"
    ),
  },
];

export function getCodexEntryById(id: string) {
  return (
    organizations.find((e) => e.id === id) ??
    artifacts.find((e) => e.id === id) ??
    dungeons.find((e) => e.id === id)
  );
}
