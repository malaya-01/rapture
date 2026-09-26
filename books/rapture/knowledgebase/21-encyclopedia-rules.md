# Encyclopedia & App Data Rules

## Purpose

The reader app's encyclopedia, timeline, relationships, and future illustrations must stay **consistent** with `knowledgebase/` and `seed/`.

## Entity ID convention

- Characters: `firstname-lastname` (e.g. `cassian-reed`)
- Factions: `kebab-case` (e.g. `iron-dominion`)
- Locations: `kebab-case` (e.g. `sanctuary-valley`)
- Monsters: `kebab-case` (e.g. `ashwolf`)
- Dungeons: `kebab-case` (e.g. `forgotten-palace`)
- Artifacts: `kebab-case` (e.g. `compass-of-horizons`)
- Chapters: `ch-XXXX` (zero-padded 4 digits)

## Spoiler gating

`relationships.json` and timeline entries use `minChapter` — hide until reader progress ≥ that chapter.

## Encyclopedia entry schema (seed)

```json
{
  "id": "ashwolf",
  "name": "Ashwolf",
  "category": "monster",
  "threatRank": "E",
  "description": "...",
  "firstAppearance": "ch-0008",
  "imagePrompt": "...",
  "tags": ["beast", "pack-hunter", "fire"]
}
```

## Image prompt standard (all visual entities)

Append to every prompt:

> realistic epic fantasy art, highly detailed, cinematic lighting, book illustration quality

Avoid: anime, cartoon, chibi, low-detail game assets.

**Content maturity (18+):** Illustrations follow `23-content-maturity-rating.md` — honest combat/hazard; tasteful romance; no explicit sexual content.

## Location entry fields

```
name, region, description, visual_prompt, landmarks,
dominant_species, danger_level, story_importance
```

## Monster entry fields

```
species, threat_rank, appearance, traits, habitat,
behavior, scale_reference, image_prompt, evolution_chain
```

## Dungeon entry fields

```
name, classification, theme, floors, appearance, ecosystem,
dominant_monsters, rules, sovereign, reward, visual_prompt,
story_significance, failure_stages
```

## When to add encyclopedia entries

Add to seed **when entity first appears in outline**, not when prose is written. Update description if prose reveals more.

## Codex-before-prose (locked)

Chapter generation must not reference entities missing from seed. See `24-chapter-progress-and-continuity.md` for the full checklist. Run `npm run seed:sync` after any seed edit so the reader codex matches.

## Sync to app

`src/data/*.ts` is compiled from seed for demo; long-term: build script `npm run seed:compile`.
