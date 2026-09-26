import { imageManifest as raptureManifest } from "@/data/image-manifest";
import { imageManifest as echoesManifest } from "@/data/books/echoes-of-the-void/image-manifest";
import { imageManifest as canopyManifest } from "@/data/books/the-hollow-canopy/image-manifest";

const manifests = {
  rapture: raptureManifest,
  "echoes-of-the-void": echoesManifest,
  "the-hollow-canopy": canopyManifest,
};

export function getImageEntry(id: string, bookSlug = "rapture") {
  const manifest = manifests[bookSlug as keyof typeof manifests] ?? raptureManifest;
  return manifest.entries.find((e) => e.id === id);
}

/** Public URL for a codex image when the file exists on disk. */
export function getImageSrc(id: string, bookSlug = "rapture"): string | undefined {
  const entry = getImageEntry(id, bookSlug);
  if (!entry || entry.status !== "present") return undefined;
  const v = entry.version;
  return v ? `${entry.publicPath}?v=${v}` : entry.publicPath;
}
