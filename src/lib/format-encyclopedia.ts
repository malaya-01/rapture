/** Shared formatters for codex / bestiary display */

export function formatSlugId(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatChapterRef(ch?: string): string {
  if (!ch) return "Unknown";
  const n = parseInt(ch.replace(/\D/g, ""), 10);
  if (!n) return ch;
  return `Chapter ${n}`;
}

export function formatPercent(chance: number): string {
  return `${Math.round(chance * 100)}%`;
}

export function formatStoryRole(role?: string): string {
  if (!role) return "";
  return formatSlugId(role);
}

export function formatAffinity(affinity?: string | null): string {
  if (!affinity) return "None";
  return formatSlugId(affinity);
}

export function formatSecondaryGender(g?: string | null): string {
  if (!g) return "—";
  return g.charAt(0).toUpperCase() + g.slice(1);
}

export function tierLabel(tier: number): string {
  return `Growth Tier ${tier}`;
}
