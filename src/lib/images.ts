import { imageManifest } from "@/data/image-manifest";

export function getImageEntry(id: string) {
  return imageManifest.entries.find((e) => e.id === id);
}

/** Public URL for a codex image when the file exists on disk. */
export function getImageSrc(id: string): string | undefined {
  const entry = getImageEntry(id);
  if (!entry || entry.status !== "present") return undefined;
  const v = entry.version;
  return v ? `${entry.publicPath}?v=${v}` : entry.publicPath;
}
