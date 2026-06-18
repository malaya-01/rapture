"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getCodexPreview, type CodexPreview } from "@/lib/codex-preview";

interface TooltipState {
  preview: CodexPreview;
  anchor: DOMRect;
}

const TOOLTIP_W = 288;
const TOOLTIP_GAP = 10;

function positionTooltip(anchor: DOMRect) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = anchor.bottom + TOOLTIP_GAP;
  let left = anchor.left + anchor.width / 2 - TOOLTIP_W / 2;

  if (left < 8) left = 8;
  if (left + TOOLTIP_W > vw - 8) left = vw - TOOLTIP_W - 8;

  const estimatedH = 200;
  if (top + estimatedH > vh - 8) {
    top = Math.max(8, anchor.top - TOOLTIP_GAP - estimatedH);
  }

  return { top, left };
}

function CodexTooltipCard({
  preview,
  anchor,
}: {
  preview: CodexPreview;
  anchor: DOMRect;
}) {
  const pos = positionTooltip(anchor);
  const initials = preview.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      data-codex-tooltip
      className="codex-link-tooltip pointer-events-none fixed z-[200] w-72"
      style={{ top: pos.top, left: pos.left }}
      role="tooltip"
    >
      <div className="overflow-hidden rounded-sm border border-gold/20 bg-bg-elevated/95 shadow-2xl shadow-black/50 backdrop-blur-md">
        <div className="flex gap-3 p-3">
          <div
            className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm"
            style={
              preview.imageSrc
                ? undefined
                : {
                    background: `linear-gradient(145deg, ${preview.imageColor}55, ${preview.imageColor})`,
                  }
            }
          >
            {preview.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.imageSrc}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-display text-sm text-text/80">
                {initials}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-ui text-[0.6rem] tracking-wider text-gold/60 uppercase">
              {preview.kind === "character" ? "Character" : "Location"}
            </p>
            <p className="font-display text-sm leading-tight text-gold">
              {preview.name}
            </p>
            {preview.subtitle && (
              <p className="text-ui mt-0.5 text-[0.65rem] text-text-muted">
                {preview.subtitle}
              </p>
            )}
          </div>
        </div>
        {preview.description && (
          <p className="border-t border-gold/10 px-3 py-2 font-serif text-xs leading-relaxed text-text/85">
            {preview.description}
          </p>
        )}
        <p className="text-ui border-t border-gold/10 px-3 py-1.5 text-[0.6rem] text-text-muted/70">
          Click to open codex
        </p>
      </div>
    </div>
  );
}

export function CodexLinkLayer({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [mounted, setMounted] = useState(false);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

  const showForLink = useCallback((link: HTMLAnchorElement) => {
    const id = link.dataset.codexId;
    const kind = link.dataset.codexKind as "character" | "location" | undefined;
    if (!id || !kind) return;
    const preview = getCodexPreview(kind, id);
    if (!preview) return;
    activeLinkRef.current = link;
    setTooltip({ preview, anchor: link.getBoundingClientRect() });
  }, []);

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      activeLinkRef.current = null;
      setTooltip(null);
    }, 80);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const link = (e.target as HTMLElement).closest(
        "a.codex-link[data-codex-id]"
      ) as HTMLAnchorElement | null;
      if (!link || !root.contains(link)) return;
      cancelHide();
      if (activeLinkRef.current !== link) showForLink(link);
    };

    const onPointerOut = (e: PointerEvent) => {
      const link = (e.target as HTMLElement).closest(
        "a.codex-link[data-codex-id]"
      ) as HTMLAnchorElement | null;
      if (!link || !root.contains(link)) return;
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.closest?.("a.codex-link[data-codex-id]") === link) return;
      scheduleHide();
    };

    const onFocusIn = (e: FocusEvent) => {
      const link = (e.target as HTMLElement).closest(
        "a.codex-link[data-codex-id]"
      ) as HTMLAnchorElement | null;
      if (!link || !root.contains(link)) return;
      cancelHide();
      showForLink(link);
    };

    const onFocusOut = (e: FocusEvent) => {
      const link = (e.target as HTMLElement).closest(
        "a.codex-link[data-codex-id]"
      ) as HTMLAnchorElement | null;
      if (!link || !root.contains(link)) return;
      scheduleHide();
    };

    const onScroll = () => {
      if (activeLinkRef.current) {
        setTooltip((t) =>
          t
            ? {
                ...t,
                anchor: activeLinkRef.current!.getBoundingClientRect(),
              }
            : null
        );
      }
    };

    root.addEventListener("pointerover", onPointerOver);
    root.addEventListener("pointerout", onPointerOut);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      root.removeEventListener("pointerover", onPointerOver);
      root.removeEventListener("pointerout", onPointerOut);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("scroll", onScroll, true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [cancelHide, scheduleHide, showForLink]);

  return (
    <>
      <div ref={rootRef} className="reader-prose chapter-body">
        {children}
      </div>
      {mounted &&
        tooltip &&
        createPortal(
          <CodexTooltipCard preview={tooltip.preview} anchor={tooltip.anchor} />,
          document.body
        )}
    </>
  );
}
