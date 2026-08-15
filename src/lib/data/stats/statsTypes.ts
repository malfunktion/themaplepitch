// src/lib/data/stats/statsTypes.ts
// Shared between src/app/stats/page.tsx and the extracted components in
// src/components/stats/ — kept alongside statsDemo.ts since they describe
// that data's shape.

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
