"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { books } from "@/data/books-registry";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const Library3DCanvas = dynamic(
  () => import("@/components/library/library-3d-canvas").then((m) => m.Library3DCanvas),
  { ssr: false, loading: () => null }
);

export function HomeHero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="archive-home-hero">
      {!reducedMotion && (
        <div className="archive-home-hero-scene" aria-hidden>
          <Library3DCanvas books={books} />
        </div>
      )}
      <div className="archive-home-hero-bg" aria-hidden />
      <div className="archive-home-hero-content">
        <p className="archive-home-hero-eyebrow">The Threshold</p>
        <h1 className="archive-home-hero-title">
          <span className="archive-home-hero-title-main">AETHER VALE</span>
          <span className="archive-home-hero-title-sub">Digital Library</span>
        </h1>
        <p className="archive-home-hero-tagline">Every Book Contains A World</p>
        <Link href="/library" className="archive-cta-primary">
          Enter the Library
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
