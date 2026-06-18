# Artifacts, Relics & Treasures

Reference catalog for named artifacts in *Rapture*. Canonical machine-readable data lives in **`seed/artifacts.json`** (15 entries) and craftable gear in **`seed/equipment.json`** (12 entries). Artifacts are **history**, not random loot — every significant piece answers: Who created it? Why? What does it symbolize? What price accompanies use?

**Rule:** Artifacts enhance characters — never replace them.

**Cross-references:** `22-equipment-loot-and-ranks.md` · `06-dungeon-bible.md` · `10-magic-and-mana-system.md` · `02-main-cast.md`

---

## Grade system

| Grade | Rarity | Description | Typical source |
|-------|--------|-------------|----------------|
| **Common** | Mass-produced | Rune tools, salvage gear | Craft, general loot |
| **Rare** | Uncommon finds | Named dungeon drops | Floor chests F–D |
| **Epic** | Major dungeon rewards | Story-significant relics | Legacy partial clears |
| **Legendary** | Named weapons/armor | Character-bound masterworks | Sovereign kills, arc rewards |
| **Mythic** | Dragon / titan origin | Recognized by elder species | Dragon hoard, SS materials |
| **World Relics** | ≤50 exist | Pre-Rapture civilization | Gate-adjacent, cycle lore |
| **Historic** | Sanctuary / nation symbols | Non-combat cultural treasures | Founding era |
| **Unique** | One confirmed instance | Limbo, dimensional origin | Limbo, Wanderer line |

Gear **rank** (F–Catastrophe) in `equipment.json` aligns with monster threat ranks — see **`22-equipment-loot-and-ranks.md`**.

---

## Categories

Weapons · Armor · Jewelry · Tools · Books · Relics · Structures · Vehicles · Living Artifacts · Banners

---

## Generation targets

| Grade | Target count |
|-------|--------------|
| World Relics | 50 |
| Legendary | 100 |
| Epic | 300 |
| Lesser (Common–Rare) | 1000+ |

**Current seed:** 15 artifacts · 12 equipment items

---

## Artifact entries (full catalog)

---

### The Compass of Horizons (`compass-of-horizons`)

| Field | Value |
|-------|--------|
| **grade** | world-relic |
| **type** | relic |
| **creator** | Unknown pre-Rapture civilization |
| **appearance** | Ancient silver compass; needle floats without touch; symbols that shift when observer's desire changes |
| **function** | Points toward what holder truly seeks — not always a geographic location (person, truth, decision) |
| **limitation** | Holder must understand own desires; confused or self-deceiving users receive contradictory readings |
| **theme** | purpose |
| **intendedUser** | Keepers of the Last Flame tradition; Cassian (eventual) |
| **firstAppearance** | ch-0500 |
| **imagePath** | `assets/images/artifacts/compass-of-horizons.png` |
| **imagePrompt** | An ancient silver compass floating above a stone pedestal while glowing runes orbit around it, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### The Chronicle of Echoes (`chronicle-of-echoes`)

| Field | Value |
|-------|--------|
| **grade** | world-relic |
| **type** | book |
| **creator** | Pre-Rapture archivist order (name lost) |
| **appearance** | Massive white tome; infinite pages that turn without wind; ink that writes itself when history changes |
| **function** | Records important events; reveals lost history on request; cross-references empire records |
| **limitation** | Never reveals future; omits events observer is not ready to witness |
| **theme** | memory |
| **intendedUser** | scholars, council archivists |
| **firstAppearance** | ch-0480 |
| **imagePath** | `assets/images/artifacts/chronicle-of-echoes.png` |
| **imagePrompt** | An enormous floating book surrounded by glowing pages and ancient light, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### The Last Flame (`last-flame`)

| Field | Value |
|-------|--------|
| **grade** | world-relic |
| **type** | lantern |
| **creator** | First Keeper circle (pre-Sanctuary) |
| **appearance** | Golden lantern; single eternal flame that does not consume wick; warm light without heat burn |
| **function** | Cannot be extinguished by natural means; protects nearby souls from corruption and whisper-shade influence |
| **limitation** | Small radius (~10 meters); attracts attention of high-mana predators |
| **theme** | hope |
| **intendedUser** | Keeper order; Sanctuary council ritual |
| **firstAppearance** | ch-0200 |
| **imagePath** | `assets/images/artifacts/last-flame.png` |
| **imagePrompt** | A golden lantern containing an eternal flame glowing in darkness, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Skybreaker (`skybreaker`)

| Field | Value |
|-------|--------|
| **grade** | legendary |
| **type** | weapon (greatsword) |
| **creator** | Storm-forge guild (First Fracture era) |
| **appearance** | Massive silver blade etched with storm runes; weight impossible for non-Awakened |
| **function** | Converts physical momentum into lightning; strike power scales with charge distance |
| **limitation** | Requires physical momentum to activate; stationary defense weak |
| **theme** | determination |
| **intendedUser** | darius |
| **affinity** | lightning, wind |
| **firstAppearance** | ch-0300 |
| **imagePath** | `assets/images/artifacts/skybreaker.png` |
| **imagePrompt** | A colossal silver greatsword crackling with lightning while embedded in stone, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

**Related equipment:** `roc-wing-bow` (Nora) in `seed/equipment.json` — masterwork bow, not legendary artifact tier.

---

### Dawnsong (`dawnsong`)

| Field | Value |
|-------|--------|
| **grade** | legendary |
| **type** | weapon (spear) |
| **creator** | Sanctuary founders' armory |
| **appearance** | White ash shaft; crystalline gold tip; hums at sunrise |
| **function** | Amplifies courage and coordination in allies within voice range |
| **limitation** | Effect fades if bearer acts from cruelty or deception |
| **theme** | leadership |
| **intendedUser** | aria |
| **firstAppearance** | ch-0250 |
| **imagePath** | `assets/images/artifacts/dawnsong.png` |
| **imagePrompt** | A radiant white spear glowing beneath sunrise, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Nightveil (`nightveil`)

| Field | Value |
|-------|--------|
| **grade** | legendary |
| **type** | weapon (bow) |
| **creator** | Deep Delvers Guild master fletcher (name: Elara Voss) |
| **appearance** | Black obsidian bow; silver string that never snaps; no reflection in mirrors |
| **function** | Arrows ignore darkness, shadow magic, and optical illusion |
| **limitation** | Wielder must speak true aim aloud for maximum effect |
| **theme** | guidance |
| **intendedUser** | nora-winters |
| **firstAppearance** | ch-0400 |
| **imagePath** | `assets/images/artifacts/nightveil.png` |
| **imagePrompt** | A dark elegant bow surrounded by shadow and moonlight, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Aegis of the First Guardian (`aegis-first-guardian`)

| Field | Value |
|-------|--------|
| **grade** | legendary |
| **type** | armor (full plate) |
| **creator** | First Guardian order (pre-Rapture military sanctum) |
| **appearance** | White and silver plate; subtle rune patterns like breathing; no visor — face always visible |
| **function** | Generates protective barriers; absorbs directed harm meant for allies behind bearer |
| **limitation** | Barrier strength drops if bearer retreats from sworn protection |
| **theme** | sacrifice |
| **intendedUser** | adrian-hale |
| **firstAppearance** | ch-0150 |
| **imagePath** | `assets/images/artifacts/aegis-first-guardian.png` |
| **imagePrompt** | A shining suit of white armor standing within a field of protective light, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Titanheart Plate (`titanheart-plate`)

| Field | Value |
|-------|--------|
| **grade** | legendary |
| **type** | armor (heavy plate) |
| **creator** | Reworked from mountain-walker stone-heart fragment (Marcus Hale forge) |
| **appearance** | Stone-like massive plate; seams glow faint amber; weight shakes ground when dropped |
| **function** | Immense durability; damage reduction scales with bearer's resolve (not mana) |
| **limitation** | Mobility penalty; cannot swim; requires Rowan's strength to wear fully |
| **theme** | endurance |
| **intendedUser** | rowan-hale |
| **firstAppearance** | ch-0550 |
| **imagePath** | `assets/images/artifacts/titanheart-plate.png` |
| **imagePrompt** | A giant suit of stone and metal armor standing amidst a battlefield, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Memory Shard (`memory-shard`)

| Field | Value |
|-------|--------|
| **grade** | epic |
| **type** | relic |
| **creator** | Forgotten Palace (formed from condensed memories) |
| **origin** | forgotten-palace |
| **appearance** | Crystalline fragment; scenes float inside like amber insects |
| **function** | Access lost memories — personal or historical — when focused |
| **limitation** | May reveal painful truths; overuse erodes bearer's short-term recall |
| **theme** | identity |
| **intendedUser** | Adrian (primary); council use restricted |
| **firstAppearance** | ch-0133 |
| **imagePath** | `assets/images/artifacts/memory-shard.png` |
| **imagePrompt** | A crystalline fragment containing floating memories, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

**Related equipment:** `memory-glass-amulet` (A-rank masterwork) — protection, not full access — in `seed/equipment.json`.

---

### Bronze Heart Engine (`bronze-heart-engine`)

| Field | Value |
|-------|--------|
| **grade** | epic |
| **type** | relic |
| **creator** | Eternal Machine (Clockwork Empress core) |
| **origin** | eternal-machine |
| **appearance** | Massive bronze mechanical heart; pulses with mana light; gear spokes rotate slowly |
| **function** | Power source for Mana-Tech; enables rune mass production at Sanctuary scale |
| **limitation** | Requires law-compliant maintenance schedule; overload risks clockwork soldier manifestation |
| **theme** | innovation |
| **intendedUser** | Marcus Hale (custodian) |
| **firstAppearance** | ch-0451 |
| **imagePath** | `assets/images/artifacts/bronze-heart-engine.png` |
| **imagePrompt** | A massive bronze mechanical heart suspended within a chamber of gears, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

**Related equipment:** `bronze-heart-core-unit` (S-rank prototype) in `seed/equipment.json` — portable derivative.

---

### The Hourglass of Stillness (`hourglass-of-stillness`)

| Field | Value |
|-------|--------|
| **grade** | unique |
| **type** | relic |
| **creator** | Unknown (Limbo-native) |
| **origin** | limbo |
| **appearance** | Black crystal hourglass; silver sand falls upward; no sound when inverted |
| **function** | Localized time dilation — slows hostile action in radius |
| **limitation** | Extremely dangerous; user ages inside field; prolonged use strands bearer in Limbo drift |
| **theme** | time |
| **intendedUser** | none recommended — Cassian emergency use only |
| **firstAppearance** | ch-0705 |
| **imagePath** | `assets/images/artifacts/hourglass-of-stillness.png` |
| **imagePrompt** | A black crystal hourglass floating in darkness while silver sand falls upward, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### The Wanderer's Key (`wanderers-key`)

| Field | Value |
|-------|--------|
| **grade** | unique |
| **type** | relic |
| **creator** | Wanderer line (pre-cycle travelers) |
| **origin** | limbo |
| **appearance** | Ancient silver key; teeth shift shape near dimensional tears |
| **function** | Opens dimensional pathways — including unstable Limbo exits |
| **limitation** | Each use attracts attention of Gate architecture; key grows heavier with use |
| **theme** | journey |
| **intendedUser** | Cassian (Vol 14+); Wanderer messengers |
| **firstAppearance** | ch-0710 |
| **imagePath** | `assets/images/artifacts/wanderers-key.png` |
| **imagePrompt** | An ornate silver key surrounded by fractured portals, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Starscale Crown (`starscale-crown`)

| Field | Value |
|-------|--------|
| **grade** | mythic |
| **type** | relic |
| **creator** | Dragon Conclave craft (obsidian-dragon scale) |
| **origin** | dragon (not Velkarion's scale — lesser elder) |
| **appearance** | Crown of shimmering dragon scales; starlight visible in facets |
| **function** | Improves mana perception and rune reading speed |
| **limitation** | Dragons recognize instantly; wearing without accord marks bearer as thief |
| **theme** | legacy |
| **intendedUser** | guild diplomats; Cassian (temporary loan Vol 11) |
| **firstAppearance** | ch-0680 |
| **imagePath** | `assets/images/artifacts/starscale-crown.png` |
| **imagePrompt** | A majestic crown crafted from shimmering dragon scales, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

**Note:** **Heart of Velkarion** is not a harvestable artifact — immense mana source tied to Velkarion's living body. See `03-antagonists.md`.

---

### The Founder's Table (`founders-table`)

| Field | Value |
|-------|--------|
| **grade** | historic |
| **type** | structure |
| **creator** | Sanctuary founders (physical table); no magical forge |
| **appearance** | Worn oak table; knife marks; candle wax layers; never refinished by council vote |
| **function** | Symbol of unity; council decisions at table carry traditional weight; no combat ability |
| **limitation** | Immovable from Sanctuary hall; destruction would fracture community legitimacy |
| **theme** | community |
| **intendedUser** | Sanctuary council; all citizens (open meetings) |
| **firstAppearance** | ch-0100 |
| **imagePath** | `assets/images/artifacts/founders-table.png` |
| **imagePrompt** | A worn wooden table illuminated by lantern light while leaders gather around it, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

## Additional seed artifacts (summary)

| id | name | grade | type | theme |
|----|------|-------|------|-------|
| first-banner | The First Banner | historic | banner | hope |

Full fields: **`seed/artifacts.json`**

---

## Equipment cross-reference (`seed/equipment.json`)

Craftable and loot gear uses **gearGrade** aligned to threat rank:

| id | name | rank | gearGrade | source |
|----|------|------|-----------|--------|
| rusted-machete | Rusted Machete | F | scrap | craft |
| salvage-knife | Salvage Knife | E | salvaged | loot:general |
| ember-hide-jacket | Ember Hide Jacket | E | salvaged | craft:ember-hide |
| rune-forged-blade | Rune-Forged Blade | D | standard | craft:marcus-workshop |
| ironthorn-shield | Ironthorn Shield | D | standard | craft:ironthorn-plate |
| storm-crystal-staff | Storm Crystal Staff | C | refined | craft:storm-crystal |
| void-silk-cloak | Void Silk Cloak | C | refined | craft:void-silk |
| revenant-plate-vest | Revenant Plate Vest | B | elite | loot:dusk-revenant |
| abyssal-harpoon | Abyssal Harpoon | B | elite | craft:abyssal-tooth |
| roc-wing-bow | Roc Wing Bow | A | masterwork | craft:roc-plume |
| memory-glass-amulet | Memory Glass Amulet | A | masterwork | loot:forgotten-palace |
| bronze-heart-core-unit | Bronze Heart Core Unit | S | legendary-prototype | loot:eternal-machine-core |

Monster material → equipment pipeline: **`22-equipment-loot-and-ranks.md`**

---

## Living artifacts (narrative — not in artifacts seed)

| Name | Type | Theme | Notes |
|------|------|-------|-------|
| **Aurora** | floating crystal spirit | wisdom | Records knowledge continuously |
| **Lumen** | Aether spirit | perspective | Cassian's companion — introduce late |

---

## Creation rule (every major artifact)

Required fields for new entries:

```
id / grade / type / creator / appearance / function / limitation /
theme / intendedUser / firstAppearance / imagePath / imagePrompt
```

Add to **`seed/artifacts.json`** when entity first appears in outline — not when prose is written.
