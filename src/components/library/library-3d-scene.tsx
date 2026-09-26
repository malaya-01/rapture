"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Sparkles, ContactShadows, OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import type { Book } from "@/types/book";
import {
  LANDING_HDRI,
  LANDING_BOOKS_URL,
  LANDING_MODELS,
  universeMeshForIndex,
} from "@/lib/landing/asset-registry";
import { getBookBasePath } from "@/lib/books/book-data";
import { LibraryHallEnvironment } from "@/components/landing/library-hall-environment";
import { BookVolume, LoadedModel } from "@/components/landing/models/loaded-model";
import { LandingPostFX } from "@/components/landing/landing-postfx";
import type { Group } from "three";

function featuredArc(count: number, radius = 2.4): [number, number, number][] {
  if (count === 1) return [[0, 0.5, 1.2]];
  if (count === 2) return [[-1.6, 0.5, 1], [1.6, 0.5, 1]];
  return Array.from({ length: count }, (_, i) => {
    const t = (i / (count - 1)) * Math.PI - Math.PI / 2;
    return [Math.sin(t) * radius, 0.5, 1 + Math.cos(t) * 0.5] as [number, number, number];
  });
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
        <cylinderGeometry args={[0.48, 0.58, 0.26, 40]} />
        <meshStandardMaterial color="#14100c" metalness={0.55} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.54, 48]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      <pointLight position={[0, 0.65, 0]} intensity={0.55} color={accent} distance={2.5} />
    </group>
  );
}

function ShelfBook({
  book,
  meshName,
  position,
}: {
  book: Book;
  meshName: string;
  position: [number, number, number];
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <MagicPedestal accent={book.accentColor} position={[0, 0, 0]} />
      <BookVolume
        url={LANDING_BOOKS_URL}
        meshName={meshName}
        targetSize={0.55}
        position={[0, 0.75, 0]}
        float
        coverTint={book.accentColor}
        autoRotate={hovered ? 0.014 : 0.006}
        emissiveBoost={book.accentColor}
        emissiveIntensity={hovered ? 0.48 : 0.26}
        onClick={() => router.push(getBookBasePath(book.slug))}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      {hovered && (
        <Sparkles
          count={16}
          scale={1.5}
          size={2}
          speed={0.35}
          color={book.accentColor}
          opacity={0.55}
        />
      )}
    </group>
  );
}

function HeroTome() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.3) * 0.15;
    group.current.position.y = 2.1 + Math.sin(t) * 0.1;
  });

  return (
    <group ref={group} position={[0, 2.1, 0.2]}>
      <pointLight color="#d4af37" intensity={2.5} distance={6} decay={2} />
      <BookVolume
        url={LANDING_BOOKS_URL}
        meshName="book_encyclopedia_set_01_book01"
        targetSize={1.4}
        coverTint="#8b6b2e"
        emissiveBoost="#d4af37"
        emissiveIntensity={0.28}
      />
    </group>
  );
}

export function Library3DScene({ books }: { books: Book[] }) {
  const positions = useMemo(() => featuredArc(books.length), [books.length]);

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 10, 42]} />

      <Environment files={LANDING_HDRI} environmentIntensity={0.8} />

      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={2}
        castShadow
        color="#f6e7b0"
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight position={[0, 10, 5]} angle={0.4} penumbra={0.85} intensity={4} color="#f6e7b0" />

      <LibraryHallEnvironment targetSpan={16} position={[0, -0.5, -2]} />

      <LoadedModel
        url={LANDING_MODELS.orrery}
        scale={0.75}
        position={[0, 3.2, -1]}
        autoRotate={0.01}
        emissiveBoost="#d4af37"
        emissiveIntensity={0.35}
      />

      <HeroTome />

      {books.map((book, i) => (
        <ShelfBook
          key={book.id}
          book={book}
          meshName={universeMeshForIndex(i)}
          position={positions[i] ?? [0, 0.5, 1]}
        />
      ))}

      <Sparkles count={70} scale={12} size={1.1} speed={0.07} color="#f6e7b0" opacity={0.3} />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={12} blur={2.5} far={4} />

      <LandingPostFX />

      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={14}
        autoRotate
        autoRotateSpeed={0.25}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1.5, 0]}
      />
    </>
  );
}
