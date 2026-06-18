import { characters } from "@/data/characters";
import { locations } from "@/data/locations";

export interface GlossaryEntry {
  term: string;
  id: string;
  kind: "character" | "location";
  href: string;
  minChapter: number;
}

function chapterNum(id: string) {
  const m = /ch-(\d+)/i.exec(id);
  return m ? parseInt(m[1], 10) : 1;
}

function escapeRegExp(term: string) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function entrySort(a: GlossaryEntry, b: GlossaryEntry) {
  if (b.term.length !== a.term.length) return b.term.length - a.term.length;
  if (a.kind !== b.kind) return a.kind === "location" ? -1 : 1;
  return a.term.localeCompare(b.term);
}

function buildGlossary(): GlossaryEntry[] {
  const entries: GlossaryEntry[] = [];

  const surnameCounts = new Map<string, number>();
  for (const c of characters) {
    const parts = c.name.split(" ");
    if (parts.length > 1) {
      const surname = parts[parts.length - 1]!;
      surnameCounts.set(surname, (surnameCounts.get(surname) ?? 0) + 1);
    }
  }

  for (const c of characters) {
    entries.push({
      term: c.name,
      id: c.id,
      kind: "character",
      href: `/encyclopedia/characters/${c.id}`,
      minChapter: chapterNum(c.firstAppearance),
    });
    const parts = c.name.split(" ");
    if (parts.length > 1) {
      const surname = parts[parts.length - 1]!;
      if (surnameCounts.get(surname) === 1) {
        entries.push({
          term: surname,
          id: c.id,
          kind: "character",
          href: `/encyclopedia/characters/${c.id}`,
          minChapter: chapterNum(c.firstAppearance),
        });
      }
    }
  }

  for (const l of locations) {
    entries.push({
      term: l.name,
      id: l.id,
      kind: "location",
      href: `/encyclopedia/locations/${l.id}`,
      minChapter: 1,
    });
    for (const alias of l.aliases ?? []) {
      entries.push({
        term: alias,
        id: l.id,
        kind: "location",
        href: `/encyclopedia/locations/${l.id}`,
        minChapter: 1,
      });
    }
  }

  return entries.sort(entrySort);
}

export const glossaryEntries = buildGlossary();

const SKIP_TAGS = new Set(["a", "em", "strong", "code", "pre"]);
const ANCHOR_SPLIT = /(<a\b[^>]*>[\s\S]*?<\/a>)/gi;

function linkPlainText(text: string, unlocked: GlossaryEntry[]): string {
  let result = text;
  for (const entry of unlocked) {
    const re = new RegExp(`\\b(${escapeRegExp(entry.term)})\\b`, "g");
    result = result.replace(
      re,
      `<a href="${entry.href}" class="codex-link text-gold/80 underline decoration-gold/30 underline-offset-2 hover:text-gold" data-codex-id="${entry.id}" data-codex-kind="${entry.kind}">$1</a>`
    );
  }
  return result;
}

export function linkGlossaryTerms(
  html: string,
  maxReadChapter: number
): string {
  if (!html || maxReadChapter < 1) return html;

  const unlocked = glossaryEntries
    .filter((e) => e.minChapter <= maxReadChapter)
    .sort(entrySort);
  if (!unlocked.length) return html;

  const parts = html.split(/(<[^>]+>)/g);
  let insideSkip = 0;

  return parts
    .map((part) => {
      if (part.startsWith("<")) {
        const open = /^<(\w+)/.exec(part);
        const close = /^<\/(\w+)/.exec(part);
        if (open && SKIP_TAGS.has(open[1].toLowerCase())) insideSkip++;
        if (close && SKIP_TAGS.has(close[1].toLowerCase())) insideSkip = Math.max(0, insideSkip - 1);
        return part;
      }
      if (insideSkip > 0) return part;

      return part
        .split(ANCHOR_SPLIT)
        .map((segment) =>
          /^<a\b/i.test(segment) ? segment : linkPlainText(segment, unlocked)
        )
        .join("");
    })
    .join("");
}
