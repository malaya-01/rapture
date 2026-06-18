# Dungeon Bible

Reference catalog for all major dungeons in *Rapture*. Canonical machine-readable data lives in **`seed/dungeons.json`** (8 dungeons). Dungeons are **stories**, not loot caves — every entry answers: What happened here? Who built this? Why does it exist? What can be learned?

**Cross-references:** `05-monster-encyclopedia.md` · `11-artifacts-relics-treasures.md` · `22-equipment-loot-and-ranks.md` · `03-antagonists.md`

---

## Design philosophy

Dungeons are **not locations** — they are **worlds**. Readers should remember them like cities.

Every major dungeon requires: **history · ecosystem · rules · mystery · visuals · rewards · emotional impact**

Bad pattern: cave → monsters → boss → treasure.  
Good pattern: rule-bound world that tests character, reveals history, and changes the map.

---

## Classification system

| Classification | Floor range | Scope |
|----------------|-------------|-------|
| **Minor** | 1–5 | Local threats; tutorial delves |
| **Major** | 10–50 | Regional importance; guild economy |
| **Legacy** | Variable | World-changing secrets; sovereigns |
| **Catastrophe** | Unknown | Civilization-ending potential |
| **Civilization** | Vertical / city-scale | Populated or biome-stack worlds |
| **Unique** | Infinite / fragmented | One-of-a-kind dimensional rules |

### Dungeon types

Combat · Puzzle · Trial (character/morality) · Civilization · Living · Dimensional (time distortion)

---

## Failure escalation system

If a dungeon threat is **ignored** or a **sovereign is left undefeated**, escalation proceeds in stages:

| Stage | Effect | Example |
|-------|--------|---------|
| **1 — Localized** | Monster spill near entrance; trade routes rerouted | First Dungeon rift-hounds on Ashford surface |
| **2 — Regional** | Ecosystem bleed; neighboring biomes shift | Crimson Hive brood scouts in farmland |
| **3 — Outbreak** | Species exit dungeon bounds in numbers | Memory wraiths near Forgotten Palace gate |
| **4 — Dungeon break** | Rules leak outward; maps fail globally for that dungeon | Abyssal Ocean tides in wrong seas |
| **5 — Catastrophe event** | Sovereign or dungeon core threatens nation/world | Brood Mother surface war; Gate activation |

Sanctuary policy: Stage 2+ triggers Deep Delvers Guild mobilization. Stage 4+ triggers coalition council.

---

## Generation targets

| Type | Target count |
|------|--------------|
| Minor | 100+ |
| Major | 50+ |
| Legacy | 20+ |
| Catastrophe | 5–10 |
| Unique | 1 (Limbo) |

**Current seed:** 8 dungeons in **`seed/dungeons.json`**

---

## Dungeon entries (full catalog)

---

### The First Dungeon — Ashford Undercity (`first-dungeon`)

| Field | Value |
|-------|--------|
| **name** | The First Dungeon (Ashford Undercity) |
| **classification** | major |
| **theme** | discovery |
| **floors** | 12 |
| **entrance** | Subterranean street door east of Ashford — preserved pre-Rapture municipal access sealed until Rapture fracture |
| **appearance** | Preserved underground city; electric amber lights that activate for visitors; empty streets; no bodies; pre-Rapture signage intact |
| **rules** | Lights activate for visitors; doors seal behind party until floor cleared or retreat protocol invoked; no surface radio |
| **sovereign** | null (Floor 12 guardian construct only) |
| **dominantMonsters** | forgotten-knight, echo-servant, whisper-shade (upper floors); grave-walker, glimmer-rat (lower) |
| **rewards** | Ancient records · Rune system knowledge · Connected worlds map |
| **storySignificance** | **critical** — Cassian's first proof that dungeons are designed worlds; rune literacy begins here |
| **firstAppearance** | ch-0030 |
| **clearedChapter** | ch-0180 |
| **imagePath** | `assets/images/dungeons/first-dungeon.png` |
| **imagePrompt** | An underground preserved city with amber lights and empty streets, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

#### Floor table (12 floors)

| Floors | Rank band | Monsters | Loot | Notes |
|--------|-----------|----------|------|-------|
| **1–3** | E–D | grave-walker, glimmer-rat | salvaged-rations, rusted-scrap | Tutorial band; F-rank horde density |
| **4–6** | D–C | forgotten-knight, rift-hound | rune-fragment-d, ancient-coin | First rune literacy; rift geometry |
| **7–9** | C–B | echo-servant, memory-wraith | memory-glass-shard, archive-tablet | Memory pressure begins; party cohesion test |
| **10–12** | B–A | dungeon-guardian-construct (boss) | connected-worlds-map, rune-archive-core | Boss floor; no sovereign — construct is archive keeper |

---

### The Forgotten Palace (`forgotten-palace`)

| Field | Value |
|-------|--------|
| **name** | The Forgotten Palace |
| **classification** | legacy |
| **theme** | memory |
| **floors** | 33 |
| **entrance** | White gate arch in northern mist sea — appears only to parties carrying memory-key fragments or guild Adamant clearance |
| **appearance** | Colossal white palace in endless fog; floating staircases; drifting chandeliers; corridors that rearrange when unobserved |
| **rules** | Deeper travel = more personal memories lost (identity trivia, faces, songs — not plot-critical without holder consent); speaking true name of lost person can banish wraith |
| **sovereign** | **pale-king** |
| **dominantMonsters** | memory-wraith, forgotten-knight, echo-servant |
| **rewards** | Lost knowledge · Forbidden memories · Identity truths · memory-shard (epic relic) |
| **storySignificance** | **critical** — empire history; Adrian's buried past; memory-shard arc |
| **firstAppearance** | ch-0125 |
| **imagePath** | `assets/images/dungeons/forgotten-palace.png` |
| **imagePrompt** | A vast white palace floating in endless fog with broken staircases suspended in the sky, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

#### Floor table

| Floors | Rank band | Monsters | Loot | Notes |
|--------|-----------|----------|------|-------|
| **1–8** | C | forgotten-knight, echo-servant | pale-steel-fragment, memory-glass-shard | Entry courts; memory loss minor |
| **9–20** | B | memory-wraith, forgotten-knight | echo-crystal, forbidden-scroll | Personal memory loss moderate |
| **21–32** | A | memory-wraith (elite), echo-servant swarms | memory-shard, pale-crown-fragment | Severe memory pressure; identity trials |
| **33** | S | **pale-king** (boss) | memory-shard-legendary, truth-of-empire-fragment | Sovereign floor; consent required for deepest truth |

---

### The Eternal Machine (`eternal-machine`)

| Field | Value |
|-------|--------|
| **name** | The Eternal Machine |
| **classification** | legacy |
| **theme** | control |
| **floors** | 51 |
| **entrance** | Bronze vault door in eastern scar — opens only when party accepts written dungeon law contract |
| **appearance** | Infinite bronze machinery; mountain-sized gears; clockwork sky; pistons like tides |
| **rules** | All actions follow precise laws inscribed on floor plates; violations trigger clockwork-soldier enforcement; mercy is not in code |
| **sovereign** | **clockwork-empress** |
| **dominantMonsters** | clockwork-soldier, gear-beast, bronze-sentinel |
| **rewards** | Ancient technology · Mana engineering schematics · **bronze-heart-engine** (epic relic) |
| **storySignificance** | **critical** — Marcus's mana-tech lineage; Sanctuary industrial revolution |
| **firstAppearance** | ch-0400 |
| **imagePath** | `assets/images/dungeons/eternal-machine.png` |
| **imagePrompt** | A massive mechanical world filled with colossal gears and bronze towers, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

#### Floor table

| Floors | Rank band | Monsters | Loot | Notes |
|--------|-----------|----------|------|-------|
| **1–15** | C–B | clockwork-soldier | bronze-gear, law-tablet | Law literacy mandatory |
| **16–35** | B–A | clockwork-soldier, gear-beast | master-gear, mana-engine-schematic | Gear beast arenas |
| **36–50** | A–S | gear-beast (elite), bronze-sentinel | bronze-heart-fragment | Pre-sovereign pressure |
| **51** | S | **clockwork-empress** (boss) | bronze-heart-engine | Sovereign; grants engine only if laws honored entire run |

---

### The Crimson Hive (`crimson-hive`)

| Field | Value |
|-------|--------|
| **name** | The Crimson Hive |
| **classification** | major |
| **theme** | evolution |
| **floors** | 27 |
| **entrance** | Sinkhole in southern red plains — organic ramp descends; heat and chitin smell |
| **appearance** | Gigantic living hive; organic tunnels; glowing eggs; amber fluid rivers |
| **rules** | Dungeon adapts; repeated strategies stop working after 3 uses; hive learns party composition |
| **sovereign** | **brood-mother** |
| **dominantMonsters** | hive-soldier, brood-hunter, crimson-swarmer |
| **rewards** | Evolution ichor · Royal gel · Hive crown · Evolution core |
| **storySignificance** | **major** — evolution mechanics; Brood Mother as Monster Lord; biological warfare threat |
| **firstAppearance** | ch-0500 |
| **imagePath** | `assets/images/dungeons/crimson-hive.png` |
| **imagePrompt** | A gigantic living hive with organic tunnels and glowing eggs, realistic epic fantasy horror art, highly detailed, cinematic lighting, book illustration quality |

#### Floor table

| Floors | Rank band | Monsters | Loot | Notes |
|--------|-----------|----------|------|-------|
| **1–10** | D–C | crimson-swarmer, brood-hunter (juvenile) | hive-chitin, evolution-ichor | Swarm introduction |
| **11–22** | B–A | hive-soldier, brood-hunter | royal-gel, hunter-chitin | Adaptation phase — rotate tactics |
| **23–27** | A–S | hive-soldier (elite), brood-hunter (alpha) | evolution-core, hive-crown | Pre-brood chamber |
| **27 (core)** | S | **brood-mother** (boss) | evolution-core (guaranteed), hive-crown | Living dungeon heart |

---

### The Abyssal Ocean (`abyssal-ocean`)

| Field | Value |
|-------|--------|
| **name** | The Abyssal Ocean |
| **classification** | catastrophe |
| **theme** | fear-of-unknown |
| **floors** | unknown (depth layers, not vertical floors) |
| **entrance** | Storm wells in western trench — ships that enter do not return on same chart |
| **appearance** | Dark endless ocean beneath starless sky; bioluminescent predators; pressure that crushes unprepared hulls |
| **rules** | Maps inaccurate; distances change; navigation fails; sound travels wrong |
| **sovereign** | null (leviathan-serpent acts as de facto apex — not bindable sovereign) |
| **dominantMonsters** | abyssal-maw, deep-one, leviathan-serpent |
| **rewards** | Deep pearls · Abyssal charts (temporary) · Leviathan scale (legendary material, rare) |
| **storySignificance** | **major** — humanity's limit; Nora's Adamant trial; fear of what cannot be mapped |
| **firstAppearance** | ch-0350 |
| **imagePath** | `assets/images/dungeons/abyssal-ocean.png` |
| **imagePrompt** | A dark endless ocean beneath a starless sky with massive sea monsters emerging, realistic epic fantasy horror art, highly detailed, cinematic lighting, book illustration quality |

#### Depth layers (functional floor table)

| Layer | Rank band | Monsters | Loot | Notes |
|-------|-----------|----------|------|-------|
| **Sunless shelf** | C–B | abyssal-maw | abyssal-tooth | Coastal guild operations |
| **Midnight trench** | B–A | deep-one | deep-pearl | Intelligent ambush |
| **Abyssal core** | SS | leviathan-serpent | leviathan-scale (2%) | Catastrophe proximity; retreat mandatory |

---

### The City of Shadows (`city-of-shadows`)

| Field | Value |
|-------|--------|
| **name** | The City of Shadows |
| **classification** | legacy |
| **theme** | regret |
| **floors** | city-scale (districts, not numeric) |
| **entrance** | Abandoned mirror gate in twilight valley — reflects party at wrong age |
| **appearance** | Abandoned city frozen in eternal twilight; shadow figures in windows; streets loop emotionally not geographically |
| **rules** | Every visitor encounters manifestations of personal regret; resistance escalates to twilight-stalker hunt |
| **sovereign** | null (city itself is semi-sentient — no single boss) |
| **dominantMonsters** | shadow-citizen, twilight-stalker, regret-spirit |
| **rewards** | Shadow ink · Twilight fragments · Emotional closure (non-loot) |
| **storySignificance** | **major** — character regret arcs; Cassian limbo foreshadow |
| **firstAppearance** | ch-0550 |
| **imagePath** | `assets/images/dungeons/city-of-shadows.png` |
| **imagePrompt** | An abandoned city frozen in eternal twilight with shadowy figures watching from windows, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

#### District table

| District | Rank band | Monsters | Loot | Notes |
|----------|-----------|----------|------|-------|
| **Outer rings** | C–B | shadow-citizen | shadow-ink | Non-lethal unless resisted |
| **Memory alleys** | B | shadow-citizen, regret-spirit | twilight-fragment | Personal regret scenes |
| **Central square** | A | twilight-stalker | twilight-fragment (guaranteed) | Hunt if denial persists |

---

### The World Tree (`world-tree`)

| Field | Value |
|-------|--------|
| **name** | The World Tree |
| **classification** | civilization |
| **theme** | life |
| **floors** | hundreds-vertical (biome per level) |
| **entrance** | Root gate at Sanctuary's eastern covenant — seasonal opening |
| **appearance** | Colossal world tree rising above clouds; entire forests on branches; sap rivers; sky serpents between limbs |
| **rules** | Each level contains different biome; descending without marker vine causes level drift |
| **sovereign** | **ancient-spirit** (collective; not single combat boss) |
| **dominantMonsters** | forest-guardian, sky-serpent, ancient-spirit manifestations |
| **rewards** | Life sap · Sky serpent scale · Biome seeds · Alliance with tree spirits |
| **storySignificance** | **critical** — life magic; Sanctuary covenant origin; vertical civilization model |
| **firstAppearance** | ch-0600 |
| **imagePath** | `assets/images/dungeons/world-tree.png` |
| **imagePrompt** | A colossal world tree rising above clouds with entire forests on its branches, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

#### Biome bands (functional floor table)

| Levels | Rank band | Monsters | Loot | Notes |
|--------|-----------|----------|------|-------|
| **Root–canopy (lower)** | C–B | forest-guardian (juvenile) | life-sap | Sanctuary-adjacent farming |
| **Cloud branch (mid)** | B–A | sky-serpent, forest-guardian | sky-serpent-scale | Air travel covenant |
| **Crown (upper)** | A–S | ancient-spirit, forest-guardian (elder) | biome-seed, life-sap (refined) | Diplomatic trials not combat default |

---

### Limbo (`limbo`)

| Field | Value |
|-------|--------|
| **name** | Limbo |
| **classification** | unique |
| **theme** | loneliness |
| **floors** | infinite-fragmented (islands, not floors) |
| **entrance** | No stable entrance — dimensional tears, Wanderer's Key, or Gate adjacency |
| **appearance** | Surreal realm of floating islands, broken stars, endless twilight skies; echoes of places party has lost |
| **rules** | Time 100:3 inside:outside (`100 years inside = 3 years outside`); identity instability; maps impossible |
| **sovereign** | null |
| **dominantMonsters** | none standard — environmental hazards, identity fractals, optional wanderer-echo entities |
| **rewards** | **hourglass-of-stillness** · **wanderers-key** · perspective (Cassian arc) |
| **storySignificance** | **critical** — Cassian's emotional arc; do not fully define in early volumes |
| **firstAppearance** | ch-0700 (referenced earlier as rumor) |
| **timeDistortion** | insideYears: 100 · outsideYears: 3 |
| **imagePath** | `assets/images/dungeons/limbo.png` |
| **imagePrompt** | A surreal realm of floating islands, broken stars, and endless twilight skies, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

#### Fragment zones

| Zone | Rank band | Hazards | Loot | Notes |
|------|-----------|---------|------|-------|
| **Shore fragments** | B | identity echo, time slip | wanderers-key (shard) | First contact |
| **Deep drift** | A | stillness fields | hourglass-of-stillness | Extreme danger |
| **Core unknown** | S+ | undefined | — | Vol 14+ territory |

---

## Reward system

Rewards are not exclusively combat power:

| Type | Examples |
|------|----------|
| **Knowledge** | Rune archives, connected worlds map, empire truth |
| **Resources** | Hive ichor, bronze gears, storm crystals |
| **Territory** | Cleared floor grants guild claim (temporary) |
| **Artifacts** | memory-shard, bronze-heart-engine, hourglass-of-stillness |
| **Magic** | Skill tomes, biome seeds, life sap refinement |
| **Historical truths** | Pale King revelations, cycle hints |
| **Alliances** | World Tree covenant, dragon accords prep |

---

## Sovereign index

| Sovereign | Dungeon | Theme |
|-----------|---------|-------|
| pale-king | forgotten-palace | Memory / empire |
| clockwork-empress | eternal-machine | Control / law |
| brood-mother | crimson-hive | Evolution |
| ancient-spirit | world-tree | Life (collective) |

See **`03-antagonists.md`** for sovereign character detail.

---

## Image framework

Every dungeon entry includes:

```
id / classification / theme / floors / entrance / appearance / rules /
sovereign / dominantMonsters / floorTable / rewards / storySignificance /
firstAppearance / imagePath / imagePrompt
```

Floor art convention: `assets/images/dungeons/{id}/floor-{nn}.png`
