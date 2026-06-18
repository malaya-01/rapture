"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark } from "lucide-react";
import { bookMeta } from "@/data/book";
import { volumes } from "@/data/volumes";
import { arcs } from "@/data/arcs";
import { resolveChapter, chapters } from "@/data/chapters";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { cn } from "@/lib/utils";

export function HomePage() {
  const router = useRouter();
  const hydrated = useStoreHydration();
  const currentChapterId = useReadingStore((s) => s.currentChapterId);
  const overallProgress = useReadingStore((s) =>
    hydrated ? s.getOverallProgress() : 0
  );
  const chapterProgress = useReadingStore((s) =>
    hydrated ? s.getChapterProgress(currentChapterId) : 0
  );

  const currentChapter = resolveChapter(currentChapterId);
  const currentArc = currentChapter
    ? arcs.find((a) => a.id === currentChapter.arcId)
    : null;
  const currentVolume = volumes[0];
  const hasProgress = overallProgress > 0;

  const beginReading = () => router.push(`/read/${currentChapterId}`);

  return (
    <Atmosphere>
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          className="artwork-frame absolute inset-0 rounded-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(9,8,7,0.3) 0%, rgba(9,8,7,0.85) 60%, #090807 100%), linear-gradient(145deg, #1a1410, #2a1f18 40%, #090807)",
          }}
        />

        <div className="relative z-10 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="label-volume text-gold/60"
          >
            A Premium Digital Novel
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="title-legend embossed-gold mt-6"
          >
            {bookMeta.title.toUpperCase()}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-4 font-serif text-xl italic text-text-muted md:text-2xl"
          >
            {bookMeta.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="text-ui mt-3 text-sm tracking-widest text-text-muted/60 uppercase"
          >
            The Chronicles of Sanctuary
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <button
              type="button"
              onClick={beginReading}
              className="text-ui group flex items-center gap-2 rounded-sm border border-gold/40 bg-gold/10 px-8 py-3.5 text-sm font-medium tracking-widest text-gold uppercase transition-all duration-500 hover:bg-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
            >
              Begin Reading
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            {hasProgress && (
              <button
                type="button"
                onClick={beginReading}
                className="text-ui flex items-center gap-2 rounded-sm border border-gold/15 px-6 py-3.5 text-sm text-text-muted transition-colors hover:border-gold/30 hover:text-text"
              >
                <Bookmark className="h-4 w-4" />
                Continue Reading
              </button>
            )}
          </motion.div>

          {hasProgress && hydrated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-ui mt-10 grid gap-4 text-left sm:grid-cols-3"
            >
              <ProgressStat label="Saga Progress" value={`${overallProgress}%`} />
              <ProgressStat
                label="Current Chapter"
                value={currentChapter?.title ?? "—"}
              />
              <ProgressStat
                label="Current Arc"
                value={currentArc?.title ?? "—"}
              />
              <ProgressStat
                label="Volume"
                value={currentVolume?.title ?? "—"}
              />
              <ProgressStat
                label="Chapter Progress"
                value={`${chapterProgress}%`}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* Bookshelf */}
      <section className="border-t border-gold/10 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="label-volume text-center text-gold/50">The Collection</h2>
          <p className="mt-3 text-center font-display text-2xl tracking-wide text-text">
            Collector&apos;s Editions
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {volumes.map((vol, i) => (
              <motion.div
                key={vol.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
              >
                <VolumeCard
                  volume={vol}
                  progress={vol.number === 1 ? overallProgress : 0}
                  onClick={vol.status === "published" ? beginReading : undefined}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Atmosphere>
  );
}

function ProgressStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-gold/10 bg-bg-elevated/50 px-4 py-3 backdrop-blur-sm">
      <p className="text-[0.65rem] tracking-widest text-text-muted/60 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm text-text">{value}</p>
    </div>
  );
}

function VolumeCard({
  volume,
  progress,
  onClick,
}: {
  volume: (typeof volumes)[0];
  progress: number;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "volume-spine w-full rounded-sm p-5 text-left",
        onClick && "cursor-pointer",
        volume.status !== "published" && "opacity-60"
      )}
    >
      <div
        className="artwork-frame mb-4 rounded-sm"
        style={{
          aspectRatio: "2/3",
          background: `linear-gradient(160deg, ${volume.color}44, #090807)`,
        }}
      >
        <div className="flex h-full flex-col items-center justify-end p-4 text-center">
          <span className="label-volume text-[0.6rem]">Volume {volume.number}</span>
        </div>
      </div>
      <h3 className="font-display text-sm tracking-wide text-gold">
        {volume.title}
      </h3>
      <p className="mt-1 font-serif text-xs italic text-text-muted">
        {volume.subtitle}
      </p>
      <p className="text-ui mt-2 text-[0.6rem] tracking-wider text-text-muted/50 uppercase">
        {volume.era}
      </p>
      <div className="text-ui mt-3 flex items-center justify-between text-[0.65rem]">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 uppercase tracking-wider",
            volume.status === "published"
              ? "bg-success/15 text-success"
              : "bg-bg-surface text-text-muted"
          )}
        >
          {volume.status === "published" ? "Available" : "Forthcoming"}
        </span>
        {volume.status === "published" && (
          <span className="text-gold/60">{progress}%</span>
        )}
      </div>
    </Tag>
  );
}
