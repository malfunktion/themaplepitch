export async function computeStandings(competition: string): Promise<StandingsRow[]> {
  try {
    // 1. Fetch live imported teams directly from Supabase
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .order('name', { ascending: true });

    if (teamsError || !teamsData || teamsData.length === 0) {
      return [];
    }

    // Filter teams by target league directly from the database
    const filteredTeams = teamsData.filter((t: any) => matchesLeague(t.league, competition));

    if (filteredTeams.length === 0) {
      return [];
    }

    // 2. Fetch matches from database
    const { data: matchesData } = await supabase.from('matches').select('*');

    const targetUpper = competition.toUpperCase();

    const matches: Match[] = (matchesData || []).filter((m: any) => {
      const comp = String(m.competition || m.competition_id || '').toUpperCase();
      const status = (m.status || '').toLowerCase();
      
      // Accept standard finished statuses from API-Football (FT, AET, PEN, finished)
      const isFinished = status === 'finished' || status === 'ft' || status === 'aet' || status === 'pen';
      
      // Check if it matches text name OR if it matches numeric ID conventions if applicable
      const matchesComp = comp.includes(targetUpper) || 
                          comp === (targetUpper === 'CPL' ? '491' : comp); // Adjust ID mapping if needed

      return isFinished && matchesComp;
    });

    const statsMap: Record<number, { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }> = {};

    filteredTeams.forEach((team: any) => {
      statsMap[team.id] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
    });

    // 3. Accumulate stats if finished match fixtures exist
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

    // 4. Return database teams ordered by points, goal differential, or alphabetically
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
    return [];
  }
}

