/**
 * Curated landing assets — Poly Haven CC0 (https://polyhaven.com/license)
 * Real GLB/HDR only — no procedural environment geometry.
 */

export const LANDING_HDRI =
  "/assets/models/landing/hdri/afrikaans_church_interior_2k.hdr";

/** Shared encyclopedia GLTF — one mesh per BookVolume instance */
export const LANDING_BOOKS_URL =
  "/assets/models/landing/hero-book/hero-book.gltf";

export const BOOK_MESH = {
  hero: "book_encyclopedia_set_01_book01",
} as const;

/** Reuse 5 meshes; swap emissive/tint per series (performance pattern) */
export const UNIVERSE_BOOK_MESHES = [
  "book_encyclopedia_set_01_book05",
  "book_encyclopedia_set_01_book12",
  "book_encyclopedia_set_01_book08",
  "book_encyclopedia_set_01_book15",
  "book_encyclopedia_set_01_book03",
] as const;

export function universeMeshForIndex(index: number): string {
  return UNIVERSE_BOOK_MESHES[index % UNIVERSE_BOOK_MESHES.length];
}

export const LANDING_MODELS = {
  /** Grand library hall (Poly Pizza CC0 — Castle Hall) */
  hall: "/assets/models/landing/env-hall/env-hall.glb",
  shelf: "/assets/models/landing/env-shelf/env-shelf.gltf",
  chandelier: "/assets/models/landing/env-chandelier/env-chandelier.gltf",
  /** Celestial mechanism behind hero tome */
  orrery: "/assets/models/landing/env-orrery/env-orrery.gltf",
  desk: "/assets/models/landing/env-desk/env-desk.gltf",
  lantern: "/assets/models/landing/env-lantern-a/env-lantern-a.gltf",
  lanternB: "/assets/models/landing/artifact-lantern/artifact-lantern.gltf",
} as const;

export const LANDING_PRELOAD_URLS = [
  LANDING_MODELS.hall,
  LANDING_BOOKS_URL,
  LANDING_MODELS.orrery,
  LANDING_MODELS.lantern,
] as const;
