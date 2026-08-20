// src/lib/data/standings.ts
import { createClient } from '@/lib/supabase/client';
import type { StandingsRow, LiveTickerItem } from '@/lib/types';

type Match = {
  home_team_id: number;
  away_team_id: number;
  home_score?: number;
  away_score?: number;
  status?: string;
  competition?: string;
  competition_id?: string | number;
};

const supabase = createClient();

// Official active 2026 CPL clubs whitelist
const ACTIVE_CPL_CLUBS = [
  'cavalry fc',
  'forge fc',
  'vancouver fc',
  'atlético ottawa',
  'inter toronto fc',
  'hfx wanderers fc',
  'halifax wanderers fc',
  'pacific fc',
  'fc supra du québec',
  'fc supra du quebec'
];

function matchesLeague(teamLeague: string | null | undefined, targetLeague: string): boolean {
  if (!teamLeague) return false;
  const normalized = teamLeague.toUpperCase();
  const target = targetLeague.toUpperCase();

  if (target === 'CPL') {
    return normalized.includes('CPL') || normalized.includes('CANADIAN PREMIER LEAGUE');
  }
  if (target === 'NSL') {
    return normalized.includes('NSL') || normalized.includes('NORTHERN SUPER LEAGUE');
  }
  return normalized === target;
}

export async function computeStandings(competition: string): Promise<StandingsRow[]> {
  try {
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .order('name', { ascending: true });

    if (teamsError || !teamsData || teamsData.length === 0) {
      return [];
    }

    const targetUpper = competition.toUpperCase();

    // Filter teams by league and enforce active CPL whitelist if applicable
    const filteredTeams = teamsData.filter((t: any) => {
      const isCorrectLeague = matchesLeague(t.league, competition);
      if (!isCorrectLeague) return false;

      if (targetUpper === 'CPL') {
        const cleanName = (t.name || '').toLowerCase().trim();
        return ACTIVE_CPL_CLUBS.includes(cleanName);
      }

      return true;
    });

    if (filteredTeams.length === 0) {
      return [];
    }

    const { data: matchesData } = await supabase.from('matches').select('*');

    const matches: Match[] = (matchesData || []).filter((m: any) => {
      const comp = String(m.competition || m.competition_id || '').toUpperCase();
      const status = (m.status || '').toLowerCase();
      
      const isFinished = status === 'finished' || status === 'ft' || status === 'aet' || status === 'pen';
      const matchesComp = comp.includes(targetUpper) || comp === (targetUpper === 'CPL' ? '491' : comp);

      return isFinished && matchesComp;
    });

    const statsMap: Record<number, { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }> = {};

    filteredTeams.forEach((team: any) => {
      statsMap[team.id] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
    });

    matches.forEach((m: Match) => {
      const home = statsMap[m.home_team_id];
      const away = statsMap[m.away_team_id];
      if (!home || !away) return;

      const homeScore = m.home_score ?? 0;
      const awayScore = m.away_score ?? 0;

      home.played += 1;
      away.played += 1;
      home.gf += homeScore;
      home.ga += awayScore;
      away.gf += awayScore;
      away.ga += homeScore;

      if (homeScore > awayScore) {
        home.won += 1;
        home.pts += 3;
        away.lost += 1;
      } else if (homeScore < awayScore) {
        away.won += 1;
        away.pts += 3;
        home.lost += 1;
      } else {
        home.drawn += 1;
        home.pts += 1;
        away.drawn += 1;
        away.pts += 1;
      }
    });

    return filteredTeams
      .map((team: any) => {
        const s = statsMap[team.id] || { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
        const gf = s.gf;
        const ga = s.ga;
        return {
          id: team.id,
          slug: team.slug || team.external_id,
          external_id: team.external_id,
          position: 1,
          clubName: team.name,
          name: team.name,
          played: s.played,
          won: s.won,
          drawn: s.drawn,
          lost: s.lost,
          goalsFor: gf,
          goalsAgainst: ga,
          goalDifference: gf - ga,
          points: s.pts,
        };
      })
      .sort((a: StandingsRow, b: StandingsRow) => 
        b.points - a.points || 
        b.goalDifference - a.goalDifference || 
        (b.goalsFor || 0) - (a.goalsFor || 0) ||
        a.clubName.localeCompare(b.clubName)
      )
      .map((row: StandingsRow, idx: number) => ({
        ...row,
        position: idx + 1,
      }));
  } catch (err) {
    console.error(`Failed to compute standings for ${competition}:`, err);
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
  try {
    const { data, error } = await supabase.from('matches').select('*').limit(6);

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((m: any, idx: number) => ({
      id: String(m.id || idx),
      competition: m.competition || 'CPL',
      homeTeam: m.home_team_name || 'Home Team',
      awayTeam: m.away_team_name || 'Away Team',
      homeScore: m.home_score || 0,
      awayScore: m.away_score || 0,
      minute: m.status === 'Live' ? 75 : null,
      isLive: m.status === 'Live',
    }));
  } catch (err) {
    return [];
  }
}
