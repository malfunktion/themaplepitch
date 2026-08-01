import React from 'react';
import type { StandingsRow, UpcomingFixture } from '@/lib/types';

interface ScoutDashProps {
  standings?: StandingsRow[];
  fixture?: UpcomingFixture;
}

export default function ScoutDash({ standings, fixture }: ScoutDashProps) {
  return (
    <section className="border border-neutral-200 bg-white p-6 rounded-none">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
        <h2 className="text-xs font-mono tracking-widest uppercase text-neutral-500">
          // SCOUT DASHBOARD & ANALYTICS
        </h2>
        <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
      </div>

      <div className="space-y-6">
        {/* Standings Widget Preview */}
        <div>
          <h3 className="text-xs font-mono uppercase text-neutral-400 mb-2">League Standings Preview</h3>
          {standings && standings.length > 0 ? (
            <div className="border border-neutral-100 divide-y divide-neutral-100 text-xs font-mono">
              {standings.slice(0, 3).map((row: any, idx: number) => (
                <div key={row.id || row.team || idx} className="flex justify-between py-2 px-3">
                  <span>{row.position || idx + 1}. {row.team || row.team_name || 'Team'}</span>
                  <span className="font-bold">{row.points ?? 0} PTS</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-neutral-500">Standings syncing...</p>
          )}
        </div>

        {/* Fixture Widget Preview */}
        <div>
          <h3 className="text-xs font-mono uppercase text-neutral-400 mb-2">Next Featured Match</h3>
          {fixture ? (
            <div className="border border-neutral-200 p-3 bg-neutral-50 text-xs font-mono space-y-1">
              <div className="text-red-600 font-bold">{(fixture as any).league || 'CPL / MLS'}</div>
              <div className="text-neutral-900 font-semibold">
                {(fixture as any).homeTeam || (fixture as any).home_team || 'Home'} vs {(fixture as any).awayTeam || (fixture as any).away_team || 'Away'}
              </div>
              <div className="text-neutral-500">{(fixture as any).date || 'Upcoming'}</div>
            </div>
          ) : (
            <p className="text-xs font-mono text-neutral-500">No upcoming fixtures scheduled.</p>
          )}
        </div>
      </div>
    </section>
  );
}
