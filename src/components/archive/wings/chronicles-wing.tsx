import Link from "next/link";
import {
  Users,
  Skull,
  Gem,
  MapPin,
  Clock,
  Map,
  Swords,
  Flag,
} from "lucide-react";
import { books } from "@/data/books-registry";
import { getBookBasePath } from "@/lib/books/book-data";
import { getCodexBasePath } from "@/lib/books/book-codex-data";
import { ArchiveShell } from "@/components/archive/archive-shell";
import { ArchivePageLayout } from "@/components/archive/archive-page-layout";
import { ChronicleLoreCard } from "@/components/archive/chronicle-lore-card";
import type { Book } from "@/types/book";

const LORE_SECTIONS = [
  {
    key: "characters",
    label: "Characters",
    icon: Users,
    image: "/assets/images/rapture/characters/cassian-reed.png",
    accent: "#d4af37",
  },
  {
    key: "bestiary",
    label: "Bestiary",
    icon: Skull,
    image: "/assets/images/rapture/monsters/obsidian-dragon.png",
    accent: "#6b2e2e",
    feature: "bestiary" as const,
  },
  {
    key: "artifacts",
    label: "Artifacts",
    icon: Gem,
    image: "/assets/images/rapture/artifacts/fracture-compass.png",
    accent: "#5fa8ff",
  },
  {
    key: "locations",
    label: "Locations",
    icon: MapPin,
    image: "/assets/images/rapture/locations/world-map.png",
    accent: "#2e6b4a",
  },
  {
    key: "timeline",
    label: "Timeline",
    icon: Clock,
    image: "/assets/images/rapture/scenes/ch-0010-opening.png",
    accent: "#8b6b2e",
    feature: "timeline" as const,
  },
  {
    key: "map",
    label: "Maps",
    icon: Map,
    image: "/assets/images/rapture/locations/world-map.png",
    accent: "#4a3f6b",
    feature: "map" as const,
  },
  {
    key: "events",
    label: "Events",
    icon: Swords,
    image: "/assets/images/rapture/scenes/ch-0016-opening.png",
    accent: "#9b4d6b",
  },
  {
    key: "factions",
    label: "Factions",
    icon: Flag,
    image: "/assets/images/rapture/artifacts/iron-command-sigil.png",
    accent: "#8b6b2e",
  },
] as const;

function hrefForSection(section: (typeof LORE_SECTIONS)[number], book: Book): string | null {
  if ("feature" in section && section.feature) {
    if (!book.features[section.feature]) return null;
    if (section.key === "bestiary") return "/bestiary";
    if (section.key === "map") return "/map";
    if (section.key === "timeline") return "/timeline";
  }
  if (!book.features.codex) return null;
  if (section.key === "artifacts") return "/encyclopedia/artifacts";
  return `${getCodexBasePath(book.slug)}/${section.key}`;
}

const SIDEBAR_ITEMS = [
  { id: "all", label: "All Lore" },
  ...books.map((b) => ({ id: b.slug, label: b.title, href: getBookBasePath(b.slug) })),
];

export function ChroniclesWing() {
  const primaryBook = books[0];

  return (
    <ArchiveShell variant="wing">
      <ArchivePageLayout
        sidebarTitle="Chronicles"
        sidebarItems={SIDEBAR_ITEMS}
        activeSidebarId="all"
        pageTitle="CHRONICLES"
        pageSubtitle="Lore database — characters, artifacts, maps, and timelines."
      >
        <div className="archive-chronicle-grid">
          {LORE_SECTIONS.map((section) => {
            const href = primaryBook ? hrefForSection(section, primaryBook) : null;
            if (!href) return null;
            return (
              <ChronicleLoreCard
                key={section.key}
                label={section.label}
                href={href}
                icon={section.icon}
                imageSrc={section.image}
                accentColor={section.accent}
              />
            );
          })}
        </div>

        <div className="archive-chronicle-universes">
          {books.map((book) => (
            <section key={book.id} className="archive-chronicle-universe-block">
              <div className="archive-chronicle-universe-head">
                <div>
                  <p className="archive-chronicle-universe-eyebrow">Universe</p>
                  <h2 className="archive-chronicle-universe-title">{book.title}</h2>
                  <p className="archive-chronicle-universe-sub">{book.subtitle}</p>
                </div>
                <Link href={getBookBasePath(book.slug)} className="archive-link">
                  Series home
                </Link>
              </div>
              <div className="archive-chronicle-grid archive-chronicle-grid-sm">
                {LORE_SECTIONS.map((section) => {
                  const href = hrefForSection(section, book);
                  if (!href) return null;
                  return (
                    <ChronicleLoreCard
                      key={`${book.slug}-${section.key}`}
                      label={section.label}
                      href={href}
                      icon={section.icon}
                      imageSrc={section.image}
                      accentColor={book.accentColor}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </ArchivePageLayout>
    </ArchiveShell>
  );
}
