export interface BookMeta {
  title: string;
  subtitle: string;
  author: string;
  description: string;
}

export interface Page {
  id: string;
  content: string;
  isChapterStart?: boolean;
  chapterTitle?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  arcId: string;
  pages: Page[];
  summary: string;
}

export interface Arc {
  id: string;
  number: number;
  title: string;
  description: string;
  color: string;
}

export interface Character {
  id: string;
  name: string;
  title?: string;
  role: "protagonist" | "antagonist" | "ally" | "neutral" | "deceased";
  faction: string;
  description: string;
  traits: string[];
  firstAppearance: string;
  imageColor: string;
}

export interface Location {
  id: string;
  name: string;
  region: string;
  type: "city" | "fortress" | "wilderness" | "ruins" | "realm";
  description: string;
  significance: string;
  imageColor: string;
}

export interface Monster {
  id: string;
  name: string;
  classification: string;
  threat: "low" | "moderate" | "high" | "extreme";
  habitat: string;
  description: string;
  weaknesses: string[];
  imageColor: string;
}

export type RelationshipType =
  | "family"
  | "romance"
  | "alliance"
  | "rivalry"
  | "mentor"
  | "enemy";

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  label: string;
  strength: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  arcId: string;
  chapterId?: string;
  year: number;
  era: string;
  type: "story" | "arc" | "milestone";
  characterIds?: string[];
}

export interface ReadingProgress {
  chapterId: string;
  pageIndex: number;
  completed: boolean;
  lastReadAt: string;
}
