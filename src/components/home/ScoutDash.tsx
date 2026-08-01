import React from 'react';
import type { StandingsRow, UpcomingFixture } from '@/lib/types';

interface ScoutDashProps {
  standings?: StandingsRow[];
  fixture?: UpcomingFixture;
}

export default function ScoutDash({ standings = [], fixture }: ScoutDashProps) {
  return (
    <section className="bg-white border border-neutral-300 p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
        <h2 className="text-xs font-mono tracking-widest text-neutral-900 uppercase">
          // SCOUT_DASHBOARD // STANDINGS
        </h2>
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-500">
              <th className="py-2">#</th>
              <th className="py-2">CLUB</th>
              <th className="py-2 text-right">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.length > 0 ? (
              standings.slice(0, 5).map((row, idx) => (
                <tr key={row.clubName} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-2 text-neutral-500">{row.position ?? idx + 1}</td>
                  <td className="py-2 font-medium text-neutral-900 truncate max-w-[120px]">{row.clubName}</td>
                  <td className="py-2 text-right font-bold text-red-600">{row.points}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="py-2 text-neutral-500">Standings syncing...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2 border-t border-neutral-200 pt-4">
        <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
          Next Fixture Target
        </div>
        {fixture ? (
          <div className="bg-neutral-50 border border-neutral-200 p-3 flex justify-between items-center">
            <div>
              <div className="text-xs font-bold font-mono">
                {fixture.homeTeam.toUpperCase()} vs {fixture.awayTeam.toUpperCase()}
              </div>
              <div className="text-[10px] text-neutral-500 font-mono">
                {fixture.venue} • {fixture.date} {fixture.time}
              </div>
            </div>
            
              href="#tickets"
              className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-mono font-bold px-3 py-1.5 transition-colors"
            >
              TICKETS
            </a>
          </div>
        ) : (
          <p className="text-[10px] text-neutral-500 font-mono">No upcoming fixtures scheduled.</p>
        )}
      </div>
    </section>
  );
}
