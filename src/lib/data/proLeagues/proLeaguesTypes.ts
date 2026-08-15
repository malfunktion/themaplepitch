// src/lib/data/proLeagues/proLeaguesTypes.ts
export interface LeaderboardPlayer {
  rank: number;
  name: string;
  club: string;
  league: string;
  goals: number;
  assists: number;
  rating: string;
  cleanSheets?: number;
}
