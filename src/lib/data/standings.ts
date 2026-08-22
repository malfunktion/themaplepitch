// src/lib/data/standings.ts
import { createClient } from '@/lib/supabase/client';
import type { StandingsRow, LiveTickerItem } from '@/lib/types';

const supabase = createClient();

// Temporal Franchise Lifespan & Historical Name mapping per season
const CPL_FRANCHISE_HISTORY: Record<string, { start: number; end: number; getName: (season: number) => string }> = {
  'forge': { start: 2019, end: 2026, getName: () => 'Forge FC' },
  'cavalry': { start: 2019, end: 2026, getName: () => 'Cavalry FC' },
  'pacific': { start: 2019, end: 2026, getName: () => 'Pacific FC' },
  'hfx wanderers': { start: 2019, end: 2026, getName: () => 'HFX Wanderers FC' },
  'atletico ottawa': { start: 2020, end: 2026, getName: () => 'Atlético Ottawa' },
  'valour': { start: 2019, end: 2025, getName: () => 'Valour FC' }, // Folded after 2025
  'vancouver fc': { start: 2023, end: 2026, getName: () => 'Vancouver FC' },
  // The Evolution of the York/Inter Toronto Franchise
  'york_inter': { 
    start: 2019, 
    end: 2026, 
    getName: (season: number) => {
      if (season <= 2020) return 'York9 FC';
      if (season <= 2024) return 'York United FC';
      return 'Inter Toronto FC';
    } 
  },
  'edmonton': { start: 2019, end: 2023, getName: () => 'FC Edmonton' },
  'supra': { start: 2019, end: 2026, getName: () => 'FC Supra du Québec' }
};

export async function computeStandings(competition: string, season: number = 2026): Promise<StandingsRow[]> {
  try {
    const compUpper = competition.toUpperCase();

    // If querying CPL historical standings, check our dedicated historical_standings table first!
    if (compUpper === 'CPL') {
      const { data: histData, error: histErr } = await supabase
        .from('historical_standings')
        .select('*')
        .eq('season', season)
        .eq('competition', 'CPL');

      if (!histErr && histData && histData.length > 0) {
        return histData
          .sort((a, b) => b.points - a.points || b.goal_difference - a.goal_difference || b.goals_for - a.goals_for)
          .map((row, idx) => ({
            id: idx + 1,
            slug: slugify(row.club_name),
            external_id: `${season}-${slugify(row.club_name)}`,
            logoUrl: null,
            position: row.position || idx + 1,
            clubName: row.club_name,
            name: row.club_name,
            played: row.played,
            won: row.won,
            drawn: row.drawn,
            lost: row.lost,
            goalsFor: row.goals_for,
            goalsAgainst: row.goals_against,
            goalDifference: row.goal_difference,
            points: row.points,
          }));
      }
    }

    // Fallback or non-CPL dynamic calculation from matches table
    const { data: matchesRes } = await supabase
      .from('matches')
      .select('*, home_teams:teams!home_team_id(name), away_teams:teams!away_team_id(name)')
      .eq('season', season);

    const matches = (matchesRes || []).filter(m => String(m.competition || '').toUpperCase().includes(compUpper));
    
    // Aggregate points dynamically if pre-calculated standings aren't found
    const statsMap = new Map<string, { name: string; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }>();

    matches.forEach(m => {
      const homeName = m.home_teams?.name || 'Home Team';
      const awayName = m.away_teams?.name || 'Away Team';
      const hScore = m.home_goals ?? m.home_score ?? 0;
      const aScore = m.away_goals ?? m.away_score ?? 0;

      if (!statsMap.has(homeName)) statsMap.set(homeName, { name: homeName, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 });
      if (!statsMap.has(awayName)) statsMap.set(awayName, { name: awayName, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 });

      const h = statsMap.get(homeName)!;
      const a = statsMap.get(awayName)!;

      h.played += 1; a.played += 1;
      h.gf += hScore; h.ga += aScore;
      a.gf += aScore; a.ga += hScore;

      if (hScore > aScore) { h.won += 1; h.pts += 3; a.lost += 1; }
      else if (hScore < aScore) { a.won += 1; a.pts += 3; h.lost += 1; }
      else { h.drawn += 1; h.pts += 1; a.drawn += 1; a.pts += 1; }
    });

    return Array.from(statsMap.values())
      .map((s, idx) => ({
        id: idx + 1,
        slug: slugify(s.name),
        external_id: slugify(s.name),
        logoUrl: null,
        position: idx + 1,
        clubName: s.name,
        name: s.name,
        played: s.played,
        won: s.won,
        drawn: s.drawn,
        lost: s.lost,
        goalsFor: s.gf,
        goalsAgainst: s.ga,
        goalDifference: s.gf - s.ga,
        points: s.pts,
      }))
      .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor)
      .map((row, idx) => ({ ...row, position: idx + 1 }));

  } catch (err) {
    console.error(`Error computing standings for ${competition} (${season}):`, err);
    return [];
  }
}

function slugify(name: string): string {
  return (name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function getCplStandings(season: number = 2026): Promise<StandingsRow[]> {
  return computeStandings('CPL', season);
}

export async function getNslStandings(season: number = 2026): Promise<StandingsRow[]> {
  return computeStandings('NSL', season);
}

export async function getMlsStandings(season: number = 2026): Promise<StandingsRow[]> {
  return computeStandings('MLS', season);
}

export async function getNwslStandings(season: number = 2026): Promise<StandingsRow[]> {
  return computeStandings('NWSL', season);
}
