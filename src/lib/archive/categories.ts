import { books } from "@/data/books-registry";
import type { Book } from "@/types/book";

export interface ArchiveCategory {
  slug: string;
  title: string;
  wingName: string;
  description: string;
  accentColor: string;
}

const CATEGORY_META: Record<string, Omit<ArchiveCategory, "slug">> = {
  fantasy: {
    title: "Fantasy",
    wingName: "Fantasy Wing",
    description: "Magic, myth, and worlds beyond the veil.",
    accentColor: "#8b6b2e",
  },
  "sci-fi": {
    title: "Sci-Fi",
    wingName: "Sci-Fi Wing",
    description: "Future horizons, fractured skies, and worlds remade.",
    accentColor: "#5fa8ff",
  },
  horror: {
    title: "Horror",
    wingName: "Horror Wing",
    description: "Dread, darkness, and things that should not wake.",
    accentColor: "#6b2e2e",
  },
  romance: {
    title: "Romance",
    wingName: "Romance Wing",
    description: "Bonds forged under pressure — love as survival.",
    accentColor: "#9b4d6b",
  },
  adventure: {
    title: "Adventure",
    wingName: "Adventure Wing",
    description: "Explorers, dungeons, and the road beyond the map.",
    accentColor: "#2e6b4a",
  },
  "post-apocalyptic": {
    title: "Post-Apocalyptic",
    wingName: "Ashfall Wing",
    description: "After the fracture — rebuilding from ruin.",
    accentColor: "#8b6b2e",
  },
  "dark-fantasy": {
    title: "Dark Fantasy",
    wingName: "Umbral Wing",
    description: "Beautiful ruin, political knives, and forbidden power.",
    accentColor: "#4a3f6b",
  },
  epic: {
    title: "Epic Fantasy",
    wingName: "High Hall Wing",
    description: "Empires, cycles, and fate at continental scale.",
    accentColor: "#d4af37",
  },
};

function slugifyGenre(genre: string): string {
  return genre
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function metaForGenre(genre: string): Omit<ArchiveCategory, "slug"> {
  const slug = slugifyGenre(genre);
  const known = CATEGORY_META[slug];
  if (known) return known;
  return {
    title: genre,
    wingName: `${genre} Wing`,
    description: `Volumes shelved under ${genre}.`,
    accentColor: "#d4af37",
  };
}

/** Unique genre wings derived from all registered books */
export function getArchiveCategories(): ArchiveCategory[] {
  const genreSet = new Set<string>();
  books.forEach((b) => b.genre.forEach((g) => genreSet.add(g)));

  return [...genreSet]
    .sort()
    .map((genre) => {
      const slug = slugifyGenre(genre);
      return { slug, ...metaForGenre(genre) };
    });
}

export function getCategory(slug: string): ArchiveCategory | undefined {
  return getArchiveCategories().find((c) => c.slug === slug);
}

export function booksInCategory(categorySlug: string): Book[] {
  return books.filter((b) =>
    b.genre.some((g) => slugifyGenre(g) === categorySlug)
  );
}
