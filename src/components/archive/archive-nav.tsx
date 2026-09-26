"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ARCHIVE_WINGS, ARCHIVE_HOME } from "@/lib/archive/navigation";

export function ArchiveNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <header className={cn("archive-nav", className)}>
      <div className="archive-nav-inner">
        <Link href={ARCHIVE_HOME.href} className="archive-nav-brand group">
          <div className="landing-compass-icon">
            <Compass className="h-5 w-5 text-gold transition-transform duration-700 group-hover:rotate-90" />
          </div>
          <div className="archive-nav-brand-text">
            <span className="archive-nav-brand-name">AETHER VALE</span>
            <span className="archive-nav-brand-sub">Digital Library</span>
          </div>
        </Link>

        <nav className="archive-nav-wings" aria-label="Archive wings">
          {ARCHIVE_WINGS.map((wing) => {
            const active =
              pathname === wing.href || pathname.startsWith(wing.href + "/");
            return (
              <Link
                key={wing.href}
                href={wing.href}
                className={cn("archive-wing-tab", active && "is-active")}
                title={wing.description}
              >
                {wing.label}
              </Link>
            );
          })}
        </nav>

        <div className="archive-nav-utils">
          <Link href="/search" className="archive-nav-icon" aria-label="Search">
            <Search className="h-4 w-4" />
          </Link>
          <Link href="/profile" className="archive-nav-icon" aria-label="Profile">
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
