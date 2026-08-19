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
  timestamp?: string;
  category?: string;
  subCategory?: string;
  isHero?: boolean;
  isDataDrop?: boolean;
  isApproved?: boolean;
  gender?: string;
  relatedPlayers?: string[];
};

export function mapNewsWireCategoryToLeague(category?: string): League {
  if (!category) return "CPL";
  const upper = category.toUpperCase();
  if (upper.includes("NSL")) return "NSL";
  if (upper.includes("MLS")) return "MLS";
  if (upper.includes("MNT")) return "CanMNT";
  if (upper.includes("WNT")) return "CanWNT";
  if (upper.includes("PROV")) return "Provincial";
  if (upper.includes("ABROAD")) return "Abroad";
  if (upper.includes("TRANSFER")) return "Transfers";
  return "CPL";
}

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

// Global Player Interface
export interface Player {
  id?: string | number;
  slug?: string;
  external_id?: string | number;
  name: string;
  position?: string;
  club?: string | null;
  clubName?: string | null;
  clubId?: string | null;
  league?: League | string;
  gender?: string;
  number?: number | string | null;
  caps?: number | null;
  goals?: number | null;
  assists?: number | null;
  ga?: string;
  age?: number | null;
  status?: 'LOCKED' | 'UNTIED / DUAL-NAT' | 'INJURED' | string;
  rating?: number | string | null;
  imageUrl?: string | null;
  vitals?: string;
  tag?: string;
}
