"use client";

import { useRef, useState, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { books } from "@/data/books-registry";
import { useLandingStore } from "@/store/landing-store";
import {
  LANDING_HDRI,
  LANDING_BOOKS_URL,
  LANDING_MODELS,
  BOOK_MESH,
  universeMeshForIndex,
} from "@/lib/landing/asset-registry";
import { getBookBasePath } from "@/lib/books/book-data";
import { BookVolume, LoadedModel } from "@/components/landing/models/loaded-model";
import { LibraryHallEnvironment } from "@/components/landing/library-hall-environment";
import { LandingPostFX } from "@/components/landing/landing-postfx";
import type { Group } from "three";

/** Walking deeper into the hall as scroll progresses */
const CAMERA_PATH: {
  t: number;
  pos: [number, number, number];
  target: [number, number, number];
}[] = [
  { t: 0, pos: [0, 2, 10], target: [0, 1.85, 0] },
  { t: 0.3, pos: [0.4, 1.75, 6.5], target: [0, 1.1, -0.5] },
  { t: 0.58, pos: [0, 1.9, 4.2], target: [0, 1.4, -4] },
  { t: 0.82, pos: [-0.3, 2.1, 7], target: [0, 1.3, -2] },
  { t: 1, pos: [0, 2.2, 9.5], target: [0, 1.6, 0] },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(lerp(ar, br, t));
  const g = Math.round(lerp(ag, bg, t));
  const bl = Math.round(lerp(ab, bb, t));
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

function CameraRig() {
  const { camera } = useThree();
  const scrollProgress = useLandingStore((s) => s.scrollProgress);
  const mouse = useLandingStore((s) => s.mouse);
  const reducedMotion = useLandingStore((s) => s.reducedMotion);
  const targetRef = useRef(new THREE.Vector3());

  useFrame(() => {
    const t = scrollProgress;
    for (let i = 0; i < CAMERA_PATH.length - 1; i++) {
      const a = CAMERA_PATH[i];
      const b = CAMERA_PATH[i + 1];
      if (t >= a.t && t <= b.t) {
        const local = (t - a.t) / (b.t - a.t);
        const eased = local * local * (3 - 2 * local);
        const pos = lerpVec3(a.pos, b.pos, eased);
        const tgt = lerpVec3(a.target, b.target, eased);
        const sway = reducedMotion ? 0 : 1;
        camera.position.set(
          pos[0] + mouse.x * 0.25 * sway,
          pos[1] + mouse.y * 0.15 * sway,
          pos[2]
        );
        targetRef.current.set(
          tgt[0] + mouse.x * 0.08,
          tgt[1] + mouse.y * 0.06,
          tgt[2]
        );
        camera.lookAt(targetRef.current);
        break;
      }
    }
  });

  return null;
}

/** Full castle hall GLB + accent lanterns */
function LibraryHall() {
  return (
    <group>
      <LibraryHallEnvironment targetSpan={16} position={[0, -0.5, -2]} />
      <LoadedModel
        url={LANDING_MODELS.lantern}
        scale={0.3}
        position={[-2.5, 1.2, 0.5]}
        emissiveBoost="#f6e7b0"
        emissiveIntensity={0.4}
      />
      <LoadedModel
        url={LANDING_MODELS.lanternB}
        scale={0.28}
        position={[2.5, 1.2, 0.5]}
        emissiveBoost="#d4af37"
        emissiveIntensity={0.38}
      />
    </group>
  );
}

function CelestialOrrery() {
  const scrollProgress = useLandingStore((s) => s.scrollProgress);
  if (scrollProgress > 0.75) return null;

  return (
    <LoadedModel
      url={LANDING_MODELS.orrery}
      scale={0.85}
      position={[0, 2.6, -1.4]}
      autoRotate={0.012}
      emissiveBoost="#d4af37"
      emissiveIntensity={0.35}
    />
  );
}

function HeroGlow({ color }: { color: string }) {
  return (
    <group position={[0, 1.35, 0.15]}>
      <pointLight color={color} intensity={2.2} distance={5} decay={2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[1.1, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function HeroBook() {
  const scrollProgress = useLandingStore((s) => s.scrollProgress);
  const accentTint = useLandingStore((s) => s.accentTint);
  const glow = accentTint ?? "#d4af37";

  if (scrollProgress > 0.78) return null;

  return (
    <group position={[0, 1.85, 0]}>
      <HeroGlow color={glow} />
      <BookVolume
        url={LANDING_BOOKS_URL}
        meshName={BOOK_MESH.hero}
        targetSize={2.8}
        heroFloat
        coverTint="#8b6b2e"
        emissiveBoost={glow}
        emissiveIntensity={0.22}
      />
      <Sparkles count={36} scale={3.5} size={2} speed={0.2} color={glow} opacity={0.5} />
    </group>
  );
}

function MagicPedestal({
  accent,
  position,
}: {
  accent: string;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.62, 0.28, 40]} />
        <meshStandardMaterial color="#14100c" metalness={0.55} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.58, 48]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.55}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      <pointLight position={[0, 0.7, 0]} intensity={0.5} color={accent} distance={2.5} />
    </group>
  );
}

function FeaturedBook({
  bookSlug,
  meshName,
  accent,
  position,
}: {
  bookSlug: string;
  meshName: string;
  accent: string;
  position: [number, number, number];
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const scrollProgress = useLandingStore((s) => s.scrollProgress);
  const setHoveredUniverse = useLandingStore((s) => s.setHoveredUniverse);
  const setAccentTint = useLandingStore((s) => s.setAccentTint);

  if (scrollProgress < 0.12 || scrollProgress > 0.72) return null;

  return (
    <group position={position}>
      <MagicPedestal accent={accent} position={[0, 0, 0]} />
      <BookVolume
        url={LANDING_BOOKS_URL}
        meshName={meshName}
        targetSize={0.52}
        position={[0, 0.72, 0]}
        float
        coverTint={accent}
        autoRotate={hovered ? 0.014 : 0.005}
        emissiveBoost={accent}
        emissiveIntensity={hovered ? 0.5 : 0.25}
        onClick={() => router.push(getBookBasePath(bookSlug))}
        onPointerOver={() => {
          setHovered(true);
          setHoveredUniverse(bookSlug);
          setAccentTint(accent);
        }}
        onPointerOut={() => {
          setHovered(false);
          setHoveredUniverse(null);
          setAccentTint(null);
        }}
      />
      {hovered && (
        <Sparkles count={18} scale={1.6} size={2} speed={0.35} color={accent} opacity={0.6} />
      )}
    </group>
  );
}

function SceneLights({ accentTint }: { accentTint: string | null }) {
  const warm = accentTint ? mixHex("#f6e7b0", accentTint, 0.3) : "#f6e7b0";
  const rim = accentTint ?? "#d4af37";

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={2}
        castShadow
        color={warm}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <spotLight
        position={[0, 10, 5]}
        angle={0.4}
        penumbra={0.85}
        intensity={4}
        color="#f6e7b0"
        castShadow
      />
      <spotLight
        position={[-6, 8, 2]}
        angle={0.35}
        penumbra={1}
        intensity={1.8}
        color={rim}
      />
      <spotLight
        position={[6, 6, -4]}
        angle={0.3}
        penumbra={1}
        intensity={1.2}
        color="#5fa8ff"
      />
    </>
  );
}

function featuredPositions(count: number): [number, number, number][] {
  if (count === 1) return [[0, 0, 0.8]];
  if (count === 2) return [[-1.85, 0, 0.55], [1.85, 0, 0.55]];
  const radius = 2.6;
  return Array.from({ length: count }, (_, i) => {
    const t = (i / (count - 1)) * Math.PI - Math.PI / 2;
    return [Math.sin(t) * radius, 0, 0.45 + Math.cos(t) * 0.35] as [number, number, number];
  });
}

export function LandingScene() {
  const isMobile = useLandingStore((s) => s.isMobile);
  const accentTint = useLandingStore((s) => s.accentTint);
  const reducedMotion = useLandingStore((s) => s.reducedMotion);

  const fogColor = accentTint ? mixHex("#050505", accentTint, 0.1) : "#050505";
  const positions = featuredPositions(books.length);

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 8, isMobile ? 28 : 36]} />

      <Environment files={LANDING_HDRI} environmentIntensity={0.75} />

      <CameraRig />
      <SceneLights accentTint={accentTint} />

      <Suspense fallback={null}>
        <LibraryHall />
        <CelestialOrrery />
        <HeroBook />
        {books.map((book, i) => (
          <FeaturedBook
            key={book.slug}
            bookSlug={book.slug}
            meshName={universeMeshForIndex(i)}
            accent={book.accentColor}
            position={positions[i] ?? [0, 0, 0.8]}
          />
        ))}
      </Suspense>

      {/* Dust motes in light shafts */}
      <Sparkles
        count={isMobile ? 40 : 90}
        scale={14}
        size={1.2}
        speed={0.06}
        color="#f6e7b0"
        opacity={0.28}
      />

      <ContactShadows position={[0, 0.01, 0]} opacity={0.45} scale={14} blur={2.8} far={5} />

      {!reducedMotion && !isMobile && <LandingPostFX />}
    </>
  );
}
