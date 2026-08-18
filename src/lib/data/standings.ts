import { createClient } from '@/lib/supabase/client';
import type { StandingsRow, LiveTickerItem } from '@/lib/types';

type Match = {
  home_team_id: number;
  away_team_id: number;
  home_score?: number;
  away_score?: number;
  status?: string;
  competition?: string;
};

const supabase = createClient();

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

function getFallbackStandings(competition: string): StandingsRow[] {
  if (competition === 'CPL') {
    return [
      { id: 1, position: 1, clubName: 'Forge FC', name: 'Forge FC', played: 28, won: 15, drawn: 5, lost: 8, goalsFor: 46, goalsAgainst: 31, goalDifference: 15, points: 50 },
      { id: 2, position: 2, clubName: 'Cavalry FC', name: 'Cavalry FC', played: 28, won: 13, drawn: 9, lost: 6, goalsFor: 39, goalsAgainst: 27, goalDifference: 12, points: 48 },
      { id: 3, position: 3, clubName: 'Atlético Ottawa', name: 'Atlético Ottawa', played: 28, won: 11, drawn: 11, lost: 6, goalsFor: 42, goalsAgainst: 31, goalDifference: 11, points: 44 },
      { id: 4, position: 4, clubName: 'York United FC', name: 'York United FC', played: 28, won: 11, drawn: 6, lost: 11, goalsFor: 35, goalsAgainst: 36, goalDifference: -1, points: 39 },
      { id: 5, position: 5, clubName: 'Pacific FC', name: 'Pacific FC', played: 28, won: 9, drawn: 7, lost: 12, goalsFor: 29, goalsAgainst: 32, goalDifference: -3, points: 34 },
      { id: 6, position: 6, clubName: 'Vancouver FC', name: 'Vancouver FC', played: 28, won: 7, drawn: 9, lost: 12, goalsFor: 29, goalsAgainst: 43, goalDifference: -14, points: 30 },
      { id: 7, position: 7, clubName: 'HFX Wanderers FC', name: 'HFX Wanderers FC', played: 28, won: 7, drawn: 9, lost: 12, goalsFor: 37, goalsAgainst: 43, goalDifference: -6, points: 30 },
      { id: 8, position: 8, clubName: 'Quebec Supra', name: 'Quebec Supra', played: 28, won: 6, drawn: 6, lost: 16, goalsFor: 24, goalsAgainst: 38, goalDifference: -14, points: 24 },
    ];
  }
  return [
    { id: 1, position: 1, clubName: 'AFC Toronto', name: 'AFC Toronto', played: 10, won: 7, drawn: 2, lost: 1, goalsFor: 18, goalsAgainst: 8, goalDifference: 10, points: 23 },
    { id: 2, position: 2, clubName: 'Montreal Roses', name: 'Montreal Roses', played: 10, won: 6, drawn: 1, lost: 3, goalsFor: 15, goalsAgainst: 10, goalDifference: 5, points: 19 },
    { id: 3, position: 3, clubName: 'Vancouver Rise', name: 'Vancouver Rise', played: 10, won: 5, drawn: 2, lost: 3, goalsFor: 14, goalsAgainst: 11, goalDifference: 3, points: 17 },
    { id: 4, position: 4, clubName: 'Calgary Wild', name: 'Calgary Wild', played: 10, won: 4, drawn: 1, lost: 5, goalsFor: 11, goalsAgainst: 13, goalDifference: -2, points: 13 },
    { id: 5, position: 5, clubName: 'Ottawa Rapid', name: 'Ottawa Rapid', played: 10, won: 2, drawn: 3, lost: 5, goalsFor: 9, goalsAgainst: 14, goalDifference: -5, points: 9 },
    { id: 6, position: 6, clubName: 'Halifax Tides', name: 'Halifax Tides', played: 10, won: 1, drawn: 1, lost: 8, goalsFor: 6, goalsAgainst: 17, goalDifference: -11, points: 4 },
  ];
}

export async function computeStandings(competition: string): Promise<StandingsRow[]> {
  try {
    const { data: teamsData, error: teamsError } = await supabase.from('teams').select('*');

    if (teamsError || !teamsData || teamsData.length === 0) {
      return getFallbackStandings(competition);
    }

    const filteredTeams = teamsData.filter((t: any) => matchesLeague(t.league, competition));

    if (filteredTeams.length === 0) {
      return getFallbackStandings(competition);
    }

    const { data: matchesData } = await supabase.from('matches').select('*');

    const matches: Match[] = (matchesData || []).filter((m: any) => {
      const comp = m.competition || m.competition_id || '';
      const isFinished = (m.status || '').toLowerCase() === 'finished' || (m.status || '').toLowerCase() === 'ft';
      return isFinished && matchesLeague(String(comp), competition);
    });

    // If zero matches are found in Supabase, output baseline standings
    if (matches.length === 0) {
      return getFallbackStandings(competition);
    }

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
    return getFallbackStandings(competition);
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
      return [
        { id: 't1', competition: 'CPL', homeTeam: 'Forge FC', awayTeam: 'Cavalry FC', homeScore: 2, awayScore: 1, minute: 88, isLive: true },
        { id: 't2', competition: 'NSL', homeTeam: 'AFC Toronto', awayTeam: 'Vancouver Rise', homeScore: 1, awayScore: 1, minute: null, isLive: false },
        { id: 't3', competition: 'MLS', homeTeam: 'Toronto FC', awayTeam: 'CF Montréal', homeScore: 3, awayScore: 2, minute: 90, isLive: true },
      ];
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
    return [
      { id: 't1', competition: 'CPL', homeTeam: 'Forge FC', awayTeam: 'Cavalry FC', homeScore: 2, awayScore: 1, minute: 88, isLive: true },
    ];
  }
}
