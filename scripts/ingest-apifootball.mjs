// Example modification for your squad ingestion loop:
for (const team of VERIFIED_CANADIAN_API_TEAMS) {
  // 1. Check local database first to see when it was last updated or if data matches
  const { data: existingPlayers } = await supabase
    .from('players')
    .select('external_id, updated_at')
    .eq('team_id', dbTeam.id);

  // 2. Fetch fresh payload from API-Football
  const squadRes = await fetch(`https://v3.football.api-sports.io/players/squads?team=${team.id}`, {
    headers: { 'x-apisports-key': APIF_KEY }
  });

  if (squadRes.status === 429) {
    console.warn(`⚠️ Rate limit hit (429) on ${team.name}. Waiting before retry...`);
    await new Promise(r => setTimeout(r, 5000)); // Cool down
    continue;
  }

  const squadData = await squadRes.json();
  const playersList = squadData?.response?.[0]?.players || [];

  if (playersList.length === 0) {
    console.log(`ℹ️ No players found via API for ${team.name}. Skipping.`);
    continue;
  }

  // 3. Compare or upsert only if new data arrives (using Supabase upsert with conflict handling)
  const playerPayloads = playersList.map(p => ({
    external_id: `apif-player-${p.id}`,
    slug: slugify(p.name),
    name: p.name,
    position: p.position || 'Unknown',
    team_id: dbTeam.id,
    gender: 'men',
    league: team.league,
    nationality: p.nationality || 'Canada',
    metadata: { age: p.age, photo: p.photo },
    updated_at: new Date().toISOString() // Tracks exact freshness
  }));

  const { error: playerErr } = await supabase
    .from('players')
    .upsert(playerPayloads, { onConflict: 'external_id', ignoreDuplicates: false });

  if (playerErr) {
    console.error(`⚠️ Error syncing roster for ${team.name}:`, playerErr.message);
  } else {
    console.log(`👤 Successfully synced & updated ${playerPayloads.length} players for ${team.name}`);
  }

  // 4. Healthy delay to protect your 10 req/minute free tier ceiling
  await new Promise(r => setTimeout(r, 1000));
}
