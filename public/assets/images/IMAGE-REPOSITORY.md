# Rapture Image Repository

**Generated:** 2026-06-18T14:11:46.656Z

## Folder structure

```
public/assets/images/
├── characters/     # Main, supporting, antagonist portraits — {id}.png
├── disciples/      # Limbo disciples — disciple-{name}.png
├── companions/     # Beast contracts — {id}.png
├── monsters/       # Bestiary — {id}.png
├── artifacts/      # Relics and legendary items — {id}.png
├── dungeons/       # Dungeon establishing shots — {id}.png
├── locations/      # World locations — {id}.png
├── factions/       # Faction banners/strongholds — {id}.png
├── magic/          # Spell/skill illustrations — {id}.png
├── timeline/       # Chronicle event art — {id}.png
└── scenes/         # Chapter scene art — ch-{number}-{slug}.png
```

## Naming convention

| Category | Pattern | Example |
|----------|---------|---------|
| Character | `{character-id}.png` | `cassian-reed.png` |
| Monster | `{monster-id}.png` | `grave-walker.png` |
| Artifact | `{artifact-id}.png` | `skybreaker.png` |
| Dungeon | `{dungeon-id}.png` | `forgotten-palace.png` |
| Scene | `ch-{####}-{slug}.png` | `ch-0001-harbor.png` |

## Image format (mandatory)

- **Orientation:** Landscape only — **16:9** (characters, artifacts, monsters, magic) or **21:9** (locations, dungeons, timeline).
- **Never** portrait/vertical or square.
- **Characters:** Front-facing toward viewer — not side profile.
- **Monsters & artifacts:** Multi-view reference sheet layout on one horizontal canvas (front, side, three-quarter, detail).

## Workflow

1. Open any Codex/Bestiary card and click the **ℹ** icon for the full generation prompt.
2. Generate image (external tool).
3. Save to the folder above using the exact filename from the **Image Repository** page (`/images`).
4. Run `npm run seed:sync` — manifest auto-updates `present` / `missing` status.

## Stats

- **Total entries:** 369
- **Present:** 82
- **Missing:** 287
