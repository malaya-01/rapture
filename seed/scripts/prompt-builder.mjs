/**
 * Builds rich dual prompts for Rapture illustrations:
 * 1) contentPrompt — lore/story context for the artist or LLM
 * 2) imagePrompt — concrete generation instructions with style bible
 */

export const SERIES_CONTEXT = `RAPTURE: THE FRACTURED SKY — Cycle Seven

On an ordinary day (Day Zero), the sky fractured worldwide. Massive silver rifts opened. Dragons descended through the light. Mana flooded Earth. Physics and biology mutated. Governments collapsed within months. Billions died.

The world is recognizable post-Rapture Earth — modern cities in ruins, highways abandoned, harbors black under torn silver sky — mixed with fantasy mutation: sovereign dungeons, monster territories, mana storms, beast contracts, and awakened human affinities.

The saga follows Cassian Reed (omega, spatial affinity) and Adrian Hale (alpha guardian) who survive Ashford's fall and eventually co-found SANCTUARY — humanity's first enduring walled settlement. Themes: melancholic hope, competence over destiny, slow-burn love, political rivalry (Iron Dominion), tragic antagonists, Limbo's hundred-year arc, and the mystery of seven cosmic cycles.

Visual era: Cycle Seven post-collapse. NOT high medieval generic fantasy — think ruined 21st-century infrastructure overtaken by mana-lit growth, painterly premium novel art.

CONTENT MATURITY (18+): Adult literary survival epic. Illustrations may show combat blood, wounds, brutal action, and environmental horror when canon-appropriate. Romance: tasteful affection and kissing allowed — never explicit nudity or pornographic poses. Do not sanitize violence or hazard to look family-friendly.`;

export const CONTENT_MATURITY = `CONTENT RATING: Adult (18+) — premium novel illustration for mature readers.
- Combat/monsters: honest blood, injury, and brutality when scene-appropriate — not bloodless or cartoon
- Hazard/horror: ruin, death, predation, dread — not sanitized
- Romance: embraces and kissing tasteful — NO explicit nudity or sexual acts
- NOT family-friendly, NOT YA-safe default`;

export const STYLE_BIBLE = `ART STYLE: Painterly oil-and-gouache hybrid with subtle paper grain. Cinematic chiaroscuro lighting, soft volumetric god-rays, atmospheric depth. Collector's edition fantasy novel quality (Witcher bestiary × Arcane artbook × LotR illustrated edition).

NOT photorealistic. NOT anime. NOT 3D render. NOT generic stock fantasy.

${CONTENT_MATURITY}

ORIENTATION (MANDATORY): LANDSCAPE ONLY — aspect ratio 16:9 or 21:9. NEVER portrait/vertical. NEVER square. All Rapture codex images share horizontal landscape format.

PALETTE: Deep charcoal void (#090807), warm parchment highlights (#F5EFE2), antique gold accents (#D4AF37), muted earth tones. Silver-blue for rift/mana light.

MOOD: Melancholic hope, ancient mystery, survival epic. Mature adult (18+), timeless, premium.

TECHNICAL: Rule of thirds composition, environmental storytelling, 4K illustration quality. NO text, NO watermarks, NO UI elements, NO labels in the image.`;

/** Parse knowledgebase MD encyclopedia sections for rich context. */
export function parseMdEncyclopediaSync(readFile, exists, kbDir, ...filenames) {
  const map = {};
  for (const file of filenames) {
    const path = `${kbDir}/${file}`;
    if (!exists(path)) continue;
    const text = readFile(path, "utf8");
    const sections = text.split(/^## /m).slice(1);
    for (const section of sections) {
      const idMatch = section.match(/\|\s*\*\*id\*\*\s*\|\s*`([^`]+)`/);
      if (!idMatch) continue;
      const id = idMatch[1];

      const field = (label) => {
        const m = section.match(
          new RegExp(`\\|\\s*\\*\\*${label}\\*\\*\\s*\\|\\s*([^|\\n]+)`, "i")
        );
        return m ? m[1].replace(/`/g, "").trim() : "";
      };

      const block = (heading) => {
        const m = section.match(
          new RegExp(`### ${heading}\\s*\\n+([\\s\\S]*?)(?=\\n### |\\n---\\n|\\n## )`, "i")
        );
        return m ? m[1].trim().replace(/\n+/g, " ") : "";
      };

      map[id] = {
        name: section.split("\n")[0].trim(),
        title: field("title"),
        role: field("role"),
        faction: field("faction"),
        firstAppearance: field("firstAppearance"),
        appearance: block("Appearance"),
        personality: block("Personality"),
        preRapture: block("Pre-Rapture life"),
        magic: block("Magic and affinity"),
        arc: block("Arc"),
        imagePrompt: (section.match(/### imagePrompt\s*\n+([^\n#]+)/) || [])[1]?.trim() ?? "",
      };
    }
  }
  return map;
}

function eraEnvironment(first, faction, id) {
  if (id?.startsWith("disciple-")) {
    return "Limbo's surreal twilight realm with floating stone and broken stars";
  }
  const ch = parseInt(String(first).replace(/\D/g, ""), 10) || 0;
  if (ch <= 200) {
    return "Ashford ruins, abandoned highways, or early collapse survival — modern 21st-century debris, silver sky fracture visible";
  }
  if (String(faction).includes("iron")) {
    return "Iron Dominion fortifications and cold overcast";
  }
  if (String(faction).includes("limbo")) {
    return "Limbo — impossible horizons, fragmented time";
  }
  if (String(faction).includes("sanctuary") || ch >= 266) {
    return "Sanctuary walls, healing gardens, or defended valley beyond Ashford";
  }
  return "Fractured Earth ruins under silver sky scars";
}

function imagePathHint(category, id) {
  const folder =
    category === "disciples" || id.startsWith("disciple-")
      ? "disciples"
      : category;
  return `public/assets/images/${folder}/${id}.png`;
}

function buildContentHeader(title, entityType, id, category) {
  return `=== RAPTURE ILLUSTRATION BRIEF ===
Project: Rapture — The Fractured Sky (Cycle Seven)
Entry: ${title}
Type: ${entityType}
Asset ID: ${id}
Save to: ${imagePathHint(category, id)}

--- SERIES CONTEXT ---
${SERIES_CONTEXT}`;
}

function buildImageFooter(framing) {
  return `${STYLE_BIBLE}

COMPOSITION: ${framing}

Generate ONE cohesive illustration that belongs in the same artbook as every other Rapture image.`;
}

export function buildCharacterPrompts(c, md = {}, category = "characters") {
  const cat = c.id?.startsWith("disciple-") ? "disciples" : category;
  const name = c.name;
  const title = c.title ?? md.title ?? "";
  const faction = c.faction ? String(c.faction).replace(/-/g, " ") : md.faction ?? "unknown";
  const role = c.role ?? md.role ?? "ally";
  const first = c.firstAppearance ?? md.firstAppearance ?? "early saga";

  const contentPrompt = `${buildContentHeader(`${name} — ${title}`, "Character portrait", c.id, cat)}

--- WHO THIS CHARACTER IS ---
${name} (${title}) serves as ${role} within ${faction}.
${c.description ?? ""}

${md.appearance ? `--- CANON APPEARANCE ---\n${md.appearance}\n` : ""}
${md.personality ? `--- PERSONALITY & DEMEANOR ---\n${md.personality}\n` : ""}
${md.preRapture ? `--- PRE-RAPTURE BACKGROUND ---\n${md.preRapture.slice(0, 600)}${md.preRapture.length > 600 ? "…" : ""}\n` : ""}
${md.magic ? `--- MAGIC & AFFINITY ---\n${md.magic.slice(0, 400)}${md.magic.length > 400 ? "…" : ""}\n` : ""}
${c.traits?.length ? `--- KEY TRAITS ---\n${c.traits.join(", ")}\n` : ""}
${c.affinity ? `--- AFFINITY ---\n${c.affinity}\n` : ""}
${md.arc ? `--- CHARACTER ARC ---\n${md.arc.slice(0, 400)}${md.arc.length > 400 ? "…" : ""}\n` : ""}

--- STORY MOMENT FOR THIS PORTRAIT ---
Depict ${name} as readers encounter them around ${first}. This is Cycle Seven post-Rapture Earth — not a generic medieval world. Show survival, competence, and emotional truth. Avoid "chosen one" heroic posing unless the character's canon demands it.

--- WHAT THE IMAGE MUST COMMUNICATE ---
Readers should feel who ${name} is before reading a single line of prose: their burden, warmth, threat, or loneliness. The illustration must match Sanctuary/Ashford visual continuity.

--- ORIENTATION & POSE (MANDATORY) ---
LANDSCAPE 16:9 or 21:9 only. Character faces the VIEWER — front-facing or very slight three-quarter toward camera. Eyes visible. NOT side profile. NOT looking away from camera. NOT portrait/vertical crop.`;

  const appearanceDetail =
    md.appearance ||
    md.imagePrompt ||
    c.description ||
    `${name}, ${title}, ${faction} faction`;

  const imagePrompt = `${buildImageFooter("LANDSCAPE 16:9 — cinematic character portrait, waist-up, FRONT-FACING toward viewer, environmental storytelling in wide frame")}

ORIENTATION: Horizontal landscape 16:9 or 21:9 ONLY. Never vertical portrait.

POSE: ${name} faces the camera directly — front-facing or slight three-quarter with eyes toward viewer. NOT side profile. NOT silhouette from behind. NOT looking out a window away from viewer.

SUBJECT: ${name} — ${title}

PHYSICAL APPEARANCE: ${appearanceDetail}

EXPRESSION & BODY LANGUAGE: ${md.personality?.slice(0, 300) || c.traits?.join(", ") || "Canon-appropriate demeanor"}

WARDROBE & ERA: Post-Rapture survival gear appropriate to ${faction}. Worn practical clothing — patched jackets, guard leathers, healer wraps, or scholar layers. NOT pristine fantasy plate unless canon (e.g. Guardian armor mid-saga).

ENVIRONMENT: Setting tied to ${first} — ${eraEnvironment(first, faction, c.id)}

LIGHTING: Cinematic chiaroscuro. Silver rift glow or warm campfire contrast. Gold accent highlights on edges.

${md.imagePrompt ? `REFERENCE LINE (incorporate): ${md.imagePrompt}` : ""}`;

  return { contentPrompt, imagePrompt };
}

export function buildMonsterPrompts(m) {
  const habitat = Array.isArray(m.habitat) ? m.habitat.join(", ") : m.habitat ?? "Wild Zone";
  const threat = m.threatRank ?? "D";
  const named = m.named ? "NAMED SOVEREIGN / LEGENDARY ENTITY — treat with epic scale." : "";

  const contentPrompt = `${buildContentHeader(m.name, "Bestiary creature", m.id, "monsters")}

--- CREATURE PROFILE ---
Classification: ${m.category ?? "unknown"} | Threat rank: ${threat} | Tier: ${m.tier ?? "?"}
Habitat: ${habitat}
${named}

--- APPEARANCE ---
${m.appearance ?? ""}

--- BEHAVIOR ---
${m.behavior ?? ""}

--- SCALE ---
${m.scale ?? "See appearance"}

--- ECOLOGY (RAPTURE RULES) ---
Monsters are living species in post-Rapture Earth — not video-game mobs. They eat, reproduce, evolve, and claim territory. ${m.dungeonExclusive ? `This creature is tied to dungeon: ${m.dungeonExclusive}.` : "Found in wild zones or ruins."}
${m.firstAppearance ? `First appears: ${m.firstAppearance}` : ""}
${m.evolutionChain ? `Evolution chain: ${m.evolutionChain.join(" → ")}` : ""}
${m.evolutionOf ? `Evolves from: ${m.evolutionOf}` : ""}

--- DROPS / STORY USE ---
${m.drops?.map((d) => d.item).join(", ") || "Standard creature loot"}

--- WHAT THE IMAGE MUST COMMUNICATE ---
Threat level ${threat} must read instantly. Show environmental storytelling — where it hunts, how survivors fear it, how mana mutation changed a once-ordinary ecosystem.

--- ORIENTATION (MANDATORY) ---
LANDSCAPE 16:9 bestiary reference sheet — multiple views of the SAME creature in one horizontal image: front view, side profile, three-quarter view, and one detail inset (head/claw/scale). Like a premium fantasy bestiary field guide. NOT a single action scene only.`;

  const imagePrompt = `${buildImageFooter(
    "LANDSCAPE 16:9 — bestiary reference sheet layout: same creature shown in FRONT view, SIDE profile, THREE-QUARTER view, and detail close-up arranged horizontally on parchment-dark background"
  )}

ORIENTATION: Horizontal landscape 16:9 ONLY. Multi-view reference sheet — NOT single pose only.

LAYOUT: Four-panel bestiary spread — (1) front full body (2) side profile (3) three-quarter threatening stance (4) detail inset of distinctive feature (eyes, claws, scales, etc.)

SUBJECT: ${m.name} — ${m.category}

CREATURE DESIGN: ${m.appearance ?? m.name}

BEHAVIOR IN FRAME: ${m.behavior ?? "Canon-appropriate threat display"}

SCALE REFERENCE: ${m.scale ?? "Human or larger"} — include environmental scale (ruined street, harbor, forest, dungeon corridor).

HABITAT: ${habitat} — post-Rapture Earth with modern ruin elements where appropriate.

THREAT RANK ${threat}: Visual intensity must match — ${threat === "F" || threat === "E" ? "minor danger" : threat === "D" || threat === "C" ? "moderate menace" : threat === "B" || threat === "A" ? "serious horror" : "cataclysmic awe"}.

${m.imagePrompt ? `REFERENCE LINE (incorporate): ${m.imagePrompt}` : ""}`;

  return { contentPrompt, imagePrompt };
}

export function buildArtifactPrompts(a) {
  const contentPrompt = `${buildContentHeader(a.name, "Artifact / relic", a.id, "artifacts")}

--- ARTIFACT LORE ---
Grade: ${a.grade ?? "unknown"} | Type: ${a.type ?? "relic"}
${a.theme ? `Theme: ${a.theme}` : ""}
${a.creator ? `Creator: ${a.creator}` : ""}
${a.intendedUser ? `Intended bearer: ${a.intendedUser}` : ""}

--- APPEARANCE ---
${a.appearance ?? a.description ?? ""}

--- FUNCTION ---
${a.function ?? a.ability ?? ""}

--- LIMITATIONS ---
${a.limitation ?? "Canon-appropriate constraints"}

--- HISTORY ---
${a.history ?? "See saga canon"}

${a.firstAppearance ? `First appearance: ${a.firstAppearance}` : ""}
Story importance: ${a.storyImportance ?? "significant"}

--- WHAT THE IMAGE MUST COMMUNICATE ---
This object is a physical piece of Rapture lore — readers should sense its age, power, and cost.

--- ORIENTATION (MANDATORY) ---
LANDSCAPE 16:9 artifact reference sheet — same object shown from multiple angles: front hero view, side profile, top-down or three-quarter, and material/detail close-up. Like a museum catalog or weaponsmith's blueprint. NOT single angle only.`;

  const imagePrompt = `${buildImageFooter("LANDSCAPE 16:9 — artifact reference sheet: front view, side profile, three-quarter angle, and material detail inset on dark parchment background")}

ORIENTATION: Horizontal landscape 16:9 ONLY. Multi-angle reference — NOT single still life only.

LAYOUT: Museum catalog spread — (1) front hero display (2) side profile showing depth (3) three-quarter with scale reference (4) macro detail of materials/runes/glow

SUBJECT: ${a.name}

OBJECT DESIGN: ${a.appearance ?? a.description ?? a.name}

MATERIALS & GLOW: Mana-lit elements where appropriate (${a.affinity?.join?.(", ") || a.type}). Gold and silver accents. Weathered or ancient surfaces.

CONTEXT: ${a.intendedUser ? `Shown near gear belonging to ${a.intendedUser}` : "Sanctuary vault, explorer's pack, or dungeon discovery scene"}.

${a.imagePrompt ? `REFERENCE LINE (incorporate): ${a.imagePrompt}` : ""}`;

  return { contentPrompt, imagePrompt };
}

export function buildDungeonPrompts(d) {
  const contentPrompt = `${buildContentHeader(d.name, "Dungeon / sovereign territory", d.id, "dungeons")}

--- DUNGEON PROFILE ---
Classification: ${d.classification} | Theme: ${d.theme}
Floors: ${d.floors} | ${d.sovereign ? `Sovereign: ${d.sovereign}` : "No single sovereign"}
${d.rule ? `Dungeon rule: ${d.rule}` : ""}

--- ENVIRONMENT ---
${d.appearance ?? d.name}

--- INHABITANTS ---
${(d.dominantMonsters ?? []).join(", ")}

--- STORY SIGNIFICANCE ---
${d.storySignificance ?? "Major"} — ${d.rewards?.join?.(", ") || "Explorer rewards and lore"}

${d.firstAppearance ? `First appearance: ${d.firstAppearance}` : ""}
${d.clearedChapter ? `Cleared: ${d.clearedChapter}` : ""}

--- WHAT THE IMAGE MUST COMMUNICATE ---
Dungeons in Rapture are sovereign territories with rules — not arbitrary labyrinths. Show scale, wrongness, and the promise of ancient knowledge or horror.

--- ORIENTATION (MANDATORY) ---
LANDSCAPE 21:9 or 16:9 wide establishing shot only. NEVER portrait.`;

  const imagePrompt = `${buildImageFooter("LANDSCAPE 21:9 — epic environment establishing shot, wide cinematic panorama")}

SUBJECT: ${d.name}

ARCHITECTURE & ATMOSPHERE: ${d.appearance ?? d.name}

THEME: ${d.theme} — visual mood must embody this theme.

DUNGEON RULE (visual hint): ${d.rule ?? "Oppressive ancient wrongness"}

INHABITANTS (distant silhouettes OK): ${(d.dominantMonsters ?? []).slice(0, 3).join(", ")}

${d.imagePrompt ? `REFERENCE LINE (incorporate): ${d.imagePrompt}` : ""}`;

  return { contentPrompt, imagePrompt };
}

export function buildLocationPrompts(l) {
  const contentPrompt = `${buildContentHeader(l.name, "World location", l.id, "locations")}

--- LOCATION PROFILE ---
Region: ${l.region ?? "Unknown"}
Danger: ${l.dangerLevel ?? "unknown"} | Story importance: ${l.storyImportance ?? "significant"}

--- DESCRIPTION ---
${l.description ?? ""}

--- ECOLOGY ---
${l.dominantSpecies?.length ? `Dominant species: ${l.dominantSpecies.join(", ")}` : "See regional bestiary"}

${l.firstAppearance ? `First appearance: ${l.firstAppearance}` : ""}

--- WHAT THE IMAGE MUST COMMUNICATE ---
Establishing shot readers remember — geography of fractured Earth, not generic fantasy map. Modern ruin DNA where applicable (Ashford, highways, harbors).

--- ORIENTATION (MANDATORY) ---
LANDSCAPE 21:9 or 16:9 panorama only. NEVER portrait.`;

  const imagePrompt = `${buildImageFooter("LANDSCAPE 21:9 — wide establishing landscape or cityscape, cinematic panorama")}

SUBJECT: ${l.name} — ${l.region}

LANDSCAPE: ${l.description ?? l.name}

DANGER LEVEL: ${l.dangerLevel ?? "moderate"} — atmosphere must match.

POST-RAPTURE DETAILS: Silver sky scars, mana mist, mutated flora, abandoned infrastructure.

${l.dominantSpecies?.length ? `Optional distant creatures: ${l.dominantSpecies.join(", ")}` : ""}`;

  return { contentPrompt, imagePrompt };
}

export function buildCompanionPrompts(c) {
  const contentPrompt = `${buildContentHeader(c.name, "Beast contract companion", c.id, "companions")}

--- COMPANION PROFILE ---
Species: ${c.species}
Bonded to: ${c.bondedTo ?? "Mythic ally"}
Role: ${c.role}

--- DESCRIPTION ---
${c.description}

--- CONTRACT PHILOSOPHY ---
Companions in Rapture are characters — voluntary bonds, never slavery. ${c.bondedTo ? `This companion is bonded to ${c.bondedTo}.` : "Endgame mythic ally."}

Traits: ${(c.traits ?? []).join(", ")}
${c.firstAppearance ? `First appearance: ${c.firstAppearance}` : ""}

--- WHAT THE IMAGE MUST COMMUNICATE ---
Personality in the creature's posture. Bonded partnership, not pet ownership.

--- ORIENTATION (MANDATORY) ---
LANDSCAPE 16:9 — creature FRONT-FACING toward viewer. NOT side profile only.`;

  const imagePrompt = `${buildImageFooter("LANDSCAPE 16:9 — companion portrait, FRONT-FACING creature toward viewer with bonded partner implied nearby, wide environmental frame")}

ORIENTATION: Horizontal landscape 16:9 ONLY. Creature faces viewer — NOT side profile only.

POSE: ${c.name} front-facing or slight three-quarter, personality visible in posture.

SUBJECT: ${c.name} the ${c.species}

CREATURE DESIGN: ${c.description}

BONDED PARTNER: ${c.bondedTo ? `Include or imply ${c.bondedTo} nearby` : "Solitary mythic presence"}

${c.imagePrompt ? `REFERENCE LINE (incorporate): ${c.imagePrompt}` : ""}`;

  return { contentPrompt, imagePrompt };
}

export function buildFactionPrompts(f) {
  const contentPrompt = `${buildContentHeader(f.name, "Faction / nation", f.id, "factions")}

--- FACTION PROFILE ---
Type: ${f.type} | Alignment: ${f.alignment}
Philosophy: ${f.philosophy ?? ""}
${f.question ? `Central question: ${f.question}` : ""}
${f.banner ? `Banner: ${f.banner}` : ""}
Leaders: ${(f.leaderIds ?? []).join(", ") || "Various"}
Headquarters: ${f.headquarters ?? "See map"}

${f.firstAppearance ? `First appearance: ${f.firstAppearance}` : ""}

--- WHAT THE IMAGE MUST COMMUNICATE ---
Political identity through architecture, banners, and people — not cartoon villainy.

--- ORIENTATION (MANDATORY) ---
LANDSCAPE 16:9 or 21:9 wide shot only. NEVER portrait.`;

  const imagePrompt = `${buildImageFooter("LANDSCAPE 16:9 — faction establishing shot: stronghold, banner, or assembly in wide frame")}

SUBJECT: ${f.name}

VISUAL IDENTITY: ${f.banner ?? f.name} — colors ${(f.colors ?? []).join(", ")}

PHILOSOPHY MADE VISUAL: ${f.philosophy}

HEADQUARTERS: ${f.headquarters ?? "fortified settlement"}`;

  return { contentPrompt, imagePrompt };
}

export function buildMagicPrompts(s) {
  const contentPrompt = `${buildContentHeader(s.name, "Magic skill / spell", s.id, "magic")}

--- SKILL PROFILE ---
Type: ${s.type} | Affinity: ${s.affinity} | Rank: ${s.rank}
${s.user ? `Primary user: ${s.user}` : "General technique"}
${s.unlockChapter ? `Unlocks: ${s.unlockChapter}` : ""}
Mana cost: ${s.manaCost ?? "varies"}

--- DESCRIPTION ---
${s.description}

--- MANA SYSTEM CONTEXT ---
Magic is a force of nature, not a superpower. Three laws: mana cannot be created/destroyed; power without understanding is unstable; every use has consequences.

--- WHAT THE IMAGE MUST COMMUNICATE ---
The spell's visual identity and cost — not flashy anime VFX. Rapture magic feels physical and weary.

--- ORIENTATION (MANDATORY) ---
LANDSCAPE 16:9 spell effect illustration. Wide frame. NEVER portrait.`;

  const imagePrompt = `${buildImageFooter("LANDSCAPE 16:9 — spell effect illustration wide frame, FRONT-FACING caster silhouette if present")}

ORIENTATION: Horizontal landscape 16:9 ONLY.

SUBJECT: ${s.name} (${s.affinity} ${s.type})

EFFECT: ${s.description}

${s.user ? `CASTER: ${s.user} casting or channeling` : "Generic adept silhouette"}

MANA VISUAL: Silver-blue or affinity-appropriate glow. Chiaroscuro.`;

  return { contentPrompt, imagePrompt };
}

export function buildTimelinePrompts(e) {
  const contentPrompt = `${buildContentHeader(e.title ?? e.name, "Historical event", e.id, "timeline")}

--- EVENT ---
${e.description ?? e.name}

Era: ${e.era ?? "Age of Sanctuary"} | Year: ${e.year ?? e.inWorldDay ?? "?"}
${e.chapterId ? `Chapter: ${e.chapterId}` : e.chapter ? `Chapter: ${e.chapter}` : ""}
Importance: ${e.importance ?? "major"}

--- WHAT THE IMAGE MUST COMMUNICATE ---
Monumental story beat readers remember — documentary weight, not splash-page excess.

--- ORIENTATION (MANDATORY) ---
LANDSCAPE 21:9 or 16:9 cinematic wide scene only. NEVER portrait.`;

  const imagePrompt = `${buildImageFooter("LANDSCAPE 21:9 — historical scene illustration, cinematic wide panorama")}

SUBJECT: ${e.title ?? e.name}

SCENE: ${e.description ?? e.name}

ERA ATMOSPHERE: ${e.era ?? "Post-Rapture"} — appropriate ruins, settlement growth, or cosmic scale.`;

  return { contentPrompt, imagePrompt };
}

export function buildScenePrompts(scene) {
  const isOpening = scene.sceneType === "opening";
  const orientation = scene.orientation ?? "landscape";
  const aspectHint =
    orientation === "portrait"
      ? "3:4 portrait"
      : orientation === "square"
        ? "1:1 square"
        : isOpening
          ? "21:9 landscape"
          : "16:9 landscape";

  const contentPrompt = `${buildContentHeader(scene.title, "Chapter scene illustration", scene.id, "scenes")}

--- CHAPTER ---
${scene.chapterId}${scene.chapterTitle ? ` — ${scene.chapterTitle}` : ""}

--- SCENE TYPE ---
${isOpening ? "Chapter opening hero illustration (reader)" : "Inline scene illustration (mid-chapter)"}

--- SCENE ---
${scene.description}
${scene.subtitle ? `Setting: ${scene.subtitle}` : ""}
${scene.caption ? `Caption: ${scene.caption}` : ""}

--- WHAT THE IMAGE MUST COMMUNICATE ---
A story moment readers remember — cinematic novel illustration, not concept art filler. Match chapter prose tone (adult 18+ honesty for violence/hazard when scene is brutal).

--- ORIENTATION (MANDATORY) ---
Aspect ratio: ${aspectHint} — set per chapter figure metadata. Portrait, square, and landscape are all valid for chapter scenes.`;

  const imagePrompt = `${buildImageFooter(
    isOpening
      ? `Chapter opening hero — ${aspectHint}`
      : `Mid-chapter scene — ${aspectHint}${scene.placement?.includes("flow") ? ", text may wrap beside image in reader" : ""}`
  )}

ORIENTATION: ${aspectHint.toUpperCase()} as specified in chapter markdown.

SUBJECT: ${scene.title}

SCENE: ${scene.description}

${scene.subtitle ? `SETTING: ${scene.subtitle}` : ""}

MOOD: Post-Rapture Cycle Seven — modern ruin DNA, silver rift light, painterly premium novel art.`;

  return { contentPrompt, imagePrompt };
}

/**
 * World map prompt — single fantasy continent (Valdris) with labeled sites at
 * fixed percentages so generated art aligns with interactive map pins.
 */
export function buildWorldMapPrompt(worldMapSeed) {
  const { continent, subtitle, ocean, nodes, mapInset } = worldMapSeed;
  const majors = nodes.filter((n) => n.tier === "major");
  const minors = nodes.filter((n) => n.tier === "minor");

  const coordTable = nodes
    .map(
      (n) =>
        `  • ${n.mapLabel ?? n.name} — ${n.x}% from left, ${n.y}% from top of the LANDMASS area (${n.type.replace(/-/g, " ")})`
    )
    .join("\n");

  const majorLabels = majors
    .map((n) => `${n.mapLabel ?? n.name} at (${n.x}%, ${n.y}% of landmass)`)
    .join("; ");

  const insetNote = mapInset
    ? `Cartography occupies roughly ${mapInset.left}–${mapInset.right}% horizontally and ${mapInset.top}–${mapInset.bottom}% vertically inside the frame (title/legend live outside).`
    : "";

  const details = `SETTING: ${continent} — ${subtitle}
SURROUNDING WATERS: ${ocean}
${insetNote}

CRITICAL — NOT EARTH:
- Do NOT use real-world continents (no Americas, Europe, Africa, Asia, Australia).
- One original fantasy landmass only, surrounded on all sides by storm-tossed ocean.
- Travel is continental only; oceans are impassable Fracture Ocean (mana storms, leviathans).

CONTINENT SHAPE:
- Single large island-continent centered on the canvas (~75% width, ~70% height).
- Northwest: archives and pale ruins; north: dragon peaks and clockwork ruins;
  northeast: Iron Dominion fortress; east: crimson hive wastes;
  south-center: survivor roads and Sanctuary valley; southwest: Ashford ruins and harbor;
  west: dimensional Limbo tear; south coast center: Abyssal Gate pit.

ART STYLE:
- Illuminated manuscript / collector's edition fantasy cartography on aged parchment.
- Hand-inked coastlines, gold leaf borders, subtle silver rift scars across the land.
- Dark fantasy tone — post-Rapture Cycle Seven, not bright Tolkien pastoral.
- Landscape 3:2 aspect ratio (e.g. 1536×1024).

LABEL PLACEMENT (percentages are within the landmass cartography, not the full frame):
${coordTable}

MAJOR SITES TO PRINT ON THE MAP (gold serif labels at landmass coordinates):
${majorLabels}

MINOR SITES (${minors.length} communities, safe zones, nodes):
- Smaller italic labels or dot symbols at landmass coordinates above.
- Do not clutter; spread labels so nothing overlaps.

LEGEND BAR (bottom edge of frame, outside cartography):
- Rift Fractures | Dungeon Nodes | Cities & Communities | Wild/Danger Zones | Safe Zones | Sovereign Powers

DO NOT place labels in the ocean except Abyssal Gate on the south coast and Limbo on the west vortex.`;

  const framing =
    "Top-down fantasy continent map, single landmass, parchment cartography, 3:2 landscape aspect ratio, no Earth geography";

  return buildGenericPrompts(
    "world-map",
    `Rapture World Map — ${continent}`,
    "Fantasy continent cartography",
    details,
    framing,
    "locations"
  );
}

export function buildGenericPrompts(id, title, entityType, details, framing, category) {
  const contentPrompt = `${buildContentHeader(title, entityType, id, category)}

--- DETAILS ---
${details}

--- WHAT THE IMAGE MUST COMMUNICATE ---
Premium Rapture collector's edition continuity.`;

  const imagePrompt = `${buildImageFooter(framing)}

SUBJECT: ${title}

DETAILS: ${details}`;

  return { contentPrompt, imagePrompt };
}
