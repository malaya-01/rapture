# Monster Encyclopedia

Reference catalog for all monster species in *Rapture*. Canonical machine-readable data lives in **`seed/monsters.json`** (63 species as of last manifest compile). This document expands seed entries with narrative context, evolution rules, and generation targets.

**Cross-references:** `22-equipment-loot-and-ranks.md` · `06-dungeon-bible.md` · `15-companions-beast-contracts.md` · `08-image-bible.md`

---

## Threat rank system

Threat ranks measure **civilizational impact**, not individual toughness alone. A D-rank ambush predator can kill an unprepared A-rank Awakened; rank describes what fails if the species is ignored.

| Rank | Definition | Typical scale | Wielder / response |
|------|------------|---------------|-------------------|
| **F** | Dangerous to unarmed civilians; manageable in small numbers with improvised weapons | Individual | Untrained survivors, militia |
| **E** | Dangerous to small survivor groups (3–8); requires coordination or basic Awakening | Pack / swarm | New Awakened, Copper license |
| **D** | Requires trained Awakened; solo civilian death likely | Elite individual | Guild Iron, rune-forged gear |
| **C** | Major threat; can halt caravans or clear a city block | Large / alpha | Guild Silver, refined gear |
| **B** | Settlement threat; can breach walls or wipe out a district | Boss-tier field monster | Guild Gold, elite gear |
| **A** | City threat; requires coordinated city defense or multiple Platinum Awakened | Building-scale | Guild Platinum, masterwork |
| **S** | Regional threat; alters weather, terrain, or migration patterns | District / volcano | Guild Mythril, legendary prototypes |
| **SS** | National threat; armies and fortifications insufficient alone | Mountain / city block | Guild Adamant, mythic assets |
| **Catastrophe** | Existential threat; reality, geography, or civilization-scale disturbance | Planetary / horizon-visible | No standard counter; story-tier only |

**Tier (1–5):** Internal growth stage within a species. Tier 5 ≠ automatic S-rank — a tier-5 F-rank swarm species remains F-rank for threat purposes until evolution elevates rank.

---

## Categories

| Category | Description | Example species |
|----------|-------------|-----------------|
| **beast** | Mutated terrestrial fauna; most common post-Rapture predators | ashwolf, ironhide-boar, thunder-stag |
| **sky** | Aerial predators and gliders | razorwing, storm-roc, skymanta |
| **aquatic** | Ocean, river, and deep-water species | mud-stalker, abyssal-maw, leviathan-serpent |
| **insect** | Arthropoid swarms and hunters | crimson-swarmer, bone-mantis, hive-soldier |
| **undead** | Risen dead, revenants, memory-bound corpses | grave-walker, dusk-revenant |
| **aberration** | Rift-born, psychic, or rule-breaking entities | whisper-shade, memory-wraith, rift-hound |
| **dragon** | Ancient draconic lineages; intelligence and territory | ember-dragon, frost-dragon, obsidian-dragon |
| **titan** | Colossal humanoid or serpent megafauna | mountain-walker, world-serpent |
| **construct** | Artificial or dungeon-bound automatons | clockwork-soldier, gear-beast |
| **magical** | Mana-saturated nature spirits and guardians | forest-guardian |

Dungeon-exclusive species are tagged in seed with `dungeonExclusive`. Full species list: **`seed/monsters.json`**.

---

## Evolution rules

1. **Age and mana density:** Prolonged exposure to high-mana zones accelerates tier growth. Ashford Undercity floors 7+ produce rift-hound alphas faster than surface ruins.
2. **Consumption:** Predators that consume higher-rank cores or beast flesh accumulate mutation mass. Pack alphas often evolve first.
3. **Environmental pressure:** Burn zones favor fire-line evolutions (ashwolf chain). Battlefields spawn dusk-revenants from accumulated death mana.
4. **Dungeon adaptation:** Living dungeons (Crimson Hive) force rapid adaptation — not true evolution chain, but functional rank increase within a delver run.
5. **Chain cap:** Most chains terminate at tier 5 / A-rank unless narrative exception (sovereign, dragon lord, titan).

**Documented chain — Ashwolf line:**

`ashwolf` (E) → `dire-ashwolf` (D) → `ember-fang` (B) → `inferno-wolf-king` (A)

**Documented chain — Grave Walker line:**

`grave-walker` (F) → `grave-walker-alpha` (D)

---

## Generation targets

Long-term encyclopedia target: **400–500 species** generated via tier × habitat matrix — not hand-authored one-by-one.

| Category | Target count | Notes |
|----------|--------------|-------|
| beast | 50 | Regional variants per biome |
| sky | 40 | Cliff, urban roost, storm belt |
| aquatic | 40 | Coastal, river, trench |
| insect | 40 | Swarm + hunter splits |
| undead | 50 | Battlefield, plague, dungeon |
| aberration | 40 | Rift-adjacent only |
| dragon | 30 | Elemental + elder subtypes |
| titan | 20 | SS and Catastrophe reserved |
| construct | 25 | Dungeon-tied |
| magical | 25 | World Tree, sanctuary-adjacent |
| **Regional variants** | 100+ | Same species, different habitat modifiers |
| **Current seed** | **42** | See `seed/monsters.json` |

---

## Species entries (full catalog sample)

The entries below are the primary reference block. Remaining seed species follow the same schema in **`seed/monsters.json`**.

---

### Grave Walker (`grave-walker`)

| Field | Value |
|-------|--------|
| **category** | undead |
| **threatRank** | F |
| **tier** | 1 |
| **habitat** | urban-ruin, abandoned suburbs, sealed metro |
| **appearance** | Decayed humanoid; grey-green skin; torn modern clothing; milky eyes; wet rasping breath |
| **behavior** | Slow shambling; drawn to sound and warmth; swarms in numbers; bite spreads low-grade necrotic infection |
| **scale** | Human |
| **traits** | infectious-bite, slow, pack-swarm |
| **drops** | rotted-flesh (F, 60%) · grave-dust (F, 30%) |
| **evolutionChain** | grave-walker → grave-walker-alpha |
| **firstAppearance** | ch-0004 |
| **imagePath** | `assets/images/monsters/grave-walker.png` |
| **imagePrompt** | A decayed undead wandering through a deserted city street at dusk, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Grave Walker Alpha (`grave-walker-alpha`)

| Field | Value |
|-------|--------|
| **category** | undead |
| **threatRank** | D |
| **tier** | 2 |
| **habitat** | urban-ruin (horde centers) |
| **appearance** | Larger grave walker; bone spikes along spine; faster gait; cracked jaw exposing black teeth |
| **behavior** | Coordinates horde movement; targets wounded; does not flee fire unless horde breaks |
| **scale** | Human+ |
| **traits** | horde-command, enhanced-speed, pack-swarm |
| **drops** | grave-dust (D, 50%) · beast-core-d (D, 10%) |
| **evolutionChain** | evolutionOf: grave-walker |
| **firstAppearance** | ch-0025 |
| **imagePath** | `assets/images/monsters/grave-walker-alpha.png` |
| **imagePrompt** | A larger mutated undead leading a horde through city ruins, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Ashwolf (`ashwolf`)

| Field | Value |
|-------|--------|
| **category** | beast |
| **threatRank** | E |
| **tier** | 1 |
| **habitat** | forest, ruined-suburb, burn-zone edge |
| **appearance** | Large wolf-sized predator; ember-orange fur; glowing red eyes; heat haze around muzzle |
| **behavior** | Pack hunter; flanks prey; fire-resistant; retreats from organized fire lines |
| **scale** | Large horse |
| **traits** | pack-hunter, fire-resistance, enhanced-speed |
| **drops** | ember-hide (E, 70%) · beast-core-e (E, 15%) |
| **evolutionChain** | ashwolf → dire-ashwolf → ember-fang → inferno-wolf-king |
| **firstAppearance** | ch-0008 |
| **imagePath** | `assets/images/monsters/ashwolf.png` |
| **imagePrompt** | A massive ember-furred wolf with glowing red eyes stalking through a ruined suburban street at dusk, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Dire Ashwolf (`dire-ashwolf`)

| Field | Value |
|-------|--------|
| **category** | beast |
| **threatRank** | D |
| **tier** | 2 |
| **habitat** | forest, ashwolf-territory |
| **appearance** | Twice wolf size; black fur with lava-cracks; smoke from nostrils |
| **behavior** | Pack alpha; coordinates flanking; weak fire-breath at close range |
| **scale** | Small truck |
| **traits** | pack-alpha, fire-breath-weak |
| **drops** | ember-hide (D, 80%) · beast-core-d (D, 25%) |
| **evolutionChain** | evolutionOf: ashwolf |
| **firstAppearance** | ch-0042 |
| **imagePath** | `assets/images/monsters/dire-ashwolf.png` |
| **imagePrompt** | A gigantic black and ember wolf with smoke rising from its fur in a burned forest, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Ember Fang (`ember-fang`)

| Field | Value |
|-------|--------|
| **category** | beast |
| **threatRank** | B |
| **tier** | 4 |
| **habitat** | ashwolf-forest, deep burn zones |
| **appearance** | Wolf as large as truck; flames along spine; molten fang tips |
| **behavior** | Territory lord; commands multiple packs; burns ground to deny retreat |
| **scale** | Large truck |
| **traits** | fire-trail, pack-command, territorial |
| **drops** | ember-fang-tooth (B, 50%) |
| **evolutionChain** | evolutionOf: dire-ashwolf |
| **firstAppearance** | ch-0238 |
| **imagePath** | `assets/images/monsters/ember-fang.png` |
| **imagePrompt** | A flaming wolf the size of a truck in a burned forest, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Inferno Wolf King (`inferno-wolf-king`)

| Field | Value |
|-------|--------|
| **category** | beast |
| **threatRank** | A |
| **tier** | 5 |
| **habitat** | ashwolf-forest (apex territory) |
| **appearance** | Crown of living fire; ash-black hide; eyes like furnace doors |
| **behavior** | Commands entire territory; negotiates with Awakened who prove dominance without cruelty |
| **scale** | Building footprint |
| **traits** | fire-crown, territory-sovereign, ancient-intelligence-limited |
| **drops** | inferno-crown-fragment (A, 25%) |
| **evolutionChain** | evolutionOf: ember-fang (chain terminus) |
| **firstAppearance** | ch-0500 |
| **imagePath** | `assets/images/monsters/inferno-wolf-king.png` |
| **imagePrompt** | A wolf king wreathed in fire commanding a pack in a volcanic forest, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Ironhide Boar (`ironhide-boar`)

| Field | Value |
|-------|--------|
| **category** | beast |
| **threatRank** | D |
| **tier** | 2 |
| **habitat** | grassland, highway, open ruin |
| **appearance** | Gigantic boar; metallic skin plates; tusks like curved swords; rust-colored bristles |
| **behavior** | Charges; high durability; territorial on roads and trade routes |
| **scale** | Large truck |
| **traits** | charge, high-durability |
| **drops** | ironthorn-plate (D, 65%) · beast-core-d (D, 20%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0045 |
| **imagePath** | `assets/images/monsters/ironhide-boar.png` |
| **imagePrompt** | A giant armored boar charging through an abandoned highway, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Razorwing (`razorwing`)

| Field | Value |
|-------|--------|
| **category** | sky |
| **threatRank** | D |
| **tier** | 2 |
| **habitat** | city, cliff, skyscraper roosts |
| **appearance** | Eagle-sized; blade-shaped metal feathers; silver-grey plumage; blood grooves on primary feathers |
| **behavior** | Dive attacks from height; flock circles prey before committing |
| **scale** | Eagle |
| **traits** | dive-attack, flock, blade-feathers |
| **drops** | razor-feather (D, 55%) · sky-gland (D, 20%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0004 |
| **imagePath** | `assets/images/monsters/razorwing.png` |
| **imagePrompt** | A flock of blade-feathered flying predators circling ruined skyscrapers, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Thunder Stag (`thunder-stag`)

| Field | Value |
|-------|--------|
| **category** | beast |
| **threatRank** | C |
| **tier** | 3 |
| **habitat** | mountain-forest, storm belts |
| **appearance** | Massive deer; lightning antlers; blue-white fur; storm clouds follow herd |
| **behavior** | Territorial; electrical discharge when threatened; does not pursue beyond range boundary |
| **scale** | Elephant |
| **traits** | electrical-discharge, territorial, storm-aura |
| **drops** | storm-crystal (C, 50%) · beast-core-c (C, 30%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0086 |
| **imagePath** | `assets/images/monsters/thunder-stag.png` |
| **imagePrompt** | A majestic lightning-antlered stag atop a mountain during a storm, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Crimson Swarmer (`crimson-swarmer`)

| Field | Value |
|-------|--------|
| **category** | insect |
| **threatRank** | E |
| **tier** | 1 |
| **habitat** | everywhere (post-Rapture), ruin, hive outskirts |
| **appearance** | Thumb-sized red beetle; iridescent carapace; mandibles that glow faintly |
| **behavior** | Individually weak; swarm consumes flesh in minutes; attracted to blood and mana residue |
| **scale** | Insect |
| **traits** | swarm, flesh-consumption |
| **drops** | crimson-chitin (E, 50%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0015 |
| **imagePath** | `assets/images/monsters/crimson-swarmer.png` |
| **imagePrompt** | Thousands of crimson insects covering an abandoned vehicle, realistic epic fantasy horror art, highly detailed, cinematic lighting, book illustration quality |

---

### Bone Mantis (`bone-mantis`)

| Field | Value |
|-------|--------|
| **category** | insect |
| **threatRank** | D |
| **tier** | 2 |
| **habitat** | forest, overgrown suburb |
| **appearance** | Three-meter praying mantis; white exoskeleton like bone; scythe limbs |
| **behavior** | Ambush; camouflage among trees; strikes once then retreats to reposition |
| **scale** | Human+ |
| **traits** | ambush, camouflage, scythe-limbs |
| **drops** | bone-chitin (D, 60%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0055 |
| **imagePath** | `assets/images/monsters/bone-mantis.png` |
| **imagePrompt** | A giant white skeletal mantis hidden among forest trees, realistic epic fantasy horror art, highly detailed, cinematic lighting, book illustration quality |

---

### Dusk Revenant (`dusk-revenant`)

| Field | Value |
|-------|--------|
| **category** | undead |
| **threatRank** | B |
| **tier** | 4 |
| **habitat** | ancient-battlefield, mass-grave sites |
| **appearance** | Armored undead knight; purple soul flame in chest; rusted greatsword; empty helm |
| **behavior** | Retains combat knowledge from life; commands lesser undead; challenges worthy opponents singly |
| **scale** | Human |
| **traits** | combat-knowledge, commands-undead, soul-flame |
| **drops** | soul-ember (B, 40%) · revenant-plate-fragment (B, 35%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0200 |
| **imagePath** | `assets/images/monsters/dusk-revenant.png` |
| **imagePrompt** | An undead knight illuminated by ghostly violet flames on an ancient battlefield, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Whisper Shade (`whisper-shade`)

| Field | Value |
|-------|--------|
| **category** | aberration |
| **threatRank** | C |
| **tier** | 3 |
| **habitat** | rift-zone, high-mana fractures |
| **appearance** | Faceless shadow humanoid; edges fray like smoke; no feet; voice like static |
| **behavior** | Mental attacks; induces hallucinations of lost people; avoids direct melee |
| **scale** | Human |
| **traits** | mental-attack, hallucination, intangible |
| **drops** | void-silk (C, 35%) · shade-fragment (C, 40%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0481 |
| **imagePath** | `assets/images/monsters/whisper-shade.png` |
| **imagePrompt** | A faceless shadow creature standing inside a reality fracture, realistic epic fantasy horror art, highly detailed, cinematic lighting, book illustration quality |

---

### Rift Hound (`rift-hound`)

| Field | Value |
|-------|--------|
| **category** | aberration |
| **threatRank** | D |
| **tier** | 2 |
| **habitat** | rift-zone, Ashford Undercity mid-floors |
| **appearance** | Wolf with fractured geometry; limbs misaligned; fur flickers between states |
| **behavior** | Phases short distances; hunts in pairs; drawn to rune light |
| **scale** | Large wolf |
| **traits** | phase-step, pair-hunter, rift-touched |
| **drops** | rift-shard (D, 35%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0028 |
| **imagePath** | `assets/images/monsters/rift-hound.png` |
| **imagePrompt** | A wolf with distorted geometry hunting in a fractured city, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Storm Roc (`storm-roc`)

| Field | Value |
|-------|--------|
| **category** | sky |
| **threatRank** | A |
| **tier** | 5 |
| **habitat** | mountain, storm-roc-mountains |
| **appearance** | Eagle-like; 40m wingspan; storm clouds in wake; lightning in primary feathers |
| **behavior** | Creates localized storms; controls wind; territorial over entire mountain range |
| **scale** | Building |
| **traits** | storm-creation, wind-control, territorial |
| **drops** | roc-plume (A, 40%) · beast-core-a (A, 20%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0086 |
| **imagePath** | `assets/images/monsters/storm-roc.png` |
| **imagePrompt** | A gigantic storm eagle flying through thunderclouds above ruined mountains, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Abyssal Maw (`abyssal-maw`)

| Field | Value |
|-------|--------|
| **category** | aquatic |
| **threatRank** | B |
| **tier** | 4 |
| **habitat** | coastal, deep-water, Abyssal Ocean margins |
| **appearance** | Gigantic shark; multiple tooth rows; bioluminescent green eyes |
| **behavior** | Ambush; extreme burst speed; blood-scent tracking over kilometers |
| **scale** | Whale shark |
| **traits** | ambush, extreme-speed, blood-scent |
| **drops** | abyssal-tooth (B, 50%) · beast-core-b (B, 25%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0350 |
| **imagePath** | `assets/images/monsters/abyssal-maw.png` |
| **imagePrompt** | A glowing abyssal sea predator emerging from dark ocean depths, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Clockwork Soldier (`clockwork-soldier`)

| Field | Value |
|-------|--------|
| **category** | construct |
| **threatRank** | B |
| **tier** | 4 |
| **habitat** | eternal-machine (dungeon-exclusive) |
| **appearance** | Bronze humanoid automaton; gear joints; red crystal eyes; law-glyphs etched on chest |
| **behavior** | Follows dungeon laws; punishes rule-breakers; precision formations |
| **scale** | Human |
| **traits** | precision, law-enforcement, construct |
| **drops** | bronze-gear (B, 60%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0400 |
| **imagePath** | `assets/images/monsters/clockwork-soldier.png` |
| **imagePrompt** | Bronze clockwork soldiers marching through a mechanical dungeon, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Forest Guardian (`forest-guardian`)

| Field | Value |
|-------|--------|
| **category** | magical |
| **threatRank** | A |
| **tier** | 5 |
| **habitat** | world-tree (dungeon-exclusive) |
| **appearance** | Tree-like humanoid; moss armor; glowing sap veins; antler branches |
| **behavior** | Protects World Tree levels; warns before attacking; regenerates while rooted |
| **scale** | Building |
| **traits** | regeneration, root-bind, life-magic |
| **drops** | life-sap (A, 40%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0600 |
| **imagePath** | `assets/images/monsters/forest-guardian.png` |
| **imagePrompt** | A massive tree humanoid guarding a colossal world tree branch, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Ember Dragon (`ember-dragon`)

| Field | Value |
|-------|--------|
| **category** | dragon |
| **threatRank** | S |
| **tier** | 5 |
| **habitat** | volcanic, active caldera |
| **appearance** | Red scales; furnace breath; intelligence in gold eyes; heat shimmer aura |
| **behavior** | Territorial; negotiates if respected; sleeps decades between hunts |
| **scale** | Building+ |
| **traits** | fire-breath, flight, ancient-intelligence |
| **drops** | dragon-scale-fragment (S, 15%) |
| **evolutionChain** | — (dragon lineages do not evolve via beast rules) |
| **firstAppearance** | ch-0003 |
| **imagePath** | `assets/images/monsters/ember-dragon.png` |
| **imagePrompt** | A colossal red dragon perched atop an active volcano, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Obsidian Dragon (`obsidian-dragon`) — Velkarion tier

| Field | Value |
|-------|--------|
| **category** | dragon |
| **threatRank** | SS |
| **tier** | 5 |
| **habitat** | unknown, celestial-peaks (species); individuals roam globally |
| **appearance** | Black scales like volcanic glass; gold eyes; wings darken sky; starlight caught in scale edges |
| **behavior** | Ancient intellect; observes civilizations; dragon morality — not human good/evil |
| **scale** | Mountain (individual); **Velkarion** — Dragon Lord — spans kilometers when fully manifested |
| **traits** | catastrophic-power, ancient-intellect, flight, mana-sovereignty |
| **drops** | obsidian-dragon-scale (SS, 5%) — virtually never from living elder |
| **evolutionChain** | — |
| **notes** | **Velkarion** is the apex individual of this lineage; see `03-antagonists.md`. Species template rank SS; Velkarion's actions register as Catastrophe-scale when engaged fully. |
| **firstAppearance** | ch-0721 (Velkarion); species referenced ch-0715 |
| **imagePath** | `assets/images/monsters/obsidian-dragon.png` |
| **imagePrompt** | An enormous obsidian dragon watching humanity from a mountain peak, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Mountain Walker (`mountain-walker`)

| Field | Value |
|-------|--------|
| **category** | titan |
| **threatRank** | SS |
| **tier** | 5 |
| **habitat** | mountain-range (singular or rare pairs) |
| **appearance** | 200m humanoid giant; stone skin; moss on shoulders; slow steps cause quakes |
| **behavior** | Territorial; ignores small creatures unless provoked; migration reshapes passes |
| **scale** | Skyscraper |
| **traits** | earthquake, near-indestructible, titan-scale |
| **drops** | titan-stone-heart (SS, 1%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0600 |
| **imagePath** | `assets/images/monsters/mountain-walker.png` |
| **imagePrompt** | A mountain-sized stone giant walking through clouds, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### World Serpent (`world-serpent`)

| Field | Value |
|-------|--------|
| **category** | titan |
| **threatRank** | Catastrophe |
| **tier** | 5 |
| **habitat** | unknown (horizon-visible; possibly extra-dimensional) |
| **appearance** | Planetary-scale serpent; visible on horizon; scales like moving continents |
| **behavior** | Reality disturbance; ancient existence; no confirmed hunting pattern |
| **scale** | Planetary |
| **traits** | reality-disturbance, catastrophe-presence |
| **drops** | — (no confirmed harvest) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0900 |
| **imagePath** | `assets/images/monsters/world-serpent.png` |
| **imagePrompt** | A colossal serpent encircling the horizon beneath a fractured sky, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Memory Wraith (`memory-wraith`)

| Field | Value |
|-------|--------|
| **category** | aberration |
| **threatRank** | B |
| **tier** | 4 |
| **habitat** | forgotten-palace (dungeon-exclusive) |
| **appearance** | Translucent human shapes; faces shift between strangers |
| **behavior** | Steals short-term memories on touch; flees when named correctly |
| **scale** | Human |
| **traits** | memory-theft, intangible |
| **drops** | memory-glass-shard (B, 50%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0129 |
| **imagePath** | `assets/images/monsters/memory-wraith.png` |
| **imagePrompt** | Translucent wraiths with shifting faces in a white misty palace, realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality |

---

### Hive Soldier (`hive-soldier`)

| Field | Value |
|-------|--------|
| **category** | insect |
| **threatRank** | A |
| **tier** | 5 |
| **habitat** | crimson-hive (dungeon-exclusive) |
| **appearance** | Human-sized insect warrior; crimson chitin; acid claws; hive-mark carapace |
| **behavior** | Coordinated assault; adapts to tactics after repeated exposure |
| **scale** | Human |
| **traits** | hive-mind, acid, adaptation |
| **drops** | hive-acid-sac (A, 50%) |
| **evolutionChain** | — |
| **firstAppearance** | ch-0500 |
| **imagePath** | `assets/images/monsters/hive-soldier.png` |
| **imagePrompt** | Crimson insect warriors in organic tunnels, realistic epic fantasy horror art, highly detailed, cinematic lighting, book illustration quality |

---

## Remaining seed species (summary index)

| id | name | category | threatRank | firstAppearance |
|----|------|----------|------------|-----------------|
| glimmer-rat | Glimmer Rat | beast | E | ch-0012 |
| mud-stalker | Mud Stalker | beast | D | ch-0034 |
| ironhorn | Ironhorn | beast | C | ch-0185 |
| cinder-hound | Cinder Hound | beast | C | ch-0300 |
| plague-crow | Plague Crow | sky | E | ch-0018 |
| skymanta | Skymanta | sky | C | ch-0400 |
| sky-serpent | Sky Serpent | sky | A | ch-0600 |
| frost-dragon | Frost Dragon | dragon | S | ch-0715 |
| leviathan-serpent | Leviathan Serpent | aquatic | SS | ch-0500 |
| deep-one | Deep One | aquatic | A | ch-0500 |
| eye-of-the-void | Eye of the Void | aberration | A | ch-0500 |
| forgotten-knight | Forgotten Knight | undead | C | ch-0125 |
| echo-servant | Echo Servant | aberration | C | ch-0130 |
| gear-beast | Gear Beast | construct | A | ch-0410 |
| shadow-citizen | Shadow Citizen | aberration | B | ch-0550 |
| twilight-stalker | Twilight Stalker | aberration | B | ch-0550 |
| brood-hunter | Brood Hunter | insect | B | ch-0500 |
| stoneback | Stoneback | beast | C | ch-0292 |

Full field data for all rows: **`seed/monsters.json`**.

---

## Visual standard

Every species entry in seed and prose must include:

```
id / threatRank / tier / habitat / appearance / behavior / scale /
traits / drops / evolutionChain / firstAppearance / imagePath / imagePrompt
```

Append to all image prompts: *realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality*

Avoid: anime, cartoon, chibi, low-detail game assets.
