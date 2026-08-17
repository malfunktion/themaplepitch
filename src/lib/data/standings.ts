import { createClient } from '@supabase/supabase-js';
import type { StandingsRow, LiveTickerItem } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function computeStandings(competition: string): Promise<StandingsRow[]> {
  try {
    const { data: standings, error } = await supabase
      .from('league_standings')
      .select('*')
      .eq('competition', competition)
      .order('points', { ascending: false })
      .order('goal_difference', { ascending: false })
      .order('goals_for', { ascending: false });

    if (error) {
      console.error(`computeStandings(${competition}) error:`, error.message);
      return [];
    }

    if (!standings || standings.length === 0) return [];

    return standings.map((row, i) => ({
      position: i + 1,
      clubName: row.team_name,
      played: row.played,
      points: row.points,
      goalDifference: row.goal_difference,
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
