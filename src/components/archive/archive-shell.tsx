import type { ReactNode } from "react";
import { ArchiveNav } from "./archive-nav";

interface ArchiveShellProps {
  children: ReactNode;
  /** Subtle atmospheric background — no heavy 3D */
  variant?: "default" | "wing";
}

export function ArchiveShell({ children, variant = "default" }: ArchiveShellProps) {
  return (
    <div className={variant === "wing" ? "archive-shell archive-shell-wing" : "archive-shell"}>
      <div className="archive-shell-bg" aria-hidden />
      <ArchiveNav />
      <div className="relative z-10 pb-24">{children}</div>
    </div>
  );
}
