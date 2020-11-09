type URL = string;
type DateTime = string; // ISO 8601
type Media = "article" | "video" | "photo" | "tweet";

export interface Event {
  id: string;
  title: string;
  summary: string;
  date: DateTime;
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
