import React from 'react';

const xi = [
  { pos: 'GK', name: 'D. Melo', club: 'Forge FC' },
  { pos: 'DEF', name: 'K. Bekker', club: 'Cavalry FC' },
  { pos: 'DEF', name: 'J. Perry', club: 'Pacific FC' },
  { pos: 'MID', name: 'I. Koné', club: 'Cavalry FC' },
  { pos: 'FWD', name: 'J. David', club: 'Forge FC' },
];

export default function StatsTeamOfWeek() {
  return (
    <div className="bg-card border border-border rounded-sm p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center text-xs font-mono text-charcoal-soft">
        <span>TEAM OF THE WEEK</span>
        <span className="text-red-600 font-bold">XI SELECTION</span>
      </div>
      <p className="text-xs text-neutral-300">
        Standout individual performances selected for the weekly XI honors.
      </p>
      <div className="flex flex-col divide-y divide-border dark:divide-neutral-800">
        {xi.map((p, i) => (
          <div key={i} className="py-1.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-crimson w-8">{p.pos}</span>
              <span className="text-xs font-bold text-charcoal dark:text-neutral-200">{p.name}</span>
            </div>
            <span className="text-[10px] text-charcoal-soft">{p.club}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
