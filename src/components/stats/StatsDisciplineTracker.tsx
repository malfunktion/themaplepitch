// src/components/stats/StatsDisciplineTracker.tsx
'use client';

import React from 'react';

type DisciplineRow = {
  playerId?: string;
  name: string;
  club: string;
  yellows: number;
  reds: number;
};

interface StatsDisciplineTrackerProps {
  discipline?: DisciplineRow[];
}

export default function StatsDisciplineTracker({ discipline = [] }: StatsDisciplineTrackerProps) {
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-3 font-mono">
      <div className="flex justify-between items-center text-xs text-charcoal-soft">
        <span>DISCIPLINE MONITOR</span>
        <span className="text-red-600 font-bold">CARDS &amp; FOULS</span>
      </div>
      <p className="text-[10px] text-charcoal-soft">
        Tracking yellow and red cards, suspensions, and disciplinary logs across competitions from the database.
      </p>
      {discipline.length === 0 ? (
        <div className="py-4 text-center text-[10px] text-charcoal-soft">
          NO DISCIPLINARY RECORDS FOUND
        </div>
      ) : (
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="text-charcoal-soft border-b border-border uppercase text-[9px]">
              <th className="py-1.5 font-normal">Player</th>
              <th className="py-1.5 font-normal">Club</th>
              <th className="py-1.5 font-normal text-right">Yellow</th>
              <th className="py-1.5 font-normal text-right">Red</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {discipline.map((d, i) => (
              <tr key={d.playerId || i}>
                <td className="py-1.5 text-charcoal font-bold">{d.name}</td>
                <td className="py-1.5 text-charcoal-soft">{d.club}</td>
                <td className="py-1.5 text-right text-charcoal">{d.yellows}</td>
                <td className="py-1.5 text-right text-crimson font-bold">{d.reds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
