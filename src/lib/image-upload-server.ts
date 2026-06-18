import { imageManifest, type ImageCategory } from "@/data/image-manifest";
import { unlinkSync, existsSync } from "fs";
import { join } from "path";
import { projectPath } from "@/lib/project-path";

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"] as const;

export function isImageUploadAllowed() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.ALLOW_IMAGE_UPLOAD === "true"
  );
}

export function findManifestEntry(category: string, id: string) {
  return imageManifest.entries.find(
    (e) => e.id === id && e.category === category
  );
}

export function validateUploadMime(type: string) {
  return ALLOWED_MIME.has(type);
}

export function mimeToExtension(mime: string): ".png" | ".jpg" | ".webp" {
  if (mime === "image/webp") return ".webp";
  if (mime === "image/jpeg") return ".jpg";
  return ".png";
}

export function imageDirForCategory(category: ImageCategory) {
  return projectPath("public", "assets", "images", category);
}

export function removeSiblingImageFiles(dir: string, id: string, keepExt: string) {
  for (const ext of IMAGE_EXTENSIONS) {
    if (ext === keepExt) continue;
    const p = join(dir, `${id}${ext}`);
    if (existsSync(p)) unlinkSync(p);
  }
}

export { IMAGE_EXTENSIONS };
