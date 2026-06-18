"use client";

import Image from "next/image";
import { mapContinent } from "@/data/world-map";
import { getImageSrc } from "@/lib/images";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { ImagePromptButton } from "@/components/ui/image-prompt-modal";

/** Map artwork aspect — keep in sync with world-map prompt (3:2). */
const MAP_ASPECT = "3 / 2";

export function WorldMapView() {
  const mapSrc = getImageSrc("world-map");

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-6xl px-5">
        <header className="mb-12 text-center">
          <p className="label-volume text-gold/50">Cartographic Archive</p>
          <h1 className="title-legend embossed-gold mt-4">World Map</h1>
          <p className="mx-auto mt-3 max-w-2xl font-display text-sm tracking-[0.2em] text-gold/70 uppercase">
            {mapContinent.name}
          </p>
          <p className="mx-auto mt-4 max-w-lg font-serif text-lg italic text-text-muted">
            {mapContinent.subtitle}
          </p>
        </header>

        <div
          className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-sm border border-gold/12 bg-[#0a0908]"
          style={{ aspectRatio: MAP_ASPECT }}
        >
          <ImagePromptButton
            promptId="world-map"
            className="absolute right-3 top-3 z-10"
            size="md"
          />
          {mapSrc ? (
            <Image
              src={mapSrc}
              alt={`${mapContinent.name} world map`}
              fill
              unoptimized
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 1024px"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-bg-elevated via-bg to-bg-elevated" />
          )}
        </div>

        <p className="text-ui mt-3 text-center text-xs text-text-muted/70">
          {mapContinent.ocean}
        </p>
      </div>
    </Atmosphere>
  );
}
