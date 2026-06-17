import type { Arc } from "@/types";

export const arcs: Arc[] = [
  {
    id: "arc-1",
    number: 1,
    title: "The Fallen Star",
    description:
      "A dying kingdom awakens to prophecy as ancient powers stir beneath the obsidian mountains.",
    color: "#c9a227",
  },
  {
    id: "arc-2",
    number: 2,
    title: "Blood of the Covenant",
    description:
      "Alliances fracture and bloodlines reveal their secrets as the hunt for the Crown shards begins.",
    color: "#8b2942",
  },
  {
    id: "arc-3",
    number: 3,
    title: "The Void Ascendant",
    description:
      "The final battle looms at the edge of the world, where light and shadow must choose their price.",
    color: "#2d4a6f",
  },
];

export function getArcById(id: string) {
  return arcs.find((arc) => arc.id === id);
}
