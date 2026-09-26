# Knowledge Base — Rapture Cycle

Canonical franchise bible for the **1200-chapter** post-apocalyptic fantasy series.

**Start here:** [INSTRUCTIONS.md](./INSTRUCTIONS.md)

## Core documents

| # | File | Purpose |
|---|------|---------|
| — | [INSTRUCTIONS.md](./INSTRUCTIONS.md) | AI/author rules, workflow, non-negotiables |
| 00 | [series-bible](./00-series-bible.md) | Pitch, length, pacing, romance & antagonist contracts |
| 01 | [premise-and-pacing](./01-premise-and-pacing.md) | Themes, Walking Dead model |
| 02 | [main-cast](./02-main-cast.md) | Protagonists, POV rotation |
| 02b | [supporting-cast](./02b-supporting-cast.md) | Extended cast, founders, Limbo era |
| 03 | [antagonists](./03-antagonists.md) | Layered threats (no Dark Lord) |
| 04 | [world-bible](./04-world-bible.md) | Rapture, mana, ecology, civilizations |
| 04b | [locations-encyclopedia](./04b-locations-encyclopedia.md) | Place IDs, regions, Vol 1 location registry |
| 05 | [monster-encyclopedia](./05-monster-encyclopedia.md) | Threat ranks, species framework |
| 06 | [dungeon-bible](./06-dungeon-bible.md) | Major dungeons, rules, rewards |
| 07 | [arc-roadmap](./07-arc-roadmap.md) | Three Ages, 18 macro arcs |
| 08 | [image-bible](./08-image-bible.md) | Visual prompts, color language |
| 09 | [factions-and-nations](./09-factions-and-nations.md) | Human & non-human factions |
| 10 | [magic-and-mana-system](./10-magic-and-mana-system.md) | Laws, affinities, limits |
| 11 | [artifacts-relics-treasures](./11-artifacts-relics-treasures.md) | World relics, legendary gear |
| 12 | [history-and-timeline](./12-history-and-timeline.md) | Great Ages, mysteries |
| 13 | [races-species-cultures](./13-races-species-cultures.md) | Non-human civilizations |
| 14 | [religions-beliefs-mythology](./14-religions-beliefs-mythology.md) | Faiths, myths, holidays |
| 15 | [companions-beast-contracts](./15-companions-beast-contracts.md) | Bonded beasts |
| 16 | [sanctuary-complete-bible](./16-sanctuary-complete-bible.md) | City districts, government |
| 17 | [romance-roadmap](./17-romance-roadmap.md) | Cassian/Adrian slow burn |
| 18 | [writing-style-guide](./18-writing-style-guide.md) | Novel prose only |
| 19 | [master-outline](./19-master-outline.md) | 21 volumes @ 1200 chapters |
| 20 | [chapter-template](./20-chapter-template.md) | Per-chapter planning fields |
| 21 | [encyclopedia-rules](./21-encyclopedia-rules.md) | App/seed entity schemas |
| 22 | [equipment-loot-and-ranks](./22-equipment-loot-and-ranks.md) | Gear grades, materials, guild licenses |
| 24 | [chapter-progress-and-continuity](./24-chapter-progress-and-continuity.md) | Published canon, repeat prevention |

## Volume outlines (21)

[`volumes/`](./volumes/) — `VOLUME_01_THE_SKY_BREAKS.md` through `VOLUME_21_THE_EIGHTH_CYCLE.md`

## Seed data

Machine-readable mirror: [`../seed/`](../seed/)

```bash
npm run seed:manifest      # 1200-chapter manifest from arcs.json
npm run seed:vol-01        # Volume 1 outline JSON
npm run seed:encyclopedia  # monsters, equipment, artifacts, dungeons, skills, chapter-progress
```

**Image assets:** Generate illustrations from `imagePrompt` fields; save to `assets/images/{category}/{id}.png` paths declared in each entry.

## Prose

Published chapters: [`../content/chapters/`](../content/chapters/) — **do not write chapters without updating volume outline + manifest first.**
