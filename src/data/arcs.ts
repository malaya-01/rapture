import type { Arc } from "@/types";

export const arcs: Arc[] = [
  {
    id: "arc-1",
    number: 1,
    title: "The Last Ordinary Days",
    description:
      "Ordinary life in Ashford ends when the sky fractures. The Rapture begins and civilization collapses in a single afternoon.",
    color: "#718096",
  },
  {
    id: "arc-2",
    number: 2,
    title: "The First Month",
    description:
      "Shock, hunger, and fear. First awakenings, first deaths, and the dawning truth that no rescue is coming.",
    color: "#4a5568",
  },
  {
    id: "arc-3",
    number: 3,
    title: "Broken Roads",
    description:
      "The cast travels ruined Earth, discovers monster territories, and Adrian meets Cassian—not as destiny, but as two capable survivors.",
    color: "#2d3748",
  },
  {
    id: "arc-4",
    number: 4,
    title: "Highway Camp",
    description:
      "The first real community forms along an abandoned highway. Hope returns, and so do the things that threaten it.",
    color: "#c9a227",
  },
];

export function getArcById(id: string) {
  return arcs.find((a) => a.id === id);
}
