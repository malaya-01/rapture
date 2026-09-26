"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ImmersiveReader } from "@/components/reader/immersive-reader";
import { useStoreHydration } from "@/lib/use-hydration";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { motion } from "framer-motion";
import { getBookData } from "@/lib/books/book-data";
import { getBookBySlug } from "@/data/books-registry";

export default function BookReadChapterPage({
  params,
}: {
  params: Promise<{ bookSlug: string; chapterId: string }>;
}) {
  const { bookSlug, chapterId: rawId } = use(params);
  const hydrated = useStoreHydration();

  if (!getBookBySlug(bookSlug)) notFound();

  const data = getBookData(bookSlug);
  const chapterId = data.normalizeChapterId(rawId);
  const compiled = data.resolveChapter(chapterId);
  const manifest = data.getManifestChapter(chapterId);

  if (!manifest && !compiled) notFound();
  if (manifest && manifest.status !== "published") notFound();
  if (!compiled) notFound();

  if (!hydrated) {
    return (
      <Atmosphere>
        <div className="flex min-h-screen items-center justify-center">
          <motion.div
            className="h-12 w-12 rounded-full border border-gold/20 border-t-gold"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </Atmosphere>
    );
  }

  return <ImmersiveReader bookSlug={bookSlug} chapterId={chapterId} />;
}
