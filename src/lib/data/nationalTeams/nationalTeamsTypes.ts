// src/lib/data/nationalTeams/nationalTeamsTypes.ts
export interface SquadPlayer {
  number: number;
  name: string;
  club: string;
  position: string;
  age: number;
  caps: number;
  ga: string;
  status: 'LOCKED' | 'UNTIED / DUAL-NAT' | 'INJURED';
}
