"use client";

import Image from "next/image";
import type { ChapterFigure, FigureOrientation, FigurePlacement } from "@/types";
import { getImageSrc } from "@/lib/images";
import { ImagePromptButton } from "@/components/ui/image-prompt-modal";
import { cn } from "@/lib/utils";

export function aspectForOrientation(orientation: FigureOrientation) {
  switch (orientation) {
    case "portrait":
      return "3/4";
    case "square":
      return "1/1";
    default:
      return "16/9";
  }
}

export function isFlowPlacement(placement: FigurePlacement) {
  return placement === "flow-left" || placement === "flow-right";
}

export function isFloatPlacement(placement: FigurePlacement) {
  return placement === "float-left" || placement === "float-right";
}

interface ChapterFigureViewProps {
  figure: ChapterFigure;
  placement?: FigurePlacement;
  className?: string;
}

function FigureImage({
  figure,
  imageSrc,
  color,
  flowCaption,
}: {
  figure: ChapterFigure;
  imageSrc: string | undefined;
  color: string;
  flowCaption?: boolean;
}) {
  return imageSrc ? (
    <>
      <Image
        src={imageSrc}
        alt={figure.title ?? figure.id}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 640px"
      />
      <ImagePromptButton
        promptId={figure.promptId}
        className="absolute right-2 top-2 z-10"
        size="md"
      />
      {flowCaption && figure.caption && (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-2 pt-8 text-center font-serif text-xs italic text-text-muted">
          {figure.caption}
        </figcaption>
      )}
    </>
  ) : (
    <div className="relative flex h-full min-h-[120px] flex-col items-center justify-center p-6 text-center">
      <ImagePromptButton
        promptId={figure.promptId}
        className="absolute right-2 top-2 z-10"
        size="md"
      />
      <span className="label-volume text-text-muted">illustration</span>
      {figure.title && (
        <p className="mt-2 font-display text-xs tracking-[0.2em] text-text/70 uppercase">
          {figure.title}
        </p>
      )}
      {figure.subtitle && (
        <p className="mt-1 font-serif text-sm italic text-text-muted">
          {figure.subtitle}
        </p>
      )}
    </div>
  );
}

export function ChapterFigureView({
  figure,
  placement = figure.placement,
  className,
}: ChapterFigureViewProps) {
  const imageSrc = getImageSrc(figure.promptId);
  const aspect =
    placement === "wide" ? "21/9" : aspectForOrientation(figure.orientation);
  const color = figure.color ?? "#8b6b2e";
  const flow = isFlowPlacement(placement);

  if (flow) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <div
          className="artwork-frame relative h-full w-full overflow-hidden rounded-sm"
          style={{
            background: imageSrc
              ? undefined
              : `linear-gradient(155deg, ${color}33 0%, ${color}18 40%, #090807 100%)`,
          }}
        >
          <FigureImage
            figure={figure}
            imageSrc={imageSrc}
            color={color}
            flowCaption
          />
        </div>
      </div>
    );
  }

  const blockClass = cn(
    "chapter-figure artwork-frame relative overflow-hidden rounded-sm",
    placement === "full" && "w-full",
    placement === "wide" && "w-full",
    placement === "center" && "mx-auto w-full max-w-2xl",
    isFloatPlacement(placement) &&
      "my-2 w-[min(42%,320px)] shrink-0 sm:w-[min(38%,280px)]",
    placement === "float-left" && "float-left mr-6 mb-4",
    placement === "float-right" && "float-right ml-6 mb-4",
    className
  );

  return (
    <figure className={cn("chapter-figure-wrap", placement === "full" || placement === "wide" ? "my-12" : "")}>
      <div
        className={blockClass}
        style={{
          aspectRatio: aspect,
          background: imageSrc
            ? undefined
            : `linear-gradient(155deg, ${color}33 0%, ${color}18 40%, #090807 100%)`,
        }}
      >
        <FigureImage figure={figure} imageSrc={imageSrc} color={color} />
      </div>
      {figure.caption && (
        <figcaption className="mt-2 text-center font-serif text-sm italic text-text-muted">
          {figure.caption}
        </figcaption>
      )}
    </figure>
  );
}
