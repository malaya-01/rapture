export interface Volume {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  era: string;
  status: "published" | "in-progress" | "forthcoming";
  arcIds: string[];
  color: string;
  chapterRange: [number, number];
}

export const volumes: Volume[] = [
  {
    id: "vol-1",
    number: 1,
    title: "The Fractured Sky",
    subtitle: "The Rapture begins",
    era: "Age of Collapse",
    status: "published",
    arcIds: ["arc-1", "arc-2"],
    color: "#718096",
    chapterRange: [1, 120],
  },
  {
    id: "vol-2",
    number: 2,
    title: "Sanctuary Rising",
    subtitle: "Foundations of hope",
    era: "Age of Sanctuary",
    status: "forthcoming",
    arcIds: ["arc-3"],
    color: "#5b8a72",
    chapterRange: [121, 240],
  },
  {
    id: "vol-3",
    number: 3,
    title: "Iron and Ash",
    subtitle: "The Dominion stirs",
    era: "Age of Dominion",
    status: "forthcoming",
    arcIds: ["arc-4"],
    color: "#8b6b2e",
    chapterRange: [241, 360],
  },
  {
    id: "vol-4",
    number: 4,
    title: "The Seventh Gate",
    subtitle: "Cycles awaken",
    era: "Age of Revelation",
    status: "forthcoming",
    arcIds: [],
    color: "#5a6bcf",
    chapterRange: [361, 480],
  },
];

export function getVolumeById(id: string) {
  return volumes.find((v) => v.id === id);
}
