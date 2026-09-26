import { ArchiveShell } from "@/components/archive/archive-shell";
import { ArchivePageLayout } from "@/components/archive/archive-page-layout";
import { CategoryBannerCard } from "@/components/archive/category-banner-card";
import { getArchiveCategories } from "@/lib/archive/categories";

const SIDEBAR_ITEMS = [
  { id: "all", label: "All Wings", href: "/categories" },
];

export function CategoriesWing() {
  const categories = getArchiveCategories();

  return (
    <ArchiveShell variant="wing">
      <ArchivePageLayout
        sidebarTitle="Genres"
        sidebarItems={[
          ...SIDEBAR_ITEMS,
          ...categories.map((c) => ({
            id: c.slug,
            label: c.title,
            href: `/categories/${c.slug}`,
          })),
        ]}
        activeSidebarId="all"
        pageTitle="CATEGORIES"
        pageSubtitle="Explore genre wings — fantasy, sci-fi, horror, and more."
      >
        <div className="archive-categories-stack">
          {categories.map((cat) => (
            <CategoryBannerCard key={cat.slug} category={cat} />
          ))}
        </div>
      </ArchivePageLayout>
    </ArchiveShell>
  );
}
