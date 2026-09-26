import type { CSSProperties } from "react";
import Link from "next/link";
import type { ArchiveCategory } from "@/lib/archive/categories";
import { booksInCategory } from "@/lib/archive/categories";

interface CategoryBannerCardProps {
  category: ArchiveCategory;
}

export function CategoryBannerCard({ category }: CategoryBannerCardProps) {
  const count = booksInCategory(category.slug).length;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="archive-category-banner group"
      style={{ "--wing-accent": category.accentColor } as CSSProperties}
    >
      <div className="archive-category-banner-bg" aria-hidden />
      <div className="archive-category-banner-content">
        <h3 className="archive-category-banner-title">{category.title.toUpperCase()}</h3>
        <p className="archive-category-banner-count">
          {count} {count === 1 ? "series" : "series"}
        </p>
      </div>
    </Link>
  );
}
