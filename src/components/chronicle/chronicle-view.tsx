"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Crown, Star, Flame } from "lucide-react";
import { timelineEvents } from "@/data/timeline";
import { arcs } from "@/data/arcs";
import { characters } from "@/data/characters";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { ImagePromptButton } from "@/components/ui/image-prompt-modal";
import { getImageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";

const ICONS = { story: Star, arc: Crown, milestone: Flame };

export function ChronicleView() {
  const [era, setEra] = useState<string | "all">("all");
  const [character, setCharacter] = useState<string | "all">("all");
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(1);

  const eras = useMemo(
    () => [...new Set(timelineEvents.map((e) => e.era))],
    []
  );

  const chronicleCharacters = useMemo(() => {
    const ids = new Set<string>();
    for (const e of timelineEvents) {
      e.characterIds?.forEach((id) => ids.add(id));
    }
    return characters
      .filter((c) => ids.has(c.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filtered = useMemo(() => {
    let events = [...timelineEvents];
    if (era !== "all") events = events.filter((e) => e.era === era);
    if (character !== "all")
      events = events.filter((e) => e.characterIds?.includes(character));
    const q = search.toLowerCase();
    if (q)
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    return events.sort((a, b) => a.year - b.year);
  }, [era, character, search]);

  return (
    <Atmosphere>
      <div className="page-shell mx-auto max-w-4xl px-5">
        <header className="mb-12 text-center">
          <p className="label-volume text-gold/50">Illuminated Chronicle</p>
          <h1 className="title-legend embossed-gold mt-4">Timeline</h1>
          <p className="mx-auto mt-4 max-w-lg font-serif text-lg italic text-text-muted">
            The recorded history of the shattered age
          </p>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted/40" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the chronicle..."
              className="text-ui w-full rounded-sm border border-gold/12 bg-bg-elevated py-3 pl-11 pr-4 text-sm focus:border-gold/30 focus:outline-none"
            />
          </div>
          <div className="text-ui flex items-center gap-3">
            <span className="text-xs text-text-muted">Zoom</span>
            <input
              type="range"
              min={0.85}
              max={1.25}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-gold"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <FilterPill active={era === "all"} onClick={() => setEra("all")}>
            All Eras
          </FilterPill>
          {eras.map((e) => (
            <FilterPill key={e} active={era === e} onClick={() => setEra(e)}>
              {e}
            </FilterPill>
          ))}
        </div>

        <div className="mb-10">
          <p className="label-volume mb-3">Filter by Character</p>
          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={character === "all"}
              onClick={() => setCharacter("all")}
            >
              All
            </FilterPill>
            {chronicleCharacters.map((c) => (
              <FilterPill
                key={c.id}
                active={character === c.id}
                onClick={() => setCharacter(c.id)}
              >
                {c.name}
              </FilterPill>
            ))}
          </div>
        </div>

        <div
          className="origin-top transition-transform duration-500"
          style={{ transform: `scale(${zoom})` }}
        >
          <div className="relative space-y-12">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/15 to-transparent md:left-1/2" />

            {filtered.map((event, i) => {
              const Icon = ICONS[event.type];
              const isMonumental = event.importance === "monumental";
              const isLeft = i % 2 === 0;
              const arc = arcs.find((a) => a.id === event.arcId);
              const eventChars = event.characterIds
                ?.map((id) => characters.find((c) => c.id === id))
                .filter(Boolean);

              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7 }}
                  className={cn(
                    "relative flex",
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  <div className="hidden w-1/2 md:block" />
                  <div className="absolute left-4 z-10 flex -translate-x-1/2 md:left-1/2">
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-full border-2 border-gold/40 bg-bg",
                        isMonumental ? "h-10 w-10" : "h-7 w-7"
                      )}
                      style={
                        isMonumental
                          ? { boxShadow: "0 0 24px rgba(212,175,55,0.2)" }
                          : undefined
                      }
                    >
                      <Icon className={isMonumental ? "h-4 w-4 text-gold" : "h-3 w-3 text-gold/70"} />
                    </div>
                  </div>
                  <div
                    className={cn(
                      "ml-10 flex-1 md:ml-0 md:w-1/2",
                      isLeft ? "md:pr-10" : "md:pl-10"
                    )}
                  >
                    <div
                      className={cn(
                        "manuscript rounded-sm p-5",
                        isMonumental && "manuscript-monumental p-6"
                      )}
                    >
                      {(isMonumental || getImageSrc(event.id)) && (
                        <ChronicleArtwork
                          eventId={event.id}
                          title={event.title}
                          accent={arc?.color}
                        />
                      )}
                      <p className="text-ui text-xs text-gold/70">
                        Year {event.year} · {event.era}
                      </p>
                      <h3
                        className={cn(
                          "mt-2 font-display tracking-wide text-text",
                          isMonumental ? "text-xl text-gold" : "text-base"
                        )}
                      >
                        {event.title}
                      </h3>
                      <p className="mt-2 font-serif text-sm leading-relaxed text-text-muted">
                        {event.description}
                      </p>
                      <p className="text-ui mt-3 text-[0.65rem] tracking-widest text-text-muted/50 uppercase">
                        {event.importance} · {event.type}
                      </p>
                      {eventChars && eventChars.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {eventChars.map(
                            (c) =>
                              c && (
                                <Link
                                  key={c.id}
                                  href={`/encyclopedia/characters/${c.id}`}
                                  className="text-ui rounded-full border border-gold/10 px-2 py-0.5 text-[0.6rem] text-text-muted hover:text-gold"
                                >
                                  {c.name}
                                </Link>
                              )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </Atmosphere>
  );
}

function ChronicleArtwork({
  eventId,
  title,
  accent,
}: {
  eventId: string;
  title: string;
  accent?: string;
}) {
  const src = getImageSrc(eventId);
  return (
    <div className="relative mb-4 overflow-hidden rounded-sm">
      {src ? (
        <img
          src={src}
          alt=""
          className="artwork-frame h-36 w-full object-cover object-center"
        />
      ) : (
        <div
          className="artwork-frame flex h-36 w-full items-center justify-center rounded-sm px-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${accent ?? "#8b6b2e"}33, transparent)`,
          }}
        >
          <p className="font-display text-sm tracking-wide text-gold/40">{title}</p>
        </div>
      )}
      <ImagePromptButton
        promptId={eventId}
        className="absolute right-2 top-2"
        size="md"
      />
    </div>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-ui rounded-full border px-3 py-1 text-xs transition-all duration-500",
        active
          ? "border-gold/35 bg-gold/10 text-gold"
          : "border-transparent text-text-muted hover:text-text"
      )}
    >
      {children}
    </button>
  );
}
