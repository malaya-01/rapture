import type { BookMeta } from "@/types";

export interface BookFeatures {
  codex: boolean;
  bestiary: boolean;
  map: boolean;
  timeline: boolean;
  relationships: boolean;
}

export interface Book extends BookMeta {
  id: string;
  slug: string;
  genre: string[];
  totalChapters: number;
  totalVolumes: number;
  accentColor: string;
  coverImage?: string;
  features: BookFeatures;
}

export interface BookRegistryEntry extends Book {
  seedDir: string;
  contentDir: string;
  knowledgebaseDir: string;
}
