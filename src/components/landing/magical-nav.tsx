"use client";

import Link from "next/link";
import { Compass, BookOpen, Library, Layers, Clock, Info } from "lucide-react";
import { LANDING_SECTIONS } from "@/store/landing-store";
import { scrollToProgress } from "@/lib/landing/use-scroll-journey";

function scrollTo(ratio: number) {
  scrollToProgress(ratio);
}

const NAV_ITEMS = [
  { label: "Library", icon: Library, href: "/library" },
  { label: "Collections", icon: Layers, action: () => scrollTo(LANDING_SECTIONS.universes) },
  { label: "Categories", icon: BookOpen, href: "/library" },
  { label: "Chronicles", icon: Clock, href: "/encyclopedia" },
  { label: "About", icon: Info, action: () => scrollTo(LANDING_SECTIONS.enter) },
];

export function MagicalNav() {
  return (
    <nav className="landing-magical-nav pointer-events-auto fixed left-0 right-0 top-0 z-50 px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="landing-nav-brand group flex items-center gap-3"
        >
          <div className="landing-compass-icon">
            <Compass className="h-5 w-5 text-[#D4AF37] transition-transform duration-700 group-hover:rotate-90" />
          </div>
          <span className="hidden font-display text-xs tracking-[0.35em] text-[#F5EFE2]/80 sm:inline">
            AETHER VALE
          </span>
        </button>

        <div className="landing-nav-runes hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const className =
              "landing-nav-rune group flex items-center gap-1.5 px-3 py-2";

            if (item.href) {
              return (
                <Link key={item.label} href={item.href} className={className}>
                  <Icon className="h-3.5 w-3.5 text-[#D4AF37]/60 transition-colors group-hover:text-[#D4AF37]" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <button key={item.label} type="button" onClick={item.action} className={className}>
                <Icon className="h-3.5 w-3.5 text-[#D4AF37]/60 transition-colors group-hover:text-[#D4AF37]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <Link href="/library" className="landing-nav-enter">
          Enter Library
        </Link>
      </div>
    </nav>
  );
}
