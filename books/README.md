# Books Directory

Each series lives in its own folder under `books/<slug>/`.

```
books/
  rapture/
    knowledgebase/     # Story bible (*.md, volumes/)
    content/chapters/    # Prose (ch-XXXX.md)
    seed/                # Machine-readable canon (JSON)
    README.md
  echoes-of-the-void/
    knowledgebase/
    content/chapters/
    seed/
    MASTER-NOVEL-PROMPT.md
    README.md
  the-hollow-canopy/
    knowledgebase/
    content/chapters/
    seed/
    MASTER-NOVEL-PROMPT.md
    README.md

seed/
  books.json             # Registry — paths for all books
  scripts/               # Build pipeline (shared)

public/assets/
  covers/                # Series cover art ({slug}.svg)
  images/
    rapture/{category}/  # Per-book illustration folders
    echoes-of-the-void/{category}/

src/data/
  books/
    rapture/             # Generated chapters, manifest, codex
    echoes-of-the-void/
  *.ts                   # Rapture legacy mirrors (chapters, characters, …)
```

## Commands

```bash
npm run seed:sync
npm run seed:chapters -- --book echoes-of-the-void
npm run seed:manifest -- --book rapture
```

## Adding a new book

1. Create `books/<slug>/` with `knowledgebase/`, `content/chapters/`, `seed/book.json` + `arcs.json`
2. Add entry to `seed/books.json`
3. Run `npm run seed:sync`
4. Add route handlers use `getBookData(slug)` and `getBookCodexData(slug)` automatically once registered
