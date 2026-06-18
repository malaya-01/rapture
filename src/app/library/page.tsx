import type { Metadata } from "next";
import { LibraryView } from "@/components/library/library-view";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse all chapters organized by story arcs with reading progress.",
};

export default function LibraryPage() {
  return <LibraryView />;
}
