# The Hollow Canopy — Author & AI Generation Instructions

**Read this file before writing any chapter or seed entry.**

## Project identity

| Field | Value |
|-------|-------|
| Series | **The Hollow Canopy** |
| Subtitle | What the Rain Kept |
| Slug | `the-hollow-canopy` |
| Genre | BL romance, omegaverse, military thriller, supernatural mystery, archaeological expedition |
| **Audience** | **Adult (18+)** — see `05-content-maturity-rating.md` |
| Target length | **45 chapters**, about 100,000–140,000 words, **one complete novel** in five volumes (the five acts) |
| Romance | Major Calder Rhys (alpha, 32) and Dr. Ivo Maren (omega, 31). Adults only. Slow burn. Choice, not biology. |

## Non-negotiable rules

1. **Write prose, not outlines, in `content/chapters/`.** Chapter beats in `volumes/` are private scaffolding.
2. **Both protagonists are adults in every romantic scene.** School scenes are memory only: social cruelty, never sexual, never secretly romantic.
3. **Do not excuse the bullying.** Calder was immature and sometimes cruel. “I hurt you because I liked you” is forbidden.
4. **No pheromone coercion, no bond without consent, no heat as a shortcut to sex or love.**
5. **Ivo is not helpless. Calder is not emotionally stupid.** They are competent in different ways and wrong in different ways.
6. **The expedition plot must work without the romance.** The Marrow, the Selenqar, and Helix Meridian pay off on their own.
7. **One POV per chapter.** Deep scenes. Do not summarize the chapter you are writing.
8. **Track injuries, equipment, secrets, and who knows the childhood history.** Priya knows before Calder does. No one else does until Calder remembers, unless a chapter explicitly changes that.
9. **Forgiveness is partial and chosen.** Ivo does not forget. Calder does not get to rush him.
10. **Victories cost something.** The Bell is sealed. The cure they might have taken is refused.

## Document hierarchy

```
INSTRUCTIONS.md
00-series-bible.md          ← plot, mystery answer, ending (spoilers)
01-premise-and-pacing.md
02-main-cast.md
03-expedition-and-mystery.md
04-omegaverse-rules.md
05-content-maturity-rating.md
volumes/VOLUME_XX_*.md      ← chapter beats
```

## Seed

```bash
npm run seed:manifest -- --book the-hollow-canopy
npm run seed:chapters -- --book the-hollow-canopy
npm run seed:sync
```

Generation prompt: `../MASTER-NOVEL-PROMPT.md`.
