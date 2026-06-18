# Seed Data — Rapture Cycle

Machine-readable canon for tooling, chapter generation, and app compilation.

**Must stay in sync with `knowledgebase/`.** Read `knowledgebase/INSTRUCTIONS.md` first.

## Files

| File | Description |
|------|-------------|
| `book.json` | Series metadata (1200 chapters, 21 volumes) |
| `arcs.json` | Ages, 21 volumes, 18 macro arcs |
| `characters.json` | Core + supporting cast with IDs |
| `factions.json` | Human & non-human factions |
| `locations.json` | Regions, cities, territories |
| `monsters.json` | Encyclopedia entries + threat ranks |
| `dungeons.json` | Major dungeons |
| `artifacts.json` | Relics & legendary items |
| `relationships.json` | Graph edges with `minChapter` spoiler gates |
| `companions.json` | Beast contracts (Ash, Whisper, Tempest, etc.) |
| `disciples.json` | Limbo disciples (founder mirrors) |
| `skills.json` | Magic skills and spells |
| `chapter-manifest.json` | **All 1200 chapters** (auto-generated) |
| `outlines/vol-XX.json` | Hand-written per-volume synopses (expand as written) |

## Commands

```bash
npm run seed:manifest    # Regenerate chapter-manifest.json from arcs.json
npm run seed:vol-01      # Regenerate vol-01 outline JSON from volume MD
npm run seed:encyclopedia # Regenerate monsters/artifacts/dungeons seed from bible
npm run seed:sync        # Sync seed → src/data + image manifest (run after KB edits)
```

## Chapter status flags

| Status | Meaning |
|--------|---------|
| `seed` | Auto title/synopsis from volume template |
| `outlined` | Hand beats in `outlines/` or volume MD |
| `draft` | Prose in `content/chapters/` |
| `published` | Live in reader app (`src/data/chapters.ts`) |

## Workflow

1. Edit bible in `knowledgebase/volumes/`
2. Update `seed/outlines/` for active volume
3. Run `npm run seed:manifest`
4. Write prose → update status
5. Optional: `npm run seed:compile` (future) → `src/data/`

## ID conventions

See `knowledgebase/21-encyclopedia-rules.md`.
