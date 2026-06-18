# Magic & Mana System — Reference Encyclopedia

Canonical mechanics for Awakening, spells, runes, guild licenses, and progression. Machine-readable skills: **`seed/skills.json`**. Equipment alignment: **`22-equipment-loot-and-ranks.md`**.

---

## Core philosophy

Magic is **not a superpower** — it is a force of nature. Every creature interacts with mana; most do not understand it. Power without understanding is unstable. Every use creates consequences.

---

## The three laws of mana

1. **Mana cannot be created or destroyed** — only transformed.
2. **Power without understanding is unstable** — smarter beats stronger.
3. **Every use creates consequences** — exhaustion, corruption, instability, environmental impact.

---

## Mana density zones

| Zone | Description | Typical locations |
|------|-------------|-------------------|
| Low | Pre-Rapture baseline | Rare after Day 0 |
| Moderate | Settlement-safe with precautions | Sanctuary core, walled towns |
| High | Accelerated mutation, Awakening | Monster lands, dungeon entrances |
| Extreme | Reality strain, corruption risk | Titan territories, rift cores, Limbo |

**Mana vision:** Leon Hale, advanced mages, dragons — perceive mana as color, pressure, or geometric distortion.

---

## Human Awakening

**Factors:** genetics, environment, experience, trauma, training, luck.  
**Rule:** No chosen one. No protagonist privilege. Cassian's spatial affinity is rare, not destiny.

### Affinity tiers

| Tier | Examples |
|------|----------|
| Elemental | Fire, Water, Earth, Wind, Lightning, Ice, Metal, Wood, Light, Shadow |
| Advanced | Rune, Healing, Gravity, Sound, Dream, Beast, Poison, Crystal, Blood, **Spatial**, Temporal |
| Rare | Void, Fate, Soul, Creation, Entropy, Dimensional |

### Natural growth chains (examples)

| Base | Evolution path |
|------|----------------|
| Wind | Storm → Tempest → Sky Dominion |
| Healing | Life → Vitality → **World Bloom** (Elena, late saga) |
| Fire | Ember → Inferno → Dragonfire (contract-assisted) |
| Spatial | Pocket → Fold Step → Portal → **Reality Stitch** (Cassian) |

---

## Mastery ranks (informal)

| Rank | Description |
|------|-------------|
| Novice | Unreliable; high mana waste |
| Apprentice | Consistent basic effects |
| Adept | Combat-ready; named technique |
| Master | Teaches others; dungeon-viable solo |
| Grandmaster | Regional reputation; rune innovation |
| Legend | National asset; story-tier |
| Transcendent | Limbo / cycle-tier only |

---

## Explorer Guild license ranks

Licenses gate dungeon access and trade in regulated nations. See **`22-equipment-loot-and-ranks.md`** for full clearance table.

| License | Requirement | Clearance |
|---------|-------------|-----------|
| Copper | Awakening + survival course | F–E zones |
| Iron | 10 documented kills | E–D |
| Silver | Party clear of Minor dungeon | D–C |
| Gold | Solo or lead clear Floor 15+ Major | C–B |
| Platinum | Regional commendation | B–A |
| Mythril | Legacy dungeon partial clear | A–S |
| Adamant | Council nomination only | S+ |
| Sanctuary Class | Founder council vote | Diplomatic + combat |

**Nora Winters** holds **Adamant** by Volume 7. **Cassian Reed** never pursues paper rank — founder influence exceeds license.

---

## Named skills catalog

Full machine-readable list: **`seed/skills.json`**. Key techniques below.

### Cassian Reed — Spatial line

| id | Name | Rank | Unlock | Description |
|----|------|------|--------|-------------|
| `spatial-pocket` | Spatial Pocket | D | ch-0039 | Store objects in folded space; volume limited by understanding |
| `fold-step` | Fold Step | C | ch-0153 | Short-range teleport; line-of-sight required |
| `reality-stitch` | Reality Stitch | S | ch-1100 | Mend localized fractures; Seventh Gate stabilization |

**Rule:** Mastered through **study** (Marcus, rune texts, dungeon observation), not destiny.

### Elena Hale — Healing line

| id | Name | Rank | Description |
|----|------|------|-------------|
| `lifefire-touch` | Lifefire Touch | B | Powerful healing; costs healer vitality or borrowed life |
| `world-bloom` | World Bloom | S | Legendary field heal; costs years of vitality (ch-0800+) |

### Adrian Hale — Guardian line

| id | Name | Rank | Unlock | Description |
|----|------|------|--------|-------------|
| `guardian-stance` | Guardian Stance | C | ch-0200 | Defensive posture amplifying ally protection |

### Rowan Hale — Earth line

| id | Name | Rank | Unlock | Description |
|----|------|------|--------|-------------|
| `iron-wall` | Iron Wall | C | ch-0300 | Temporary earth barrier; firefighter instinct channel |

### Nora Winters — Scout line

| id | Name | Rank | Unlock | Description |
|----|------|------|--------|-------------|
| `horizon-sight` | Horizon Sight | B | ch-0400 | Extended visual range; maps terrain anomalies |

### Marcus Vale — Rune line

| id | Name | Rank | Unlock | Description |
|----|------|------|--------|-------------|
| `rune-light` | Rune Light | E | ch-0210 | Persistent illumination; Sanctuary infrastructure base |
| `dragon-breath-resist` | Dragon Breath Resist | A | — | Rune plating vs elemental dragon breath |

### Guild-common techniques

| id | Name | Rank | Affinity | Notes |
|----|------|------|----------|-------|
| `ember-strike` | Ember Strike | E | Fire | Iron Guild staple |
| `storm-call` | Storm Call | C | Lightning | Requires storm crystal focus |
| `memory-ward` | Memory Ward | B | Memory | Forgotten Palace expeditions |
| `beast-call` | Beast Call | B | Beast | Voluntary contract only |
| `void-step` | Void Step | A | Void | Forbidden; corruption risk |
| `tempest-wing` | Tempest Wing | A | Wind | Storm drake contract |
| `pack-hunter-instinct` | Pack Hunter Instinct | D | Beast | Passive; contract bonus |

### Skill tomes

Bound manuals teach named skills. Rank matches technique. Illegal copies circulate in warlord territories. Sanctuary Academy (Arthur Wren) catalogs verified tomes.

---

## Spell creation mechanics

**Process:** Intent → Mana Control → Shape → Effect  
**Example:** Fire + Sphere + Acceleration = Fireball

Custom spells require: affinity alignment, repetition, failure tolerance, and often a focus object (crystal, rune plate, contract bond).

---

## Mana channels

Comparable to veins. **Channel damage** from overuse, corruption, injury. Healing possible but difficult. Elena's Lifefire can mend channels at personal cost.

---

## Runes

Symbols influencing mana flow. Applications: weapons, armor, buildings, vehicles, barriers, infrastructure.

**Key practitioners:** Marcus Vale, Elian (Academy), Sanctuary engineers.

**Rune Light** is the first rune Sanctuary deploys at scale — proof that magic can rebuild civilization, not only fight monsters.

---

## Artifacts vs equipment

| Type | Definition | Seed file |
|------|------------|-----------|
| Equipment | Craftable / droppable gear | `seed/equipment.json` |
| Artifacts | Story-bound relics with history | `seed/artifacts.json` |

Grades: Common → Uncommon → Rare → Epic → Legendary → Mythic → **World Relics**

---

## Contracts

Voluntary magical relationships: Beast · Spirit · Dragon (extremely rare).

**Rules:** Forced contracts are unstable. No slavery. No monster collection gameplay.

| Companion | Type | Holder | Introduce |
|-----------|------|--------|-----------|
| Whisper | Silver hawk | Nora Winters | Early Vol 2 |
| Tempest | Storm drake | Adrian Hale | Mid Age 2 |
| Bramble | Thorn beast | Lily Vale | Vol 5+ |
| Ash | Ironhorn variant | Atlas Hale | Ch ~845 |
| Lumen | Aether spirit | Cassian Reed | **Late** — do not rush |

---

## Dragon magic

Dragons **shape reality** — instinctive, ancient, powerful. Domains: Fire, Storm, Ice, Earth, Void, Ocean, Dream, Star.

**Velkarion** (`velkarion`) — obsidian dragon lord; ally/witness; not evil; dies Vol 20 stabilization.

---

## Dungeon magic

Each dungeon enforces its own laws: Memory, Time, Dream, Living, Machine. Entering = accepting rules. Violations trigger punishment (Clockwork Soldiers, memory loss, regret manifestations).

---

## Souls

Identity, memory, potential. Soul damage possible and extremely dangerous. Limbo destabilizes soul-bound magic.

---

## Corruption

**Causes:** void exposure, dungeon influence, emotional instability, forbidden magic, ancient artifacts.  
**Treatment:** possible; not guaranteed.

---

## Healing magic limits

Cannot create life. Cannot fully reverse death. Cannot solve every problem. Every miracle has a price.

---

## Limbo magic

Domains: Memory · Distance · Identity · Possibility · Time distortion.  
**Time ratio:** 100 years inside / 3 years outside (Cassian arc, Vol 15–17).  
Understood by handful of beings including The Wanderer.

---

## Mana-Tech (Sanctuary)

| System | Description | First major deploy |
|--------|-------------|-------------------|
| Mana lights | Rune Light grid | Vol 6 |
| Rune vehicles | Ironhorn-drawn + engine hybrid | Vol 7 |
| Barrier networks | Settlement walls | Vol 8 |
| Communication arrays | Long-range signal | Vol 9 |
| Agricultural systems | Ironhorn + life runes | Vol 6 |
| Flying ships | Skymanta-assisted | Vol 10+ |

**Bronze Heart Engine** (Eternal Machine relic) accelerates Mana-Tech after Vol 12.

---

## Power ceiling

**No omnipotence** — not Cassian, not dragons, not ancient beings. Mystery, danger, and uncertainty persist through Vol 21.

---

## Progression philosophy (Fairy Tail / dungeon-manga alignment)

| Principle | Application |
|-----------|-------------|
| Skill > Power | Technique and teamwork beat raw rank |
| Knowledge > Strength | Dungeon rules beat brute force |
| Rank gates content | F-rank survivors cannot clear S-rank floors without arc growth |
| Named techniques | Readers remember **Fold Step**, not "teleport #3" |
| Loot has story | Memory Shard hurts; Skybreaker chooses Darius |

---

## Author consistency rules

Never introduce magic that solves every problem. Never break established rules. When uncertain: **consistency over spectacle**. Register new skills in `seed/skills.json` before prose use.
