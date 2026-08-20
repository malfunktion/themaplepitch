import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import { supabase } from '@/lib/supabase/client';

export const revalidate = 60; // Revalidate index every 60s

export default async function PlayersPage() {
  const { data: dbPlayers } = await supabase
    .from('players')
    .select(`
      *,
      current_team:teams!current_team_id (
        id,
        name,
        slug
      )
    `)
    .order('rating', { ascending: false });

  const playerList = dbPlayers || [];

  return (
    <>
      <HubHeader
        eyebrow="Entity index // Players"
        title="PLAYER INDEX"
        description="One canonical player entity powers profiles, scouting, comparisons, pathway views and statistics. Live data sourced from Supabase telemetry."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['PLAYERS', playerList.length],
          [
            'CANADIANS',
            playerList.filter((p) => (p.nationality || '').includes('Canada') || p.nationality === 'CAN').length,
          ],
          ['POSITIONS', new Set(playerList.map((p) => p.position)).size],
          [
            'WOMEN / NSL',
            playerList.filter((p) => p.gender === 'women' || p.league === 'NSL').length,
          ],
        ].map(([a, b]) => (
          <div key={String(a)} className="border border-border bg-card p-4">
            <div className="text-[9px] font-mono uppercase text-charcoal-soft">
              {a}
            </div>
            <div className="mt-2 text-3xl font-black">{b}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {playerList.map((p) => {
          const team = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
          const teamName = team?.name || p.league || 'Free Agent';
          const playerRouteParam = p.slug || p.external_id || p.id;

          return (
            <Link
              key={p.id}
              href={`/players/${playerRouteParam}`}
              className="group border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-crimson">
                    {p.position || 'CM'} {'// '}
                    {p.nationality || 'CAN'}
                  </div>
                  <h2 className="mt-1 text-xl font-black group-hover:text-crimson">
                    {p.name}
                  </h2>
                  <p className="text-xs text-charcoal-soft">{teamName}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black">
                    {p.rating ? Number(p.rating).toFixed(1) : '—'}
                  </div>
                  <div className="text-[9px] font-mono uppercase text-charcoal-soft">
                    RATING
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2 border-t border-border pt-3 text-center">
                {[
                  ['G', p.goals ?? 0],
                  ['A', p.assists ?? 0],
                  ['POS', p.position || '—'],
                  ['LEAGUE', p.league || 'Domestic'],
                ].map(([k, v]) => (
                  <div key={String(k)}>
                    <div className="text-sm font-bold">{v}</div>
                    <div className="text-[8px] font-mono text-charcoal-soft">
                      {k}
                    </div>
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-6">
        <SourceStamp source={{ name: 'Supabase Live Player Vault', accessedAt: new Date().toISOString() }} />
      </div>
    </>
  );
}
