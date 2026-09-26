import type { CodexDetailConfig } from "@/components/codex/codex-detail-profile";
import { getBookBySlug } from "@/data/books-registry";
import { getBookCodexData, getCodexBasePath } from "@/lib/books/book-codex-data";

function accent(bookSlug: string, fallback: string) {
  return getBookBySlug(bookSlug)?.accentColor ?? fallback;
}

export function bookLocationDetailConfig(
  bookSlug: string,
  id: string
): CodexDetailConfig | null {
  const codex = getBookCodexData(bookSlug);
  const loc = codex.locations.find((l) => l.id === id);
  if (!loc) return null;

  const fields = [];
  if (loc.region) fields.push({ label: "Region", value: loc.region });

  return {
    category: "locations",
    categoryLabel: "Locations",
    indexHref: getCodexBasePath(bookSlug),
    title: loc.name,
    subtitle: loc.region,
    description: loc.description,
    promptId: loc.promptId ?? loc.id,
    imageColor: loc.color ?? accent(bookSlug, "#4f8b5a"),
    aspectRatio: "21/9",
    spoilerChapter: loc.minChapter,
    fields: fields.length > 0 ? fields : undefined,
  };
}

export function bookMagicDetailConfig(
  bookSlug: string,
  id: string
): CodexDetailConfig | null {
  const codex = getBookCodexData(bookSlug);
  const skill = codex.magicSkills.find((m) => m.id === id);
  if (!skill) return null;

  const fields = [];
  if (skill.type) fields.push({ label: "Type", value: String(skill.type) });
  if (skill.path) fields.push({ label: "Path", value: String(skill.path) });

  return {
    category: "magic",
    categoryLabel: "Magic & Skills",
    indexHref: getCodexBasePath(bookSlug),
    title: skill.name,
    subtitle: skill.type ? String(skill.type) : undefined,
    description: String(skill.description ?? ""),
    promptId: String(skill.promptId ?? skill.id),
    imageColor: String(skill.color ?? accent(bookSlug, "#553c9a")),
    aspectRatio: "16/9",
    spoilerChapter:
      typeof skill.minChapter === "number" ? skill.minChapter : undefined,
    fields: fields.length > 0 ? fields : undefined,
  };
}

export function bookEventDetailConfig(
  bookSlug: string,
  id: string
): CodexDetailConfig | null {
  const codex = getBookCodexData(bookSlug);
  const event = codex.timelineEvents.find((e) => e.id === id);
  if (!event) return null;

  const fields = [];
  if (event.era) fields.push({ label: "Era", value: event.era });
  if (event.minChapter)
    fields.push({ label: "First appears", value: `Chapter ${event.minChapter}` });

  return {
    category: "events",
    categoryLabel: "Timeline",
    indexHref: getCodexBasePath(bookSlug),
    title: event.title,
    subtitle: event.era,
    description: event.description,
    promptId: event.promptId ?? event.id,
    imageColor: event.color ?? accent(bookSlug, "#8b6b2e"),
    aspectRatio: "21/9",
    spoilerChapter: event.minChapter,
    fields: fields.length > 0 ? fields : undefined,
  };
}
