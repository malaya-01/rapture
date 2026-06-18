"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import type { ChapterFigure } from "@/types";
import { ChapterFigureView } from "./chapter-figure";
import {
  figureAspect,
  figureWidthPct,
  layoutTextAroundFigure,
  prepareFlowText,
  type PositionedLine,
} from "@/lib/pretext-flow-layout";

const GAP = 24;
const NARROW_BREAKPOINT = 640;

interface FlowParagraph {
  html: string;
  dropCap?: boolean;
}

interface PretextFlowProps {
  paragraphs: FlowParagraph[];
  figure: ChapterFigure;
  side: "left" | "right";
}

function stripHtml(html: string) {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, "");
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.textContent ?? "";
}

function parseLineHeight(style: CSSStyleDeclaration, fontSize: number) {
  const lh = style.lineHeight;
  if (lh === "normal") return fontSize * 2;
  const px = parseFloat(lh);
  if (Number.isNaN(px)) return fontSize * 2;
  return lh.endsWith("px") ? px : px * fontSize;
}

function getProseMetrics(prose: HTMLElement) {
  const style = getComputedStyle(prose);
  const fontSize = parseFloat(style.fontSize) || 22;
  const lineHeight = parseLineHeight(style, fontSize);
  const fontFamily = style.fontFamily || "Georgia, serif";
  const fontWeight = style.fontWeight || "400";
  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  return { font, lineHeight, fontSize, fontFamily, fontWeight };
}

type FlowLayout = {
  lines: PositionedLine[];
  height: number;
  columnWidth: number;
  figureWidth: number;
  figureHeight: number;
  lineHeight: number;
  fontSize: number;
  font: string;
  narrow: boolean;
};

function FlowParagraphs({ paragraphs }: { paragraphs: FlowParagraph[] }) {
  return (
    <>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={p.dropCap ? "drop-cap" : undefined}
          dangerouslySetInnerHTML={{ __html: p.html }}
        />
      ))}
    </>
  );
}

export function PretextFlow({ paragraphs, figure, side }: PretextFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<FlowLayout | null>(null);

  const plainText = useMemo(
    () => paragraphs.map((p) => stripHtml(p.html)).join(" "),
    [paragraphs]
  );

  const measure = useCallback(async () => {
    const el = containerRef.current;
    if (!el || !plainText.trim()) return;

    const prose = el.closest(".reader-prose");
    if (!(prose instanceof HTMLElement)) return;

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const columnWidth = el.clientWidth;
    if (columnWidth <= 0) return;

    const metrics = getProseMetrics(prose);
    const narrow = columnWidth < NARROW_BREAKPOINT;

    if (narrow) {
      setLayout({
        lines: [],
        height: 0,
        columnWidth,
        figureWidth: columnWidth,
        figureHeight: 0,
        lineHeight: metrics.lineHeight,
        fontSize: metrics.fontSize,
        font: metrics.font,
        narrow: true,
      });
      return;
    }

    const figW = Math.round(columnWidth * figureWidthPct(figure.orientation));
    const figH = Math.round(figW / figureAspect(figure.orientation));
    const figX = side === "right" ? columnWidth - figW : 0;

    const prepared = prepareFlowText(plainText, metrics.font);
    const { lines, height } = layoutTextAroundFigure(
      prepared,
      columnWidth,
      { x: figX, y: 0, width: figW, height: figH },
      metrics.lineHeight,
      GAP
    );

    setLayout({
      lines,
      height,
      columnWidth,
      figureWidth: figW,
      figureHeight: figH,
      lineHeight: metrics.lineHeight,
      fontSize: metrics.fontSize,
      font: metrics.font,
      narrow: false,
    });
  }, [plainText, figure.orientation, side]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await measure();
    };
    void run();
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (!cancelled) void measure();
    });
    ro.observe(el);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [measure]);

  return (
    <div ref={containerRef} className="pretext-flow relative my-10 w-full">
      {layout?.narrow && (
        <div className="pretext-flow--stacked">
          <ChapterFigureView figure={figure} placement="center" />
          <FlowParagraphs paragraphs={paragraphs} />
        </div>
      )}

      {layout && !layout.narrow && (
        <div
          className="pretext-flow__stage relative w-full"
          style={{ height: layout.height }}
        >
          <div
            className="pretext-flow__figure absolute top-0 z-10"
            style={{
              width: layout.figureWidth,
              height: layout.figureHeight,
              [side]: 0,
            }}
          >
            <ChapterFigureView
              figure={figure}
              placement={side === "right" ? "flow-right" : "flow-left"}
              className="h-full w-full"
            />
          </div>

          <div className="pretext-flow__text absolute inset-0">
            {layout.lines.map((line, i) => (
              <span
                key={i}
                className="pretext-flow__line absolute block text-text"
                style={{
                  left: line.x,
                  top: line.y,
                  width: line.slotWidth,
                  font: layout.font,
                  fontSize: layout.fontSize,
                  lineHeight: `${layout.lineHeight}px`,
                }}
              >
                {line.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
