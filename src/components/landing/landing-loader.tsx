"use client";

import { useProgress } from "@react-three/drei";

/** Shown while curated GLTF assets load — avoids a silent black screen */
export function LandingLoader() {
  const { active, progress } = useProgress();

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#050505]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="landing-rune-star mb-6" aria-hidden />
      <p className="landing-eyebrow">Opening the archive</p>
      <div className="mt-4 h-0.5 w-48 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-[#D4AF37] transition-[width] duration-300"
          style={{ width: `${Math.round(progress)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-white/40">{Math.round(progress)}%</p>
    </div>
  );
}
