// src/components/stats/StatsTeamOfWeek.tsx
'use client';

import React from 'react';

type TeamOfWeekPlayer = {
  playerId?: string;
  pos?: string;
  name: string;
  club: string;
};

interface StatsTeamOfWeekProps {
  teamOfWeek?: TeamOfWeekPlayer[];
}

export default function StatsTeamOfWeek({ teamOfWeek = [] }: StatsTeamOfWeekProps) {
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-3 font-mono">
      <div className="flex justify-between items-center text-xs text-charcoal-soft">
        <span>TEAM OF THE WEEK</span>
        <span className="text-red-600 font-bold">XI SELECTION</span>
      </div>
      <p className="text-[10px] text-charcoal-soft">
        Standout individual performances selected for weekly honors from live database ratings.
      </p>
      {teamOfWeek.length === 0 ? (
        <div className="py-4 text-center text-[10px] text-charcoal-soft">
          NO RATINGS RECORDED FOR THIS PERIOD
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {teamOfWeek.map((p, i) => (
            <div key={p.playerId || i} className="py-1.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-crimson w-8">{p.pos || 'XI'}</span>
                <span className="text-xs font-bold text-charcoal">{p.name}</span>
              </div>
              <span className="text-[10px] text-charcoal-soft">{p.club}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
