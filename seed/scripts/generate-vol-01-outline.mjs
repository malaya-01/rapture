#!/usr/bin/env node
/**
 * Generates seed/outlines/vol-01.json — Volume 1: The Sky Breaks (30 chapters)
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "../outlines/vol-01.json");

const CHAPTERS = [
  { n: 1, title: "The Last Ordinary Morning", pov: "Cassian Reed", synopsis: "Cassian's ordinary Tuesday in Ashford ends when the sky fractures over the harbor." },
  { n: 2, title: "The Sound Above", pov: "Rowan Hale", synopsis: "Rowan's family morning; fire department overwhelmed; something emerges from the fracture." },
  { n: 3, title: "Falling Fire", pov: "Adrian Hale", synopsis: "Adrian and Selene; first dragon; city under attack." },
  { n: 4, title: "When The World Ended", pov: "Multiple", synopsis: "Civilization collapses in real time; monsters emerge; mass panic." },
  { n: 5, title: "Day Zero", pov: "Marcus Vale", synopsis: "Marcus protects Iris and Lily; evacuation fails; government crumbles." },
  { n: 6, title: "The Photographer", pov: "Nora Winters", synopsis: "Nora trapped outside city; witnesses monster migration; forced into wilderness." },
  { n: 7, title: "The First Night", pov: "Cassian Reed", synopsis: "First true survival night; isolation; sounds in the dark." },
  { n: 8, title: "The Things In The Dark", pov: "Cassian Reed", synopsis: "First monster encounter; barely survives; awakening signs." },
  { n: 9, title: "No Rescue Is Coming", pov: "Rowan Hale", synopsis: "Government and military fail; last emergency systems die." },
  { n: 10, title: "The Last Broadcast", pov: "Multiple", synopsis: "Humanity understands civilization is finished. Ends: We are alone." },
  { n: 11, title: "Hunger", pov: "Cassian Reed", synopsis: "First week scarcity; Cassian counts remaining food." },
  { n: 12, title: "The Gathering", pov: "Rowan Hale", synopsis: "Survivor cluster forms; first rationing arguments." },
  { n: 13, title: "Still Searching", pov: "Adrian Hale", synopsis: "Adrian searches for family; finds only ruins and monsters." },
  { n: 14, title: "Tracks", pov: "Nora Winters", synopsis: "Nora learns to read the new wilderness; maps begin." },
  { n: 15, title: "Notes", pov: "Marcus Vale", synopsis: "Marcus documents first mana observations from specimens." },
  { n: 16, title: "The Wait", pov: "Selene Arkwright", synopsis: "Selene waits for Adrian; abandonment fear seeds (subtle)." },
  { n: 17, title: "Crossed Paths", pov: "Multiple", synopsis: "Cast paths cross without reunion; shared sky, separate hells." },
  { n: 18, title: "First Blood", pov: "Adrian Hale", synopsis: "First deliberate monster kill; cost of survival." },
  { n: 19, title: "What We Lost", pov: "Elena Hale", synopsis: "Elena treats wounded; names the dead." },
  { n: 20, title: "Scattered Again", pov: "Multiple", synopsis: "Fragile groups split under pressure; arc B closes." },
  { n: 21, title: "Leaving", pov: "Cassian Reed", synopsis: "Cassian leaves Ashford; notes defensible structures." },
  { n: 22, title: "The Road", pov: "Nora Winters", synopsis: "Nora maps shifting roads; reality wrong." },
  { n: 23, title: "Patterns", pov: "Marcus Vale", synopsis: "Monster behavior is territorial, not random." },
  { n: 24, title: "Letters Unsent", pov: "Selene Arkwright", synopsis: "Selene writes messages Adrian may never read." },
  { n: 25, title: "Smoke On The Horizon", pov: "Rowan Hale", synopsis: "Distant fires; other survivors rumored." },
  { n: 26, title: "The Quiet Between", pov: "Adrian Hale", synopsis: "Brief calm; Adrian chooses who to protect." },
  { n: 27, title: "Wrong Stars", pov: "Cassian Reed", synopsis: "Impossible night sky; Limbo foreshadow (subtle)." },
  { n: 28, title: "Older Than Us", pov: "Nora Winters", synopsis: "Ancient ruin glimpsed; humanity was not first." },
  { n: 29, title: "The Earth Trembles", pov: "Multiple", synopsis: "Shared tremor across regions; something vast stirring below." },
  { n: 30, title: "Beyond The Ruins", pov: "Multiple", synopsis: "Colossal structure rises — first dungeon. Volume ends." },
];

const chapters = CHAPTERS.map((c) => {
  const segment = c.n <= 10 ? "A" : c.n <= 20 ? "B" : "C";
  return {
    id: `ch-${String(c.n).padStart(4, "0")}`,
    number: c.n,
    localChapter: c.n,
    segment,
    title: c.title,
    pov: c.pov,
    synopsis: c.synopsis,
    status: c.n === 1 ? "published" : "outlined",
    inWorldDay: c.n <= 10 ? c.n - 1 : 10 + (c.n - 10),
    wordTarget: 2100,
  };
});

writeFileSync(
  out,
  JSON.stringify(
    {
      volumeId: "vol-01",
      volumeNumber: 1,
      volumeTitle: "The Sky Breaks",
      chapterStart: 1,
      chapterEnd: 30,
      outlineFile: "knowledgebase/volumes/VOLUME_01_THE_SKY_BREAKS.md",
      chapters,
    },
    null,
    2
  )
);
console.log("Wrote seed/outlines/vol-01.json (30 chapters)");
