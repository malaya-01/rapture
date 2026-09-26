# Landing 3D Assets

## Grand library hall

| File | Source | License |
|------|--------|---------|
| `env-hall/env-hall.glb` | [Poly Pizza](https://poly.pizza) CDN (low-poly castle hall) | CC0 |

Re-download:

```bash
node scripts/download-env-hall.mjs
```

## Supporting assets (Poly Haven CC0)

| Role | Asset ID | Path |
|------|----------|------|
| HDRI | `afrikaans_church_interior` | `hdri/afrikaans_church_interior_2k.hdr` |
| Books (5 mesh variants) | `book_encyclopedia_set_01` | `hero-book/` |
| Orrery | `seadogs_compass` | `env-orrery/` |
| Lanterns | `Lantern_01` | `env-lantern-a/`, `artifact-lantern/` |

Full set:

```bash
npm run assets:landing
```

## Manual upgrade (optional)

For an even larger interior, download a GLB from [Sketchfab](https://sketchfab.com/search?q=library&type=models) or [Quaternius](https://quaternius.com) and replace `env-hall/env-hall.glb`.
