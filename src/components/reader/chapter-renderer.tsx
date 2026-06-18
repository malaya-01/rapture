"use client";

import type { ChapterBlock, ChapterFigure, CompiledChapter } from "@/types";
import { ChapterFigureView, isFloatPlacement } from "./chapter-figure";
import { PretextFlow } from "./pretext-flow";
import { useReadingStore } from "@/store/reading-store";
import { useStoreHydration } from "@/lib/use-hydration";
import { getMaxReadChapterNumber } from "@/lib/spoilers";
import { linkGlossaryTerms } from "@/lib/glossary";
import { CodexLinkLayer } from "./codex-link-tooltip";

function Paragraph({
  block,
  index,
  maxReadChapter,
}: {
  block: Extract<ChapterBlock, { type: "paragraph" }>;
  index: number;
  maxReadChapter: number;
}) {
  const html = linkGlossaryTerms(block.html, maxReadChapter);
  return (
    <p
      key={`p-${index}`}
      className={block.dropCap ? "drop-cap" : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function collectParagraphs(blocks: ChapterBlock[], start: number) {
  const paras: Extract<ChapterBlock, { type: "paragraph" }>[] = [];
  let j = start;
  while (j < blocks.length && blocks[j].type === "paragraph") {
    paras.push(blocks[j] as Extract<ChapterBlock, { type: "paragraph" }>);
    j++;
  }
  return { paras, nextIndex: j };
}

export function ChapterRenderer({ chapter }: { chapter: CompiledChapter }) {
  const hydrated = useStoreHydration();
  const progress = useReadingStore((s) => s.progress);
  const maxReadChapter = hydrated ? getMaxReadChapterNumber(progress) : 1;

  const nodes: React.ReactNode[] = [];
  let i = 0;
  const { blocks } = chapter;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "break") {
      nodes.push(
        <div key={`break-${i}`} className="my-12 flex justify-center" aria-hidden>
          <span className="text-gold/40 tracking-[1em]">* * *</span>
        </div>
      );
      i++;
      continue;
    }

    if (block.type === "heading") {
      nodes.push(
        <h3
          key={`heading-${i}`}
          className="mt-14 mb-8 text-center font-serif text-sm font-normal uppercase tracking-[0.25em] text-gold/55"
        >
          {block.text}
        </h3>
      );
      i++;
      continue;
    }

    if (block.type === "figure") {
      const fig = block.figure;

      if (fig.placement === "flow-left" || fig.placement === "flow-right") {
        const { paras, nextIndex } = collectParagraphs(blocks, i + 1);
        nodes.push(
          <PretextFlow
            key={`flow-${fig.id}`}
            paragraphs={paras.map((p) => ({
              html: linkGlossaryTerms(p.html, maxReadChapter),
              dropCap: p.dropCap,
            }))}
            figure={fig}
            side={fig.placement === "flow-left" ? "left" : "right"}
          />
        );
        i = nextIndex;
        continue;
      }

      if (isFloatPlacement(fig.placement)) {
        const { paras, nextIndex } = collectParagraphs(blocks, i + 1);
        nodes.push(
          <div key={`float-${fig.id}`} className="clearfix my-8">
            <ChapterFigureView figure={fig} />
            {paras.map((p, idx) => (
              <Paragraph
                key={`fp-${idx}`}
                block={p}
                index={idx}
                maxReadChapter={maxReadChapter}
              />
            ))}
          </div>
        );
        i = nextIndex;
        continue;
      }

      nodes.push(<ChapterFigureView key={`fig-${fig.id}`} figure={fig} />);
      i++;
      continue;
    }

    if (block.type === "paragraph") {
      nodes.push(
        <Paragraph
          key={`p-${i}`}
          block={block}
          index={i}
          maxReadChapter={maxReadChapter}
        />
      );
      i++;
      continue;
    }

    i++;
  }

  return (
    <CodexLinkLayer>{nodes}</CodexLinkLayer>
  );
}

export function ChapterHeader({
  chapter,
  bookTitle,
}: {
  chapter: CompiledChapter;
  bookTitle?: string;
}) {
  return (
    <>
      <ChapterFigureView
        figure={chapter.opening}
        placement={chapter.opening.placement}
      />

      <header className="mt-12 text-center">
        <p className="label-volume">
          {chapter.volumeTitle ?? "Volume I — The Fractured Sky"}
        </p>
        {bookTitle && (
          <h1 className="title-legend embossed-gold mt-4">{bookTitle}</h1>
        )}
        <div className="mx-auto my-8 h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <p className="label-volume text-gold/60">Chapter {chapter.number}</p>
        <h2 className="title-chapter mt-3 text-text">{chapter.title}</h2>
        {chapter.epigraph && (
          <blockquote className="mx-auto mt-10 max-w-lg">
            <p className="font-serif text-xl italic leading-relaxed text-text-muted">
              &ldquo;{chapter.epigraph}&rdquo;
            </p>
            {chapter.epigraphAttribution && (
              <cite className="mt-3 block font-serif text-sm not-italic text-text-muted/70">
                {chapter.epigraphAttribution}
              </cite>
            )}
          </blockquote>
        )}
      </header>

      <div className="mx-auto my-12 h-px w-full max-w-md bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </>
  );
}
