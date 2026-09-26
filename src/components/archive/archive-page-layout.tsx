import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArchiveSidebar, type SidebarItem } from "./archive-sidebar";

interface ArchivePageLayoutProps {
  sidebarTitle: string;
  sidebarItems: SidebarItem[];
  activeSidebarId?: string;
  onSidebarSelect?: (id: string) => void;
  pageTitle: string;
  pageSubtitle?: string;
  headerExtra?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ArchivePageLayout({
  sidebarTitle,
  sidebarItems,
  activeSidebarId,
  onSidebarSelect,
  pageTitle,
  pageSubtitle,
  headerExtra,
  children,
  className,
}: ArchivePageLayoutProps) {
  return (
    <div className={cn("archive-page-layout", className)}>
      <ArchiveSidebar
        title={sidebarTitle}
        items={sidebarItems}
        activeId={activeSidebarId}
        onSelect={onSidebarSelect}
      />
      <div className="archive-page-main">
        <header className="archive-page-header">
          <div>
            <h1 className="archive-page-title">{pageTitle}</h1>
            {pageSubtitle && <p className="archive-page-subtitle">{pageSubtitle}</p>}
          </div>
          {headerExtra}
        </header>
        {children}
      </div>
    </div>
  );
}
