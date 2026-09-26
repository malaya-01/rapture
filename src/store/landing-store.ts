import { create } from "zustand";

interface LandingState {
  scrollProgress: number;
  mouse: { x: number; y: number };
  /** Slug of the book currently highlighted in the universes section */
  hoveredUniverse: string | null;
  /** Accent color from hovered book — drives scene tint when set */
  accentTint: string | null;
  isMobile: boolean;
  reducedMotion: boolean;
  setScrollProgress: (p: number) => void;
  setMouse: (m: { x: number; y: number }) => void;
  setHoveredUniverse: (id: string | null) => void;
  setAccentTint: (color: string | null) => void;
  setIsMobile: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
}

export const useLandingStore = create<LandingState>((set) => ({
  scrollProgress: 0,
  mouse: { x: 0, y: 0 },
  hoveredUniverse: null,
  accentTint: null,
  isMobile: false,
  reducedMotion: false,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setMouse: (mouse) => set({ mouse }),
  setHoveredUniverse: (hoveredUniverse) => set({ hoveredUniverse }),
  setAccentTint: (accentTint) => set({ accentTint }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));

/** Section scroll anchors (0–1) */
export const LANDING_SECTIONS = {
  arrival: 0,
  universes: 0.22,
  shelf: 0.52,
  enter: 0.82,
} as const;

export function sectionOpacity(
  progress: number,
  start: number,
  end: number,
  fade = 0.08
): number {
  const inStart = Math.min(1, Math.max(0, (progress - start) / fade));
  const inEnd = Math.min(1, Math.max(0, (end - progress) / fade));
  return Math.min(inStart, inEnd);
}
