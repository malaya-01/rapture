# Rapture: The Fractured Sky

Premium immersive novel reader and world codex for the **Rapture** saga (Cycle Seven).

## Features

- **Immersive scroll reader** — Pretext flow figures, auto-save, restore on return, per-chapter URLs (`/read/ch-0001`)
- **Reader settings** — Font size, line width, sepia/paper themes, reduced motion, progress export/import
- **Library** — All 1,200 chapters from manifest (locked until published + compiled)
- **World Codex** — Characters, equipment, artifacts, dungeons, factions, magic (with detail pages)
- **Spoiler gates** — Relationships and codex entries respect `minChapter` / `firstAppearance`
- **18+ maturity gate** — Adult content notice on first visit
- **Bestiary, map, chronicle, lore network** — Illustrated encyclopedia with image prompt workflow
- **PWA** — Web manifest + basic offline shell

## Tech Stack

- Next.js 16 (App Router)
- TypeScript, Tailwind CSS v4, Framer Motion, Zustand

## Getting Started

```bash
npm install
cp .env.example .env.local   # optional — set NEXT_PUBLIC_SITE_URL for production
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Seed pipeline

```bash
npm run seed:manifest      # after arcs.json changes
npm run seed:encyclopedia  # monsters, equipment, artifacts, dungeons, skills
npm run seed:chapters      # compile content/chapters/*.md
npm run seed:sync          # chapters + full app data sync
npm run seed:audio         # placeholder ambience WAV files (optional)
```

## Project structure

```
content/chapters/     # Prose source (ch-XXXX.md)
seed/                 # Machine-readable canon JSON
knowledgebase/        # Story bible & outlines
src/app/              # Next.js routes
src/components/       # Reader, codex, map, UI
src/data/             # Generated from seed (do not hand-edit)
src/store/            # Reading progress (localStorage)
public/assets/        # Images, audio, sw.js
```

## Writing workflow

See `knowledgebase/INSTRUCTIONS.md`. After editing a chapter:

1. Save to `content/chapters/ch-XXXX.md`
2. Run `npm run seed:sync`
3. Set `status: published` in `seed/chapter-manifest.json` when ready

## Tests & CI

```bash
npm test        # vitest unit tests
npm run lint
npm run build
```

GitHub Actions runs lint, typecheck, test, and build on push/PR.

## Assets

- **Images:** `public/assets/images/` — see `/images` repository page
- **Audio:** `public/assets/audio/` — `library`, `rain`, `wind`, `fireplace`, `music` (mp3/ogg/wav)
