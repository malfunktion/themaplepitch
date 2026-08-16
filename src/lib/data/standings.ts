import { supabase } from '@/lib/supabase/client';
import type { StandingsRow, LiveTickerItem } from '@/lib/types';

type TeamRow = { id: number; team_name: string };
type MatchRow = { home_team_id: number; away_team_id: number; home_score: number; away_score: number };

async function computeStandings(competition: string): Promise<StandingsRow[]> {
  try {
    // 1. Fetch teams belonging to this league/competition using the correct column 'team_name'
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, team_name')
      .eq('league', competition);

    if (teamsError || !teams || teams.length === 0) {
      console.error(`computeStandings(${competition}) teams error:`, teamsError);
      return [];
    }

    const teamIds = teams.map((t) => t.id);

    // 2. Fetch finished matches where participating teams belong to this league
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('home_team_id, away_team_id, home_score, away_score')
      .in('home_team_id', teamIds)
      .eq('status', 'Finished');

    if (matchesError) {
      console.error(`computeStandings(${competition}) matches error:`, matchesError);
      return [];
    }

    const table = new Map<
      number,
      { clubName: string; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number }
    >();

    for (const team of teams as TeamRow[]) {
      table.set(team.id, {
        clubName: team.team_name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
      });
    }

    for (const m of (matches ?? []) as MatchRow[]) {
      const home = table.get(m.home_team_id);
      const away = table.get(m.away_team_id);
      if (!home || !away) continue;

      home.played += 1;
      away.played += 1;
      home.goalsFor += m.home_score;
      home.goalsAgainst += m.away_score;
      away.goalsFor += m.away_score;
      away.goalsAgainst += m.home_score;

      if (m.home_score > m.away_score) {
        home.won += 1;
        home.points += 3;
        away.lost += 1;
      } else if (m.home_score < m.away_score) {
        away.won += 1;
        away.points += 3;
        home.lost += 1;
      } else {
        home.drawn += 1;
        away.drawn += 1;
        home.points += 1;
        away.points += 1;
      }
    }

    return Array.from(table.values())
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const gdA = a.goalsFor - a.goalsAgainst;
        const gdB = b.goalsFor - b.goalsAgainst;
        if (gdB !== gdA) return gdB - gdA;
        return b.goalsFor - a.goalsFor;
      })
      .map((row, i) => ({
        position: i + 1,
        clubName: row.clubName,
        played: row.played,
        points: row.points,
        goalDifference: row.goalsFor - row.goalsAgainst,
      }));
  } catch (err) {
    console.error(`computeStandings(${competition}) threw:`, err);
    return [];
  }
}

export async function getCplStandings(): Promise<StandingsRow[]> {
  return computeStandings('CPL');
}

export async function getNslStandings(): Promise<StandingsRow[]> {
  return computeStandings('NSL');
}

export async function getLiveTicker(): Promise<LiveTickerItem[]> {
  return [
    { id: 't1', competition: 'CPL', homeTeam: 'Pacific FC', awayTeam: 'Forge FC', homeScore: 1, awayScore: 0, minute: 70, isLive: true },
    { id: 't2', competition: 'NSL', homeTeam: 'Vancouver Rise', awayTeam: 'AFC Toronto', homeScore: 0, awayScore: 0, minute: null, isLive: false },
  ];
      }
