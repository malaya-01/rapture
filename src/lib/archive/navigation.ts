import type { LucideIcon } from "lucide-react";
import {
  Library,
  Layers,
  BookMarked,
  Scroll,
  Search,
  User,
  Info,
  Home,
} from "lucide-react";

export interface ArchiveNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

/** Primary wings of the archive — not generic website pages */
export const ARCHIVE_WINGS: ArchiveNavItem[] = [
  {
    label: "Library",
    href: "/library",
    icon: Library,
    description: "Browse, filter, and read every series in the collection.",
  },
  {
    label: "Collections",
    href: "/collections",
    icon: Layers,
    description: "Curated reading experiences and grouped universes.",
  },
  {
    label: "Categories",
    href: "/categories",
    icon: BookMarked,
    description: "Explore genre wings — fantasy, sci-fi, horror, and more.",
  },
  {
    label: "Chronicles",
    href: "/chronicles",
    icon: Scroll,
    description: "Lore database — characters, artifacts, maps, and timelines.",
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
    description: "What Aether Vale is and how to use the archive.",
  },
];

export const ARCHIVE_UTILITIES: ArchiveNavItem[] = [
  {
    label: "Search",
    href: "/search",
    icon: Search,
    description: "Discover books, characters, and lore across all worlds.",
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    description: "Reading progress, bookmarks, and personal shelves.",
  },
];

export const ARCHIVE_HOME: ArchiveNavItem = {
  label: "Home",
  href: "/",
  icon: Home,
  description: "The threshold of the archive.",
};

export function isArchiveRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  const roots = [
    "/library",
    "/collections",
    "/categories",
    "/chronicles",
    "/about",
    "/search",
    "/profile",
  ];
  return roots.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

export function wingForPath(pathname: string): ArchiveNavItem | undefined {
  return ARCHIVE_WINGS.find(
    (w) => pathname === w.href || pathname.startsWith(w.href + "/")
  );
}
