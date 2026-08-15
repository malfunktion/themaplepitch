// src/app/players/page.tsx

import Link from 'next/link';
import HubHeader from '@/components/entity/HubHeader';
import SourceStamp from '@/components/entity/SourceStamp';
import { players } from '@/lib/data/demo';

export default function PlayersPage() {
  const ranked = [...players].sort((a, b) => b.rating - a.rating);
  return (
    <>
      <HubHeader
        eyebrow="Entity index // Players"
        title="PLAYER INDEX"
        description="One canonical player entity powers profiles, scouting, comparisons, pathway views and statistics. This index is currently seeded with clearly labelled demonstration records."
      />{' '}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['PLAYERS', players.length],
          [
            'CANADIANS',
            players.filter((p) => p.nationality.includes('Canada')).length,
          ],
          ['POSITIONS', new Set(players.map((p) => p.position)).size],
          [
            'ABROAD WATCH',
            players.filter((p) => p.pathway.some((x) => x === 'Europe')).length,
          ],
        ].map(([a, b]) => (
          <div key={String(a)} className="border border-border bg-card p-4">
            <div className="text-[9px] font-mono uppercase text-charcoal-soft">
              {a}
            </div>
            <div className="mt-2 text-3xl font-black">{b}</div>
          </div>
        ))}
      </div>{' '}
      <div className="grid gap-4 md:grid-cols-2">
        {ranked.map((p) => (
          <Link
            key={p.id}
            href={`/players/${p.slug}`}
            className="group border border-border bg-surface p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-crimson">
                  {p.position} {'// '}
                  {p.province ?? 'CAN'}
                </div>
                <h2 className="mt-1 text-xl font-black group-hover:text-crimson">
                  {p.name}
                </h2>
                <p className="text-xs text-charcoal-soft">{p.clubName}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black">{p.rating}</div>
                <div className="text-[9px] font-mono uppercase text-charcoal-soft">
                  INDEX
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2 border-t border-border pt-3 text-center">
              {[
                ['G', p.goals],
                ['A', p.assists],
                ['xG', p.xG.toFixed(1)],
                ['MIN', p.minutes],
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
        ))}
      </div>
      <div className="mt-6">
        <SourceStamp />
      </div>
    </>
  );
}
