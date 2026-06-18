"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Copy, Check, ImageIcon } from "lucide-react";
import {
  imageManifest,
  getManifestByCategory,
  type ImageCategory,
  type ImageManifestEntry,
} from "@/data/image-manifest";
import { getImagePrompt } from "@/data/image-prompts";
import { ImagePromptButton } from "@/components/ui/image-prompt-modal";
import { ImageUploadButton } from "@/components/images/image-upload-button";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { cn } from "@/lib/utils";

const CATEGORIES: { id: ImageCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "characters", label: "Characters" },
  { id: "disciples", label: "Disciples" },
  { id: "companions", label: "Companions" },
  { id: "monsters", label: "Monsters" },
  { id: "artifacts", label: "Artifacts" },
  { id: "equipment", label: "Equipment" },
  { id: "dungeons", label: "Dungeons" },
  { id: "locations", label: "Locations" },
  { id: "factions", label: "Factions" },
  { id: "magic", label: "Magic" },
  { id: "timeline", label: "Timeline" },
  { id: "scenes", label: "Scenes" },
];

function entryKey(e: ImageManifestEntry) {
  return `${e.category}:${e.id}`;
}

export function ImageRepository() {
  const router = useRouter();
  const [category, setCategory] = useState<ImageCategory | "all">("all");
  const [filter, setFilter] = useState<"all" | "missing" | "present">("all");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, ImageManifestEntry>>(
    {}
  );

  const mergedEntries = useMemo(() => {
    return imageManifest.entries.map((e) => overrides[entryKey(e)] ?? e);
  }, [overrides]);

  const summary = useMemo(() => {
    const present = mergedEntries.filter((e) => e.status === "present").length;
    return {
      total: mergedEntries.length,
      present,
      missing: mergedEntries.length - present,
    };
  }, [mergedEntries]);

  const entries = useMemo(() => {
    let list =
      category === "all"
        ? mergedEntries
        : mergedEntries.filter((e) => e.category === category);

    if (filter === "missing") list = list.filter((e) => e.status === "missing");
    if (filter === "present") list = list.filter((e) => e.status === "present");

    const q = search.toLowerCase();
    if (q) {
      list = list.filter(
        (e) =>
          e.id.includes(q) ||
          e.title.toLowerCase().includes(q) ||
          e.filename.includes(q)
      );
    }
    return list;
  }, [category, filter, search, mergedEntries]);

  const copyPath = async (path: string, id: string) => {
    await navigator.clipboard.writeText(path);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const onUploaded = useCallback(
    (updated: ImageManifestEntry) => {
      setOverrides((prev) => ({
        ...prev,
        [entryKey(updated)]: updated,
      }));
      router.refresh();
    },
    [router]
  );

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-6xl px-5">
        <header className="mb-12 text-center">
          <p className="label-volume text-gold/50">Illustration Pipeline</p>
          <h1 className="title-legend embossed-gold mt-4">Image Repository</h1>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic text-text-muted">
            Upload art directly — files are saved to{" "}
            <code className="text-gold/80">public/assets/images/</code> with the
            correct category folder and filename. Manifest refreshes automatically.
          </p>
          <div className="text-ui mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="text-text-muted">Total: {summary.total}</span>
            <span className="text-success">Present: {summary.present}</span>
            <span className="text-danger">Missing: {summary.missing}</span>
          </div>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted/40" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by id or title..."
              className="text-ui w-full rounded-sm border border-gold/12 bg-bg-elevated py-3 pl-11 pr-4 text-sm focus:border-gold/30 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "missing", "present"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "text-ui rounded-full border px-3 py-1.5 text-xs capitalize",
                  filter === f
                    ? "border-gold/35 bg-gold/10 text-gold"
                    : "border-transparent text-text-muted"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                "text-ui rounded-full border px-3 py-1 text-xs",
                category === c.id
                  ? "border-gold/35 text-gold"
                  : "border-gold/10 text-text-muted"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {entries.map((entry, i) => {
            const previewUrl =
              entry.status === "present"
                ? entry.version
                  ? `${entry.publicPath}?v=${entry.version}`
                  : entry.publicPath
                : null;

            return (
              <motion.div
                key={entryKey(entry)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.01, 0.3) }}
                className="codex-panel flex flex-col gap-3 rounded-sm p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={cn(
                      "relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-gold/10 bg-bg-surface",
                      entry.status === "present"
                        ? "text-success"
                        : "text-danger/70"
                    )}
                  >
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm text-gold">{entry.title}</p>
                    <p className="text-ui text-[0.65rem] text-text-muted uppercase">
                      {entry.category} · {entry.status}
                    </p>
                    <p className="mt-1 font-mono text-xs text-text/80">
                      public/{entry.relativePath}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <ImageUploadButton entry={entry} onUploaded={onUploaded} />
                  <button
                    type="button"
                    onClick={() => void copyPath(entry.relativePath, entry.id)}
                    className="text-ui flex items-center gap-1.5 rounded-sm border border-gold/15 px-3 py-1.5 text-xs text-text-muted hover:text-gold"
                  >
                    {copied === entry.id ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy path
                      </>
                    )}
                  </button>
                  {getImagePrompt(entry.id) && (
                    <ImagePromptButton promptId={entry.id} size="md" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {entries.length === 0 && (
          <p className="text-center font-serif italic text-text-muted">
            No matching entries.
          </p>
        )}

        <section className="codex-panel mt-12 rounded-sm p-6">
          <h2 className="label-volume mb-4">Folder guide</h2>
          <p className="mb-4 font-serif text-sm text-text-muted">
            Accepted formats: PNG, JPEG, WebP. Upload replaces any existing file
            for that id. PNG is preferred; the manifest updates after each upload.
          </p>
          <div className="grid gap-3 font-mono text-xs text-text-muted sm:grid-cols-2">
            {Object.entries(imageManifest.categories).map(([cat, info]) => (
              <div key={cat} className="rounded-sm border border-gold/10 p-3">
                <p className="text-gold">{cat}/</p>
                <p className="mt-1">{info.folder}</p>
                <p className="mt-1">Naming: {info.naming}</p>
              </div>
            ))}
          </div>
          <Link
            href="/encyclopedia"
            className="text-ui mt-6 inline-block text-sm text-gold hover:underline"
          >
            ← Return to Codex
          </Link>
        </section>
      </div>
    </Atmosphere>
  );
}
