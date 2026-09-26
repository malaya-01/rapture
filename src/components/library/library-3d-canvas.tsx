"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Book } from "@/types/book";
import { LANDING_PRELOAD_URLS } from "@/lib/landing/asset-registry";
import { Library3DScene } from "./library-3d-scene";

export function Library3DCanvas({ books }: { books: Book[] }) {
  useEffect(() => {
    LANDING_PRELOAD_URLS.forEach((url) => useGLTF.preload(url));
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 2, 10], fov: 35, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      className="h-full w-full touch-none"
    >
      <Suspense fallback={null}>
        <Library3DScene books={books} />
      </Suspense>
    </Canvas>
  );
}
