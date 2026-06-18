/** Shared visual language for every Rapture illustration prompt. */
export const RAPTURE_STYLE_BIBLE = `ART STYLE: Painterly oil-and-gouache hybrid with subtle paper grain. Cinematic chiaroscuro lighting, soft volumetric god-rays, atmospheric depth. Collector's edition fantasy novel quality (Witcher bestiary × Arcane artbook × LotR illustrated edition).

NOT photorealistic. NOT anime. NOT 3D render.

PALETTE: Deep charcoal void (#090807), warm parchment highlights (#F5EFE2), antique gold accents (#D4AF37), muted earth tones. Post-Rapture Earth — recognizable ruins mixed with magical mutation.

MOOD: Melancholic hope, ancient mystery, survival epic. Mature adult (18+), timeless, premium.

CONTENT MATURITY: Adult novel art — combat may show blood and injury; romance tasteful (affection/kissing OK, not explicit); hazard and horror honest — not sanitized for YA.

TECHNICAL: Rule of thirds composition, environmental storytelling, no text/watermarks/UI in image. 4K illustration quality.`;

export const RAPTURE_SERIES_CONTEXT = `RAPTURE: THE FRACTURED SKY — Cycle Seven. On Day Zero the sky fractured; silver rifts opened worldwide; dragons descended; mana flooded Earth; civilization collapsed. The saga follows survivors who build Sanctuary while navigating monster ecology, sovereign dungeons, and the mystery of seven cosmic cycles. Audience: adult (18+) literary fiction — honest violence and hazard; earned romance; no explicit sex.`;

export interface DualPrompt {
  contentPrompt: string;
  imagePrompt: string;
}

/** @deprecated Use dual prompts from image-prompts.ts registry */
export function buildImagePrompt(
  subject: string,
  details: string,
  framing: string = "cinematic portrait, waist-up"
): string {
  return `${RAPTURE_STYLE_BIBLE}

SUBJECT: ${subject}
DETAILS: ${details}
FRAMING: ${framing}

Generate a single cohesive illustration that fits the Rapture visual universe.`;
}

export function buildDualPrompt(
  title: string,
  contentSections: Record<string, string>,
  imageSections: Record<string, string>,
  framing: string = "cinematic portrait, waist-up"
): DualPrompt {
  const contentPrompt = `=== RAPTURE ILLUSTRATION BRIEF ===
${RAPTURE_SERIES_CONTEXT}

${Object.entries(contentSections)
  .map(([k, v]) => `--- ${k.toUpperCase()} ---\n${v}`)
  .join("\n\n")}`;

  const imagePrompt = `${RAPTURE_STYLE_BIBLE}

COMPOSITION: ${framing}

${Object.entries(imageSections)
  .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
  .join("\n\n")}

Generate ONE cohesive illustration. No text or watermarks.`;

  return { contentPrompt, imagePrompt };
}
