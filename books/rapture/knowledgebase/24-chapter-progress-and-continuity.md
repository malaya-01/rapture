# Chapter Progress & Continuity Tracker

**Purpose:** Prevent repeated beats, contradictions, and spoiled reveals during 1200-chapter generation. Update after every drafted chapter.

**Machine-readable mirror:** `seed/chapter-progress.json`  
**Prose files:** `content/chapters/ch-XXXX.md`

**Content tone:** Adult (18+) — do not retroactively sanitize violence, hazard, or earned romantic physicality in revisions. See `23-content-maturity-rating.md`.

---

## Status legend

| Status | Meaning |
|--------|---------|
| `planned` | Outlined in volume MD only |
| `draft` | Prose exists, not final |
| `published` | In reader app |
| `locked` | Canon fixed — do not retcon without bible amendment |

---

## Volume 1 progress (Ch 1–30)

**In-world day calendar (canonical):** `seed/outlines/vol-01.json` and `seed/chapter-manifest.json`

| Rule | Detail |
|------|--------|
| Day 0 | Chapter 1 — ordinary Tuesday morning; sky fractures by chapter end |
| Days 1–9 | Chapters 2–10 — Rapture week (family scatter, collapse, first broadcast) |
| Day 10 | **Unused** — intentional gap between Arc A and Arc B |
| Days 11–30 | Chapters 11–30 — first month; dungeon rises Ch 30 |

| Ch | Title | POV | Status | In-world day | Key canon locked |
|----|-------|-----|--------|--------------|-------------------|
| 1 | The Last Ordinary Morning | Cassian | **published** | 0 | Ashford harbor fracture; Cassian apartment; Mara from accounting; first monster glimpse (mutated dog); sky crease ending |
| 2 | The Sound Above | Rowan | planned | 1 | Hale family; something emerges from fracture |
| 3 | Falling Fire | Adrian | planned | 2 | Adrian/Selene; first dragon |
| 4 | When The World Ended | Multi | planned | 3 | Collapse; monsters on page |
| 5 | Day Zero | Marcus | planned | 4 | Iris, Lily; evacuation fails |
| 6 | The Photographer | Nora | planned | 5 | Wilderness POV; Whisper hawk |
| 7 | The First Night | Cassian | planned | 6 | First solo survival night |
| 8 | The Things In The Dark | Cassian | planned | 7 | First direct monster encounter |
| 9 | No Rescue Is Coming | Rowan | planned | 8 | Government/military fail |
| 10 | The Last Broadcast | Multi | planned | 9 | Ends: "We are alone." |
| 11 | Hunger | Cassian | planned | 11 | First week scarcity |
| 12 | The Gathering | Rowan | planned | 12 | Survivor cluster |
| 13 | Still Searching | Adrian | planned | 13 | Searching for family |
| 14 | Tracks | Nora | planned | 14 | Wilderness mapping |
| 15 | Notes | Marcus | planned | 15 | First mana observations |
| 16 | The Wait | Selene | planned | 16 | Abandonment fear seeds |
| 17 | Crossed Paths | Multi | planned | 17 | Paths cross, no reunion |
| 18 | First Blood | Adrian | planned | 18 | First deliberate kill |
| 19 | What We Lost | Elena | planned | 19 | Names the dead |
| 20 | Scattered Again | Multi | planned | 20 | Arc B closes |
| 21 | Leaving | Cassian | planned | 21 | Leaves Ashford; sanctuary seeds |
| 22 | The Road | Nora | planned | 22 | Shifting roads |
| 23 | Patterns | Marcus | planned | 23 | Territorial monsters |
| 24 | Letters Unsent | Selene | planned | 24 | Unsent messages |
| 25 | Smoke On The Horizon | Rowan | planned | 25 | Distant fires |
| 26 | The Quiet Between | Adrian | planned | 26 | Brief calm |
| 27 | Wrong Stars | Cassian | planned | 27 | Limbo foreshadow |
| 28 | Older Than Us | Nora | planned | 28 | Ancient ruin glimpse |
| 29 | The Earth Trembles | Multi | planned | 29 | Shared tremor |
| 30 | Beyond The Ruins | Multi | planned | 30 | First dungeon rises |

---

## Continuity locks (do not violate)

### Characters alive at Day 0 end (Ch 10)
Cassian, Rowan, Elena, Atlas, Leon, Adrian, Selene, Marcus, Iris, Lily, Nora — **all alive** unless chapter explicitly kills.

### Not yet met (as of Ch 1)
- Cassian ↔ Adrian (meet ~Ch 81)
- Cassian ↔ Selene (meet ~Ch 97)
- Viktor Drake (Ch ~404)
- Velkarion (Ch ~721)

### Not yet revealed (as of Ch 1)
- Mana named as "mana" (Ch ~35 Marcus)
- Awakenings widespread (Ch ~37–39)
- Dungeons named (Ch ~30 structure rises; enter ~Ch 120)
- Ancient civilization confirmed (Ch ~136)
- Seventh Gate (Ch ~590)

### Deaths registered
*(empty — update on first canon death)*

### Skills acquired
*(empty — update when first spell named)*

### Equipment acquired
*(empty — update on first gear)*

### Locations visited by Cassian
- Ch 1: Ashford apartment, logistics office, streets, alley, apartment window view

---

## Repeat prevention checklist (per new chapter)

- [ ] POV voice matches `02-main-cast.md`
- [ ] No character knows future lore
- [ ] Monster rank appropriate to survivor capability
- [ ] No duplicate "first time seeing X" unless flashback labeled
- [ ] Romance subtext rules (`17-romance-roadmap.md`)
- [ ] Update `seed/chapter-progress.json` when status changes
- [ ] Register new entities in seed + encyclopedia before reuse

---

## Codex-before-prose rule (chapter generation)

**Every named entity in prose must exist in seed before the chapter is published.**

Before writing or publishing a chapter, verify:

| If prose mentions… | It must exist in… |
|--------------------|-------------------|
| Monster species | `seed/monsters.json` |
| Gear, materials, consumables | `seed/equipment.json` |
| Relic, legendary item | `seed/artifacts.json` |
| Dungeon | `seed/dungeons.json` |
| Named spell / technique | `seed/skills.json` |
| Faction or nation | `seed/factions.json` |
| Place | `seed/locations.json` · `04b-locations-encyclopedia.md` |
| Person (speaking or named) | `seed/characters.json` or `seed/disciples.json` |
| Beast contract | `seed/companions.json` |

If a new entity is required: add to seed → `npm run seed:sync` → confirm in codex/bestiary → then reference in prose.

Do not invent off-book monsters, artifacts, or factions that readers cannot look up in the encyclopedia.

---

## History context log

Append one line per published chapter — **what the world learned**:

| Ch | World state delta |
|----|-------------------|
| 1 | Sky fractured over Ashford; dragons/monsters real; power/phones failing; Cassian alone in apartment |

---

## Foreshadowing registry (planted / paid off)

| Seed ID | Planted | Paid off | Description |
|---------|---------|----------|-------------|
| `limbo-wrong-stars` | Ch 27 (planned) | Vol 15 | Impossible constellations |
| `sanctuary-sites` | Ch 21+ (planned) | Vol 6 | Cassian notes defensible valleys |
| `selene-abandonment` | Ch 16 (planned) | Vol 11+ | Fear of replaceability |
