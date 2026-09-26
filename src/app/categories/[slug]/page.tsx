import { notFound } from "next/navigation";
import { CategoryWingDetail } from "@/components/archive/wings/category-wing-detail";
import { getCategory } from "@/lib/archive/categories";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getCategory(slug)) notFound();
  return <CategoryWingDetail slug={slug} />;
}
