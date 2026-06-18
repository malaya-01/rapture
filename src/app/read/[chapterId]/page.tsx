"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ImmersiveReader } from "@/components/reader/immersive-reader";
import { useStoreHydration } from "@/lib/use-hydration";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { motion } from "framer-motion";
import { resolveChapter } from "@/data/chapters";
import { getManifestChapter } from "@/data/chapter-manifest";
import { normalizeChapterId } from "@/data/chapters";

export default function ReadChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId: rawId } = use(params);
  const chapterId = normalizeChapterId(rawId);
  const hydrated = useStoreHydration();

  const compiled = resolveChapter(chapterId);
  const manifest = getManifestChapter(chapterId);

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

  return <ImmersiveReader chapterId={chapterId} />;
}
