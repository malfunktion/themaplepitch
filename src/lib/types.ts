// src/lib/types.ts

export type League =
  | "CPL"
  | "NSL"
  | "MLS"
  | "CanMNT"
  | "CanWNT"
  | "Provincial"
  | "Abroad"
  | "Transfers";

export type WireStory = {
  id: string;
  headline: string;
  summary: string;
  league: League;
  sourceName: string;
  sourceUrl: string;
  thumbnailUrl: string | null;
  publishedAt: string;
  isEditorPick: boolean;
};

export type StandingsRow = {
  id?: number;
  position: number;
  clubName: string;
  name?: string;
  played: number;
  points: number;
  goalDifference: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goalsFor?: number;
  goalsAgainst?: number;
};

export type LiveTickerItem = {
  id: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number | null;
  isLive: boolean;
};

export interface UpcomingFixture {
  id?: string;
  homeTeam: string;
  homeCity?: string;
  awayTeam: string;
  awayCity?: string;
  league?: string;
  date?: string;
  time?: string;
  venue?: string;
  ticketUrl: string | null;
}

export type HomeSectionId =
  | 'hero'
  | 'wire'
  | 'pro-leagues-tracker'
  | 'youth-pipeline'
  | 'player-database'
  | 'player-provincial'
  | 'stats-dashboard'
  | 'legends-gallery'
  | 'fan-hub'
  | 'provincial-pyramid'
  | 'conversion-section'
  | 'local-club-spotlight'
  | 'collegiate-watchlist';

export interface HomeLayoutItem {
  id: HomeSectionId;
  span: string;
}
