export type League =
  | "CPL"
  | "NSL"
  | "MLS"
  | "CanMNT"
  | "CanWNT"
  | "Provincial"
  | "Abroad";

export type WireStory = {
  id: string;
  headline: string;
  summary: string;
  league: League;
  sourceName: string;
  sourceUrl: string;
  thumbnailUrl: string | null;   // ← missing from the suggested fallback
  publishedAt: string;            // ← missing
  isEditorPick: boolean;          // ← missing
};


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
  minute: number | null; // null when the match hasn't kicked off / has ended
  isLive: boolean;
};

export interface UpcomingFixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  time: string;
  venue?: string;
  ticketUrl?: string;
};
export type HomeSectionId = 'hero' | 'wire' | 'scout' | 'player-database';

export interface HomeLayoutItem {
  id: HomeSectionId;
  span: string; // Tailwind col-span classes for this section
}
