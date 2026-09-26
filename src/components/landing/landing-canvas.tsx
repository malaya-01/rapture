"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { LandingScene } from "./landing-scene";

export function LandingCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2, 10], fov: 35, near: 0.1, far: 80 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      className="h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <LandingScene />
      </Suspense>
    </Canvas>
  );
}
