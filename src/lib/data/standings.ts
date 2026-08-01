import type { StandingsRow, LiveTickerItem } from "@/lib/types";

export async function getCplStandings(): Promise<StandingsRow[]> {
  return [
    { position: 1, clubName: "Forge FC", played: 25, points: 51, goalDifference: 16 },
    { position: 2, clubName: "Cavalry FC", played: 25, points: 47, goalDifference: 11 },
    { position: 3, clubName: "Pacific FC", played: 25, points: 43, goalDifference: 7 },
  ];
}

export async function getLiveTicker(): Promise<LiveTickerItem[]> {
  return [
    {
      id: "t1",
      competition: "CPL",
      homeTeam: "Pacific FC",
      awayTeam: "Forge FC",
      homeScore: 1,
      awayScore: 0,
      minute: 70,
      isLive: true,
    },
    {
      id: "t2",
      competition: "NSL",
      homeTeam: "Vancouver Rise",
      awayTeam: "AFC Toronto",
      homeScore: 0,
      awayScore: 0,
      minute: null,
      isLive: false,
    },
  ];
}
