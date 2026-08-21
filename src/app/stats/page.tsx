const filteredPlayers = useMemo(() => {
  return activePlayers.filter((p: any) => {
    // 1. Gender check with fallback
    const g = String(p.gender || '').toUpperCase();
    const comp = String(p.league || p.competitionName || p.competition || '').toUpperCase();
    
    const isWomen = programGender === 'WOMEN';
    const matchesGender = isWomen
      ? (g === 'WOMEN' || comp.includes('NSL') || comp.includes('WOMEN'))
      : (g === 'MEN' || comp.includes('CPL') || comp.includes('MEN') || (!g && !comp.includes('NSL')));

    if (!matchesGender) return false;

    // 2. Citizenship Fallback:
    // Presume Canadian unless explicitly flagged false (since most ingested rows lack the tag)
    const isCanadian = p.is_canadian !== false && String(p.nationality || '').toLowerCase() !== 'foreign';
    if (!isCanadian) return false;

    // 3. League / Competition Dropdown Filter
    if (competition === 'CPL') {
      return comp.includes('CPL') || comp.includes('CANADIAN PREMIER LEAGUE');
    } 
    if (competition === 'NSL') {
      return comp.includes('NSL') || comp.includes('NORTHERN SUPER LEAGUE');
    } 
    if (competition === 'ABROAD') {
      return comp.includes('ABROAD') || comp.includes('MLS') || comp.includes('EUROPE') || (!comp.includes('CPL') && !comp.includes('NSL'));
    }

    // 'ALL CANADIAN' returns all matching gender & citizenship criteria
    return true;
  });
}, [activePlayers, programGender, competition]);
