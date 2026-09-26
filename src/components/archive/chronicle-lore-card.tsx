import type { CSSProperties } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ChronicleLoreCardProps {
  label: string;
  href: string;
  icon: LucideIcon;
  imageSrc?: string;
  accentColor?: string;
  className?: string;
}

export function ChronicleLoreCard({
  label,
  href,
  icon: Icon,
  imageSrc,
  accentColor = "#d4af37",
  className,
}: ChronicleLoreCardProps) {
  return (
    <Link
      href={href}
      className={cn("archive-chronicle-card group", className)}
      style={{ "--lore-accent": accentColor } as CSSProperties}
    >
      <div className="archive-chronicle-card-visual">
        {imageSrc ? (
          <Image src={imageSrc} alt="" fill className="object-cover opacity-70" sizes="280px" />
        ) : (
          <div className="archive-chronicle-card-fallback" aria-hidden>
            <Icon className="h-10 w-10 text-gold/40" />
          </div>
        )}
        <div className="archive-chronicle-card-overlay" aria-hidden />
      </div>
      <span className="archive-chronicle-card-label">{label}</span>
    </Link>
  );
}
