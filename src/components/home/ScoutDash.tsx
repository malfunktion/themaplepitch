import React from 'react';

// Define the types matching what page.tsx is passing
export interface StandingsRow {
  position: number;
  team: string;
  played: number;
  points: number;
}

export interface UpcomingFixture {
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  time: string;
  venue: string;
}

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
              {standings.slice(0, 3).map((row) => (
                <div key={row.team} className="flex justify-between py-2 px-3">
                  <span>{row.position}. {row.team}</span>
                  <span className="font-bold">{row.points} PTS</span>
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
              <div className="text-red-600 font-bold">{fixture.league}</div>
              <div className="text-neutral-900 font-semibold">{fixture.homeTeam} vs {fixture.awayTeam}</div>
              <div className="text-neutral-500">{fixture.date} — {fixture.venue}</div>
            </div>
          ) : (
            <p className="text-xs font-mono text-neutral-500">No upcoming fixtures scheduled.</p>
          )}
        </div>
      </div>
    </section>
  );
}
