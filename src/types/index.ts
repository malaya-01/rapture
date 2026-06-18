export interface BookMeta {
  title: string;
  subtitle: string;
  author: string;
  description: string;
}

export type FigurePlacement =
  | "full"
  | "wide"
  | "center"
  | "float-left"
  | "float-right"
  | "flow-left"
  | "flow-right";

export type FigureOrientation = "landscape" | "portrait" | "square";

export interface ChapterFigure {
  id: string;
  promptId: string;
  placement: FigurePlacement;
  orientation: FigureOrientation;
  title?: string;
  subtitle?: string;
  caption?: string;
  color?: string;
}

export type ChapterBlock =
  | { type: "paragraph"; html: string; dropCap?: boolean }
  | { type: "heading"; text: string }
  | { type: "break" }
  | { type: "figure"; figure: ChapterFigure };

export interface CompiledChapter {
  id: string;
  number: number;
  title: string;
  arcId: string;
  volumeTitle?: string;
  epigraph?: string;
  epigraphAttribution?: string;
  summary: string;
  opening: ChapterFigure;
  blocks: ChapterBlock[];
}

/** @deprecated legacy page model — use CompiledChapter.blocks */
export interface Page {
  id: string;
  content: string;
  isChapterStart?: boolean;
  isChapterOpener?: boolean;
  chapterTitle?: string;
  illustration?: Illustration;
}

export type IllustrationType =
  | "opening"
  | "scene"
  | "character"
  | "location"
  | "monster";

export interface Illustration {
  type: IllustrationType;
  title: string;
  subtitle?: string;
  caption?: string;
  color?: string;
  aspectRatio?: string;
  promptId?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  arcId: string;
  pages: Page[];
  summary: string;
  volumeTitle?: string;
  epigraph?: string;
  epigraphAttribution?: string;
  /** Compiled from markdown */
  opening?: ChapterFigure;
  blocks?: ChapterBlock[];
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
  storyRole?: string;
  faction: string;
  factionId?: string;
  description: string;
  traits: string[];
  secondaryGender?: string | null;
  affinity?: string | null;
  ageAtRapture?: number | null;
  romanceRelevant?: boolean;
  firstAppearance: string;
  imageColor: string;
  povTier?: string;
  appearance?: string;
  personality?: string;
  preRaptureLife?: string;
  arc?: string;
  age?: string;
  status?: string;
  quote?: string;
}

export interface Location {
  id: string;
  name: string;
  region: string;
  type: "city" | "fortress" | "wilderness" | "ruins" | "realm";
  description: string;
  significance: string;
  imageColor: string;
  /** Alternate phrases in prose that should link to this place (longer phrases first). */
  aliases?: string[];
}

export interface MonsterDrop {
  item: string;
  rank: string;
  chance: number;
}

export interface Monster {
  id: string;
  name: string;
  classification: string;
  threatRank: string;
  tier: number;
  threat: "low" | "moderate" | "high" | "extreme";
  scale: string;
  habitats: string[];
  appearance: string;
  behavior: string;
  traits: string[];
  vulnerabilities: string[];
  drops: MonsterDrop[];
  evolutionChain: string[];
  evolutionOf?: string;
  dungeonExclusive?: boolean;
  named?: boolean;
  firstAppearance: string;
  description: string;
  imageColor: string;
  relatedIds: string[];
}

export type RelationshipType =
  | "family"
  | "romance"
  | "alliance"
  | "rivalry"
  | "mentor"
  | "enemy";

export interface RelationshipStage {
  stage: string;
  untilChapter: number;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  label: string;
  strength: number;
  minChapter: number;
  endsChapter?: number;
  revealedChapter?: number;
  stages?: RelationshipStage[];
}

export type ReaderFontSize = "sm" | "md" | "lg";
export type ReaderLineWidth = "narrow" | "default" | "wide";
export type ReaderTheme = "dark" | "sepia" | "paper";

export interface ReaderSettings {
  fontSize: ReaderFontSize;
  lineWidth: ReaderLineWidth;
  theme: ReaderTheme;
  reducedMotion: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  subtype: string;
  rank: string;
  gearGrade: string;
  stats: Record<string, string | boolean | number>;
  source: string;
  intendedUser?: string;
  imageColor: string;
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
  locationIds?: string[];
  importance: "minor" | "major" | "monumental";
}

export type AmbientTrack =
  | "none"
  | "library"
  | "rain"
  | "wind"
  | "fireplace"
  | "music";

export interface ReadingProgress {
  chapterId: string;
  scrollPercent: number;
  completed: boolean;
  lastReadAt: string;
}
