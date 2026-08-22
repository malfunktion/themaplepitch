// src/lib/data/standings.ts
import { createClient } from '@/lib/supabase/client';
import type { StandingsRow, LiveTickerItem } from '@/lib/types';

type Team = {
  id: number;
  name: string;
  slug: string | null;
  logo_url: string | null;
  league: string;
};

type Match = {
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
  status: string;
  competition: string;
  season?: number;
};

const supabase = createClient();

const TEAM_ACTIVE_SEASONS: Record<string, { start: number; end: number }> = {
  'Forge FC': { start: 2019, end: 2026 },
  'Cavalry FC': { start: 2019, end: 2026 },
  'Pacific FC': { start: 2019, end: 2026 },
  'HFX Wanderers FC': { start: 2019, end: 2026 },
  'Atlético Ottawa': { start: 2020, end: 2026 },
  'Valour FC': { start: 2019, end: 2026 },
  'York United FC': { start: 2019, end: 2024 },
  'Vancouver FC': { start: 2023, end: 2026 },
  'FC Edmonton': { start: 2019, end: 2023 },
  'Inter Toronto FC': { start: 2025, end: 2026 },
  // NSL Clubs (Launched 2025)
  'AFC Toronto': { start: 2025, end: 2026 },
  'Roses de Montréal': { start: 2025, end: 2026 },
  'Vancouver Rise': { start: 2025, end: 2026 },
  'Calgary Wild': { start: 2025, end: 2026 },
  'Ottawa Rapid': { start: 2025, end: 2026 },
  'Halifax Tides': { start: 2025, end: 2026 },
};

const TEAM_NAME_OVERRIDES: Record<string, string> = {
  'york9': 'York United FC',
  'york9 fc': 'York United FC',
  'york united': 'York United FC',
  'york united fc': 'York United FC',
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

function slugify(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function computeStandings(competition: string, season: number = 2026): Promise<StandingsRow[]> {
  try {
    const isCpl = competition.toUpperCase() === 'CPL';
    
    // Fetch teams and matches filtered by season
    const [teamsRes, matchesRes] = await Promise.all([
      supabase.from('teams').select('id, name, slug, logo_url, league').eq('league', competition),
      supabase
        .from('matches')
        .select('home_team_id, away_team_id, home_score, away_score, status, competition, season')
        .eq('competition', competition)
        .eq('season', season),
    ]);

    if (teamsRes.error || !teamsRes.data || teamsRes.data.length === 0) {
      return [];
    }

    const rawTeams: Team[] = teamsRes.data;
    const matches: Match[] = matchesRes.data || [];
    
    const uniqueTeamsMap = new Map<string, Team>();

    rawTeams.forEach(team => {
      const canonicalName = normalizeTeamName(team.name);
      const canonicalLower = canonicalName.toLowerCase();

      // Check if team was active during the requested season
      const lifespan = TEAM_ACTIVE_SEASONS[canonicalName];
      if (lifespan) {
        if (season < lifespan.start || season > lifespan.end) return;
      }

      const existing = uniqueTeamsMap.get(canonicalLower);
      if (!existing) {
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
          slug: team.slug || slugify(team.name),
          external_id: String(team.id),
          logoUrl: team.logo_url || null,
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
        (b.goalsFor || 0) - (a.goalsFor || 0) ||
        a.clubName.localeCompare(b.clubName)
      )
      .map((row, idx) => ({
        ...row,
        position: idx + 1,
      }));
  } catch (err) {
    console.error(`Failed to compute standings for ${competition} in season ${season}:`, err);
    return [];
  }
}

export async function getCplStandings(season: number = 2026): Promise<StandingsRow[]> {
  return computeStandings('CPL', season);
}

export async function getNslStandings(season: number = 2026): Promise<StandingsRow[]> {
  return computeStandings('NSL', season);
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
