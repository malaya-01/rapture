import Link from "next/link";
import { ArchiveShell } from "@/components/archive/archive-shell";

const MISSION_CARDS = [
  {
    title: "Preserve Stories",
    body: "Every saga shelved with care — built to endure across volumes, revisions, and years of reading.",
  },
  {
    title: "Infinite Worlds",
    body: "From ten books to ten thousand — each universe with its own codex, maps, and chronicles.",
  },
  {
    title: "Timeless Adventures",
    body: "An immersive reading experience optimized for long-form fiction and deep worldbuilding.",
  },
];

const SECTIONS = [
  {
    title: "What is Aether Vale",
    body: "A premium digital library for long-form fiction — where each series is a living world with its own codex, volumes, and reading experience.",
  },
  {
    title: "Mission",
    body: "Help readers discover, enter, and dwell inside immense fictional archives without losing clarity or craft.",
  },
  {
    title: "Reading Experience",
    body: "Immersive reader with bookmarks, progress tracking, illustrations, and per-series lore.",
  },
];

export function AboutWing() {
  return (
    <ArchiveShell variant="wing">
      <div className="archive-about-page">
        <div className="archive-about-hero">
          <div className="archive-about-hero-bg" aria-hidden />
          <div className="archive-about-hero-content">
            <h1 className="archive-about-title">ABOUT AETHER VALE</h1>
            <p className="archive-about-lead">
              A grand digital archive for readers who want to live inside immense fictional worlds —
              discover, enter, and read without leaving the atmosphere of a cathedral library.
            </p>
          </div>
        </div>

        <div className="archive-about-body">
          {SECTIONS.map((s) => (
            <section key={s.title} className="archive-about-section">
              <h2 className="font-display text-lg tracking-wide text-gold">{s.title}</h2>
              <p className="mt-3 font-serif leading-relaxed text-text-muted">{s.body}</p>
            </section>
          ))}

          <div className="archive-about-cards">
            {MISSION_CARDS.map((card) => (
              <div key={card.title} className="archive-about-card">
                <h3 className="archive-about-card-title">{card.title}</h3>
                <p className="archive-about-card-body">{card.body}</p>
              </div>
            ))}
          </div>

          <p className="archive-about-footer">
            Questions?{" "}
            <Link href="/library" className="text-gold hover:underline">
              Enter the Library
            </Link>{" "}
            to begin.
          </p>
        </div>
      </div>
    </ArchiveShell>
  );
}
