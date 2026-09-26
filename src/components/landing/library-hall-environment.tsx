"use client";

import { useMemo } from "react";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { LANDING_MODELS } from "@/lib/landing/asset-registry";

function useHallScale(url: string, targetSpan = 14) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const max = Math.max(size.x, size.y, size.z);
    return max > 0 ? targetSpan / max : 1;
  }, [scene, targetSpan]);
}

export interface LibraryHallEnvironmentProps {
  /** Uniform scale multiplier after auto-fit */
  scaleMul?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  targetSpan?: number;
}

/** Full library hall GLB — single environment asset */
export function LibraryHallEnvironment({
  scaleMul = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  targetSpan = 14,
}: LibraryHallEnvironmentProps) {
  const url = LANDING_MODELS.hall;
  const { scene } = useGLTF(url);
  const fitScale = useHallScale(url, targetSpan);

  const hall = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  const scale = fitScale * scaleMul;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Center>
        <primitive object={hall} />
      </Center>
    </group>
  );
}

useGLTF.preload(LANDING_MODELS.hall);
