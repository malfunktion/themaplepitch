// Inside the roster table mapping in src/app/national-teams/page.tsx
{players.map((p, idx) => {
  const playerSlug = p.slug || p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const tabType = activeGender === 'WOMEN' ? 'CANWNT' : 'CANMNT';

  return (
    <tr key={p.id || idx} className="border-b border-border/40 hover:bg-surface/50 transition-colors">
      <td className="py-2.5 px-2 font-mono text-xs text-neutral-500">{p.number || idx + 1}</td>
      <td className="py-2.5 px-3 font-bold text-charcoal dark:text-white hover:text-crimson transition-colors">
        <Link href={`/players/${playerSlug}?tab=${tabType}`}>
          {p.name} ➔
        </Link>
      </td>
      <td className="py-2.5 px-3 text-xs font-mono text-crimson">{p.position}</td>
      <td className="py-2.5 px-3 text-xs font-mono text-neutral-400">{p.club || 'Unattached'}</td>
      <td className="py-2.5 px-3 text-right text-xs font-mono text-neutral-300">{p.caps ?? 0}</td>
      <td className="py-2.5 px-3 text-right text-xs font-mono text-neutral-400">
        {p.goals ?? 0} / {p.assists ?? 0}
      </td>
    </tr>
  );
})}
