"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { Artwork } from "@/components/reader/reader-primitives";
import { PortraitPlaceholder } from "@/components/ui/image-prompt-modal";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";
import { isFirstAppearanceUnlocked } from "@/lib/spoilers";
import { cn } from "@/lib/utils";
import {
  DataTable,
  LinkTagList,
} from "@/components/encyclopedia/encyclopedia-sections";

export interface CodexDetailProse {
  title: string;
  body: string;
}

export interface CodexDetailTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface CodexDetailLinkTag {
  label: string;
  href: string;
}

export interface CodexDetailField {
  label: string;
  value: string;
}

export interface CodexDetailConfig {
  category: string;
  categoryLabel: string;
  indexHref: string;
  title: string;
  subtitle?: string;
  description: string;
  promptId: string;
  imageColor: string;
  aspectRatio?: string;
  fields?: CodexDetailField[];
  tags?: string[];
  linkTags?: CodexDetailLinkTag[];
  proseSections?: CodexDetailProse[];
  tables?: CodexDetailTable[];
  spoilerChapter?: number;
}

export function CodexDetailProfile({
  config,
}: {
  config: CodexDetailConfig | null;
}) {
  const hydrated = useStoreHydration();
  const progress = useReadingStore((s) => s.progress);
  if (!config) notFound();

  const unlocked =
    !hydrated ||
    !config.spoilerChapter ||
    isFirstAppearanceUnlocked(`ch-${String(config.spoilerChapter).padStart(4, "0")}`, progress);

  if (!unlocked) {
    return (
      <Atmosphere>
        <div className="page-shell mx-auto max-w-2xl px-5 text-center">
          <p className="label-volume text-gold/50">Classified</p>
          <h1 className="title-chapter mt-6 text-text-muted">Not yet discovered</h1>
          <p className="mt-4 font-serif text-lg text-text-muted">
            This entry unlocks as you read further in the saga.
          </p>
          <Link href={config.indexHref} className="text-ui mt-8 inline-block text-sm text-gold hover:underline">
            Return to Codex
          </Link>
        </div>
      </Atmosphere>
    );
  }

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-4xl px-5">
        <Link
          href={config.indexHref}
          className="text-ui mb-10 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to {config.categoryLabel}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Artwork
            title={config.title}
            aspectRatio={config.aspectRatio ?? "16/7"}
            promptId={config.promptId}
            illustration={{
              type: "character",
              title: config.title,
              subtitle: config.subtitle,
              color: config.imageColor,
            }}
          />

          <header className="mt-12">
            <p className="label-volume">{config.categoryLabel}</p>
            <h1 className="title-chapter mt-3 text-gold">{config.title}</h1>
            {config.subtitle && (
              <p className="text-ui mt-2 text-sm tracking-widest text-text-muted uppercase">
                {config.subtitle}
              </p>
            )}
          </header>

          <section className="mt-12">
            <p className="reader-prose !text-xl !leading-[1.9] text-text/90">
              {config.description}
            </p>
          </section>

          {config.fields && config.fields.length > 0 && (
            <section className="mt-10 grid gap-3 sm:grid-cols-2">
              {config.fields.map((f) => (
                <div
                  key={f.label}
                  className="rounded-sm border border-gold/10 bg-bg-elevated/50 px-4 py-3"
                >
                  <p className="text-ui text-[0.65rem] tracking-wider text-text-muted uppercase">
                    {f.label}
                  </p>
                  <p className="mt-1 font-serif text-text">{f.value}</p>
                </div>
              ))}
            </section>
          )}

          {config.proseSections?.map((section) => (
            <section key={section.title} className="mt-10">
              <h2 className="label-volume mb-4">{section.title}</h2>
              <p className="reader-prose !text-lg !leading-[1.85] text-text/90 whitespace-pre-line">
                {section.body}
              </p>
            </section>
          ))}

          {config.tables?.map((table) => (
            <section key={table.title} className="mt-10">
              <h2 className="label-volume mb-4">{table.title}</h2>
              <DataTable headers={table.headers} rows={table.rows} />
            </section>
          ))}

          {config.linkTags && config.linkTags.length > 0 && (
            <section className="mt-8">
              <LinkTagList items={config.linkTags} />
            </section>
          )}

          {config.tags && config.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {config.tags.filter(Boolean).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "text-ui rounded-full border border-gold/15 px-3 py-1 text-xs text-text-muted"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Atmosphere>
  );
}

export function CodexCardPortrait({
  promptId,
  color,
  label,
}: {
  promptId: string;
  color: string;
  label?: string;
}) {
  return (
    <PortraitPlaceholder promptId={promptId} color={color} size="md" className="h-20 w-16">
      {label && (
        <span className="flex h-full w-full items-center justify-center font-display text-sm text-text/70">
          {label.slice(0, 2)}
        </span>
      )}
    </PortraitPlaceholder>
  );
}
