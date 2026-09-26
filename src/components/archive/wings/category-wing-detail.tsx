import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategory,
  booksInCategory,
  getArchiveCategories,
} from "@/lib/archive/categories";
import { ArchiveShell } from "@/components/archive/archive-shell";
import { ArchivePageLayout } from "@/components/archive/archive-page-layout";
import { BookCoverCard } from "@/components/archive/book-cover-card";
import { CategoryBannerCard } from "@/components/archive/category-banner-card";

export function CategoryWingDetail({ slug }: { slug: string }) {
  const category = getCategory(slug);
  if (!category) notFound();
  const volumes = booksInCategory(slug);
  const allCategories = getArchiveCategories();

  return (
    <ArchiveShell variant="wing">
      <ArchivePageLayout
        sidebarTitle="Genres"
        sidebarItems={allCategories.map((c) => ({
          id: c.slug,
          label: c.title,
          href: `/categories/${c.slug}`,
        }))}
        activeSidebarId={slug}
        pageTitle={category.wingName.toUpperCase()}
        pageSubtitle={category.description}
      >
        <CategoryBannerCard category={category} />

        <div className="archive-wing-detail-section">
          <h2 className="archive-section-title">
            {volumes.length} {volumes.length === 1 ? "Series" : "Series"} Shelved
          </h2>
          <div className="archive-book-grid">
            {volumes.map((book) => (
              <BookCoverCard key={book.id} book={book} />
            ))}
          </div>
          {volumes.length === 0 && (
            <p className="archive-empty-state">
              No series in this wing yet.{" "}
              <Link href="/library" className="text-gold hover:underline">
                Browse the Library
              </Link>
            </p>
          )}
        </div>
      </ArchivePageLayout>
    </ArchiveShell>
  );
}
