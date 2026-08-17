// src/lib/data/stats/statsTypes.ts

export type PlayerRow = {
  rank: number;
  name: string;
  club: string;
  value: string;
  initials: string;
};

export type ComparePlayer = {
  playerId: string;
  name: string;
  club: string;
  league: string;
  statSummary: string;
};

export type DbPlayerRecord = {
  id: string | number;
  name?: string;
  full_name?: string;
  league?: string;
  position?: string;
  gender?: string;
};
