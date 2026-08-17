async function importPlayers() {
  console.log('Importing core Canadian player profiles...');

  const corePlayers = [
    { name: 'Jonathan David', league: 'Abroad', gender: 'men', position: 'ST' },
    { name: 'Alphonso Davies', league: 'Abroad', gender: 'men', position: 'LB' },
    { name: 'Stephen Eustáquio', league: 'Abroad', gender: 'men', position: 'CM' },
    { name: 'Tajon Buchanan', league: 'Abroad', gender: 'men', position: 'RW' },
    { name: 'Ismaël Koné', league: 'Abroad', gender: 'men', position: 'CM' },
    { name: 'Alistair Johnston', league: 'Abroad', gender: 'men', position: 'RB' },
    { name: 'Jonathan Osorio', league: 'MLS', gender: 'men', position: 'CM' },
    { name: 'Kamal Miller', league: 'MLS', gender: 'men', position: 'CB' },
    { name: 'Jessie Fleming', league: 'Abroad', gender: 'women', position: 'CM' },
    { name: 'Simi Awujo', league: 'Abroad', gender: 'women', position: 'CDM' },
    { name: 'Shelina Zadorsky', league: 'Abroad', gender: 'women', position: 'CB' },
    { name: 'Evelyne Viens', league: 'NSL', gender: 'women', position: 'ST' },
    { name: 'Jorian Baucom', league: 'NSL', gender: 'women', position: 'ST' },
    { name: 'Terran Campbell', league: 'CPL', gender: 'men', position: 'ST' },
    { name: 'Moses Dyer', league: 'CPL', gender: 'men', position: 'ST' }
  ];

  // Map to match columns present in your players table schema
  const initialPlayers = corePlayers.map(p => ({
    name: p.name,
    position: p.position
  }));

  // Using 'name' as the conflict target since the table uses name uniqueness
  const { error } = await supabase.from('players').upsert(initialPlayers, { onConflict: 'name' });
  if (error) {
    console.error(`Player stats upsert failed: ${error.message}`);
  } else {
    console.log(`Successfully upserted ${initialPlayers.length} player profiles into Supabase.`);
  }
}
