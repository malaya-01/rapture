<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Aether Vale Digital Library — project context for agents

This repo hosts **multiple book series** in one reading app.

## Books

| Series | Slug | Bible | Prose | Seed |
|--------|------|-------|-------|------|
| **Rapture** | `rapture` | `books/rapture/knowledgebase/INSTRUCTIONS.md` | `books/rapture/content/chapters/` | `books/rapture/seed/` |
| **Echoes of the Void** | `echoes-of-the-void` | `books/echoes-of-the-void/knowledgebase/INSTRUCTIONS.md` | `books/echoes-of-the-void/content/chapters/` | `books/echoes-of-the-void/seed/` |
| **The Hollow Canopy** | `the-hollow-canopy` | `books/the-hollow-canopy/knowledgebase/INSTRUCTIONS.md` | `books/the-hollow-canopy/content/chapters/` | `books/the-hollow-canopy/seed/` |

Registry: `seed/books.json` → `src/data/books-registry.ts`

## Rapture (primary)

**Story bible:** `books/rapture/knowledgebase/INSTRUCTIONS.md` (read first)  
**Content rating:** `books/rapture/knowledgebase/23-content-maturity-rating.md`  
**Chapter outlines:** `books/rapture/knowledgebase/volumes/VOLUME_XX_*.md`  
**Seed data:** `books/rapture/seed/` — run `npm run seed:manifest` after editing `arcs.json`  
**Prose:** `books/rapture/content/chapters/ch-XXXX.md` — compile with `npm run seed:chapters`

## Echoes of the Void

**Story bible:** `books/echoes-of-the-void/knowledgebase/INSTRUCTIONS.md`  
**Generation prompt:** `books/echoes-of-the-void/MASTER-NOVEL-PROMPT.md`  
**8 volumes / 360 chapters** — see `books/echoes-of-the-void/seed/arcs.json`

## The Hollow Canopy

**Story bible:** `books/the-hollow-canopy/knowledgebase/INSTRUCTIONS.md`  
**Generation prompt:** `books/the-hollow-canopy/MASTER-NOVEL-PROMPT.md`  
**5 acts / 45 chapters** — see `books/the-hollow-canopy/seed/arcs.json`

## App routes

- `/` — library shelf (all books)
- `/books/[slug]` — series home
- `/books/[slug]/library` — volume chapter list
- `/books/[slug]/read/[chapterId]` — reader
- `/books/[slug]/encyclopedia` — per-book codex
- `/books/[slug]/library` — export PDF per volume

## Seed pipeline

```bash
npm run seed:sync              # all books
npm run seed:chapters -- --book echoes-of-the-void
npm run seed:manifest -- --book rapture
```
