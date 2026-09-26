"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  id: string;
  label: string;
  href?: string;
}

interface ArchiveSidebarProps {
  title: string;
  items: SidebarItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function ArchiveSidebar({
  title,
  items,
  activeId,
  onSelect,
  className,
}: ArchiveSidebarProps) {
  return (
    <aside className={cn("archive-sidebar", className)}>
      <p className="archive-sidebar-title">{title}</p>
      <nav className="archive-sidebar-nav" aria-label={title}>
        {items.map((item) => {
          const active = activeId === item.id;
          const className = cn("archive-sidebar-item", active && "is-active");

          if (item.href && !onSelect) {
            return (
              <Link key={item.id} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className={className}
              onClick={() => onSelect?.(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
