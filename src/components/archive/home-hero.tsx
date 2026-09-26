import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeHero() {
  return (
    <section className="archive-home-hero">
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
