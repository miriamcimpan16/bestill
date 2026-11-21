export type DayStatus = 'DRAFT' | 'PUBLISHED';

export interface Day {
  dayOfWeek: number; // 1 = Luni, 7 = Duminică
  date: string; // ISO date string
  verseReference: string;
  verseText: string;
  title: string;
  content: string;
  reflectionQuestion: string;
  order: number; // ordine pentru drag & drop
}

export interface Week {
  id: string;
  weekStart: string; // ISO date string (Luni)
  weekEnd: string; // ISO date string (Duminică)
  status: DayStatus;
  days: Day[];
  createdAt: string;
  updatedAt: string;
}

export interface OpenWhenVerse {
  id: string;
  verseReference: string;
  verseText: string;
  order: number;
}

export interface OpenWhenCategory {
  id: string;
  title: string;
  verses: OpenWhenVerse[];
  createdAt: string;
  updatedAt: string;
}

export type TabView = 'weeks' | 'categories';
