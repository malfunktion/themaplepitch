export type Gender = 'men' | 'women' | 'mixed';
export type EntityStatus = 'demo' | 'live' | 'archived';

export interface SourceAttribution {
  name: string;
  url?: string;
  accessedAt: string;
  note?: string;
}

export interface Player {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  position: string;
  clubId: string;
  clubName: string;
  nationality: string[];
  birthYear: number;
  province?: string;
  status: EntityStatus;
  rating: number;
  appearances: number;
  goals: number;
  assists: number;
  xG: number;
  xA: number;
  minutes: number;
  pathway: string[];
  source: SourceAttribution;
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  competitionId: string;
  competitionName: string;
  city: string;
  province: string;
  gender: Gender;
  founded?: number;
  status: EntityStatus;
  form: string[];
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  source: SourceAttribution;
}

export interface Competition {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  level: 'professional' | 'provincial' | 'national' | 'international';
  gender: Gender;
  country: string;
  status: EntityStatus;
  season: string;
  source: SourceAttribution;
}

export interface Match {
  id: string;
  competitionId: string;
  competitionName: string;
  season: string;
  date: string;
  status: 'scheduled' | 'live' | 'final';
  minute?: number;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  venue: string;
  city: string;
  source: SourceAttribution;
}

export interface WireItem {
  id: string;
  category: 'news' | 'transfer' | 'scouting' | 'pathway' | 'tactical' | 'federation';
  timestamp: string;
  headline: string;
  dek: string;
  source: SourceAttribution;
  relatedPlayerId?: string;
  relatedTeamId?: string;
}

export interface PathwayNode {
  id: string;
  label: string;
  province: string;
  level: string;
  type: 'club' | 'league' | 'university' | 'academy' | 'professional' | 'international';
}

export interface PathwayEdge {
  from: string;
  to: string;
  count: number;
}
