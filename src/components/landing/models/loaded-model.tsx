"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Object3D } from "three";

function applyEmissive(root: Object3D, color?: string, intensity = 0.15) {
  if (!color) return;
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((m) => {
        if (m instanceof THREE.MeshStandardMaterial) {
          m.emissive = new THREE.Color(color);
          m.emissiveIntensity = intensity;
        }
      });
    }
  });
}

/** Tint cover materials toward each series accent (texture-swap pattern) */
function applyCoverTint(root: Object3D, tint: string, strength = 0.38) {
  const accent = new THREE.Color(tint);
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((m) => {
        if (m instanceof THREE.MeshStandardMaterial) {
          m.color.lerp(accent, strength);
        }
      });
    }
  });
}

export interface LoadedModelProps {
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  autoRotate?: number;
  float?: boolean;
  emissiveBoost?: string;
  emissiveIntensity?: number;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export function LoadedModel({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = 0,
  float = false,
  emissiveBoost,
  emissiveIntensity = 0.15,
  onClick,
  onPointerOver,
  onPointerOut,
}: LoadedModelProps) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(url);
  const baseY = position[1];

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    applyEmissive(c, emissiveBoost, emissiveIntensity);
    return c;
  }, [scene, emissiveBoost, emissiveIntensity]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    if (autoRotate) group.current.rotation.y += autoRotate;
    if (float) group.current.position.y = baseY + Math.sin(t * 0.6) * 0.08;
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <Center>
        <primitive object={cloned} />
      </Center>
    </group>
  );
}

export function BookVolume({
  url,
  meshName,
  targetSize = 1,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  autoRotate = 0,
  float = false,
  heroFloat = false,
  coverTint,
  emissiveBoost,
  emissiveIntensity = 0.15,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  url: string;
  meshName: string;
  targetSize?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  autoRotate?: number;
  float?: boolean;
  /** Hero tome: slow sin sway + levitation */
  heroFloat?: boolean;
  coverTint?: string;
  emissiveBoost?: string;
  emissiveIntensity?: number;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(url);
  const scale = useNodeFitScale(url, meshName, targetSize);
  const baseY = position[1];
  const openRef = useRef(0);

  const book = useMemo(() => {
    const node = scene.getObjectByName(meshName);
    if (!node) {
      console.warn(`[BookVolume] mesh not found: ${meshName}`);
      return null;
    }
    const c = node.clone(true);
    if (coverTint) applyCoverTint(c, coverTint);
    applyEmissive(c, emissiveBoost, emissiveIntensity);
    return c;
  }, [scene, meshName, coverTint, emissiveBoost, emissiveIntensity]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    if (heroFloat) {
      group.current.rotation.y = Math.sin(t * 0.3) * 0.15;
      group.current.position.y = baseY + Math.sin(t) * 0.1;
    } else {
      if (autoRotate) group.current.rotation.y += autoRotate;
      if (float) group.current.position.y = baseY + Math.sin(t * 0.6) * 0.08;
    }

    if (openRef.current > 0) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        openRef.current,
        delta * 2.5
      );
    }
  });

  if (!book) return null;

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => {
        openRef.current = 0.18;
        onPointerOver?.();
      }}
      onPointerOut={() => {
        openRef.current = 0;
        onPointerOut?.();
      }}
    >
      <Center>
        <primitive object={book} />
      </Center>
    </group>
  );
}

export function useNodeFitScale(url: string, meshName: string, targetSize: number) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const node = scene.getObjectByName(meshName);
    if (!node) return 1;
    const box = new THREE.Box3().setFromObject(node);
    const size = box.getSize(new THREE.Vector3());
    const max = Math.max(size.x, size.y, size.z);
    return max > 0 ? targetSize / max : 1;
  }, [scene, meshName, targetSize]);
}
