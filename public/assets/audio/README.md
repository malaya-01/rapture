# Ambient audio for the reader

Place loopable audio files here. The reader loads them when you pick an ambience in **Read → Ambience**.

## Required filenames

| File | Ambience option |
|------|-----------------|
| `library.mp3` | Library |
| `rain.mp3` | Rain |
| `wind.mp3` | Wind |
| `fireplace.mp3` | Fireplace |
| `music.mp3` | Music |

`.ogg` and `.wav` also work — use the same base name (e.g. `rain.ogg`).

## Tips

- **Loop seamlessly** — avoid clicks at the loop point.
- **Normalize volume** — aim for similar loudness across tracks (~−18 to −14 LUFS).
- **Keep files small** — 1–3 minute loops, compressed MP3 (128–192 kbps) are fine.
- If a file is missing, the app falls back to a simple synthesized tone (placeholder).

After adding files, hard-refresh the reader page. No build step required.
