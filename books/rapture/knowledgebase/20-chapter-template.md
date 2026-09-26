# Chapter Template & Architecture

## Per-chapter planning fields

Every chapter outline (in `volumes/` or `seed/outlines/`) must define:

| Field | Description |
|-------|-------------|
| `chapter` | Global number 1–1200 |
| `title` | Unique within volume |
| `pov` | Single primary POV (multi-POV chapters: list ordered) |
| `location` | Primary setting ID(s) from `seed/locations.json` — see `04b-locations-encyclopedia.md` |
| `characters` | Present cast (IDs) |
| `objective` | What POV character wants this chapter |
| `conflict` | What prevents it |
| `character_growth` | How the person changes |
| `worldbuilding` | New rules/lore introduced (if any) |
| `foreshadowing` | Seeds planted (reference bible section) |
| `ending_hook` | Last beat that pulls reader forward |

## Word targets

| Metric | Value |
|--------|-------|
| Words per chapter | 1,800–2,400 |
| Preferred | ~2,100 |
| Pages (reader app) | 4–8 prose blocks |

## Volume internal structure (100-chapter volumes)

For volumes with 80+ chapters, use five segments:

| Segment | Local chapters | Purpose |
|---------|----------------|---------|
| A — Setup | 1–20 | Establish arc conflict |
| B — First Impact | 21–45 | Escalation |
| C — Systems Response | 46–70 | World/cast adapts |
| D — Personal Climax | 71–90 | Character peak or break |
| E — Volume Bridge | 91–end | Resolution + hook to next volume |

Shorter volumes (30–40 ch) use three acts: Setup / Confrontation / Resolution.

## Arc obligations

Every major arc must advance **all four**:

1. Character development  
2. Relationships  
3. Worldbuilding  
4. Plot  

No arc may exist solely for combat or power growth.

## Prose structure (literary novel)

- Open with **grounded sensory detail** in POV character's perception  
- Integrate dialogue into paragraphs — no script labels  
- Scene breaks: `* * *` only when time/place jumps significantly  
- End on **emotion or question**, not summary  
- One chapter = one primary dramatic unit (may contain 2–3 scenes)

## Chapter markdown format (`content/chapters/ch-XXXX.md`)

Prose lives in markdown. Run `npm run seed:chapters` (or `seed:sync`) to compile into the reader.

### Frontmatter (YAML)

```yaml
---
chapter: 1
title: "Chapter Title"
volume: 1
summary: "One-line synopsis for opening illustration context"
opening:
  id: ch-0001-opening
  placement: wide          # full | wide | center | float-left | float-right | flow-left | flow-right
  orientation: landscape   # landscape | portrait | square
  title: Optional caption title
  caption: Optional caption
---
```

### Inline figures

Place on its own line anywhere in the body:

```
@figure{id=ch-0001-harbor placement=flow-right orientation=portrait title="Scene Title" subtitle="Setting" caption="Caption text"}
```

| placement | layout |
|-----------|--------|
| `wide` / `full` | Full-width block (21:9 / 16:9) |
| `center` | Centered block |
| `float-left` / `float-right` | CSS float — text wraps |
| `flow-left` / `flow-right` | **Pretext** line-by-line wrap around image |

Scene breaks: `---` on its own line.

## Content maturity (18+)

Chapters are **adult fiction**. Do not plan around sanitizing violence, gore, survival horror, or earned romantic physicality. See `23-content-maturity-rating.md`.

## Status lifecycle (`chapter-manifest.json`)

```
seed → outlined → draft → published
```

- **seed**: auto-generated title/synopsis from volume template  
- **outlined**: hand-written beats in `outlines/vol-XX.json`  
- **draft**: prose exists in `content/chapters/`  
- **published**: synced to reader app

## Example (Volume 2, Chapter 31)

```yaml
chapter: 31
title: Empty Streets
pov: Cassian Reed
location: ashford
characters: [cassian-reed]
objective: Leave apartment; learn if anyone else survived
conflict: City unrecognizable; no rescue infrastructure
character_growth: Passive loneliness → active survival decisions
worldbuilding: Power grid dead; mana visible in fracture lines
foreshadowing: [limbo-symbols-in-graffiti]
ending_hook: Fresh footprints in dust leading upward
```
