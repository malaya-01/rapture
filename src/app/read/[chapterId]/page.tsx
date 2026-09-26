import { redirect } from "next/navigation";

/** Legacy chapter URLs — pick a series from the library shelf */
export default async function LegacyReadChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  await params;
  redirect("/library");
}
