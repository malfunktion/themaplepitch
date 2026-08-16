import Link from 'next/link';

// TODO: swap for a real query against the Supabase `live_streams` table
// once that's wired in. Deliberately left static/muted for now — the
// table exists but nothing reads from it yet, and we didn't want a live
// data dependency here before that's ready.
const PLACEHOLDER_MATCHES: {
  id: string;
  title: string;
  league: string;
  status: 'LIVE' | 'UPCOMING';
  detail: string;
}[] = [
  { id: 'cpl-forge-vs-cavalry', title: 'Forge FC vs Cavalry FC', league: 'CPL', status: 'LIVE', detail: "67'" },
  { id: 'nsl-vancouver-vs-toronto', title: 'Vancouver Rise vs AFC Toronto', league: 'NSL', status: 'UPCOMING', detail: 'Sat 7:00 PM ET' },
  { id: 'league1-simcoe-vs-scrosoppi', title: 'Simcoe County vs Scrosoppi FC', league: 'League1', status: 'UPCOMING', detail: 'Sun 2:00 PM ET' },
];

export default function MatchCenterHubPage() {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6 rounded-sm border border-crimson/40 bg-card p-6">
        <div className="text-xs font-mono font-bold tracking-wider text-crimson uppercase">THE MAPLE PITCH // MATCH CENTRE</div>
        <h1 className="mt-2 text-4xl font-black text-charcoal">MATCH CENTRE</h1>
        <p className="mt-2 text-sm text-charcoal-soft">Live trackers, tactical views, and official broadcast links.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {PLACEHOLDER_MATCHES.map((match) => {
          const isLive = match.status === 'LIVE';
          return (
            <Link
              key={match.id}
              href={`/match-centre/${match.id}`}
              className={`rounded-sm border bg-card p-4 transition-colors ${
                isLive ? 'border-crimson/50 hover:border-crimson' : 'border-border hover:border-crimson/60'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-border text-charcoal-soft uppercase">
                  {match.league}
                </span>
                {isLive ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-crimson">
                    <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse"></span>
                    LIVE {match.detail}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-charcoal-soft">{match.detail}</span>
                )}
              </div>
              <div className="text-sm font-bold text-charcoal">{match.title}</div>
              <div className="mt-2 text-xs font-mono text-crimson">Open match centre →</div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
