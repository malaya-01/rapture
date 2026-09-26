"use client";

import { useMemo } from "react";
import { Vector3 } from "three";
import {
  EffectComposer,
  Bloom,
  Vignette,
  DepthOfField,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function LandingPostFX() {
  const focus = useMemo(() => new Vector3(0, 1.8, 0), []);
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.55} luminanceThreshold={0.28} mipmapBlur />
      <DepthOfField
        target={focus}
        focalLength={0.024}
        bokehScale={2.8}
        height={480}
      />
      <Vignette eskil offset={0.08} darkness={0.72} />
      <Noise opacity={0.025} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
}
