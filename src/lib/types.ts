// src/lib/types.ts
import type { Key } from 'react';

export type League = 
  | "CPL"
  | "NSL"
  | "MLS"
  | "CanMNT"
  | "CanWNT"
  | "Provincial"
  | "Abroad"
  | "Transfers";

const VALID_LEAGUES: League[] = ["CPL", "NSL", "MLS", "CanMNT", "CanWNT", "Provincial", "Abroad", "Transfers"];

export function mapNewsWireCategoryToLeague(category: string | null | undefined): League {
  if (category && (VALID_LEAGUES as string[]).includes(category)) {
    return category as League;
  }
  return "CPL";
}

export interface WireStory {
  id: Key;
  headline: string;
  summary: string;
  league: League | string;
  sourceName: string;
  sourceUrl: string;
  thumbnailUrl: string | null;
  publishedAt: string;
  gender?: string;
  isApproved?: boolean;
  isHero?: boolean;
  isDataDrop?: boolean;
  category?: string;
  subCategory?: string;
  storyType?: string;
  isEditorPick?: boolean;
  relatedPlayers?: string[];
  timestamp?: string;
}

export type StandingsRow = {
  position: number;
  clubName: string;
  played: number;
  points: number;
  goalDifference: number;
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
  | 'fan-hub' 
  | 'player-provincial' 
  | 'stats-dashboard' 
  | 'legends-gallery' 
  | 'local-club-spotlight' 
  | 'conversion-section';

export interface HomeLayoutItem {
  id: HomeSectionId;
  span: string;
}
