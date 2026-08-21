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

// Official 2026 Active Whitelists & Alias Normalization Maps
const ACTIVE_CPL_CLUBS = [
  'cavalry fc',
  'forge fc',
  'vancouver fc',
  'atlético ottawa',
  'inter toronto fc',
  'york united fc', // mapped via normalization
  'york9',          // mapped via normalization
  'hfx wanderers fc',
  'pacific fc',
  'fc supra du québec',
  'fc supra du quebec',
  'quebec supra',
  'valour fc'
];

const ACTIVE_NSL_CLUBS = [
  'afc toronto',
  'calgary wild',
  'halifax tides',
  'ottawa rapid',
  'roses de montréal',
  'montreal roses',
  'vancouver rise'
];

const TEAM_NAME_OVERRIDES: Record<string, string> = {
  'york9': 'Inter Toronto FC',
  'york9 fc': 'Inter Toronto FC',
  'york united': 'Inter Toronto FC',
  'york united fc': 'Inter Toronto FC',
  'inter toronto': 'Inter Toronto FC',
  'inter toronto fc': 'Inter Toronto FC',
  'fc supra du quebec': 'FC Supra du Québec',
  'fc supra du québec': 'FC Supra du Québec',
  'quebec supra': 'FC Supra du Québec',
  'québec supra': 'FC Supra du Québec',
  'supra': 'FC Supra du Québec',
  'supra du québec': 'FC Supra du Québec',
  'montreal roses': 'Roses de Montréal',
  'montreal roses fc': 'Roses de Montréal',
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

    const rawTeams: Team[] = teamsRes.data;
    const matches: Match[] = matchesRes.data || [];

    const targetWhitelist = competition.toUpperCase() === 'CPL' ? ACTIVE_CPL_CLUBS : ACTIVE_NSL_CLUBS;

    // Filter raw teams strictly against the official active whitelist
    const uniqueTeamsMap = new Map<string, Team>();
    rawTeams.forEach(team => {
      const cleanName = (team.name || '').trim().toLowerCase();
      const canonicalName = normalizeTeamName(team.name);
      const canonicalLower = canonicalName.toLowerCase();

      // Check if team matches our active whitelist (either directly or through alias mapping)
      const isWhitelisted = targetWhitelist.some(w => cleanName.includes(w) || canonicalLower.includes(w));
      if (!isWhitelisted) return;

      if (!uniqueTeamsMap.has(canonicalLower)) {
        uniqueTeamsMap.set(canonicalLower, {
          ...team,
          name: canonicalName,
        });
      }
    });

    const teams = Array.from(uniqueTeamsMap.values());
    const canonicalIdMap = new Map<number, number>();

    rawTeams.forEach(raw => {
      const canonicalName = normalizeTeamName(raw.name).toLowerCase();
      const targetTeam = uniqueTeamsMap.get(canonicalName);
      if (targetTeam) {
        canonicalIdMap.set(raw.id, targetTeam.id);
      }
    });

    const statsMap: Record<number, { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }> = {};

    teams.forEach(team => {
      statsMap[team.id] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
    });

    matches.forEach(m => {
      const canonicalHomeId = canonicalIdMap.get(m.home_team_id);
      const canonicalAwayId = canonicalIdMap.get(m.away_team_id);
      
      if (!canonicalHomeId || !canonicalAwayId || canonicalHomeId === canonicalAwayId) return;

      const home = statsMap[canonicalHomeId];
      const away = statsMap[canonicalAwayId];
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

    return teams
      .map(team => {
        const s = statsMap[team.id] || { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
        const gf = s.gf;
        const ga = s.ga;
        return {
          id: team.id,
          slug: team.name,
          external_id: String(team.id),
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
      .sort((a, b) => 
        b.points - a.points || 
        b.goalDifference - a.goalDifference || 
        b.goalsFor - a.goalsFor ||
        a.clubName.localeCompare(b.clubName)
      )
      .map((row, idx) => ({
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
      return [];
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
