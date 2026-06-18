# Rapture — Author & AI Generation Instructions

**Read this file before writing any chapter, outline, or seed entry.**

## Project identity

| Field | Value |
|-------|-------|
| Series | **Rapture** (Cycle Seven) |
| Subtitle | The Fractured Sky |
| Genre | Post-apocalyptic fantasy, survival epic, slow-burn romance |
| **Audience** | **Adult (18+)** — see `23-content-maturity-rating.md` |
| Target length | **1200 chapters** (~2.4M words) |
| Model | *The Walking Dead* pacing + layered fantasy worldbuilding |
| Romance | Cassian Reed (omega) + Adrian Hale (alpha) — **earned**, not destiny |

## Non-negotiable rules

1. **No single Dark Lord.** Antagonists layer: tragic, human, monster lords, dungeon sovereigns, political rivals, ancient beings, emergent crisis (Seventh Gate / cycles).
2. **No chosen one.** Cassian masters spatial magic through study. No protagonist privilege.
3. **No screenplay format** in prose. See `18-writing-style-guide.md`.
4. **Apocalypse in Chapter 1.** Sky fractures by end of Ch 1. Collapse by Ch 3–4. Monsters Ch 4–5. Cast paths cross before Ch 20.
5. **Adrian + Cassian:** friendship ~Ch 81; romance late saga only. Selene/Adrian must read **real** for hundreds of chapters.
6. **Limbo is a character arc**, not a training arc. 100 years inside / 3 years outside.
7. **Final conflict is not good vs evil.** Competing civilizations choose the future. Seventh Gate = failsafe, not weapon.
8. **Contracts are voluntary.** No slavery, no monster collection.
9. **Magic has limits.** No omnipotent Cassian, dragons, or ancient beings.
10. **Outline one volume → write → update bible.** Never outline all 1200 chapters before writing Vol 1.
11. **Adult (18+) content honesty.** Violence, hazard, blood, and brutal consequences are written fully — not sanitized. Romance includes affection and kissing when earned; no explicit pornographic sex scenes. See `23-content-maturity-rating.md`.

## Content maturity (18+)

Rapture is **adult fiction**. Writers and agents must **not** hold back on:

- Gory or brutal combat, injury, death, and aftermath  
- Hazardous survival (starvation, infection, trauma, moral compromise)  
- Honest depiction of antagonist cruelty and monster predation  

**Do** write affection, physical closeness, and **kissing** when the relationship earns it (especially late saga). **Do not** write explicit sexual intercourse on page — imply or fade.

Full policy: **`23-content-maturity-rating.md`**

## Document hierarchy (read order)

```
INSTRUCTIONS.md          ← you are here
00-series-bible.md         ← pitch, length, contracts
01-premise-and-pacing.md
02-main-cast.md
02b-supporting-cast.md
03-antagonists.md
04-world-bible.md
05-monster-encyclopedia.md
06-dungeon-bible.md
07-arc-roadmap.md
08-image-bible.md
09-factions-and-nations.md
10-magic-and-mana-system.md
11-artifacts-relics-treasures.md
12-history-and-timeline.md
13-races-species-cultures.md
14-religions-beliefs-mythology.md
15-companions-beast-contracts.md
16-sanctuary-complete-bible.md
17-romance-roadmap.md
18-writing-style-guide.md
19-master-outline.md
20-chapter-template.md
21-encyclopedia-rules.md
22-equipment-loot-and-ranks.md
23-content-maturity-rating.md
24-chapter-progress-and-continuity.md
volumes/VOLUME_XX_*.md   ← per-volume chapter beats
```

## Seed data (`seed/`)

Machine-readable canon. **Must match** knowledgebase.

```bash
npm run seed:manifest      # after arcs.json changes
npm run seed:vol-01        # refresh vol-01 outline JSON
npm run seed:encyclopedia  # monsters, equipment, artifacts, dungeons, skills, chapter-progress
npm run seed:chapters      # compile content/chapters/*.md → src/data/chapters.ts
npm run seed:sync          # chapters + encyclopedia → app data + image prompts
```

| File | Purpose |
|------|---------|
| `book.json` | Series metadata |
| `arcs.json` | 21 volumes, chapter ranges, ages |
| `characters.json` | Full cast with IDs, roles, first appearance |
| `factions.json` | Human + non-human factions |
| `locations.json` | Regions, cities, waypoints — see `04b-locations-encyclopedia.md` |
| `monsters.json` | 63+ encyclopedia entries + threat ranks + drops |
| `dungeons.json` | 8 major dungeons with floor tables + loot |
| `artifacts.json` | Legendary items + world relics |
| `equipment.json` | Craftable / droppable gear by rank |
| `skills.json` | Named spells, runes, techniques |
| `chapter-progress.json` | Published chapters, continuity locks, foreshadowing |
| `relationships.json` | Graph edges with `minChapter` gates |
| `timeline.json` | In-world anchor events |
| `chapter-manifest.json` | All 1200 chapters (metadata) |
| `outlines/vol-XX.json` | Hand-written synopses per volume |

## Chapter generation workflow

1. Read `volumes/VOLUME_XX.md` for the chapter's beats.
2. Read POV character in `02-main-cast.md` / `02b-supporting-cast.md`.
3. Check `chapter-manifest.json` for number, title, synopsis, `inWorldDay`.
4. Cross-check magic (`10-`), monsters (`05-`), equipment (`22-`), skills (`seed/skills.json`), factions (`09-`) for consistency.
5. Check `24-chapter-progress-and-continuity.md` + `seed/chapter-progress.json` — do not repeat locked beats.
6. **Codex check:** every monster, item, location, faction, and named character in the chapter must already exist in `seed/` (see `24-chapter-progress-and-continuity.md` codex-before-prose rule).
7. Write prose to `content/chapters/ch-XXXX.md` with YAML frontmatter and `@figure{...}` directives (see `20-chapter-template.md`).
8. Run `npm run seed:chapters` or `npm run seed:sync` to compile markdown → reader.
9. Set manifest `status`: `seed` → `outlined` → `draft` → `published`.
10. Update `chapter-progress.json` when publishing.
11. Sync to `src/data/chapters.ts` when publishing to reader app.

**Chapter synopses:** Use `seed/outlines/vol-XX.json` or `knowledgebase/volumes/VOLUME_XX_*.md` — not the generic manifest fallback for outlined volumes.

**In-world days:** Canonical per-chapter days live in `seed/outlines/vol-XX.json` and `seed/chapter-manifest.json`. Vol 1: Ch1=day0, Ch2–10=days1–9, day10 unused, Ch11–30=days11–30.

## Chapter YAML frontmatter (required)

```yaml
---
chapter: 42
title: "Empty Streets"
pov: Cassian Reed
volume: 2
arc: "Alone"
in_world_day: 34
characters: [cassian-reed]
locations: [ashford]
status: draft
---
```

## Chapter planning template (outline only — never in prose)

```yaml
chapter: 42
title: Empty Streets
pov: Cassian Reed
location: Ashford ruins
characters: [cassian-reed]
objective: Leave apartment; assess city
conflict: No authorities; first signs of other survivors
character_growth: Isolation becomes actionable survival
worldbuilding: Mana saturation visible in cracks
foreshadowing: []
ending_hook: Evidence someone survived nearby
```

## POV rotation (Volumes 1–3)

Never single-POV for 40+ consecutive chapters. Core rotation:

Cassian · Rowan · Adrian · Marcus · Nora · Selene · Elena (secondary)

## Revelation budget

| Story phase | Chapters | Truth revealed |
|-------------|----------|----------------|
| Early | 1–350 | ~10% |
| Mid | 351–850 | ~40% |
| Late | 851–1100 | ~80% |
| Ending | 1101–1200 | ~90% — mystery survives |

## Sellability checklist

- Hook Ch 1 (sky breaks)
- Ensemble cast with distinct survival philosophies
- Clear progression: survival → camp → settlement → nation → world
- Emotional investment in Sanctuary before wars destroy parts of it
- Romance payoff for long-term readers without hijacking plot
- Franchise bible supports 1200 chapters without filler arcs

## What NOT to do

- Pad chapters to hit count
- Introduce ancient evil as final answer
- Rush Selene's fall or Adrian/Cassian romance
- Write dungeons as cave → boss → loot only
- Make Viktor cartoonishly evil
- Use alpha/omega politics as main plot engine
- Break established magic rules for spectacle
- **Sanitize violence, gore, or survival horror** to make chapters “safer”
- **Skip earned romantic physicality** (affection, kisses) out of undue caution
- Write **explicit pornographic sex** on page
