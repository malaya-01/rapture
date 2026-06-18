import { redirect } from "next/navigation";
import { chapters } from "@/data/chapters";
import { manifestChapters } from "@/data/chapter-manifest";

export default function ReadPage() {
  const first = chapters[0]?.id ?? manifestChapters[0]?.id ?? "ch-0001";
  redirect(`/read/${first}`);
}
