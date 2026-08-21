// src/lib/data/standings.ts
import { createClient } from '@/lib/supabase/client';
import type { StandingsRow, LiveTickerItem } from '@/lib/types';

type Team = {
  id: number;
  name: string;
  league: string;
};

type Match = {
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
  status: string;
  competition: string;
};

const supabase = createClient();

// Franchise Renaming & Accent Normalization Whitelist
const TEAM_NAME_OVERRIDES: Record<string, string> = {
  'york9': 'Inter Toronto FC',
  'york9 fc': 'Inter Toronto FC',
  'york united': 'Inter Toronto FC',
  'york united fc': 'Inter Toronto FC',
  'inter toronto': 'Inter Toronto FC',
  'fc supra du quebec': 'FC Supra du Québec',
  'fc supra du québec': 'FC Supra du Québec',
  'quebec supra': 'FC Supra du Québec',
  'québec supra': 'FC Supra du Québec'
};

function normalizeTeamName(name: string): string {
  if (!name) return '';
  const trimmed = name.trim().toLowerCase();
  return TEAM_NAME_OVERRIDES[trimmed] || name.trim();
}

export async function computeStandings(competition: string): Promise<StandingsRow[]> {
  try {
    const [teamsRes, matchesRes] = await Promise.all([
      supabase.from('teams').select('id, name, league').eq('league', competition),
      supabase
        .from('matches')
        .select('home_team_id, away_team_id, home_score, away_score, status, competition')
        .eq('competition', competition)
        .eq('status', 'Finished'),
    ]);

    if (teamsRes.error || matchesRes.error || !teamsRes.data) {
      return [];
    }

    const teams: Team[] = teamsRes.data;
    const matches: Match[] = matchesRes.data || [];

    const statsMap: Record<number, { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }> = {};

    teams.forEach((team: Team) => {
      statsMap[team.id] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
    });

    matches.forEach((m: Match) => {
      const home = statsMap[m.home_team_id];
      const away = statsMap[m.away_team_id];
      if (!home || !away) return;

      home.played += 1;
      away.played += 1;
      home.gf += m.home_score || 0;
      home.ga += m.away_score || 0;
      away.gf += m.away_score || 0;
      away.ga += m.home_score || 0;

      if ((m.home_score || 0) > (m.away_score || 0)) {
        home.won += 1;
        home.pts += 3;
        away.lost += 1;
      } else if ((m.home_score || 0) < (m.away_score || 0)) {
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

    return teams
      .map((team: Team) => {
        const s = statsMap[team.id] || { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
        const canonicalName = normalizeTeamName(team.name);
        const gf = s.gf;
        const ga = s.ga;
        return {
          id: team.id,
          slug: team.name,
          external_id: String(team.id),
          position: 1,
          clubName: canonicalName,
          name: canonicalName,
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
    const { data, error } = await supabase
      .from('matches')
      .select('id, competition, home_score, away_score, status, home_teams:teams!home_team_id(name), away_teams:teams!away_team_id(name)')
      .limit(6);

    if (error || !data || data.length === 0) {
      return [
        { id: 't1', competition: 'CPL', homeTeam: 'Forge FC', awayTeam: 'Cavalry FC', homeScore: 2, awayScore: 1, minute: 88, isLive: true },
        { id: 't2', competition: 'NSL', homeTeam: 'AFC Toronto', awayTeam: 'Vancouver Rise', homeScore: 1, awayScore: 1, minute: null, isLive: false },
      ];
    }

    return data.map((m: any, idx: number) => ({
      id: String(m.id || idx),
      competition: m.competition || 'CPL',
      homeTeam: normalizeTeamName(m.home_teams?.name || 'Home Team'),
      awayTeam: normalizeTeamName(m.away_teams?.name || 'Away Team'),
      homeScore: m.home_score || 0,
      awayScore: m.away_score || 0,
      minute: m.status === 'Live' ? 75 : null,
      isLive: m.status === 'Live',
    }));
  } catch (err) {
    return [];
  }
}
