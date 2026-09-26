# Echoes of the Void — Author & AI Generation Instructions

**Read this file before writing any chapter, outline, or seed entry.**

## Project identity

| Field | Value |
|-------|-------|
| Series | **Echoes of the Void** |
| Subtitle | The Omega Who Became the End |
| Genre | Dark fantasy, omegaverse, time-loop tragedy, political intrigue, MM mpreg |
| **Audience** | **Adult (18+)** — see `05-content-maturity-rating.md` |
| Target length | **360 chapters** (~1.8M+ words) across **8 volumes** |
| Model | *Game of Thrones* ensemble + *Harry Potter* mage craft + *Overlord* Skill progression |
| Romance | Elarion Voss (omega) + rotating Prince pairings across loops — earned, never destiny |

## Non-negotiable rules

1. **Elarion starts average.** No unique void power at birth. The End is earned through loops, death, and betrayal.
2. **Time loops are Elarion's secret alone.** Reset to Academy arrival day. No one else remembers.
3. **Mages and Skill users are separate paths.** Never give a mage Skills or a warrior spellcasting.
4. **Romance biology is strict.** See `04-omegaverse-rules.md`. No omega–omega or alpha–alpha romance.
5. **No underage explicit content.** Academy begins at 17; romantic/sexual content only at 18+.
6. **Ensemble cast.** All 10 mains (5 omegas + 5 princes) get equal depth across volumes.
7. **One POV per chapter.** No head-hopping. Deep scenes, never rushed summaries.
8. **Outline one volume → write → update bible.** Never outline all 360 chapters before writing Vol 1.

## Document hierarchy

```
INSTRUCTIONS.md              ← you are here
00-series-bible.md
01-premise-and-pacing.md
02-main-cast.md
03-magic-and-skills.md
04-omegaverse-rules.md
05-content-maturity-rating.md
20-chapter-template.md
volumes/VOLUME_XX_*.md       ← per-volume chapter beats
```

## Seed data (`seed/echoes-of-the-void/`)

```bash
npm run seed:manifest -- --book echoes-of-the-void
npm run seed:chapters -- --book echoes-of-the-void
npm run seed:sync
```

## Master generation prompt

See `../MASTER-NOVEL-PROMPT.md` for the full LLM prompt used to generate prose chapter by chapter.
