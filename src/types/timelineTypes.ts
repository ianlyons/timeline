type URL = string;
type DateTime = string; // ISO 8601
export type Media = "article" | "video" | "photo" | "tweet";
export enum TrumpTags {
  IMMIGRATION = "IMMIGRATION",
  ETHICS = "ETHICS",
  PROTESTS = "PROTESTS",
  RUSSIA = "RUSSIA",
  CHINA = "CHINA",
  NORTH_KOREA = "NORTH_KOREA",
  TURNOVER = "TURNOVER",
  APPROVAL_RATINGS = "APPROVAL_RATINGS",
  MUELLER_PROBE = "MUELLER_PROBE",
  ENCOURAGING_VIOLENCE = "ENCOURAGING_VIOLENCE",
}

export interface Event {
  id: string;
  title: string;
  summary: string;
  date: DateTime;
  tags?: string[];
  resources: Resource[];
}

export interface Resource {
  id: string;
  description: string;
  location: URL;
  media: Media;
  source: string;
}

export interface Timeline {
  id: string;
  title: string;
  events: Event[];
  createdAt: DateTime;
  createdBy: string;
  slug: string;
}
