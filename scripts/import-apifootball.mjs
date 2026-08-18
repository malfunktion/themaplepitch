async function importPlayers(teams) {
  console.log('Importing player rosters from API-Football squads...');
  
  // Strict filter: only target teams whose names match known Canadian professional clubs
  const canadianTeamNames = [
    'cavalry', 'forge', 'hFX wanderers', 'valour', 'atletico ottawa', 
    'pacific', 'valour', 'york united', 'inter toronto', 'vancouver fc', 
    'halifax wanderers', 'cavalry fc', 'forge fc', 'vancouver whitecaps', 
    'toronto fc', 'cf montreal', 'montreal'
  ];

  const canadianTeams = teams.filter(t => {
    const name = t.name.toLowerCase();
    return t.league === 'CPL' || t.league === 'NSL' || canadianTeamNames.some(c => name.includes(c));
  });

  let totalPlayersUpserted = 0;

  for (const team of canadianTeams) {
    const apiTeamId = team.external_id;
    if (!apiTeamId || isNaN(Number(apiTeamId))) continue;

    try {
      console.log(`Fetching squad for Canadian team: ${team.name} (API ID: ${apiTeamId})`);
      const squadData = await fetchApiFootball(`/players/squads?team=${apiTeamId}`);
      
      if (!squadData || squadData.length === 0 || !squadData[0].players) {
        continue;
      }

      const roster = squadData[0].players.map((p) => {
        const pSlug = `${slugify(p.name)}-${p.id || Math.floor(Math.random() * 10000)}`;
        return {
          external_id: pSlug,
          name: p.name,
          league: team.league || 'Domestic',
          gender: team.league === 'NSL' ? 'women' : 'men',
          position: normalizePosition(p.position),
          goals: 0,
          assists: 0,
          rating: 7.0,
          current_team_id: team.id,
          nationality: 'Canada',
        };
      });

      if (roster.length > 0) {
        const { data: inserted, error: playerErr } = await supabase
          .from('players')
          .upsert(roster, { onConflict: 'external_id' })
          .select('id');

        if (playerErr) {
          console.error(`Error upserting roster for ${team.name}:`, playerErr.message);
        } else {
          totalPlayersUpserted += inserted?.length || roster.length;
        }
      }
    } catch (err) {
      console.warn(`Warning: Could not fetch squad for ${team.name}: ${err.message}`);
    }
    // 1.5 second delay to strictly respect API-Football rate limits
    await sleep(1500);
  }

  console.log(`Successfully upserted ${totalPlayersUpserted} total player profiles into Supabase.`);
}
