const eligible = useMemo(() => {
  return players.filter((p) => {
    // Treat undefined/null as true to prevent stripping bulk ingested data
    if (p.is_canadian === false) return false;

    const g = String(p.gender || '').toUpperCase();
    const comp = String(p.league || '').toUpperCase();
    const targetIsFemale = gender === 'WOMEN';

    return targetIsFemale
      ? (g === 'WOMEN' || comp.includes('NSL'))
      : (g === 'MEN' || !comp.includes('NSL'));
  });
}, [players, gender]);
