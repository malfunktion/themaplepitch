import { createClient } from '@/lib/supabase/client';

export type StandingsRow = {
  id: number;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

const supabase = createClient();

export async function computeStandings(competition: string): Promise<StandingsRow[]> {
  try {
    const [teamsRes, matchesRes] = await Promise.all([
      supabase.from('teams').select('id, name').eq('league', competition),
      supabase
        .from('matches')
        .select('home_team_id, away_team_id, home_score, away_score')
        .eq('competition', competition)
        .eq('status', 'Finished'),
    ]);

    if (teamsRes.error || matchesRes.error || !teamsRes.data) {
      return [];
    }

    const teams = teamsRes.data;
    const matches = matchesRes.data || [];

    const statsMap: Record<number, { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }> = {};

    teams.forEach(team => {
      statsMap[team.id] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
    });

    matches.forEach(m => {
      const home = statsMap[m.home_team_id];
      const away = statsMap[m.away_team_id];
      if (!home || !away) return;

      home.played += 1;
      away.played += 1;
      home.gf += m.home_score;
      home.ga += m.away_score;
      away.gf += m.away_score;
      away.ga += m.home_score;

      if (m.home_score > m.away_score) {
        home.won += 1;
        home.pts += 3;
        away.lost += 1;
      } else if (m.home_score < m.away_score) {
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
        const s = statsMap[team.id];
        return {
          id: team.id,
          name: team.name,
          played: s.played,
          won: s.won,
          drawn: s.drawn,
          lost: s.lost,
          goalsFor: s.gf,
          goalsAgainst: s.ga,
          goalDifference: s.gf - s.ga,
          points: s.pts,
        };
      })
      .sort((a, b) => b.points - b.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
  } catch (err) {
    console.error(`Failed to compute standings for ${competition}:`, err);
    return [];
  }
}

export async function getCplStandings() {
  return computeStandings('CPL');
}

export async function getNslStandings() {
  return computeStandings('NSL');
}
