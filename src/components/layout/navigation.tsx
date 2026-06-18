"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Library,
  Globe,
  Clock,
  Map,
  Skull,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStoreHydration } from "@/lib/use-hydration";
import { useReadingStore } from "@/store/reading-store";

const navItems = [
  { href: "/read", label: "Read", icon: BookOpen },
  { href: "/library", label: "Library", icon: Library },
  { href: "/encyclopedia", label: "Codex", icon: Globe },
  { href: "/bestiary", label: "Bestiary", icon: Skull },
  { href: "/map", label: "Map", icon: Map },
  { href: "/timeline", label: "Chronicle", icon: Clock },
];

export function Navigation() {
  const pathname = usePathname();
  const hydrated = useStoreHydration();
  const progress = useReadingStore((s) =>
    hydrated ? s.getOverallProgress() : 0
  );
  const chromeVisible = useReadingStore((s) => s.chromeVisible);

  if (pathname === "/") return null;
  if (pathname === "/read" && !chromeVisible) return null;

  return (
    <nav className="text-ui fixed bottom-0 left-0 right-0 z-50 border-t border-gold/10 bg-bg/95 backdrop-blur-lg md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3">
        <Link
          href="/"
          className="hidden font-display text-sm tracking-[0.25em] text-gold md:block"
        >
          RAPTURE
        </Link>

        <div className="flex flex-1 items-center justify-around gap-0.5 py-2 md:flex-none md:justify-end">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-sm bg-gold/10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 px-2 py-2 text-[0.6rem] md:flex-row md:gap-1.5 md:text-xs",
                    isActive ? "text-gold" : "text-text-muted hover:text-text"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="h-1 w-16 overflow-hidden rounded-full bg-bg-elevated">
            <div
              className="h-full bg-gradient-to-r from-gold-dim to-gold transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
