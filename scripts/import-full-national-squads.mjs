// Inside NationalTeamsContent component:
const [squad, setSquad] = useState<PlayerAsset[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  async function fetchNationalData() {
    setIsLoading(true);
    const genderDb = activeGender === 'MEN' ? 'men' : 'women';
    const nationalTag = activeGender === 'MEN' ? 'CanMNT' : 'CanWNT';

    // Fetch all players matching gender and national team metadata or tags
    const { data: playerData, error } = await supabase
      .from('players')
      .select('*')
      .eq('gender', genderDb)
      .order('rating', { ascending: false });

    if (playerData) {
      // Filter safely in JS to catch both metadata tags and general national team pool assets
      const filtered = playerData.filter(p => 
        p.squad_type === activeAge || 
        p.metadata?.national_team === nationalTag ||
        p.league === 'CanMNT' || p.league === 'CanWNT' ||
        p.league === 'Abroad' || p.league === 'MLS' || p.league === 'NWSL' || p.league === 'NSL'
      );
      
      // Fallback to full list if strict filter is too narrow
      setSquad(filtered.length > 0 ? filtered : playerData);
    }
    setIsLoading(false);
  }

  fetchNationalData();
}, [activeGender, activeAge]);

// Split Squad into Starting XI (Top 11) and Depth/Substitutes (The Rest)
const startingXI = squad.slice(0, 11);
const substitutes = squad.slice(11);

// Helper to group substitutes by position category securely
const getSubsByPosition = (posCategory: 'GK' | 'DEF' | 'MID' | 'FWD') => {
  return substitutes.filter(p => {
    const pos = (p.position || '').toUpperCase();
    if (posCategory === 'GK') return pos.includes('GK');
    if (posCategory === 'DEF') return pos.includes('CB') || pos.includes('LB') || pos.includes('RB') || pos.includes('FB') || pos.includes('DEF') || pos.includes('WB');
    if (posCategory === 'MID') return pos.includes('CM') || pos.includes('DM') || pos.includes('AM') || pos.includes('LM') || pos.includes('RM') || pos.includes('MID');
    if (posCategory === 'FWD') return pos.includes('ST') || pos.includes('FW') || pos.includes('LW') || pos.includes('RW') || pos.includes('W') || pos.includes('CF');
    return false;
  });
};
