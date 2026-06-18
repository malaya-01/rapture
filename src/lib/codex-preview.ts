import { getCharacterById } from "@/data/characters";
import { getLocationById } from "@/data/locations";
import { getImageSrc } from "@/lib/images";
import { formatAffinity } from "@/lib/format-encyclopedia";

export type CodexPreviewKind = "character" | "location";

export interface CodexPreview {
  id: string;
  kind: CodexPreviewKind;
  name: string;
  subtitle: string;
  description: string;
  imageSrc?: string;
  imageColor: string;
  href: string;
}

function trimDescription(text: string, max = 140): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

export function getCodexPreview(
  kind: CodexPreviewKind,
  id: string
): CodexPreview | null {
  if (kind === "character") {
    const c = getCharacterById(id);
    if (!c) return null;
    const subtitle = [c.title, c.faction].filter(Boolean).join(" · ");
    const extra = c.affinity ? ` ${formatAffinity(c.affinity)} affinity.` : "";
    return {
      id,
      kind,
      name: c.name,
      subtitle,
      description: trimDescription(`${c.description}${extra}`),
      imageSrc: getImageSrc(id),
      imageColor: c.imageColor,
      href: `/encyclopedia/characters/${id}`,
    };
  }

  const l = getLocationById(id);
  if (!l) return null;
  return {
    id,
    kind: "location",
    name: l.name,
    subtitle: `${l.type} · ${l.region}`,
    description: trimDescription(l.description),
    imageSrc: getImageSrc(id),
    imageColor: l.imageColor,
    href: `/encyclopedia/locations/${id}`,
  };
}
