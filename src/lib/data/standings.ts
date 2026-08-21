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
};

const supabase = createClient();

// Official 2026 Active Whitelists & Alias Normalization Maps
const ACTIVE_CPL_CLUBS = [
  'cavalry fc',
  'forge fc',
  'vancouver fc',
  'atlético ottawa',
  'inter toronto fc',
  'york united fc',
  'york9',
  'hfx wanderers fc',
  'pacific fc',
  'fc supra du québec',
  'fc supra du quebec',
  'quebec supra',
  'supra du québec'
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

function slugify(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents (Atlético -> Atletico)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function computeStandings(competition: string): Promise<StandingsRow[]> {
  try {
    const isCpl = competition.toUpperCase() === 'CPL';
    const targetWhitelist = isCpl ? ACTIVE_CPL_CLUBS : ACTIVE_NSL_CLUBS;

    const [teamsRes, matchesRes] = await Promise.all([
      supabase.from('teams').select('id, name, slug, logo_url, league').eq('league', competition),
      supabase
        .from('matches')
        .select('home_team_id, away_team_id, home_score, away_score, status, competition')
        .eq('competition', competition)
        .eq('status', 'Finished'),
    ]);

    if (teamsRes.error || matchesRes.error || !teamsRes.data || teamsRes.data.length === 0) {
      // Fallback arrays guaranteeing clean, exact active teams
      if (isCpl) {
        return [
          { id: 1, position: 1, clubName: 'Forge FC', name: 'Forge FC', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'forge-fc' },
          { id: 2, position: 2, clubName: 'Cavalry FC', name: 'Cavalry FC', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'cavalry-fc' },
          { id: 3, position: 3, clubName: 'Atlético Ottawa', name: 'Atlético Ottawa', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'atletico-ottawa' },
          { id: 4, position: 4, clubName: 'Vancouver FC', name: 'Vancouver FC', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'vancouver-fc' },
          { id: 5, position: 5, clubName: 'FC Supra du Québec', name: 'FC Supra du Québec', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'fc-supra-du-quebec' },
          { id: 6, position: 6, clubName: 'HFX Wanderers FC', name: 'HFX Wanderers FC', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'hfx-wanderers-fc' },
          { id: 7, position: 7, clubName: 'Inter Toronto FC', name: 'Inter Toronto FC', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'inter-toronto-fc' },
          { id: 8, position: 8, clubName: 'Pacific FC', name: 'Pacific FC', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'pacific-fc' },
        ];
      } else {
        return [
          { id: 101, position: 1, clubName: 'AFC Toronto', name: 'AFC Toronto', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'afc-toronto' },
          { id: 102, position: 2, clubName: 'Roses de Montréal', name: 'Roses de Montréal', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'roses-de-montreal' },
          { id: 103, position: 3, clubName: 'Vancouver Rise', name: 'Vancouver Rise', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'vancouver-rise' },
          { id: 104, position: 4, clubName: 'Calgary Wild', name: 'Calgary Wild', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'calgary-wild' },
          { id: 105, position: 5, clubName: 'Ottawa Rapid', name: 'Ottawa Rapid', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'ottawa-rapid' },
          { id: 106, position: 6, clubName: 'Halifax Tides', name: 'Halifax Tides', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, slug: 'halifax-tides' },
        ];
      }
    }

    const rawTeams: Team[] = teamsRes.data;
    const matches: Match[] = matchesRes.data || [];

    const uniqueTeamsMap = new Map<string, Team>();
    rawTeams.forEach(team => {
      const cleanName = (team.name || '').trim().toLowerCase();
      const canonicalName = normalizeTeamName(team.name);
      const canonicalLower = canonicalName.toLowerCase();

      const isWhitelisted = targetWhitelist.some(w => cleanName.includes(w) || canonicalLower.includes(w));
      if (!isWhitelisted) return;

      const existing = uniqueTeamsMap.get(canonicalLower);
      // Prefer whichever row's own name IS the canonical name (the club's
      // current identity) over a historical/rebrand alias row, so we link
      // out using the current team's own slug and crest rather than a
      // retired franchise name's.
      const isCurrentIdentity = cleanName === canonicalLower;
      if (!existing || (isCurrentIdentity && existing.name.toLowerCase() !== canonicalLower)) {
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
